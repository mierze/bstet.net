pub fn put(_: *UserWeb, _: zap.Request) !void {}

pub fn get(self: *UserWeb, r: zap.Request) !void {
    if (r.path) |path| {
        // /users
        if (path.len == self.path.len) {
            return self.listUsers(r);
        }
        var jsonbuf: [256]u8 = undefined;
        if (self.userIdFromPath(path)) |id| {
            if (self._users.get(id)) |user| {
                const json = try zap.util.stringifyBuf(&jsonbuf, user, .{});
                try r.sendJson(json);
            }
        }
    }
}

fn listUsers(self: *UserWeb, r: zap.Request) !void {
    if (self._users.toJSON()) |json| {
        defer self.alloc.free(json);
        try r.sendJson(json);
    } else |err| {
        return err;
    }
}

pub fn post(self: *UserWeb, r: zap.Request) !void {
    if (r.body) |body| {
        const maybe_user: ?std.json.Parsed(User) = std.json.parseFromSlice(User, self.alloc, body, .{}) catch null;
        if (maybe_user) |u| {
            defer u.deinit();
            if (self._users.addByName(u.value.first_name, u.value.last_name)) |id| {
                var jsonbuf: [128]u8 = undefined;
                const json = try zap.util.stringifyBuf(&jsonbuf, .{ .status = "OK", .id = id }, .{});
                try r.sendJson(json);
            } else |err| {
                std.debug.print("ADDING error: {}\n", .{err});
                return;
            }
        }
    }
}

pub fn patch(self: *UserWeb, r: zap.Request) !void {
    if (r.path) |path| {
        if (self.userIdFromPath(path)) |id| {
            if (self._users.get(id)) |_| {
                if (r.body) |body| {
                    const maybe_user: ?std.json.Parsed(User) = std.json.parseFromSlice(User, self.alloc, body, .{}) catch null;
                    if (maybe_user) |u| {
                        defer u.deinit();
                        var jsonbuf: [128]u8 = undefined;
                        if (self._users.update(id, u.value.first_name, u.value.last_name)) {
                            const json = try zap.util.stringifyBuf(&jsonbuf, .{ .status = "OK", .id = id }, .{});
                            try r.sendJson(json);
                        } else {
                            const json = try zap.util.stringifyBuf(&jsonbuf, .{ .status = "ERROR", .id = id }, .{});
                            try r.sendJson(json);
                        }
                    }
                }
            }
        }
    }
}

pub fn delete(self: *UserWeb, r: zap.Request) !void {
    if (r.path) |path| {
        if (self.userIdFromPath(path)) |id| {
            var jsonbuf: [128]u8 = undefined;
            if (self._users.delete(id)) {
                const json = try zap.util.stringifyBuf(&jsonbuf, .{ .status = "OK", .id = id }, .{});
                try r.sendJson(json);
            } else {
                const json = try zap.util.stringifyBuf(&jsonbuf, .{ .status = "ERROR", .id = id }, .{});
                try r.sendJson(json);
            }
        }
    }
}
