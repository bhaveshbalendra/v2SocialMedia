import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  useCreatePostMutation,
  useGetAuthenticatedFeedQuery,
  useGetPublicFeedQuery,
} from "@/store/apis/postApi";
import { setLoading, setPosts } from "@/store/slices/postSlice";

import { useEffect } from "react";

export const usePost = (page: number = 1, limit: number = 10) => {
  const dispatch = useAppDispatch();
  const [createPost, { isLoading: isLoadingCreatePost }] =
    useCreatePostMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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
    const response = await createPost(credentials);
    console.log(response);
    // Optionally, refetch posts or handle UI updates here
    return response;
  };

  // Determine which data to use based on authentication
  const data = isAuthenticated ? authData : publicData;
  const isLoading = isAuthenticated ? authLoading : publicLoading;
  const error = isAuthenticated ? authError : publicError;

  useEffect(() => {
    if (data) {
      dispatch(setPosts(data.posts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
