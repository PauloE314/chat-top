const http = require("http");
const { Server } = require("socket.io");
const { setupIoServer } = require("./interface/socket");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ["websocket", "polling"],
});

setupIoServer(io);

server.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
