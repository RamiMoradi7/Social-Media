import { User } from "../models/User";

export type userAddress = {
  city: string;
  state: string;
  country: string;
};
export enum PrivacyOptions {
  Public = "public",
  Friends = "friends",
  Private = "private",
}
export type MediaItem = {
  type: "profilePicture" | "coverPhoto" | "photo" | "video";
  url: string | string[];
  createdAt: Date;
  postId?: string;
};

export type FriendshipData = {
  receiverUser: Partial<User>;
  senderUser: Partial<User>;
  status: string;
};

export type FriendActionTypes =
  | "friendRequest"
  | "acceptRequest"
  | "ignoreRequest"
  | "deleteFriendship";
