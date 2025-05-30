import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { socket } from "@/utils/socket";
import { useEffect } from "react";

export const useSocketConnect = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      socket.on("connect", () => {
        console.log(`Welcome  ${socket.id}`);
      });
    }
    return () => {
      socket.off("connect");
    };
  }, [isAuthenticated, user]);
};
