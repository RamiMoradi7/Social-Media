import axios from "axios";
import { Chat } from "../models/Chat";
import {
  deleteChat,
  initChats,
  startChat,
  updateChat,
} from "../redux/ChatsSlice";
import { store } from "../redux/Store";
import { appConfig } from "../utilities/AppConfig";

class ChatsService {
  public async getChats(userId: string): Promise<Chat[]> {
    let chats = store.getState().chatState.chats;
    if (chats.length > 0) return chats;
    const response = await axios.get<Chat[]>(appConfig.chatsUrl + userId);
    chats = response.data;
    store.dispatch(initChats(chats));
    return chats;
  }

  public async startChat(participants: string[]): Promise<void> {
    await axios.post<Chat>(appConfig.chatsUrl, {
      participants: participants,
    });
  }

  public handleChat(chat: Chat, userId: string): Promise<void> {
    const existingChat = store
      .getState()
      .chatState.chats.find((c) => c._id === chat._id);
    const participant = chat.participants.find((p) => p._id === userId);
    if (!participant) return;

    if (existingChat) {
      const isDeleted = existingChat.deletedBy.some(
        (deletedBy) => deletedBy.userId === userId
      );
      if (isDeleted) {
        store.dispatch(updateChat(chat));
      }
    } else {
      store.dispatch(startChat(chat));
    }
  }

  public async updateChat(chat: Chat): Promise<void> {
    const response = await axios.put<Chat>(appConfig.chatsUrl + chat._id, chat);
    const updatedChat = response.data;
    console.log(updatedChat);
  }

  public async deleteChat(chatId: string, userId: string): Promise<void> {
    await axios.delete<Chat>(appConfig.chatsUrl + chatId + `/${userId}`);
    store.dispatch(deleteChat({ chatId, userId }));
  }
}

export const chatsService = new ChatsService();
