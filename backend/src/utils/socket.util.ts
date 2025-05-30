import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { config } from "../config/app.config";

// Extend the SocketIO server type to include our custom method
declare module "socket.io" {
  interface Server {
    sendToUser(userId: string, event: string, data: any): boolean;
  }
}

export let io: SocketServer;

export const userSocketMap = new Map<string, string[]>();

export const initializeSocketServer = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.allowed_origins,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);
    // Example: Handle user login (emit this from frontend with userId)
    socket.on("register", (userId: string) => {
      // Get existing sockets for this user or create new array
      const userSockets = userSocketMap.get(userId) || [];

      // Add this socket to the user's sockets
      userSockets.push(socket.id);
      userSocketMap.set(userId, userSockets);

      console.log(`User ${userId} registered with socket ${socket.id}`);
      console.log(
        `User ${userId} now has ${userSockets.length} active connections`
      );
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketIds] of userSocketMap.entries()) {
        const index = socketIds.indexOf(socket.id);
        if (index !== -1) {
          // Remove this socket from the user's sockets
          socketIds.splice(index, 1);

          // If user has no more connections, remove from map
          if (socketIds.length === 0) {
            userSocketMap.delete(userId);
            console.log(`User ${userId} has no more active connections`);
          } else {
            userSocketMap.set(userId, socketIds);
            console.log(
              `User ${userId} still has ${socketIds.length} active connections`
            );
          }
          break;
        }
      }
    });
  });

  // Helper function to send message to all of a user's connected devices
  io.sendToUser = (userId: string, event: string, data: any) => {
    const socketIds = userSocketMap.get(userId);
    if (socketIds && socketIds.length > 0) {
      socketIds.forEach((socketId) => {
        io.to(socketId).emit(event, data);
      });
      return true;
    }
    return false;
  };
};
