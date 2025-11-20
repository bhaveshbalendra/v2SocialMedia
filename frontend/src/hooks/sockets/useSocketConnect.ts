import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { addRealTimeMessage } from "@/store/slices/chatSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import { IMessage } from "@/types/chat.types";
import { SocketNotificationEvent } from "@/types/notification.types";
import { socket } from "@/utils/socket";
import { useEffect } from "react";

export const useSocketConnect = () => {
  const { isAuthenticated, user, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated && user && accessToken) {
      // Set auth token before connecting
      socket.auth = { token: accessToken };

      // Connect socket
      if (!socket.connected) {
        socket.connect();
      }

      const handleConnect = () => {
        console.log(`Socket connected: ${socket.id}`);
        // Register user with socket server
        socket.emit("register", user._id);
      };

      // Handle incoming real-time messages
      const handleNewMessage = (message: IMessage) => {
        console.log("Real-time message received:", message);

        // Convert the message to match our frontend interface
        const formattedMessage = {
          id: message.id || (message as { _id?: string })._id || "",
          senderId: message.senderId,
          conversationId: message.conversationId,
          content: message.content,
          messageType: message.messageType || "text",
          isEdited: message.isEdited || false,
          editedAt: message.editedAt,
          readBy: message.readBy || [],
          replyTo: message.replyTo,
          reactions: message.reactions || [],
          systemData: message.systemData,
          isRead: message.isRead || false,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        };

        // Always dispatch - the reducer will handle replacing optimistic messages
        // or adding new messages from other users
        dispatch(addRealTimeMessage(formattedMessage));
      };

      // Handle incoming real-time notifications
      const handleNotification = (notification: SocketNotificationEvent) => {
        console.log("Real-time notification received:", notification);
        
        // Dispatch notification to Redux store
        dispatch(addNotification(notification));
      };

      socket.on("connect", handleConnect);
      socket.on("newMessage", handleNewMessage);
      socket.on("notification", handleNotification);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("newMessage", handleNewMessage);
        socket.off("notification", handleNotification);
        // Don't disconnect here - let useSocket handle cleanup
      };
    } else {
      // Disconnect if not authenticated
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [isAuthenticated, user, accessToken, dispatch]);
};
