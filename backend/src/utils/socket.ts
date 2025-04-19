import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { config } from "../config/app.config";

// Declare global socketIo
declare global {
  const socketIo: SocketServer;
}

export const initializeSocketServer = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: config.allowed_origins,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};
