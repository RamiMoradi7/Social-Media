import mongoose, { Document, Schema, model, mongo } from "mongoose";
import { appConfig } from "../2-utils/app-config";

export interface IReply extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  commentId: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  imageName?: string;
  isLiked: boolean;
  isLikedByUser?: (userId: mongoose.Types.ObjectId) => boolean;
}

export const ReplySchema = new Schema<IReply>(
  {
    text: { type: String, required: [true, "Text is missing."] },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is missing."],
    },
    commentId: {
      type: Schema.Types.ObjectId,
      required: [true, "Comment id is missing."],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    imageName: {
      type: String,
    },
  },
  {
    versionKey: false,
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);

ReplySchema.methods.isLikedByUser = function (
  this: IReply,
  userId: mongoose.Types.ObjectId
): boolean {
  return this.likes.some((like) => like.equals(userId));
};

ReplySchema.virtual("likesCount").get(function (this: IReply) {
  return this.likes.length;
});

ReplySchema.virtual("imageUrl").get(function (this: IReply) {
  return this.imageName ? appConfig.baseReplyImageUr + this.imageName : null;
});

export const Reply = model<IReply>("Reply", ReplySchema, "replies");
