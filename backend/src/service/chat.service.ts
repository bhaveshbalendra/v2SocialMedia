import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import User from "../models/user.model";
import {
  IConversation,
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

    // Ensure userId and friendId are strings for socket map lookup
    const userIdString = userId.toString();
    const friendIdString = friendId.toString();

    // Get the message as a plain object
    const messageData = message.toObject() as any;
    const messageId = (message._id as Types.ObjectId).toString();
    const conversationId = (conversation._id as Types.ObjectId).toString();

    // Convert _id to id for frontend compatibility
    const formattedMessage = {
      ...messageData,
      _id: messageData._id?.toString() || messageId,
      id: messageData._id?.toString() || messageId,
      senderId: messageData.senderId?.toString() || userIdString,
      conversationId: messageData.conversationId?.toString() || conversationId,
      createdAt:
        messageData.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt:
        messageData.updatedAt?.toISOString() || new Date().toISOString(),
      messageType: messageData.messageType || "text",
      isEdited: messageData.isEdited || false,
      readBy: messageData.readBy || [],
      reactions: messageData.reactions || [],
      isRead: messageData.isRead || false,
    };

    // Emit to recipient
    const recipientSockets = userSocketMap.get(friendIdString) || [];
    if (recipientSockets && recipientSockets.length > 0) {
      recipientSockets.forEach((socketId) => {
        io.to(socketId).emit("newMessage", formattedMessage);
      });
    }

    // Also emit to sender so they can replace their optimistic message
    const senderSockets = userSocketMap.get(userIdString) || [];
    if (senderSockets && senderSockets.length > 0) {
      senderSockets.forEach((socketId) => {
        io.to(socketId).emit("newMessage", formattedMessage);
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

    if (!conversations || conversations.length === 0) {
      return {
        conversations: [],
      };
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

      const foundConversation = await Conversation.findById(
        newConversation._id
      ).populate({
        path: "participants",
        select: "username profilePicture _id",
      });

      if (!foundConversation) {
        throw AppError.notFoundError("Conversation");
      }

      conversation = foundConversation;
    }

    if (!conversation) {
      throw AppError.notFoundError("Conversation");
    }

    return {
      conversation: conversation as IConversation,
    };
  }

  // Mark messages as read for a conversation
  async markMessagesAsRead({
    userId,
    conversationId,
  }: {
    userId: string;
    conversationId: string;
  }): Promise<{ message: string }> {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw AppError.notFoundError("Conversation not found");
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId
    );

    if (!isParticipant) {
      throw AppError.unauthorizedError(
        "Not authorized to access this conversation"
      );
    }

    // Get all unread messages in this conversation
    const unreadMessages = await Message.find({
      conversationId: conversation._id,
      senderId: { $ne: userId }, // Messages not sent by current user
      readBy: { $not: { $elemMatch: { userId: new Types.ObjectId(userId) } } }, // Not read by current user
    });

    // Mark all unread messages as read
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map((m) => m._id) } },
        {
          $addToSet: {
            readBy: {
              userId: new Types.ObjectId(userId),
              readAt: new Date(),
            },
          },
        }
      );
    }

    return {
      message: "Messages marked as read",
    };
  }
}

export default new ChatService();
