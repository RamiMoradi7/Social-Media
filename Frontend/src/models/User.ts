import { MediaItem, PrivacyOptions, userAddress } from "../types/UserTypes";
import { Post } from "./Post";

export type Album = {
  title: string;
  mediaItems: MediaItem[];
  createdAt: Date;
};

export class User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
  address?: userAddress;
  birthday: Date;
  bio?: string;
  photos: {
    profilePhoto?: string;
    coverPhoto?: string;
  };
  privacySettings?: {
    posts: PrivacyOptions;
    friendList: PrivacyOptions;
  };
  notificationsEnabled: boolean;
  albums: Album[];
  friends?: Partial<User>[];
  friendRequests?: User[];
  sentRequests?: Partial<User>[];
  isActive?: boolean;
  posts?: Post[];
  comments?: Comment[];
  likedPosts?: string[];
  lastLogin?: Date;
  interests?: string[];
  languages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  theme?: "light" | "dark";
  isFriendRequestSent?: boolean;
}
