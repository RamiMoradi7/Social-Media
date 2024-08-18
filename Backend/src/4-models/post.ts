import mongoose, { Document, Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
import { IComment } from "./comment";

export type MediaItem = {
  url: string;
  type: "image" | "video";
};

export interface IPost extends Document {
  content: string;
  postedAt: Date;
  author: mongoose.Types.ObjectId;
  tags?: string;
  likes: mongoose.Types.ObjectId[];
  imageNames: MediaItem[];
  comments: IComment[];
  privacy: "Public" | "Private" | "Friends";
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
        ref: "Comment",
      },
    ],
    privacy: {
      type: String,
      enum: ["Public", "Private", "Friends"],
      required: [true, "Post privacy is missing."],
    },
  },
  {
    versionKey: false,
    id: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.isLiked = doc.isLiked;
        return ret;
      },
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

export const Post = model<IPost>("Post", PostSchema, "posts");
