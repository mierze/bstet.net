//!
//! Part of the Zap examples.
//!
//! Build me with `zig build     serve`.
//! Run   me with `zig build run-serve`.
//!
const std = @import("std");
const zap = @import("zap");
const WebSockets = zap.WebSockets;

fn on_request(r: zap.Request) !void {
    if (r.path) |path| {
        if (std.mem.startsWith(u8, path, "/wedding")) {
            var file_path_buf: [std.fs.max_path_bytes]u8 = undefined;

            const file_path = blk: {
                if (std.mem.eql(u8, path, "/wedding") or std.mem.eql(u8, path, "/wedding/")) {
                    break :blk "./dist/index.html";
                } else {
                    const subpath = path["/wedding".len..];
                    if (subpath.len == 0 or std.mem.eql(u8, subpath, "/")) {
                        break :blk "./dist/index.html";
                    }
                    const n = try std.fmt.bufPrint(&file_path_buf, "./dist{s}", .{subpath});
                    break :blk n;
                }
            };

            if (r.sendFile(file_path)) |_| {
                return;
            } else |_| {
                // fall through to 404
            }
            r.setStatus(.not_found);
            r.sendBody("<html><body><h1>404 - File not found</h1></body></html>") catch return;
            return;
        }
    }

    r.setStatus(.not_found);
    r.sendBody("<html><body><h1>404 - File not found</h1></body></html>") catch return;
}

pub fn main() !void {
    var listener = zap.HttpListener.init(.{
        .port = 80,
        .on_upgrade = on_upgrade,
        .on_request = on_request,
        .max_clients = 1000,
        .max_body_size = 1 * 4096,
        .log = true,
    });
    try listener.listen();

    std.debug.print("Listening on 0.0.0.0:80\n", .{});
    var gpa = std.heap.GeneralPurposeAllocator(.{
        .thread_safe = true,
    }){};
    const allocator = gpa.allocator();

    GlobalContextManager = ContextManager.init(allocator, "chatroom", "user-");
    defer GlobalContextManager.deinit();

    // setup listener
    std.log.info("Terminate with CTRL+C", .{});

    // start worker threads
    zap.start(.{
        .threads = 2,
        .workers = 2,
    });
}

// global variables, yeah!
var GlobalContextManager: ContextManager = undefined;

const WebsocketHandler = WebSockets.Handler(Context);
const Context = struct {
    userName: []const u8,
    channel: []const u8,
    // we need to hold on to them and just re-use them for every incoming
    // connection
    subscribeArgs: WebsocketHandler.SubscribeArgs,
    settings: WebsocketHandler.WebSocketSettings,
};

const ContextList = std.ArrayList(*Context);

const ContextManager = struct {
    allocator: std.mem.Allocator,
    channel: []const u8,
    usernamePrefix: []const u8,
    lock: std.Thread.Mutex = .{},
    contexts: ContextList = undefined,

    pub fn init(
        allocator: std.mem.Allocator,
        channelName: []const u8,
        usernamePrefix: []const u8,
    ) ContextManager {
        return .{
            .allocator = allocator,
            .channel = channelName,
            .usernamePrefix = usernamePrefix,
            .contexts = ContextList.init(allocator),
        };
    }

    pub fn deinit(self: *ContextManager) void {
        for (self.contexts.items) |ctx| {
            self.allocator.free(ctx.userName);
        }
        self.contexts.deinit();
    }

    pub fn newContext(self: *ContextManager) !*Context {
        self.lock.lock();
        defer self.lock.unlock();

        const ctx = try self.allocator.create(Context);
        const userName = try std.fmt.allocPrint(
            self.allocator,
            "{s}{d}",
            .{ self.usernamePrefix, self.contexts.items.len },
        );
        ctx.* = .{
            .userName = userName,
            .channel = self.channel,
            // used in subscribe()
            .subscribeArgs = .{
                .channel = self.channel,
                .force_text = true,
                .context = ctx,
            },
            // used in upgrade()
            .settings = .{
                .on_open = on_open_websocket,
                .on_close = on_close_websocket,
                .on_message = handle_websocket_message,
                .context = ctx,
            },
        };
        try self.contexts.append(ctx);
        return ctx;
    }
};

//
// Websocket Callbacks
//
fn on_open_websocket(context: ?*Context, handle: WebSockets.WsHandle) !void {
    if (context) |ctx| {
        _ = try WebsocketHandler.subscribe(handle, &ctx.subscribeArgs);

        // say hello
        var buf: [128]u8 = undefined;
        const message = try std.fmt.bufPrint(
            &buf,
            "{s} joined the chat.",
            .{ctx.userName},
        );

        // send notification to all others
        WebsocketHandler.publish(.{ .channel = ctx.channel, .message = message });
        std.log.info("new websocket opened: {s}", .{message});
    }
}

fn on_close_websocket(context: ?*Context, uuid: isize) !void {
    _ = uuid;
    if (context) |ctx| {
        // say goodbye
        var buf: [128]u8 = undefined;
        const message = try std.fmt.bufPrint(
            &buf,
            "{s} left the chat.",
            .{ctx.userName},
        );

        // send notification to all others
        WebsocketHandler.publish(.{ .channel = ctx.channel, .message = message });
        std.log.info("websocket closed: {s}", .{message});
    }
}

fn handle_websocket_message(
    context: ?*Context,
    handle: WebSockets.WsHandle,
    message: []const u8,
    is_text: bool,
) !void {
    _ = handle;
    _ = is_text;

    if (context) |ctx| {
        // send message
        const buflen = 128; // arbitrary len
        var buf: [buflen]u8 = undefined;

        const format_string = "{s}: {s}";
        const fmt_string_extra_len = 2; // ": " between the two strings
        //
        const max_msg_len = buflen - ctx.userName.len - fmt_string_extra_len;
        if (max_msg_len > 0) {
            // there is space for the message, because the user name + format
            // string extra do not exceed the buffer now, let's check: do we
            // need to trim the message?
            var trimmed_message: []const u8 = message;
            if (message.len > max_msg_len) {
                trimmed_message = message[0..max_msg_len];
            }
            const chat_message = try std.fmt.bufPrint(
                &buf,
                format_string,
                .{ ctx.userName, trimmed_message },
            );

            // send notification to all others
            WebsocketHandler.publish(
                .{ .channel = ctx.channel, .message = chat_message },
            );
            std.log.info("{s}", .{chat_message});
        } else {
            std.log.warn(
                "Username is very long, cannot deal with that size: {d}",
                .{ctx.userName.len},
            );
        }
    }
}

fn on_upgrade(r: zap.Request, target_protocol: []const u8) !void {
    // make sure we're talking the right protocol
    if (!std.mem.eql(u8, target_protocol, "websocket")) {
        std.log.warn("received illegal protocol: {s}", .{target_protocol});
        r.setStatus(.bad_request);
        r.sendBody("400 - BAD REQUEST") catch unreachable;
        return;
    }
    var context = GlobalContextManager.newContext() catch |err| {
        std.log.err("Error creating context: {any}", .{err});
        return;
    };

    try WebsocketHandler.upgrade(r.h, &context.settings);
    std.log.info("connection upgrade OK", .{});
}
