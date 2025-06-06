import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { likePost, unlikePost } from "@/store/slices/postSlice";
import { ILikePostRTM, IUnlikePostRTM } from "@/types/like.types";
import { IPost } from "@/types/post.types";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { posts } = useAppSelector((state) => state.post);
  const { isAuthenticated, user, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    let socketInstance: Socket | null = null;

    // Only connect to socket if user is authenticated
    if (isAuthenticated && user && accessToken) {
      // Create socket instance
      socketInstance = io(
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

      // Register user in socket system
      socketInstance.on("connect", () => {
        console.log("Socket connected");
        socketInstance?.emit("register", user._id);
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

      setSocket(socketInstance);
    }

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, accessToken]);

  return socket;
}
