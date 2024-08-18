import mongoose, { Document, Schema, model } from "mongoose";

export interface ILike extends Document {
  targetType: "Post" | "Comment" | "Reply" | "ProfilePhoto" | "CoverPhoto";
  targetId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

export const LikeSchema = new Schema<ILike>(
  {
    targetType: {
      type: String,
      enum: ["Post", "Comment", "Reply", "ProfilePhoto", "CoverPhoto"],
      required: [true, "Entity type is missing."],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: function (this: ILike) {
        return [
          "Post",
          "Comment",
          "Reply",
          "ProfilePhoto",
          "CoverPhoto",
        ].includes(this.targetType);
      },
      refPath: "targetType",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is missing."],
    },
  },
  {
    versionKey: false,
    id: false,
  }
);
LikeSchema.index({ targetType: 1, targetId: 1, userId: 1 }, { unique: false });

export const Like = model<ILike>("Like", LikeSchema, "likes");
