//! not sure
const std = @import("std");
const print = @import("std").debug.print;
const helper = @import("helper.zig");

fn toI32() ?i32 {
    var y: i32 = 5678;
    y += 1;
    if (2 > y) {
        return null;
    }
    return y;
}
pub fn main() !void {
    // const res = helper.add(3, 5);
    // print("{d}", res);
    helper.printHello();
    const bytes = "hello";
    // print("{}", toI32());
    //
    const result = toI32();
    if (result) |eye| {
        print("got your\t-{d}\n", .{eye});
    } else {
        print("{d} \n", .{bytes.len}); // 5
    }

    std.debug.print("hello, {s}!\n", .{"world"});
}

/// A structure for storing a timestamp, with nanosecond precision (this is a
/// multiline doc comment).
const Timestamp = struct {
    /// The number of seconds since the epoch (this is also a doc comment).
    seconds: i64, // signed so we can represent pre-1970 (not a doc comment)
    /// The number of nanoseconds past the second (doc comment again).
    nanos: u32,

    /// Returns a `Timestamp` struct representing the Unix epoch; that is, the
    /// moment of 1970 Jan 1 00:00:00 UTC (this is a doc comment too).
    pub fn unixEpoch() Timestamp {
        return Timestamp{
            .seconds = 0,
            .nanos = 0,
        };
    }
};
