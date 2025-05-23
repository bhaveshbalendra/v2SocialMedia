import { socket } from "@/utils/socket";
import { useEffect } from "react";
import { useAppSelector } from "./useAppSelector";

export const useSocketConnect = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  console.log(user);
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
