import mongoose, { Document, Schema, model } from "mongoose";
import { appConfig } from "../2-utils/app-config";
import {
  GenderOptions,
  PrivacyOptions,
  UserAddress,
} from "../3-types/user-types";
import { IAlbum } from "./album";
import { RoleModel } from "./enums";
import { IPost } from "./post";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  gender: GenderOptions;
  password: string;
  address: UserAddress;
  birthday: Date;
  age?: number;
  bio?: string;
  profilePicture?: string;
  coverPhoto?: string;
  privacySettings?: {
    posts: PrivacyOptions;
    friendList: PrivacyOptions;
  };
  albums: IAlbum[];
  friends?: mongoose.Types.ObjectId[];
  friendRequests?: mongoose.Types.ObjectId[];
  sentRequests?: mongoose.Types.ObjectId[];
  notificationsEnabled: boolean;
  isActive?: boolean;
  posts?: IPost[];
  likedPosts?: mongoose.Types.ObjectId[];
  lastLogin?: Date;
  interests?: string[];
  languages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  theme?: "light" | "dark";
  roleId: RoleModel;
  isFriendRequestSent?: boolean;
  isFriendRequestSentByUser?: (userId: mongoose.Types.ObjectId) => boolean;
}
export const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is missing"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is missing"],
    },

    address: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    email: {
      type: String,
      required: [true, "Email is missing."],
    },
    gender: {
      type: String,
      enum: GenderOptions,
      required: [true, "Gender is missing."],
    },
    password: {
      type: String,
      select: false,
    },
    birthday: {
      type: Date,
      required: [true, "Birthday is missing."],
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    bio: {
      type: String,
      minlength: 5,
      maxlength: 110,
    },
    profilePicture: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    privacySettings: {
      posts: {
        type: String,
        enum: PrivacyOptions,
      },
      friendList: {
        type: String,
        enum: PrivacyOptions,
      },
    },
    albums: [
      {
        type: Object,
      },
    ],
    notificationsEnabled: { type: Boolean },

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        date: new Date(),
      },
    ],
    sentRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      required: false,
    },
    likedPosts: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastLogin: { type: Date },
    interests: [{ type: String }],
    languages: [{ type: String }],
    createdAt: { type: Date },
    updatedAt: { type: Date },
    theme: {
      type: String,
      default: "dark",
    },
    roleId: {
      type: Number,
      required: false,
      validate: {
        validator: (value: number) =>
          [RoleModel.Admin, RoleModel.User].includes(value),
        message: "Invalid role id.",
      },
    },
  },
  {
    versionKey: false,
    id: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

function calculateAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDifference = today.getMonth() - birthday.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }
  return age;
}

UserSchema.pre<IUser>("save", function (next) {
  if (this.isModified("birthday")) {
    this.age = calculateAge(this.birthday);
  }
  next();
});

UserSchema.methods.isFriendRequestSentByUser = function (
  this: IUser,
  userId: mongoose.Types.ObjectId
): boolean {
  return this.friendRequests.some((friendRequest) =>
    friendRequest.equals(userId)
  );
};

UserSchema.virtual("photos").get(function (
  this: IUser & { profilePicture?: string; coverPhoto?: string }
) {
  return {
    profilePhoto: this.profilePicture
      ? appConfig.baseImageUrl + this.profilePicture
      : null,
    coverPhoto: this.coverPhoto
      ? appConfig.baseImageUrl + this.coverPhoto
      : null,
  };
});

export const User = model<IUser>("User", UserSchema, "users");
