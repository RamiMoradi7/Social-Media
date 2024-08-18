import { Socket, io } from "socket.io-client";
import { Comment } from "../models/Comment";
import { Message } from "../models/Message";
import { Notification } from "../models/Notification";
import { appConfig } from "../utilities/AppConfig";
import { Chat } from "../models/Chat";

class SocketService {
  private socket: Socket;

  public connect(
    handleMessage: (msg: Message) => void,
    handleAddComment: (comment: Comment) => void,
    handleNotification: (notification: Notification) => void,
    handleRemoveNotification: (notificationId: string) => void,
    handleStartChat: (chat: Chat) => void
  ): void {
    this.socket = io(appConfig.socketUrl);

    this.socket.on("startChat", (chat: Chat) => {
      handleStartChat(chat);
    });

    this.socket.on("addedComment", (comment: Comment) => {
      handleAddComment(comment);
    });

    this.socket.on("sendMessage", (msg: Message) => {
      handleMessage(msg);
    });
    this.socket.on("notificationAdded", (notification: Notification) => {
      handleNotification(notification);
    });
    this.socket.on("notificationRemoved", (notificationId: string) => {
      handleRemoveNotification(notificationId);
    });
  }

  public sendMessage(messageData: Partial<Message>): void {
    this.socket.emit("sendMessage", messageData);
  }

  public sendNotification(notification: Notification): void {
    this.socket.emit("sendNotification", notification);
  }

  public startChat(chat: Chat): void {
    this.socket.emit("startChat", chat);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}

export const socketService = new SocketService();
