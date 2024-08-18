import { Reply } from "./Reply";
import { Post } from "./Post";
import { User } from "./User";

export class Comment {
  _id: string;
  text: string;
  author: User;
  postId: string;
  createdAt: Date;
  likes: User[];
  image: File;
  imageUrl: string;
  likesCount: number;
  replies: Reply[];
  isLiked: boolean;
}
