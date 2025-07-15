import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import User from "../models/user.model";
import {
  IFindOrCreateConversationParameter,
  IFindOrCreateConversationServiceReturn,
  IGetConversationsParameter,
  IGetConversationsServiceReturn,
  IGetMessagesParameter,
  IGetMessagesServiceReturn,
  IMessage,
  ISendMessageParameter,
  ISendMessageServiceReturn,
} from "../types/chat.types";
import { io, userSocketMap } from "../utils/socket.util";

class ChatService {
  async sendMessage({
    userId,
    friendId,
    content,
  }: ISendMessageParameter): Promise<ISendMessageServiceReturn> {
    if (!userId || !friendId || !content) {
      throw AppError.authError("All fields are required");
    }

    const friend = await User.findById(friendId);

    if (!friend) {
      throw AppError.authError("Friend not found");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (!conversation) {
      const newConversation = await Conversation.create({
        participants: [userId, friendId],
        type: "individual",
      });

      conversation = newConversation;
    }

    const message = await Message.create({
      senderId: userId,
      conversationId: conversation._id,
      content,
      messageType: "text",
    });

    if (!message) {
      throw AppError.authError("Failed to send message");
    }

    conversation.messages.push(message._id as Types.ObjectId);
    await conversation.save();

    const userSockets = userSocketMap.get(friendId) || [];

    if (userSockets && userSockets.length > 0) {
      userSockets.forEach((socketId) => {
        io.to(socketId).emit("newMessage", message.toJSON());
      });
    }

    return {
      message: "message sent",
    };
  }

  async getConversations({
    userId,
  }: IGetConversationsParameter): Promise<IGetConversationsServiceReturn> {
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    }).populate({
      path: "participants",
      select: "username profilePicture _id",
    });

    if (!conversations) {
      throw AppError.notFoundError("Start a conversation with the user");
    }

    return {
      conversations,
    };
  }

  async getMessages({
    conversationId,
  }: IGetMessagesParameter): Promise<IGetMessagesServiceReturn> {
    if (!conversationId) {
      throw AppError.authError("Friend not found");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw AppError.authError("Conversation not found");
    }

    const conversations = await Conversation.findOne({
      _id: conversationId,
    }).populate({
      path: "messages",
      select:
        "senderId conversationId content messageType media isEdited editedAt readBy replyTo reactions systemData createdAt updatedAt",
    });

    if (!conversations) {
      throw AppError.authError("Start a conversation with the user");
    }

    return {
      messages: conversations.messages as unknown as IMessage[],
    };
  }

  async findOrCreateConversation({
    userId,
    friendId,
  }: IFindOrCreateConversationParameter): Promise<IFindOrCreateConversationServiceReturn> {
    if (!userId || !friendId) {
      throw AppError.authError("All fields are required");
    }

    const friend = await User.findById(friendId);

    if (!friend) {
      throw AppError.authError("Friend not found");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, friendId] },
    }).populate({
      path: "participants",
      select: "username profilePicture _id",
    });

    if (!conversation) {
      const newConversation = await Conversation.create({
        participants: [userId, friendId],
        type: "individual",
      });

      conversation = await Conversation.findById(newConversation._id).populate({
        path: "participants",
        select: "username profilePicture _id",
      });
    }

    return {
      conversation,
    };
  }
}

export default new ChatService();
