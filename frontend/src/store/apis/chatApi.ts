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
      transformResponse: (response: IFetchConversationsApiResponse) => {
        // Convert Date objects to ISO strings to ensure serializability
        if (response.conversations) {
          response.conversations = response.conversations.map((conv) => ({
            ...conv,
            createdAt: conv.createdAt
              ? new Date(conv.createdAt).toISOString()
              : undefined,
            updatedAt: conv.updatedAt
              ? new Date(conv.updatedAt).toISOString()
              : undefined,
            lastActivity: conv.lastActivity
              ? new Date(conv.lastActivity).toISOString()
              : new Date().toISOString(),
          }));
        }
        return response;
      },
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
      transformResponse: (response: IFetchMessagesApiResponse) => {
        // Convert Date objects to ISO strings to ensure serializability
        if (response.messages) {
          response.messages = response.messages.map((message) => ({
            ...message,
            createdAt: message.createdAt
              ? new Date(message.createdAt).toISOString()
              : undefined,
            updatedAt: message.updatedAt
              ? new Date(message.updatedAt).toISOString()
              : undefined,
            editedAt: message.editedAt
              ? new Date(message.editedAt).toISOString()
              : undefined,
            readBy: message.readBy?.map((read) => ({
              ...read,
              readAt: new Date(read.readAt).toISOString(),
            })),
            reactions: message.reactions?.map((reaction) => ({
              ...reaction,
              createdAt: new Date(reaction.createdAt).toISOString(),
            })),
          }));
        }
        return response;
      },
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
      transformResponse: (response: {
        success: boolean;
        message: string;
        conversation: IConversation;
      }) => {
        // Convert Date objects to ISO strings for the conversation
        if (response.conversation) {
          response.conversation = {
            ...response.conversation,
            createdAt: response.conversation.createdAt
              ? new Date(response.conversation.createdAt).toISOString()
              : undefined,
            updatedAt: response.conversation.updatedAt
              ? new Date(response.conversation.updatedAt).toISOString()
              : undefined,
            lastActivity: response.conversation.lastActivity
              ? new Date(response.conversation.lastActivity).toISOString()
              : new Date().toISOString(),
          };
        }
        return response;
      },
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useFetchConversationsQuery,
  useSendMessageMutation,
  useFetchMessagesQuery,
  useFindOrCreateConversationMutation,
} = chatApi;
