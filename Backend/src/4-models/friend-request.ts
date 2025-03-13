import mongoose, { Document, Schema, model } from "mongoose";
import { FriendRequestStatus } from "./enums"; 

export interface IFriendRequest extends Document {
  targetUserId: mongoose.Types.ObjectId;
  currentUserId: mongoose.Types.ObjectId;
  status: FriendRequestStatus; 
  createdAt: Date;
  updatedAt: Date;
}

export const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", 
    },
    currentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",  
    },
    status: {
      type: String,
      enum: Object.values(FriendRequestStatus),  
      required: true,
    },
  },
  {
    timestamps: true,  
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

export const FriendRequest = model<IFriendRequest>("FriendRequest", FriendRequestSchema, "friend-requests");
