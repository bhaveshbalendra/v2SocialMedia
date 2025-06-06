// import { Router } from "express";
// import {
//   createGroupChat,
//   createSingleChat,
//   deleteChat,
//   getChatById,
//   getUserChats,
//   updateGroupChat,
// } from "../controllers/chat.controller";
// import { authenticate } from "../middlewares/auth.middleware";
// import { validateRequest } from "../middlewares/validator.middleware";
// import { chatValidation } from "../utils/validators";

// const router = Router();

// /**
//  * @route   POST /api/v2/chat/single
//  * @desc    Create a new one-on-one chat
//  * @access  Private
//  */
// router.post(
//   "/single",
//   authenticate,
//   validateRequest(chatValidation.create),
//   createSingleChat
// );

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

// export default router;
