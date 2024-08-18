import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { Chat, IChat } from "../4-models/chat";
import mongoose, { PopulateOptions, Types } from "mongoose";
import { socketService } from "./socket-service";

class ChatsService {
  private populateFields: PopulateOptions[] = [
    {
      path: "participants",
      select: "firstName lastName isActive profilePicture coverPhoto",
    },
    {
      path: "messages",
      populate: {
        path: "receiver sender",
        select: "firstName lastName profilePicture coverPhoto isActive",
      },
    },
  ];
  public async getChats(userId: string): Promise<IChat[]> {
    const chats = await Chat.find({ participants: userId })
      .populate(this.populateFields)
      .exec();

    if (!chats) throw new Error(`${userId} has no chats.`);

    const userObj = new mongoose.Types.ObjectId(userId);

    const filteredChats = chats.map((chat) => {
      const userDeletedInfo = chat.deleteHistory.find((user) =>
        user.userId.equals(userObj)
      );
      if (userDeletedInfo) {
        chat.messages = chat.messages.filter((msg) => {
          return (
            new Date(msg.createdAt).getTime() >=
            new Date(userDeletedInfo.deletedAt).getTime()
          );
        });
      }
      return chat;
    });
    return filteredChats;
  }

  public async getChat(chatId: string): Promise<IChat> {
    const chat = await Chat.findById({
      _id: chatId,
    }).populate(this.populateFields);
    if (!Chat) throw new ResourceNotFoundError(chatId);
    return chat;
  }

  public async startChat(chat: IChat): Promise<IChat> {
    const sortedParticipants = chat.participants.sort();
    const existingChat = await Chat.findOne({
      participants: {
        $size: sortedParticipants.length,
        $all: sortedParticipants,
      },
    })
      .populate(this.populateFields)
      .exec();
    if (existingChat) {
      existingChat.messages = existingChat.messages.filter((msg) => {
        return existingChat.deletedBy.some(
          (deletedBy) =>
            msg.createdAt.getTime() >= deletedBy.deletedAt.getTime()
        );
      });
      existingChat.deletedBy = [];

      await Chat.findByIdAndUpdate(
        existingChat._id,
        { deletedBy: [] },
        { new: true }
      );
      socketService.emitChat(existingChat);
      return chat;
    }
    const errors = chat.validateSync();
    if (errors) throw new ValidationError(errors.message);
    chat.createdAt = new Date();
    const addedChat = await Chat.create(chat);
    chat = await this.getChat(addedChat._id.toString());
    socketService.emitChat(chat);
    return chat;
  }

  public async updateChat(chat: IChat): Promise<IChat> {
    const errors = chat.validateSync();
    if (errors) throw new ValidationError(errors.message);
    chat.updatedAt = new Date();
    const updatedChat = await Chat.findByIdAndUpdate(chat._id, chat, {
      new: true,
    });
    if (!updatedChat) throw new ResourceNotFoundError(chat._id.toString());

    chat = await this.getChat(chat._id.toString());

    return chat;
  }

  public async deleteChat(
    chatId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new ResourceNotFoundError(chatId);
    const deletionEntry = { userId, deletedAt: new Date() };
    const existingIndex = chat.deletedBy.findIndex((entry) =>
      entry.userId.equals(userId)
    );
    if (existingIndex !== -1) {
      chat.deletedBy[existingIndex] = deletionEntry;
    } else {
      chat.deletedBy.push(deletionEntry);
    }

    const historyIndex = chat.deleteHistory.findIndex((entry) =>
      entry.userId.equals(userId)
    );
    if (historyIndex !== -1) {
      chat.deleteHistory[historyIndex] = deletionEntry;
    } else {
      chat.deleteHistory.push(deletionEntry);
    }
    await chat.save();
  }
}

export const chatsService = new ChatsService();
