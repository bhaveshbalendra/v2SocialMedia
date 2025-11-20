import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import chatService from "../service/chat.service";

// Get all conversations for authenticated user
const handleGetConversations = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user._id.toString();

    const { conversations } = await chatService.getConversations({
      userId,
    });

    response.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      conversations,
    });
  }
);

// Get all messages for a conversation
const handleGetMessages = asyncHandler(
  async (request: Request, response: Response) => {
    const { conversationId } = request.params;

    const { messages } = await chatService.getMessages({
      conversationId,
    });

    response.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  }
);

// Send a message
const handleSendMessage = asyncHandler(
  async (request: Request, response: Response) => {
    const { friendId, content } = request.body;
    const userId = request.user._id.toString();

    const { message } = await chatService.sendMessage({
      userId,
      friendId,
      content,
    });

    response.status(200).json({
      success: true,
      message,
    });
  }
);

// Find or create a conversation with a specific user
const handleFindOrCreateConversation = asyncHandler(
  async (request: Request, response: Response) => {
    const { friendId } = request.body;
    const userId = request.user._id.toString();

    if (!friendId) {
      response.status(400).json({
        success: false,
        message: "Friend ID is required",
      });
      return;
    }

    const { conversation } = await chatService.findOrCreateConversation({
      userId,
      friendId,
    });

    response.status(200).json({
      success: true,
      message: "Conversation found/created successfully",
      conversation,
    });
  }
);

// Mark messages as read for a conversation
const handleMarkMessagesAsRead = asyncHandler(
  async (request: Request, response: Response) => {
    const { conversationId } = request.params;
    const userId = request.user._id.toString();

    const { message } = await chatService.markMessagesAsRead({
      userId,
      conversationId,
    });

    response.status(200).json({
      success: true,
      message,
    });
  }
);

export {
  handleFindOrCreateConversation,
  handleGetConversations,
  handleGetMessages,
  handleMarkMessagesAsRead,
  handleSendMessage,
};
