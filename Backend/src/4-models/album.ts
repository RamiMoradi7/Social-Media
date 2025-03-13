import mongoose, { Document, Schema, model } from "mongoose";
import { MediaTypes } from "./enums";

export interface IMediaItem {
  type: MediaTypes;
  url: string[];
  createdAt: Date;
  postId?: mongoose.Types.ObjectId;
}

export interface IAlbum extends Document {
  title: string;
  mediaItems: IMediaItem[];
  createdAt: Date;
  referenceId: mongoose.Types.ObjectId;
}

const MediaItemSchema = new Schema<IMediaItem>({
  type: {
    type: String,
    enum: MediaTypes,
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
    referenceId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    toJSON: { virtuals: true },
    id: false,
    versionKey: false,
  }
);

export const Album = model<IAlbum>("Album", AlbumSchema, "albums");
