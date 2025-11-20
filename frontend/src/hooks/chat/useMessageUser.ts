import { useFindOrCreateConversationMutation } from "@/store/apis/chatApi";
import { setSelectedConversation } from "@/store/slices/chatSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch } from "../redux/useAppDispatch";
import { useAppSelector } from "../redux/useAppSelector";

const useMessageUser = () => {
  const [findOrCreateConversation, { isLoading }] =
    useFindOrCreateConversationMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useAppSelector((state) => state.auth.user);

  const handleMessageUser = async (userId: string) => {
    // Prevent users from messaging themselves
    if (userInfo?._id === userId) {
      toast.error("You cannot message yourself");
      return;
    }

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
