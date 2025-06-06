import { Document, Types } from "mongoose";

interface IGetConversationsParameter {
  userId: string;
  friendId?: string;
}

interface IConversationParameter {
  userId: string;
  friendId: string;
}

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  type: "individual" | "group";
  groupName?: string;
  groupDescription?: string;
  groupAvatar?: string;
  groupAdmins: Types.ObjectId[];
  createdBy: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  lastActivity: Date;
  isActive: boolean;
  settings: {
    muteNotifications: boolean;
    allowNewMembers: boolean;
  };
  // Virtuals
  isGroup: boolean;
  participantCount: number;
}

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  conversationId: Types.ObjectId;
  content: string;
  messageType: "text" | "image" | "file" | "audio" | "video" | "system";
  media?: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  };
  isEdited: boolean;
  editedAt?: Date;
  readBy: Array<{
    userId: Types.ObjectId;
    readAt: Date;
  }>;
  replyTo?: Types.ObjectId;
  reactions: Array<{
    userId: Types.ObjectId;
    emoji: string;
    createdAt: Date;
  }>;
  systemData?: {
    action:
      | "user_joined"
      | "user_left"
      | "user_added"
      | "user_removed"
      | "group_created"
      | "group_updated";
    targetUserId?: Types.ObjectId;
    metadata?: any;
  };
  // Virtuals
  isRead: boolean;
}

interface IFriend {
  _id: string;
  username: string;
  profilePicture: string;
}

interface IGetConversationsServiceReturn {
  conversations: IConversation[];
}

interface IConversationServiceReturn {
  conversation: IConversation;
}

interface ISendMessageParameter {
  userId: string;
  friendId: string;
  content: string;
}

interface ISendMessageServiceReturn {
  message: string;
}

interface IGetMessagesParameter {
  conversationId: string;
}

interface IGetMessagesServiceReturn {
  messages: IMessage[];
}

interface IFindOrCreateConversationParameter {
  userId: string;
  friendId: string;
}

interface IFindOrCreateConversationServiceReturn {
  conversation: any;
}

export type {
  IConversationParameter,
  IConversationServiceReturn,
  IFindOrCreateConversationParameter,
  IFindOrCreateConversationServiceReturn,
  IFriend,
  IGetConversationsParameter,
  IGetConversationsServiceReturn,
  IGetMessagesParameter,
  IGetMessagesServiceReturn,
  ISendMessageParameter,
  ISendMessageServiceReturn,
};
