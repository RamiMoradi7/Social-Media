import { memo } from "react";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../../../context/UserContext";
import { useToggle } from "../../../../hooks/useToggle";
import { useToggleLike } from "../../../../hooks/useToggleLike";
import { Post } from "../../../../models/Post";
import { updatePost } from "../../../../redux/PostsSlice";
import Modal from "../../../common/Modal";
import Favorites from "../../../common/svgs/Favorites";
import Like from "../../../common/svgs/Like";
import Share from "../../../common/svgs/Share";
import AddComment from "../Comment/AddComment";
import CommentCard from "../Comment/Comment";
import EditPost from "./EditPost";
import PostHeader from "../Post/PostHeader";
import PostPhotos from "../Post/PostPhotos";

type PostCardProps = {
  post: Post;
};

export const PostCard = memo(({ post }: PostCardProps) => {
  const { user } = useCurrentUser();
  const { toggleLike } = useToggleLike();
  const { isOpen: isEditOpen, toggle: toggleEdit } = useToggle();

  const {
    comments,
    content,
    photos,
    likesCount,
    _id: postId,
    postedAt,
    likes,
    privacy,
    isLiked,
  } = post;

  const handleToggleLike = async () => {
    await toggleLike(post, user, updatePost, post?._id, "Post");
  };

  return (
    <>
      <div className=" flex flex-row px-2 py-3 mx-3 ">
        <PostHeader
          author={post?.author}
          postId={postId}
          postedAt={postedAt}
          privacy={privacy}
          isOwnPost={post?.author._id === user?._id}
          toggleEdit={toggleEdit}
        />
      </div>

      <div className="border-b border-gray-100"></div>
      <NavLink to={`/post/${postId}`}>
        <div className="text-gray-400 dark:text-dark-txt text-lg mb-6 mx-3 px-2">
          {content}
        </div>
      </NavLink>
      <PostPhotos postId={postId} photos={photos} />
      <div className="flex justify-start mb-4 border-t border-gray-100">
        <div className="flex w-full mt-1 pt-2 pl-5">
          <span className="bg-white transition ease-out duration-300 hover:text-red-500 border w-8 h-8 px-2 pt-2 text-center rounded-full text-gray-400 cursor-pointer mr-2">
            <Favorites />
          </span>
          {likes?.map((like) => (
            <NavLink key={like._id} to={`/user-profile/${like._id}`}>
              <img
                className="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                src={like?.photos.profilePhoto}
                alt=""
              />
            </NavLink>
          ))}
        </div>
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
      </div>
      <div className="flex w-full border-t border-gray-100">
        <div className="mt-3 mx-5 w-full flex justify-end text-xs">
          <div className="flex text-gray-600 dark:text-dark-txt font-normal rounded-md mb-2 mr-4 items-center">
            Comments:
            <div className="ml-1 text-gray-600 dark:text-dark-txt text-ms">
              {comments?.length}
            </div>
          </div>
          <div className="flex text-gray-600 dark:text-dark-txt font-normal rounded-md mb-2 mr-4 items-center">
            Likes:
            <div className="ml-1 text-gray-600 dark:text-dark-txt  text-ms">
              {likesCount}
            </div>
          </div>
        </div>
      </div>
      {comments?.map((comment) => (
        <CommentCard key={comment._id} comment={comment} />
      ))}
      <AddComment postId={post._id} />

      {isEditOpen && (
        <Modal
          title="Editing Post"
          component={<EditPost postId={postId} toggle={toggleEdit} />}
          toggleModal={toggleEdit}
        />
      )}
    </>
  );
});
