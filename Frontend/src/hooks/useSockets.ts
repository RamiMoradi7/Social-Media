import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import soundFile from "../assets/sounds/messenger.mp3";
import { Chat } from "../models/Chat";
import { Comment } from "../models/Comment";
import { Message } from "../models/Message";
import { Notification as INotification } from "../models/Notification";
import { updateUserRequests } from "../redux/AuthSlice";
import { addMessage, isChatOpen } from "../redux/ChatsSlice";
import {
  deleteNotification,
  sendNotification,
} from "../redux/NotificationsSlice";
import { addComment } from "../redux/PostsSlice";
import { updateProfileUserRequests } from "../redux/ProfileUserSlice";
import { useCurrentUser } from "../redux/Selectors";
import { chatsService } from "../services/ChatsService";
import { socketService } from "../services/SocketService";
import { FriendActionTypes, FriendshipData } from "../types/UserTypes";

export const useSockets = () => {
  const user = useCurrentUser();
  const { _id, notificationsEnabled } = user;
  const dispatch = useDispatch();

  const handleMessage = useCallback(
    (msg: Message) => {
      dispatch(addMessage(msg));
      dispatch(isChatOpen({ chatId: msg.chatId, isOpen: true }));
      if (msg.receiverId === _id) {
        playNotificationSound();
      }
    },
    [_id, dispatch, notificationsEnabled]
  );

  const handleChat = useCallback(
    (chat: Chat) => {
      chatsService.handleChat(chat, _id);
    },
    [_id]
  );

  const handleAddComment = useCallback(
    (comment: Comment) => {
      dispatch(addComment(comment));
    },
    [dispatch]
  );

  const handleNotification = useCallback(
    (notification: INotification) => {
      if (notification.userId._id === _id) {
        dispatch(sendNotification(notification));
      }
    },
    [_id, dispatch]
  );

  const handleRemoveNotification = useCallback(
    (notificationId: string) => {
      dispatch(deleteNotification(notificationId));
    },
    [dispatch]
  );

  const handleFriendRequestAction = (
    action: FriendActionTypes,
    friendshipData: FriendshipData
  ) => {
    const { receiverUser, senderUser, status } = friendshipData;
    if (status !== "success") return;
    const isReceiver = _id && _id === receiverUser?._id;
    const userToUpdate = isReceiver ? receiverUser : senderUser;
    const profileUser = isReceiver ? senderUser : receiverUser;

    switch (action) {
      case "friendRequest":
        console.log(profileUser.isFriendRequestSent);
        dispatch(updateUserRequests(userToUpdate));
        dispatch(updateProfileUserRequests(profileUser));
        break;
      case "acceptRequest":
        dispatch(updateUserRequests(userToUpdate));
        dispatch(updateProfileUserRequests(profileUser));

        break;
      case "ignoreRequest":
        dispatch(updateUserRequests(receiverUser));
        dispatch(updateProfileUserRequests(senderUser));
        break;
      case "deleteFriendship":
        dispatch(updateUserRequests(senderUser));
        dispatch(updateProfileUserRequests(receiverUser));
        break;
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio(soundFile);
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });
  };

  useEffect(() => {
    socketService.connect(
      handleMessage,
      handleAddComment,
      handleNotification,
      handleRemoveNotification,
      handleChat,
      handleFriendRequestAction
    );
    return () => {
      socketService.disconnect();
    };
  }, []);
};
