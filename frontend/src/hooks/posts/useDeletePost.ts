import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useDeletePostMutation } from "@/store/apis/postApi";
import { setSelectedPost } from "@/store/slices/postSlice";
import { useCallback } from "react";

export const useDeletePost = () => {
  const [deletePostMutation, { isLoading }] = useDeletePostMutation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleDeletePost = useCallback(
    async (postId: string, postAuthorId?: string) => {
      // Check if user is authenticated and owns the post
      if (!user || !postId) {
        return;
      }

      if (postAuthorId && postAuthorId !== user._id) {
        return;
      }

      try {
        // Call the delete mutation directly without confirmation
        const result = await deletePostMutation({ postId }).unwrap();

        if (result.success) {
          // Close post modal if it's open
          dispatch(setSelectedPost(null));
        }
      } catch (error: unknown) {
        // Silently handle errors without showing notifications
        console.error("Failed to delete post:", error);
      }
    },
    [deletePostMutation, dispatch, user]
  );

  return {
    handleDeletePost,
    isDeleting: isLoading,
  };
};
