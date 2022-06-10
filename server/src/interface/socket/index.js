const events = {
  join: "client-join",
  message: "client-message",
  disconnect: "client-disconnect",
};

function setupIoServer(io) {
  io.use((socket, next) => {
    socket.data.name = socket.handshake.auth.name;
    next();
  });

  io.on("connection", (socket) => {
    io.emit(events.join, {
      clientId: socket.id,
      clientName: socket.data.name,
      clientsCount: io.engine.clientsCount,
    });

    socket.on(events.message, ({ text }) => {
      io.emit(events.message, {
        clientId: socket.id,
        clientName: socket.data.name,
        text,
      });
    });

    socket.on("disconnect", () => {
      io.emit(events.disconnect, {
        clientId: socket.id,
        clientName: socket.data.name,
        clientsCount: io.engine.clientsCount,
      });
    });
  });
}

module.exports = { setupIoServer };
