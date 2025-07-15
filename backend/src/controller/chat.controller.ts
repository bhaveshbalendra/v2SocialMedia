import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import chatService from "../service/chat.service";

/**
 * @route   GET /api/v2/chat/conversations
 * @desc    Get all conversations
 * @access  Private
 */
const getConversations = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user;

    const { conversations } = await chatService.getConversations({ userId });

    response.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      conversations,
    });
  }
);

/**
 * @route   GET /api/v2/chat/messages/:conversationId
 * @desc    Get all messages for a conversation
 * @access  Private
 */
const getMessages = asyncHandler(
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

/**
 * @route   POST /api/v2/chat/send-message
 * @desc    Send a message
 * @access  Private
 */
const sendMessage = asyncHandler(
  async (request: Request, response: Response) => {
    const { friendId, content } = request.body;
    const userId = request.user;

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

/**
 * @route   POST /api/v2/chat/find-or-create
 * @desc    Find or create a conversation with a specific user
 * @access  Private
 */
const findOrCreateConversation = asyncHandler(
  async (request: Request, response: Response) => {
    const { friendId } = request.body;
    const userId = request.user;

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

export { findOrCreateConversation, getConversations, getMessages, sendMessage };
