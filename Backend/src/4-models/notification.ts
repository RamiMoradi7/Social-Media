import mongoose, { Document, Schema, model } from "mongoose";
export enum NotificationTypes {
  FriendRequest = "friendRequest",
  AcceptFriendRequest = "acceptFriendRequest",
  Message = "message",
  Comment = "comment",
  Reply = "reply",
  Like = "like",
  Mention = "mention",
}
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationTypes;
  message?: string;
  timestamp: Date;
  isRead: boolean;
  referenceId?: mongoose.Types.ObjectId;
  senderId?: mongoose.Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: {
      type: String,
      required: true,
      enum: NotificationTypes,
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: [true, "Reference Id is missing."],
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    versionKey: false,
    id: false,
  }
);

export const Notification = model<INotification>(
  "Notification",
  NotificationSchema,
  "notifications"
);
