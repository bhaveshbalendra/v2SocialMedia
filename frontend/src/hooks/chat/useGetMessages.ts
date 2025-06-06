import { useFetchMessagesQuery } from "@/store/apis/chatApi";
import { setMessages } from "@/store/slices/chatSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/useAppDispatch";
import { useAppSelector } from "../redux/useAppSelector";

const useGetMessages = () => {
  const { selectedConversation, messages } = useAppSelector(
    (state) => state.chat
  );
  const dispatch = useAppDispatch();

  const { data, isLoading, isError } = useFetchMessagesQuery(
    { conversationId: selectedConversation?._id as string },
    {
      skip: !selectedConversation?._id, // Skip the query if no conversation is selected
    }
  );

  useEffect(() => {
    if (data?.messages) {
      dispatch(setMessages(data.messages));
    }
  }, [data, dispatch]);

  return {
    messages,
    isLoading,
    isError,
  };
};

export default useGetMessages;
