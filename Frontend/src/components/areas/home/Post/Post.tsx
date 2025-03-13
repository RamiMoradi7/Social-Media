import React from "react";
import { useToggle } from "../../../../hooks/useToggle";
import { Post } from "../../../../models/Post";
import { useCurrentUser } from "../../../../redux/Selectors";
import PostHeader from "../Post/PostHeader";
import PostPhotos from "../Post/PostPhotos";
import PostComments from "./PostComments";
import PostContent from "./PostContent";
import PostEditModal from "./PostEditModal";
import PostInteractions from "./PostInteractions";
import PostLikes from "./PostLikes";

type PostCardProps = {
  post: Post;
};

export const PostCard = React.memo(({ post }: PostCardProps) => {
  const user = useCurrentUser();
  const { toggle: toggleEdit, isOpen: isEditMode } = useToggle();
  const { content, photos, _id: postId, likes } = post;
  const isOwnPost = post.author._id === user._id;
  if (!post) return;

  console.log("Rendering Post Card.");
  return (
    <div className="max-w-[900px] dark:bg-dark-third mx-auto border border-gray-300 p-4 mb-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
      <div className="flex flex-row px-2 py-3 mx-3 fade-in">
        <PostHeader
          postId={postId}
          isOwnPost={isOwnPost}
          toggleEdit={toggleEdit}
        />
      </div>
      <div className="border-b border-gray-100"></div>
      <PostContent
        content={content}
        postId={postId}
      />
      <PostPhotos
        postId={postId}
        key={postId}
        photos={photos}
      />
      <div className="flex justify-start mb-4 border-t border-gray-100">
        <PostLikes likes={likes} />
        <PostInteractions postId={postId} />
      </div>
      <PostComments postId={postId} />
      <PostEditModal
        postId={postId}
        isEditMode={isEditMode}
        toggleEdit={toggleEdit}
      />
    </div>
  );
});
