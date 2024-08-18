import mongoose, { Document, Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
import { IReply } from "./reply";

export interface IComment extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  replies: IReply[];
  imageName?: string;
  isLiked: boolean;
  isLikedByUser: (userId: mongoose.Types.ObjectId) => boolean;
}

export const CommentSchema = new Schema<IComment>(
  {
    text: { type: String, required: [true, "Text is missing."] },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is missing."],
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: [true, "Post id is missing."],
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
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply",
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
      transform: function (doc, ret) {
        delete ret.imageName;
        return ret;
      },
    },
  }
);

CommentSchema.virtual("post", {
  ref: "Post",
  foreignField: "_id",
  localField: "postId",
  justOne: true,
});

CommentSchema.methods.isLikedByUser = function (
  this: IComment,
  userId: mongoose.Types.ObjectId
): boolean {
  return this.likes.some((like) => like.equals(userId));
};

CommentSchema.virtual("imageUrl").get(function (this: IComment) {
  return this.imageName
    ? appConfig.baseCommentsImageUrl + this.imageName
    : null;
});

CommentSchema.virtual("likesCount").get(function (this: IComment) {
  return this.likes.length;
});

export const Comment = model<IComment>("Comment", CommentSchema, "comments");
