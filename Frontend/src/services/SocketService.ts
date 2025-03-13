import { Socket, io } from "socket.io-client";
import { Chat } from "../models/Chat";
import { Comment } from "../models/Comment";
import { Message } from "../models/Message";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { appConfig } from "../utilities/AppConfig";
import { FriendActionTypes, FriendshipData } from "../types/UserTypes";

class SocketService {
  private socket: Socket;
  public connect(
    handleMessage: (msg: Message) => void,
    handleAddComment: (comment: Comment) => void,
    handleNotification: (notification: Notification) => void,
    handleRemoveNotification: (notificationId: string) => void,
    handleStartChat: (chat: Chat) => void,
    handleFriendRequestAction: (
      action: FriendActionTypes,
      friendshipData: FriendshipData
    ) => void
  ): void {
    this.socket = io(appConfig.socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log(`Connected to WebSocket server.`);
    });

    this.socket.on("startChat", (chat: Chat) => {
      handleStartChat(chat);
    });

    this.socket.on("addedComment", (comment: Comment) => {
      handleAddComment(comment);
    });

    this.socket.on(
      "friendAction",
      async ({
        action,
        senderUser,
        receiverUser,
        status,
      }: {
        action: FriendActionTypes;
        senderUser: Partial<User>;
        receiverUser: Partial<User>;
        status: string;
      }) => {
        handleFriendRequestAction(action, { senderUser, receiverUser, status });
      }
    );
    this.socket.on("sendMessage", (msg: Message) => {
      handleMessage(msg);
    });
    this.socket.on("notificationAdded", (notification: Notification) => {
      handleNotification(notification);
    });
    this.socket.on("notificationRemoved", (notificationId: string) => {
      handleRemoveNotification(notificationId);
    });

    this.socket.on("error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  public sendFriendAction(
    action: FriendActionTypes,
    senderUserId: string,
    receiverUserId: string
  ) {
    this.socket.emit("friendAction", action, senderUserId, receiverUserId);
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
