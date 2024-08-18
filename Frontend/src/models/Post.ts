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
  comments: Comment[];
  privacy: "Public" | "Private" | "Friends";
  isLiked: boolean;
}
