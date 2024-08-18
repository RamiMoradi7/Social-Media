import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import soundFile from "../assets/sounds/messenger.mp3";
import { useCurrentUser } from "../context/UserContext";
import { Chat } from "../models/Chat";
import { Comment } from "../models/Comment";
import { Message } from "../models/Message";
import { Notification as INotification } from "../models/Notification";
import {
    addMessage,
    isChatOpen
} from "../redux/ChatsSlice";
import {
    deleteNotification,
    sendNotification,
} from "../redux/NotificationsSlice";
import { addComment } from "../redux/PostsSlice";
import { chatsService } from "../services/ChatsService";
import { socketService } from "../services/SocketService";

export const useSockets = () => {
  const dispatch = useDispatch();

  const {
    user: { _id, notificationsEnabled },
  } = useCurrentUser();

  const handleMessage = useCallback(
    (msg: Message) => {
      dispatch(addMessage(msg));
      dispatch(isChatOpen({ chatId: msg.chatId, isOpen: true }));

      if (msg.receiverId === _id && notificationsEnabled) {
        playNotificationSound();
      }
    },
    [notificationsEnabled, _id]
  );

  const handleChat = useCallback(
    (chat: Chat) => {
      chatsService.handleChat(chat, _id);
    },
    [notificationsEnabled, _id]
  );

  const handleAddComment = useCallback(
    (comment: Comment) => {
      dispatch(addComment(comment));
    },
    [notificationsEnabled, _id]
  );

  const handleNotification = useCallback(
    (notification: INotification) => {
      if (notification.userId._id === _id) {
        dispatch(sendNotification(notification));
      }
    },
    [notificationsEnabled, _id]
  );

  const handleRemoveNotification = useCallback(
    (notificationId: string) => {
      dispatch(deleteNotification(notificationId));
    },
    [notificationsEnabled, _id]
  );

  useEffect(() => {
    socketService.connect(
      handleMessage,
      handleAddComment,
      handleNotification,
      handleRemoveNotification,
      handleChat
    );

    return () => {
      socketService.disconnect();
    };
  }, [
    handleChat,
    handleMessage,
    handleNotification,
    handleRemoveNotification,
    handleAddComment,
  ]);

  return { notificationsEnabled, _id };
};

const playNotificationSound = () => {
  const audio = new Audio(soundFile);
  audio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
};
