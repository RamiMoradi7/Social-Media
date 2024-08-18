import React from "react";
import Like from "../../../common/svgs/Like";
import CommentSvg from "../../../common/svgs/Comment";
import AddSvg from "../../../common/svgs/Add";
import MessageSvg from "../../../common/svgs/MessageSvg";
import ReplySvg from "../../../common/svgs/ReplySvg";


type NotificationIconProps = {
  type: string;
};

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
  switch (type) {
    case "like":
      return <Like color="text-white" size="w-4 h-4" />;
    case "comment":
      return <CommentSvg />;
    case "friendRequest":
    case "acceptFriendRequest":
      return <AddSvg />;
    case "message":
      return <MessageSvg />;
    case "reply":
      return <ReplySvg />;
    default:
      return null;
  }
};

export default NotificationIcon;
