import { Message } from "./Message";
import { User } from "./User";

export class Chat {
  _id: string;
  participants: User[];
  deletedBy: { userId: string; deletedAt?: Date }[];
  messages: Message[];
  createdAt: Date;
  updatedAt: string;
}
