import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { addRealTimeMessage } from "@/store/slices/chatSlice";
import { likePost, unlikePost } from "@/store/slices/postSlice";
import { ILikePostRTM, IUnlikePostRTM } from "@/types/like.types";
import { IPost } from "@/types/post.types";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { posts } = useAppSelector((state) => state.post);
  const { isAuthenticated, user, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Prevent multiple socket connections
    if (socketRef.current) {
      return;
    }

    // Only connect to socket if user is authenticated
    if (isAuthenticated && user && accessToken) {
      // Create socket instance
      const socketInstance = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:8000",
        {
          auth: {
            token: accessToken,
          },
          withCredentials: true,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        }
      );

      socketRef.current = socketInstance;

      // Register user in socket system
      socketInstance.on("connect", () => {
        console.log("Socket connected");
        socketInstance.emit("register", user._id);
      });

      // Handle disconnections
      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketInstance.on("notification", (notification) => {
        console.log("Notification received:", notification);
      });

      // Handle errors
      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socketInstance.on("postLiked", (data: ILikePostRTM) => {
        if (posts.find((post: IPost) => post._id === data.postId)) {
          dispatch(likePost(data));
        }
      });

      socketInstance.on("postUnliked", (data: IUnlikePostRTM) => {
        if (posts.find((post: IPost) => post._id === data.postId)) {
          dispatch(unlikePost(data));
        }
      });

      // Handle incoming real-time messages
      socketInstance.on("newMessage", (message) => {
        console.log("Real-time message received:", message);

        // IMPORTANT: Only handle messages from OTHER users, not yourself
        if (message.senderId !== user._id) {
          // Convert the message to match our frontend interface with serializable dates
          const formattedMessage = {
            id: message._id,
            senderId: message.senderId,
            conversationId: message.conversationId,
            content: message.content,
            messageType: message.messageType || "text",
            isEdited: message.isEdited || false,
            editedAt: message.editedAt
              ? new Date(message.editedAt).toISOString()
              : undefined,
            readBy: (message.readBy || []).map(
              (read: { userId: string; readAt: string | Date }) => ({
                ...read,
                readAt: new Date(read.readAt).toISOString(),
              })
            ),
            replyTo: message.replyTo,
            reactions: (message.reactions || []).map(
              (reaction: {
                userId: string;
                emoji: string;
                createdAt: string | Date;
              }) => ({
                ...reaction,
                createdAt: new Date(reaction.createdAt).toISOString(),
              })
            ),
            systemData: message.systemData,
            isRead: message.isRead || false,
            createdAt: message.createdAt
              ? new Date(message.createdAt).toISOString()
              : new Date().toISOString(),
            updatedAt: message.updatedAt
              ? new Date(message.updatedAt).toISOString()
              : undefined,
          };

          dispatch(addRealTimeMessage(formattedMessage));
        }
      });

      setSocket(socketInstance);
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user, accessToken, dispatch, posts]);

  return socket;
}
