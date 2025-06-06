import { Router } from "express";

import {
  findOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../controller/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route   GET /api/v2/chat/friends
 * @desc    Get all friends
 * @access  Private
 */
router.get("/conversations", authenticate, getConversations);

/**
 * @route   POST /api/v2/chat/individual
 * @desc    Create a new one-on-one chat
 * @access  Private
 */
router.post("/individual", authenticate, sendMessage);

/**
 * @route   POST /api/v2/chat/find-or-create
 * @desc    Find or create a conversation with a specific user
 * @access  Private
 */
router.post("/find-or-create", authenticate, findOrCreateConversation);

/**
 * @route   GET /api/v2/chat/messages/:conversationId
 * @desc    Get all messages for a conversation
 * @access  Private
 */
router.get("/messages/:conversationId", authenticate, getMessages);

// /**
//  * @route   POST /api/v2/chat/group
//  * @desc    Create a new group chat
//  * @access  Private
//  */
// router.post(
//   "/group",
//   authenticate,
//   validateRequest(chatValidation.createGroup),
//   createGroupChat
// );

// /**
//  * @route   PUT /api/v2/chat/group/:chatId
//  * @desc    Update a group chat
//  * @access  Private
//  */
// router.put(
//   "/group/:chatId",
//   authenticate,
//   validateRequest(chatValidation.updateGroup),
//   updateGroupChat
// );

// /**
//  * @route   GET /api/v2/chat
//  * @desc    Get all chats for a user
//  * @access  Private
//  */
// router.get("/", authenticate, getUserChats);

// /**
//  * @route   GET /api/v2/chat/:chatId
//  * @desc    Get a single chat by ID
//  * @access  Private
//  */
// router.get("/:chatId", authenticate, getChatById);

// /**
//  * @route   DELETE /api/v2/chat/:chatId
//  * @desc    Delete a chat
//  * @access  Private
//  */
// router.delete("/:chatId", authenticate, deleteChat);

export default router;
