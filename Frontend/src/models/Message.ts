import { Chat } from "./Chat";
import { User } from "./User";

export class Message {
  _id?: string;
  content: string;
  sender: User;
  senderId: string;
  participants: User[];
  receiver: User;
  receiverId: string;
  chat: Chat;
  chatId: string;
  image?: File;
  imageUrl?: string;
}
