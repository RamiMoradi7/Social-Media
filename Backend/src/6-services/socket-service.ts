import { UploadedFile } from "express-fileupload";
import { Server as httpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { IComment } from "../4-models/comment";
import { IMessage, Message } from "../4-models/message";
import { INotification, Notification } from "../4-models/notification";
import { commentsService } from "./comments-service";
import { messagesService } from "./messages-service";
import { notificationsService } from "./notifications-service";
import { Chat, IChat } from "../4-models/chat";
import { chatsService } from "./chats-service";

class SocketService {
  private socketServer: SocketServer | null = null;

  public handleSocketMessages(httpServer: httpServer) {
    const options = {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    };
    this.socketServer = new SocketServer(httpServer, options);

    this.socketServer.sockets.on("connection", (socket: Socket) => {
      console.log(`Client has been connected ${socket.id}.`);

      socket.on("sendMessage", async (msg: IMessage) => {
        console.log("Client sent message.");
        const newMessage = new Message(msg);
        const image = msg.image;
        const message = await messagesService.sendMessage({
          message: newMessage,
          image,
        });
        this.socketServer.sockets.emit("sendMessage", message);
      });

      socket.on("startChat", async (chat: IChat) => {
        console.log("Client started new chat.");
        const newChat = new Chat(chat);
        const addedChat = await chatsService.startChat(newChat);
        this.socketServer.sockets.emit("startChat", addedChat);
      });

      socket.on("addNotification", async (notification: INotification) => {
        console.log("Client sent notification.");
        const newNotification = new Notification(notification);
        const addedNotification = await notificationsService.createNotification(
          newNotification
        );
        this.socketServer.sockets.emit("notificationAdded", addedNotification);
      });
      socket.on("removeNotification", async (notificationId: string) => {
        console.log("Client removed notification.");
        await notificationsService.deleteNotification(notificationId);
        this.socketServer.emit("notificationRemoved", notificationId);
      });

      socket.on(
        "addComment",
        async (comment: IComment, image: UploadedFile) => {
          console.log(`Client commented on post ${comment.postId}.`);
          const addedComment = await commentsService.addComment({
            comment,
            image,
          });
          this.socketServer.emit("addedComment", addedComment);
        }
      );

      socket.on("disconnect", () => {
        console.log("Client has been disconnected.");
      });
    });
  }

  public emitNotification(notification: INotification) {
    this.socketServer?.sockets.emit("notificationAdded", notification);
  }

  public emitComment(comment: IComment) {
    this.socketServer?.sockets.emit("addedComment", comment);
  }

  public emitChat(chat: IChat) {
    this.socketServer.sockets.emit("startChat", chat);
  }

  public emitNotificationRemoval({
    notificationId,
  }: {
    notificationId: string;
  }) {
    this.socketServer?.sockets.emit("notificationRemoved", notificationId);
  }
}

export const socketService = new SocketService();
