// Define interfaces for the chat state
export interface MessageState {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface OnlineUserState {
  userId: string;
  socketId: string;
  username?: string;
  avatar?: string;
}

export interface ChatState {
  messages: MessageState[];
  onlineUsers: OnlineUserState[];
  activeChat: string | null; // ID of the user you're actively chatting with
  unreadCounts: Record<string, number>; // Maps userId to number of unread messages
}
