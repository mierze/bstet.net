// helper.zig
const std = @import("std");

pub fn add(a: i32, b: i32) i32 {
    return a + b;
}

pub fn printHello() void {
    std.debug.print("Hello from helper!\n", .{});
}
