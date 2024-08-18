import { User } from "./User";

export class Reply {
  _id: string;
  author: User;
  text: string;
  commentId: string;
  createdAt: Date;
  likes: User[];
  isLiked: boolean;
  image: File;
  likesCount: number;
  imageUrl: string;
}
