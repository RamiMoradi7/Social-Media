import { Post } from "./Post";
import { User } from "./User";

export enum NotificationTypes {
  FriendRequest = "friendRequest",
  AcceptFriendRequest = "acceptFriendRequest",
  Message = "message",
  Comment = "comment",
  Reply = "reply",
  Like = "like",
  Mention = "mention",
}

export interface Notification {
  _id: string;
  userId: Partial<User>;
  type: NotificationTypes;
  message: string;
  timestamp: Date;
  isRead: boolean;
  referenceId: string;
  senderId: Partial<User>;
  post?: Post;
}
