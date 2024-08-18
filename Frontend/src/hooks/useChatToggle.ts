import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/AppState";
import { isChatOpen } from "../redux/ChatsSlice";
import { useCallback } from "react";

export const useChatToggle = (chatId: string) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (appState: AppState) => appState.chatState.isOpen[chatId]
  );

  const toggleChat = useCallback(
    () => {
      dispatch(isChatOpen({ chatId, isOpen: !isOpen }));
    },
    [chatId, dispatch, isOpen]
  );

  return { isOpen, toggleChat };
};
