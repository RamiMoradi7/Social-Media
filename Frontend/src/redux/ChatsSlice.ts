import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export interface ChatsState {
  chats: Chat[];
  isOpen: { [chatId: string]: boolean };
}

const initialState: ChatsState = {
  chats: [],
  isOpen: {},
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    initChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    startChat(state, action: PayloadAction<Chat>) {
      state.chats.push(action.payload);
    },
    isChatOpen(
      state,
      action: PayloadAction<{ chatId: string; isOpen?: boolean }>
    ) {
      const { chatId, isOpen } = action.payload;

      Object.keys(state.isOpen).forEach((id) => {
        if (id !== chatId) {
          state.isOpen[id] = false;
        }
      });

      state.isOpen[chatId] =
        isOpen === undefined ? !state.isOpen[chatId] : isOpen;
    },
    updateChat(state, action: PayloadAction<Chat>) {
      const updatedChat = action.payload;
      state.chats = state.chats.map((chat) =>
        chat._id === updatedChat._id ? updatedChat : chat
      );
    },
    deleteChat(
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) {
      const { chatId, userId } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId);

      if (chatIndex !== -1) {
        state.isOpen[chatId] = false;
        state.chats[chatIndex].deletedBy.push({ userId });
        state.chats[chatIndex].messages = [];
      }
    },
    addMessage(state, action: PayloadAction<Message>) {
      const _id = action.payload.chatId;
      const chatIndex = state.chats.findIndex((chat) => chat._id === _id);
      if (chatIndex !== -1) {
        if (state.chats[chatIndex].deletedBy) {
          state.chats[chatIndex].deletedBy = [];
        }

        state.chats[chatIndex].updatedAt = new Date().toISOString();
        state.chats[chatIndex].messages.push(action.payload);
      }
    },
    updateMessage(state, action: PayloadAction<Message>) {
      const { _id } = action.payload.chat;
      const chatIndex = state.chats.findIndex((chat) => chat._id === _id);
      if (chatIndex !== -1) {
        const msgIndex = state.chats[chatIndex].messages.findIndex(
          (msg) => msg._id === action.payload._id
        );
        if (msgIndex !== -1) {
          state.chats[chatIndex].messages[msgIndex] = action.payload;
        }
      }
    },
  },
});

export const {
  initChats,
  startChat,
  isChatOpen,
  updateChat,
  deleteChat,
  addMessage,
  updateMessage,
} = chatsSlice.actions;

export const chatReducers = chatsSlice.reducer;
