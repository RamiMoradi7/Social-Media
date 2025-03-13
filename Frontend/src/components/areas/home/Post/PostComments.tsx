import { useState } from "react";
import { useCurrentUser, usePostSelector } from "../../../../redux/Selectors";
import { commentsService } from "../../../../services/CommentsService";
import Loader from "../../../common/loader/Loader";
import AddComment from "../Comment/AddComment";
import CommentCard from "../Comment/Comment";

type PostCommentsProps = {
  postId: string;
};

export default function PostComments({
  postId,
}: PostCommentsProps): JSX.Element {
  const [loadingComments, setLoadingComments] = useState(false);
  const user = useCurrentUser();
  const {
    commentsCount,
    recordComments: postComments,
    likesCount,
  } = usePostSelector(postId);

  const fetchComments = async () => {
    if (commentsCount === 0) return;
    setLoadingComments(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await commentsService.getCommentsByPost(postId, user?._id);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };
  return (
    <>
      <div className="flex w-full border-t border-gray-100">
        <div className="mt-3 mx-5 w-full flex justify-end text-xs">
          <div
            onClick={fetchComments}
            className="flex cursor-pointer text-gray-600 dark:text-dark-txt font-normal rounded-md mb-2 mr-4 items-center"
          >
            Comments:
            <div className="ml-1 text-gray-600 dark:text-dark-txt text-ms">
              {commentsCount}
            </div>
          </div>
          <div className="flex text-gray-600 dark:text-dark-txt font-normal rounded-md mb-2 mr-4 items-center">
            Likes:
            <div className="ml-1 text-gray-600 dark:text-dark-txt text-ms">
              {likesCount}
            </div>
          </div>
        </div>
      </div>

      {loadingComments ? (
        <Loader />
      ) : (
        postComments &&
        Object.values(postComments)?.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
          />
        ))
      )}

      <AddComment postId={postId} />
    </>
  );
}
