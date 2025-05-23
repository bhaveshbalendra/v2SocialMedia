import { Model, model, Schema } from "mongoose";
import { IMessage } from "../types/schema.types";

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
