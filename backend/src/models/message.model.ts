import { Document, Model, model, Schema } from "mongoose";

//Interface for Message model
interface IMessage extends Document {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  message: string;
}

/**
 * @description Schema for message for comments
 */
const messageSchema: Schema<IMessage> = new Schema<IMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

//exporting the Message model
export const Message: Model<IMessage> = model<IMessage>(
  "Message",
  messageSchema
);
