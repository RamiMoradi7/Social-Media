import { Comment } from "./Comment";
import { User } from "./User";

export type PostMediaItem = {
  imageUrl: string;
  type: string;
};

export class Post {
  _id: string;
  title: string;
  content: string;
  postedAt: Date;
  authorId: string;
  author: User;
  tags?: string;
  likes: User[];
  photos: PostMediaItem[];
  likesCount: number;
  images: FileList;
  recordComments: Record<string, Comment>;
  commentsCount: number;
  privacy: "Public" | "Private" | "Friends";
  targetUserId?: string;
  targetUser: Partial<User>;
  isLiked: boolean;
}
