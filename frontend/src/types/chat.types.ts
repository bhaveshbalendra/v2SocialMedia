// Define interfaces for the chat state
export interface MessageState {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Define interfaces for the chat state

export interface IConversation {
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  _id: string;
  participants: {
    _id: string;
    username: string;
    profilePicture: string;
  }[];
  type: "individual" | "group";
  groupName?: string;
  groupDescription?: string;
  groupAvatar?: string;
  groupAdmins: string[];
  createdBy: string;
  lastMessage?: string;
  lastActivity: string;
  isActive: boolean;
  settings: {
    muteNotifications: boolean;
    allowNewMembers: boolean;
  };
  // Virtuals
  isGroup: boolean;
  participantCount: number;
}

export interface OnlineUserState {
  userId: string;
  socketId: string;
  username?: string;
  avatar?: string;
}

export interface ChatState {
  conversations: IConversation[];
  messages: IMessage[];
  onlineUsers: OnlineUserState[];
  activeChat: string | null; // ID of the user you're actively chatting with
  unreadCounts: Record<string, number>; // Maps userId to number of unread messages
  selectedConversation: IConversation | null;
}

export interface IFetchConversationsApiResponse {
  success: boolean;
  message: string;
  conversations: IConversation[];
}

export interface IFetchMessagesApiResponse {
  success: boolean;
  message: string;
  messages: IMessage[];
}

export interface ISendMessageApiResponse {
  success: boolean;
  message: string;
}

export interface ISendMessageParameter {
  friendId: string;
  content: string;
}

export interface IReceiveMessageRTM {
  message: IMessage;
}

export interface IMessage {
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  senderId: string;
  conversationId: string;
  content: string;
  messageType: "text" | "image" | "file" | "audio" | "video" | "system";
  media?: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  };
  isEdited: boolean;
  editedAt?: string;
  readBy: Array<{
    userId: string;
    readAt: string;
  }>;
  replyTo?: string;
  reactions: Array<{
    userId: string;
    emoji: string;
    createdAt: string;
  }>;
  systemData?: {
    action:
      | "user_joined"
      | "user_left"
      | "user_added"
      | "user_removed"
      | "group_created"
      | "group_updated";
    targetUserId?: string;
    metadata?: unknown;
  };
  // Virtuals
  isRead: boolean;
}
