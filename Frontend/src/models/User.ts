import { MediaItem, PrivacyOptions, userAddress } from "../types/UserTypes";
import { Comment } from "./Comment";
import { Post } from "./Post";

export type Album = {
  title: string;
  mediaItems: MediaItem[];
  createdAt: Date;
  referenceId: string;
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
  friends?: User[];
  friendRequests?: User[];
  sentRequests?: User[];
  isActive?: boolean;
  comments?: Comment[];
  lastLogin?: Date;
  interests?: string[];
  languages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  theme?: "light" | "dark";
  isFriendRequestSent?: boolean;
}
