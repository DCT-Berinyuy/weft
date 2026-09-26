const std = @import("std");

const Server = @import("../daemon/Server.zig");
pub const Connection = @import("../wire/Connection.zig");
const Remote = @import("Remote.zig");

conn: Connection,
reader: std.Io.net.Stream.Reader,
writer: std.Io.net.Stream.Writer,
buffer: []u8,
stream: std.Io.net.Stream,

fn create(gpa: std.mem.Allocator, io: std.Io, stream: std.Io.net.Stream, secret: *const [32]u8) !*@This() {
    const self = try gpa.create(@This());
    errdefer gpa.destroy(self);
    const buffer = try gpa.alloc(u8, 8 << 10);
    errdefer gpa.free(buffer);

    self.stream = stream;
    self.buffer = buffer;
    self.reader = stream.reader(io, buffer[0 .. buffer.len / 2]);
    self.writer = stream.writer(io, buffer[buffer.len / 2 ..]);
    self.conn = try Connection.init(
        io,
        secret,
        &self.reader.interface,
        &self.writer.interface,
    );
    return self;
}

pub fn connect(gpa: std.mem.Allocator, io: std.Io, addr: std.Io.net.IpAddress, secret: *const [32]u8) !*@This() {
    const stream = try addr.connect(io, .{
        .mode = .stream,
        .protocol = .tcp,
    });
    errdefer stream.close(io);
    return try create(gpa, io, stream, secret);
}

pub fn destroy(self: *@This(), alloc: std.mem.Allocator, io: std.Io) void {
    self.stream.close(io);
    alloc.free(self.buffer);
    alloc.destroy(self);
}
