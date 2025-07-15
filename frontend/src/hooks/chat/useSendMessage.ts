import { useSendMessageMutation } from "@/store/apis/chatApi";
import { updateMessageOptimistically } from "@/store/slices/chatSlice";
import { IMessage } from "@/types/chat.types";
import { useCallback } from "react";
import { useAppDispatch } from "../redux/useAppDispatch";
import { useAppSelector } from "../redux/useAppSelector";

const useSendMessage = () => {
  const [sendMessageMutation, { isLoading }] = useSendMessageMutation();
  const dispatch = useAppDispatch();
  const { selectedConversation } = useAppSelector((state) => state.chat);
  const userInfo = useAppSelector((state) => state.auth.user);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversation || !userInfo || !content.trim()) {
        return;
      }

      // Find the other participant (not the current user)
      const otherParticipant = selectedConversation.participants.find(
        (participant) => participant._id !== userInfo._id
      );

      if (!otherParticipant) {
        console.error("Could not find other participant");
        return;
      }

      // Create optimistic message
      const nowISOString = new Date().toISOString();
      const optimisticMessage: IMessage = {
        id: `temp-${Date.now()}`, // Temporary ID
        senderId: userInfo._id,
        conversationId: selectedConversation._id,
        content: content.trim(),
        messageType: "text",
        isEdited: false,
        readBy: [],
        reactions: [],
        isRead: false,
        createdAt: nowISOString,
        updatedAt: nowISOString,
      };

      // Add optimistic message to store immediately
      dispatch(updateMessageOptimistically(optimisticMessage));

      try {
        // Send the actual message
        await sendMessageMutation({
          friendId: otherParticipant._id,
          content: content.trim(),
        }).unwrap();

        // Note: The real message will be received via socket.io and will replace the optimistic one
        // or we could implement message ID mapping to update the optimistic message
      } catch (error) {
        console.error("Failed to send message:", error);
        // TODO: Implement error handling - remove optimistic message or mark as failed
      }
    },
    [selectedConversation, userInfo, sendMessageMutation, dispatch]
  );

  return {
    sendMessage,
    isLoading,
  };
};

export default useSendMessage;
