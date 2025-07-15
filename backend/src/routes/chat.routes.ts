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
 * @route   GET /api/v2/chat/conversations
 * @desc    Get all conversations
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

export default router;
