import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "@/store/apis/likeApi";

import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useLike = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [likePost, { isLoading: isLoadingLikePost }] = useLikePostMutation();
  const [unlikePost, { isLoading: isLoadingUnlikePost }] =
    useUnlikePostMutation();

  const navigate = useNavigate();

  const handleLikePost = async (postId: string) => {
    if (isAuthenticated) {
      await likePost({ postId });
    } else {
      toast.error("Please login to like a post");
      navigate("/login");
    }
  };

  const handleUnlikePost = async (postId: string) => {
    if (isAuthenticated) {
      await unlikePost({ postId });
    } else {
      toast.error("Please login to like a post");
      navigate("/login");
    }
  };

  return {
    handleLikePost,
    handleUnlikePost,
    isLoadingLikePost,
    isLoadingUnlikePost,
  };
};
