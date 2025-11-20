import { Document, Model, Schema, Types, model } from "mongoose";

// Interface for Subscription Document - defines the structure of premium user subscriptions
export interface ISubscription extends Document {
  _id: string;
  user: Types.ObjectId;
  plan: string;
  price: number;
  currency: string;
  status: string;
  paymentId?: string;
  paymentProvider: string;
  startDate: Date;
  endDate: Date;
  isAutoRenew: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Schema - Mongoose schema for user premium subscriptions
const subscriptionSchema: Schema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["BASIC", "STANDARD", "PREMIUM"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELED", "EXPIRED", "PENDING"],
      default: "PENDING",
    },
    paymentId: {
      type: String,
    },
    paymentProvider: {
      type: String,
      enum: ["RAZORPAY", "STRIPE", "PAYPAL"],
      default: "RAZORPAY",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isAutoRenew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster subscription lookups
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription: Model<ISubscription> = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
export default Subscription;
