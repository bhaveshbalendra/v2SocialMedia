import { io, Socket } from "socket.io-client";
import { socketCreds } from "../config/configs";

// Create socket instance with better error handling and configuration
export const socket: Socket = io(socketCreds.backendUrl, {
  autoConnect: false, // Don't connect immediately - wait for authentication
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"], // Try websocket first, fallback to polling
  withCredentials: true,
});

// Handle connection errors, including blocked requests
socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error);

  // Check if it's a blocked request (ERR_BLOCKED_BY_CLIENT)
  const errorMessage = error.message || String(error);
  if (
    errorMessage.includes("blocked") ||
    errorMessage.includes("TransportError")
  ) {
    console.warn(
      "Socket.IO connection blocked. This might be caused by:\n" +
        "1. Browser extensions (ad blockers)\n" +
        "2. Firewall settings\n" +
        "3. Network restrictions\n\n" +
        "Please try:\n" +
        "- Disabling ad blockers for this site\n" +
        "- Checking browser extension settings\n" +
        "- Using a different browser"
    );
  }
});

socket.on("connect", () => {
  console.log("Socket.IO connected successfully:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket.IO disconnected:", reason);
});
