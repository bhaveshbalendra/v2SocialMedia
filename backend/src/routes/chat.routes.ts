import { Router } from "express";
import {
  handleFindOrCreateConversation,
  handleGetConversations,
  handleGetMessages,
  handleMarkMessagesAsRead,
  handleSendMessage,
} from "../controller/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Get all conversations for authenticated user
router.get("/conversations", authenticate, handleGetConversations);

// Send a message in a one-on-one chat
router.post("/individual", authenticate, handleSendMessage);

// Find or create a conversation with a specific user
router.post("/find-or-create", authenticate, handleFindOrCreateConversation);

// Get all messages for a conversation
router.get("/messages/:conversationId", authenticate, handleGetMessages);

// Mark messages as read for a conversation
router.patch("/messages/:conversationId/read", authenticate, handleMarkMessagesAsRead);

export default router;
