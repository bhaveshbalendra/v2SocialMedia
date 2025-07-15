import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  useCreatePostMutation,
  useGetAuthenticatedFeedQuery,
  useGetPublicFeedQuery,
} from "@/store/apis/postApi";
import { prependPosts, setLoading, setPosts } from "@/store/slices/postSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export const usePost = (page: number = 1, limit: number = 10) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [createPost, { isLoading: isLoadingCreatePost }] =
    useCreatePostMutation();

  const { posts, isLoading: feedLoading } = useAppSelector(
    (state) => state.post
  );

  // Use the appropriate query based on authentication status
  const {
    data: publicData,
    isLoading: publicLoading,
    error: publicError,
  } = useGetPublicFeedQuery({ page, limit }, { skip: isAuthenticated });

  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = useGetAuthenticatedFeedQuery({ page, limit }, { skip: !isAuthenticated });

  const handleCreatePost = async (credentials: FormData) => {
    try {
      const response = await createPost(credentials).unwrap();

      // Show success message
      toast.success("Post created successfully!", {
        action: {
          label: "X",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

      // Add the new post to the beginning of the current posts array
      if (response?.success && response?.post) {
        dispatch(prependPosts([response.post]));
      }

      return response;
    } catch (error: unknown) {
      // Handle error cases
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to create post";

      console.error("Failed to create post:", error);
      toast.error(errorMessage || "Failed to create post", {
        action: {
          label: "X",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      throw error;
    }
  };

  // Determine which data to use based on authentication
  const data = isAuthenticated ? authData : publicData;
  const isLoading = isAuthenticated ? authLoading : publicLoading;
  const error = isAuthenticated ? authError : publicError;

  useEffect(() => {
    if (data) {
      dispatch(setPosts(data.posts));
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  return {
    posts,
    feedLoading,
    error,
    handleCreatePost,
    isLoadingCreatePost,
  };
};
