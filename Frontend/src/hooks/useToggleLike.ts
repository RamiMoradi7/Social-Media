import { ActionCreatorWithOptionalPayload } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { Comment } from "../models/Comment";
import { Reply } from "../models/Reply";
import { User } from "../models/User";
import { store } from "../redux/Store";
import { LikeProps, likesService } from "../services/LikesService";
import { notify } from "../utilities/Notify";
import { Post } from "../models/Post";

export const useToggleLike = () => {
  const handleLikeClick = async (like: LikeProps) => {
    const { targetId, targetType, userId } = like;
    try {
      await likesService.toggleLike({
        targetId,
        targetType,
        userId,
      });
    } catch (err: any) {
      notify.error(err);
    }
  };

  const toggleLike = useCallback(
    async <T extends Post | Comment | Reply>(
      entity: T,
      user: User,
      updateAction: ActionCreatorWithOptionalPayload<T>,
      targetId: string,
      targetType: "Post" | "Comment" | "Reply"
    ): Promise<void> => {
      try {
        const isLiked = entity.isLiked;
        const likes = entity.likes || [];

        const updatedEntity = {
          ...entity,
          isLiked: !isLiked,
          likesCount: isLiked ? entity.likesCount - 1 : entity.likesCount + 1,
          likes: isLiked
            ? likes.filter((like: User) => like._id !== user._id)
            : [...likes, user],
        };
        store.dispatch(updateAction(updatedEntity));
        await handleLikeClick({ targetId, targetType, userId: user?._id });
      } catch (err: any) {
        notify.error(err);
      }
    },
    []
  );

  return { toggleLike };
};
