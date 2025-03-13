import { Share } from "@mui/icons-material";
import React from "react";
import { useCurrentUser, usePostSelector } from "../../../../redux/Selectors";
import Like from "../../../common/svgs/Like";
import { useToggleLike } from "../../../../hooks/useToggleLike";
import { updatePost } from "../../../../redux/PostsSlice";

export default function PostInteractions({ postId }: { postId: string }) {
  const post = usePostSelector(postId);
  const user = useCurrentUser();
  const { postedAt, isLiked } = post;
  const { toggleLike } = useToggleLike();

  const handleToggleLike = async () => {
    await toggleLike(post, user, updatePost, postId, "Post");
  };

  return (
    <div className="flex justify-end w-full mt-1 pt-2 pr-5">
      <span className="transition ease-out duration-300 hover:bg-blue-50 bg-blue-100 w-8 h-8 px-2 py-2 text-center rounded-full text-blue-400 cursor-pointer mr-2">
        <Share />
      </span>
      <span
        key={`${postId}_${postedAt}`}
        onClick={handleToggleLike}
        className="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
      >
        <Like isLiked={isLiked} />
      </span>
    </div>
  );
}
