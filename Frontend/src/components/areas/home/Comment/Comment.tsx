import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../../../context/UserContext";
import { useToggleLike } from "../../../../hooks/useToggleLike";
import DeleteButton from "../../../common/buttons/DeleteButton";
import { commentsService } from "../../../../services/CommentsService";
import { dateFormat } from "../../../../utilities/DateFormat";
import Like from "../../../common/svgs/Like";
import { Comment } from "../../../../models/Comment";
import { updateComment } from "../../../../redux/PostsSlice";
import ReplyCard from "../Reply/Reply";
import AddReply from "../Reply/AddReply";

type CommentCardProps = {
  comment: Comment;
};

export default function CommentCard({
  comment,
}: CommentCardProps): JSX.Element {
  const { user } = useCurrentUser();
  const { toggleLike } = useToggleLike();
  const {
    author: { firstName, lastName, photos, _id: authorId },
    createdAt,
    likes,
    likesCount,
    text,
    imageUrl,
    _id: commentId,
    isLiked,
    replies,
  } = comment;

  const handleToggleLike = async () => {
    await toggleLike(comment, user, updateComment, commentId, "Comment");
  };

  return (
    <>
      <div className="text-black p-4 antialiased flex">
        {authorId === user._id && (
          <DeleteButton
            targetId={commentId}
            fnQuery={() => commentsService.deleteComment(comment)}
          />
        )}
        <NavLink to={`/user-profile/${authorId}`}>
          <img
            className="rounded-full h-8 w-8 mr-2 mt-1 "
            src={photos?.profilePhoto}
          />
        </NavLink>
        <div>
          <div className="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
            <div className="font-semibold text-xs leading-relaxed">
              {firstName} {lastName}
            </div>
            <div className="text-xs leading-snug md:leading-normal">{text}</div>
          </div>
          <div className="text-xs  mt-0.5 text-gray-500">
            {dateFormat(createdAt)}
          </div>
          <div className="mt-2 bg-white border border-white rounded-full float-right mr-0.5 flex shadow items-center ">
            {imageUrl && (
              <img src={imageUrl} alt="comment-img" width={120} height={120} />
            )}
            <span
              onClick={handleToggleLike}
              className="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
            >
              <Like key={comment._id} isLiked={isLiked} />
            </span>
            <span className="text-sm ml-1 pr-1.5 text-gray-500">
              {likesCount}
              {likes?.map((like) => (
                <NavLink
                  key={comment._id}
                  to={`/user-profile/${comment.author._id}`}
                >
                  <img
                    className="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                    src={like?.photos?.profilePhoto}
                    alt=""
                  />
                </NavLink>
              ))}
            </span>
          </div>
        </div>
      </div>
      <div className="m-8 text-gray-400 text-ms">
        Replies: {replies?.length}
      </div>
      {replies?.length > 0 && (
        <div className="mt-3 border-l-2 ml-12 pl-4 border-gray-300">
          {replies.map((reply) => (
            <ReplyCard key={reply._id} reply={reply} />
          ))}
        </div>
      )}
      <AddReply commentId={commentId} />
    </>
  );
}
