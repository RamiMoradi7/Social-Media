import mongoose, { Document, Schema, Types, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
import { PrivacyOptions } from "./enums";

export type MediaItem = {
  url: string;
  type: "image" | "video";
};

export interface IPost extends Document {
  content: string;
  postedAt: Date;
  author: mongoose.Types.ObjectId;
  tags?: string;
  likes: Types.ObjectId[];
  imageNames: MediaItem[];
  comments: mongoose.Types.ObjectId[];
  commentsCount: number;
  privacy: PrivacyOptions;
  targetUser?: mongoose.Types.ObjectId;
  isLiked: boolean;
  isLikedByUser: (userId: mongoose.Types.ObjectId) => boolean;
}

export const PostSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: [true, "Content is missing."],
    },
    postedAt: {
      type: Date,
      default: new Date(),
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is missing."],
    },
    tags: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    imageNames: [
      {
        url: { type: String },
        type: { type: String },
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    privacy: {
      type: String,
      enum: PrivacyOptions,
      required: [true, "Post privacy is missing."],
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

PostSchema.methods.isLikedByUser = function (
  this: IPost,
  userId: mongoose.Types.ObjectId
): boolean {
  return this.likes.some((like) => like.equals(userId));
};

PostSchema.virtual("photos").get(function (this: IPost) {
  return this.imageNames.map((imageName) => {
    return {
      imageUrl: appConfig.basePostsImageUrl + imageName.url,
      type: imageName.type,
    };
  });
});

PostSchema.virtual("likesCount").get(function (this: IPost) {
  return this.likes.length;
});
PostSchema.virtual("commentsCount").get(function (this: IPost) {
  return this.comments.length;
});
export const Post = model<IPost>("Post", PostSchema, "posts");
