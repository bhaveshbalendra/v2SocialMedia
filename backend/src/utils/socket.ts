import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { config } from "../config/app.config";

export let io: SocketServer;

export const initializeSocketServer = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.allowed_origins,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  const userSocketMap = new Map<string, string>();

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);
    // Example: Handle user login (emit this from frontend with userId)
    socket.on("register", (userId: string) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};
