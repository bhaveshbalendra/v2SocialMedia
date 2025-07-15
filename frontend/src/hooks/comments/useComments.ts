import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
  useUpdateCommentMutation,
} from "@/store/apis/commentApi";
import { setSelectedPost } from "@/store/slices/postSlice";
import { ICreateCommentRequest } from "@/types/comment.types";
import { useState } from "react";
import { toast } from "sonner";

export const useComments = () => {
  const [isReplying, setIsReplying] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  // Mutations
  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [createReply, { isLoading: isCreatingReply }] =
    useCreateReplyMutation();
  const [updateComment, { isLoading: isUpdatingComment }] =
    useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] =
    useDeleteCommentMutation();
  const [toggleCommentLike, { isLoading: isTogglingLike }] =
    useToggleCommentLikeMutation();
  // Handlers
  const handleCreateComment = async ({
    content,
    postId,
  }: ICreateCommentRequest) => {
    try {
      const res = await createComment({ postId, content }).unwrap();

      if (res.success && res.comment) {
        // Update the selected post's comments array
        dispatch(
          setSelectedPost({
            type: "ADD_COMMENT",
            comment: res.comment,
            postId,
          })
        );
        toast.success("Comment added successfully!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to add comment";
      toast.error(errorMessage || "Failed to add comment");
    }
  };

  const handleCreateReply = async (commentId: string, content: string) => {
    if (!content.trim()) {
      toast.error("Reply cannot be empty");
      return false;
    }

    try {
      await createReply({ commentId, content }).unwrap();
      toast.success("Reply added successfully!");
      setIsReplying(null);
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to add reply";
      toast.error(errorMessage || "Failed to add reply");
      return false;
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return false;
    }

    try {
      await updateComment({ commentId, content }).unwrap();
      toast.success("Comment updated successfully!");
      setIsEditing(null);
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to update comment";
      toast.error(errorMessage || "Failed to update comment");
      return false;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId).unwrap();
      toast.success("Comment deleted successfully!");
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to delete comment";
      toast.error(errorMessage || "Failed to delete comment");
      return false;
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      const result = await toggleCommentLike(commentId).unwrap();
      // No toast for likes - too noisy
      return result.isLiked;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to toggle like";
      toast.error(errorMessage || "Failed to toggle like");
      return null;
    }
  };

  // UI State helpers
  const startReplying = (commentId: string) => {
    setIsReplying(commentId);
    setIsEditing(null);
  };

  const startEditing = (commentId: string) => {
    setIsEditing(commentId);
    setIsReplying(null);
  };

  const cancelReply = () => setIsReplying(null);
  const cancelEdit = () => setIsEditing(null);

  return {
    // Loading states

    isCreatingComment,
    isCreatingReply,
    isUpdatingComment,
    isDeletingComment,
    isTogglingLike,

    // Error states

    // UI states
    isReplying,
    isEditing,

    // Actions
    handleCreateComment,
    handleCreateReply,
    handleUpdateComment,
    handleDeleteComment,
    handleToggleLike,

    // UI helpers
    startReplying,
    startEditing,
    cancelReply,
    cancelEdit,
  };
};
