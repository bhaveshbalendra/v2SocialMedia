import { apiUrl } from "@/config/configs";

import {
  IConversation,
  IFetchConversationsApiResponse,
  IFetchMessagesApiResponse,
  ISendMessageApiResponse,
} from "@/types/chat.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/chat`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Chat", "Conversations", "Messages"],
  endpoints: (builder) => ({
    fetchConversations: builder.query<IFetchConversationsApiResponse, void>({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      providesTags: ["Conversations"],
    }),
    fetchMessages: builder.query<
      IFetchMessagesApiResponse,
      { conversationId: string }
    >({
      query: ({ conversationId }) => ({
        url: `/messages/${conversationId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),
    sendMessage: builder.mutation<
      ISendMessageApiResponse,
      { friendId: string; content: string }
    >({
      query: ({ friendId, content }) => ({
        url: "/individual",
        method: "POST",
        body: { friendId, content },
      }),
    }),
    findOrCreateConversation: builder.mutation<
      { success: boolean; message: string; conversation: IConversation },
      { friendId: string }
    >({
      query: ({ friendId }) => ({
        url: "/find-or-create",
        method: "POST",
        body: { friendId },
      }),
      invalidatesTags: ["Conversations"],
    }),
    markMessagesAsRead: builder.mutation<
      { success: boolean; message: string },
      { conversationId: string }
    >({
      query: ({ conversationId }) => ({
        url: `/messages/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Messages", "Conversations"],
    }),
  }),
});

export const {
  useFetchConversationsQuery,
  useSendMessageMutation,
  useFetchMessagesQuery,
  useFindOrCreateConversationMutation,
  useMarkMessagesAsReadMutation,
} = chatApi;
