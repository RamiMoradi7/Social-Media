import { UploadedFile } from "express-fileupload";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import { Chat, IChat } from "../4-models/chat";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { IMessage, Message } from "../4-models/message";
import { notificationsService } from "./notifications-service";
import mongoose, { mongo, Types } from "mongoose";
import { NotificationTypes } from "../4-models/notification";
import { socketService } from "./socket-service";
import { chatsService } from "./chats-service";

type MessageProps = {
  message: IMessage;
  image?: UploadedFile;
};
class MessagesService {
  public async getMessage(messageId: string): Promise<IMessage> {
    const message = await Message.findById({ _id: messageId }).populate({
      path: "receiver sender",
      select: "firstName lastName profilePicture coverPhoto isActive",
    });
    if (!message) throw new ResourceNotFoundError(messageId);
    return message;
  }

  public async sendMessage({
    message,
    image,
  }: MessageProps): Promise<IMessage> {
    try {
      const chat = await chatsService.getChat(message.chatId);
      const messageReceiverId = new mongoose.Types.ObjectId(message.receiverId);
      await this.handleDeletedMessages(chat, messageReceiverId);

      const errors = message.validateSync();
      if (errors) {
        throw new ValidationError(errors.message);
      }

      if (image) {
        const imageName = await this.handleImageUpload(image);
        message.imageName = imageName;
      }
      message.createdAt = new Date();

      message = await Message.create(message);
      await Chat.findByIdAndUpdate(
        message.chatId,
        { $push: { messages: message._id }, updatedAt: new Date() },
        { new: true }
      );

      await notificationsService.handleAddNotification({
        userId: new mongoose.Types.ObjectId(message.receiverId),
        type: NotificationTypes.Message,
        referenceId: new mongoose.Types.ObjectId(message.chatId),
        message: "Sent you a message!",
        senderId: new mongoose.Types.ObjectId(message.senderId),
      });

      message = await this.getMessage(message._id.toString());
      return message;
    } catch (error) {
      console.error("Error in sendMessage:", error.message);
      throw error;
    }
  }

  private async handleImageUpload(image: UploadedFile): Promise<string> {
    imageHandlers.configureFileSaver("1-assets", "messages-images");
    const uploadedFile: UploadedFile = {
      mv: async (path: string) => {
        const fs = require("fs").promises;
        await fs.writeFile(path, image);
      },
      encoding: "binary",
      data: image.data,
      md5: image.md5,
      size: image.size,
      truncated: image.truncated,
      tempFilePath: "/path/to/temp/file",
      name: "uploaded-image.jpg",
      mimetype: "image/jpeg",
    };
    return await fileSaver.add(uploadedFile);
  }

  private async handleDeletedMessages(
    chat: IChat,
    receiverId: mongoose.Types.ObjectId
  ): Promise<void> {
    const isDeleted = chat.deleteHistory.find((c) =>
      c.userId.equals(receiverId)
    );
    if (isDeleted) {
      chat.deletedBy = chat.deleteHistory.filter((c) =>
        c.userId.equals(receiverId)
      );
      chat.messages = chat.messages.filter((msg) => {
        return (
          new Date(msg.createdAt).getTime() >=
          new Date(isDeleted.deletedAt).getTime()
        );
      });
      chat.updatedAt = new Date();
      await Chat.findByIdAndUpdate(
        chat._id,
        { deletedBy: [], updatedAt: new Date() },
        { new: true }
      );
      socketService.emitChat(chat);
    }
  }

  public async updateMessage({
    message,
    image,
  }: MessageProps): Promise<IMessage> {
    const errors = message.validateSync();
    if (errors) throw new ValidationError(errors.message);

    if (image) {
      imageHandlers.configureFileSaver("1-assets", "messages-images");
      const oldImageName = await this.getImageName(message._id.toString());
      const newImageName = await fileSaver.update(oldImageName, image);
      message.imageName = newImageName;
    }
    message = await Message.findByIdAndUpdate(message._id, message, {
      new: true,
    });
    await Chat.findByIdAndUpdate(
      message.chatId,
      { $pull: { messages: message._id } },
      { new: true }
    );

    message = await this.getMessage(message._id.toString());
    return message;
  }

  public async deleteMessage(messageId: string): Promise<void> {
    const imageName = await this.getImageName(messageId);
    const messageToDelete = await Message.findByIdAndDelete({ _id: messageId });
    if (!messageToDelete) throw new ResourceNotFoundError(messageId);
    await fileSaver.delete(imageName);
    const chatId = messageToDelete.chatId;
    await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { messages: messageId },
      },
      { new: true }
    );
  }

  private async getImageName(messageId: string): Promise<string> {
    const message = await Message.findById({ _id: messageId }).select(
      "imageName"
    );
    if (!message) throw new ResourceNotFoundError(messageId);
    return message.imageName || "";
  }
}
export const messagesService = new MessagesService();
