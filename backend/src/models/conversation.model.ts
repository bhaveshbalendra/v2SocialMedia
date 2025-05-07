import { Document, Model, model, Schema } from "mongoose";

//interface for conversation
interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  messages: Schema.Types.ObjectId[];
}

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
