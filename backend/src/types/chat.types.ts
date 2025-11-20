import { IConversation, IMessage } from "./schema.types";

interface IGetConversationsParameter {
  userId: string;
  friendId?: string;
}

interface IConversationParameter {
  userId: string;
  friendId: string;
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
  conversation: IConversation;
}

export type { IConversation, IMessage };

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
