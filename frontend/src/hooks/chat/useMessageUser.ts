import { useFindOrCreateConversationMutation } from "@/store/apis/chatApi";
import { setSelectedConversation } from "@/store/slices/chatSlice";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../redux/useAppDispatch";

const useMessageUser = () => {
  const [findOrCreateConversation, { isLoading }] =
    useFindOrCreateConversationMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMessageUser = async (userId: string) => {
    try {
      const result = await findOrCreateConversation({
        friendId: userId,
      }).unwrap();

      if (result.success && result.conversation) {
        // Set the selected conversation in the store
        dispatch(setSelectedConversation(result.conversation));

        // Navigate to the messages page
        navigate("/direct/inbox");
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return {
    handleMessageUser,
    isLoading,
  };
};

export default useMessageUser;
