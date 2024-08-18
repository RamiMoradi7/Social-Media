import mongoose, { Document, Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";

export interface IMediaItem {
  type: "profilePicture" | "coverPhoto" | "photo" | "video";
  url: string[];
  createdAt: Date;
  postId?: mongoose.Types.ObjectId;
}

export interface IAlbum extends Document {
  title: string;
  mediaItems: IMediaItem[];
  createdAt: Date;
}

const MediaItemSchema = new Schema<IMediaItem>({
  type: {
    type: String,
    enum: ["profilePicture", "coverPhoto", "photo", "video"],
    required: true,
  },
  url: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => Array.isArray(v),
      message: (props) => `${props.path} must be an array!`,
    },
  },
  createdAt: { type: Date, default: Date.now },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
});

const AlbumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true },
    mediaItems: [MediaItemSchema],
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
  }
);

export const Album = model<IAlbum>("Album", AlbumSchema);
