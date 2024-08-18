import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationTypes } from "../../models/Notification";
import { isChatOpen } from "../../redux/ChatsSlice";
import { store } from "../../redux/Store";
import { useCallback } from "react";

export const useNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = useCallback(
    (type: NotificationTypes, referenceId: string) => {
      let baseUrl: string;
      switch (type) {
        case NotificationTypes.FriendRequest:
        case NotificationTypes.AcceptFriendRequest:
          baseUrl = `/user-profile/${referenceId}`;
          break;
        case NotificationTypes.Like:
        case NotificationTypes.Comment:
        case NotificationTypes.Reply:
          baseUrl = `/post/${referenceId}`;
          break;
        case NotificationTypes.Message:
          const isOpen = store.getState().chatState.isOpen[referenceId];
          dispatch(isChatOpen({ chatId: referenceId, isOpen: !isOpen }));
          break;

        default:
          break;
      }
      if (baseUrl) {
        navigate(baseUrl);
      }
    },
    [navigate, dispatch]
  );
  return { handleNavigation };
};
