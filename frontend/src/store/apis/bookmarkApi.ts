import { apiUrl } from "@/config/configs";
import { IPost } from "@/types/post.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types for bookmarks
export interface IBookmarkToggleResponse {
  success: boolean;
  message: string;
  isBookmarked: boolean;
}

export interface IBookmarkStatusResponse {
  success: boolean;
  isBookmarked: boolean;
}

export interface IGetBookmarksResponse {
  success: boolean;
  message: string;
  bookmarks: IPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface IRemoveBookmarkResponse {
  success: boolean;
  message: string;
}

export const bookmarkApi = createApi({
  reducerPath: "bookmarkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/bookmarks`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Bookmarks", "Bookmark"],
  endpoints: (builder) => ({
    // Toggle bookmark for a post
    toggleBookmark: builder.mutation<IBookmarkToggleResponse, string>({
      query: (postId) => ({
        url: `/${postId}/toggle`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks"],
      // Optimistic update for bookmark status
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate bookmark status for this post
          dispatch(
            bookmarkApi.util.invalidateTags([{ type: "Bookmark", id: postId }])
          );
        } catch {
          // Error handling
        }
      },
    }),

    // Get user's bookmarked posts
    getUserBookmarks: builder.query<
      IGetBookmarksResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Bookmarks"],
    }),

    // Remove bookmark from a post
    removeBookmark: builder.mutation<IRemoveBookmarkResponse, string>({
      query: (postId) => ({
        url: `/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),

    // Check bookmark status for a post
    getBookmarkStatus: builder.query<IBookmarkStatusResponse, string>({
      query: (postId) => ({
        url: `/${postId}/status`,
        method: "GET",
      }),
      providesTags: (_result, _error, postId) => [
        { type: "Bookmark", id: postId },
      ],
    }),
  }),
});

export const {
  useToggleBookmarkMutation,
  useGetUserBookmarksQuery,
  useRemoveBookmarkMutation,
  useGetBookmarkStatusQuery,
} = bookmarkApi;
