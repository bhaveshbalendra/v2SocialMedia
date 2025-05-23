import { Model, model, Schema } from "mongoose";
import { IConversation } from "../types/schema.types";

/**
 * @description message schema
 */
const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

//exporting conversation
export const Conversation: Model<IConversation> = model<IConversation>(
  "Conversation",
  conversationSchema
);
