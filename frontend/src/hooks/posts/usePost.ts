import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import {
  useCreatePostMutation,
  useGetAuthenticatedFeedQuery,
  useGetPublicFeedQuery,
  useLazyGetAuthenticatedFeedQuery,
  useLazyGetPublicFeedQuery,
} from "@/store/apis/postApi";
import {
  appendPosts,
  prependPosts,
  resetFeed,
  setLoading,
  setPosts,
} from "@/store/slices/postSlice";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export const usePost = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    posts,
    isLoading: feedLoading,
    hasMore,
    nextCursor,
  } = useAppSelector((state) => state.post);

  const [createPost, { isLoading: isLoadingCreatePost }] =
    useCreatePostMutation();

  // Initial feed query - always fetch first page
  const {
    data: publicData,
    isLoading: publicLoading,
    error: publicError,
    refetch: refetchPublic,
  } = useGetPublicFeedQuery({ limit: 5 }, { skip: isAuthenticated });

  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
    refetch: refetchAuth,
  } = useGetAuthenticatedFeedQuery({ limit: 5 }, { skip: !isAuthenticated });

  // For loading more posts
  const [loadMorePublic] = useLazyGetPublicFeedQuery();
  const [loadMoreAuth] = useLazyGetAuthenticatedFeedQuery();

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

  // Load more posts function
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || feedLoading) {
      return;
    }

    try {
      dispatch(setLoading(true));

      if (isAuthenticated) {
        const result = await loadMoreAuth({
          cursor: nextCursor || undefined,
          limit: 5,
        });
        if (result.data) {
          dispatch(
            appendPosts({
              posts: result.data.posts,
              pagination: result.data.pagination,
            })
          );
        }
      } else {
        const result = await loadMorePublic({
          cursor: nextCursor || undefined,
          limit: 5,
        });
        if (result.data) {
          dispatch(
            appendPosts({
              posts: result.data.posts,
              pagination: result.data.pagination,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [
    hasMore,
    feedLoading,
    isAuthenticated,
    nextCursor,
    posts.length,
    loadMoreAuth,
    loadMorePublic,
    dispatch,
  ]);

  // Refresh feed function
  const refreshFeed = useCallback(() => {
    dispatch(resetFeed());
    if (isAuthenticated) {
      refetchAuth();
    } else {
      refetchPublic();
    }
  }, [isAuthenticated, refetchAuth, refetchPublic, dispatch]);

  // Determine which data to use based on authentication
  const data = isAuthenticated ? authData : publicData;
  const isLoading = isAuthenticated ? authLoading : publicLoading;
  const error = isAuthenticated ? authError : publicError;

  // Set initial posts when data is available
  useEffect(() => {
    if (data) {
      dispatch(setPosts({ posts: data.posts, pagination: data.pagination }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  return {
    posts,
    feedLoading,
    error,
    hasMore,
    nextCursor,
    handleCreatePost,
    isLoadingCreatePost,
    loadMorePosts,
    refreshFeed,
  };
};

// import { useAppDispatch } from "@/hooks/useAppDispatch";
// import { useAppSelector } from "@/hooks/useAppSelector";
// import {
//   useGetAuthenticatedFeedQuery,
//   useGetPublicFeedQuery,
// } from "@/store/apis/feedApi";
// import {
//   appendPosts,
//   resetFeed,
//   setHasMore,
//   setLoading,
//   setPosts,
// } from "@/store/slices/feedSlice";
// import { useEffect } from "react";

// export const useFeed = (page: number = 1, limit: number = 10) => {
//   const dispatch = useAppDispatch();
//   const { isAuthenticated } = useAppSelector((state) => state.auth);
//   const {
//     posts,
//     hasMore,
//     isLoading: feedLoading,
//   } = useAppSelector((state) => state.feed);

//   // Use the appropriate query based on authentication status
//   const {
//     data: publicData,
//     isLoading: publicLoading,
//     error: publicError,
//   } = useGetPublicFeedQuery({ page, limit }, { skip: isAuthenticated });

//   const {
//     data: authData,
//     isLoading: authLoading,
//     error: authError,
//   } = useGetAuthenticatedFeedQuery({ page, limit }, { skip: !isAuthenticated });

//   // Determine which data to use based on authentication
//   const data = isAuthenticated ? authData : publicData;
//   const isLoading = isAuthenticated ? authLoading : publicLoading;
//   const error = isAuthenticated ? authError : publicError;

//   useEffect(() => {
//     if (data) {
//       if (page === 1) {
//         dispatch(setPosts(data.data));
//       } else {
//         dispatch(appendPosts(data.data));
//       }
//       dispatch(setHasMore(data.hasMore));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data, page]);

//   useEffect(() => {
//     dispatch(setLoading(isLoading));
//   }, [isLoading, dispatch]);

//   const loadMore = () => {
//     if (!hasMore || isLoading) return;
//     // The next page will be loaded automatically when the page prop changes
//   };

//   const refresh = () => {
//     dispatch(resetFeed());
//   };

//   return {
//     posts,
//     feedLoading,
//     error,
//     hasMore,
//     loadMore,
//     refresh,
//   };
// };
