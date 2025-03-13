import { NavLink } from "react-router-dom";
import { useToggleLike } from "../../../../hooks/useToggleLike";
import DeleteButton from "../../../common/buttons/DeleteButton";
import { commentsService } from "../../../../services/CommentsService";
import { dateFormat } from "../../../../utilities/DateFormat";
import Like from "../../../common/svgs/Like";
import { Comment } from "../../../../models/Comment";
import { updateComment } from "../../../../redux/PostsSlice";
import ReplyCard from "../Reply/Reply";
import AddReply from "../Reply/AddReply";
import { useState } from "react";
import { repliesService } from "../../../../services/RepliesService";
import Loader from "../../../common/loader/Loader";
import { useCurrentUser } from "../../../../redux/Selectors";

type CommentCardProps = {
    comment: Comment;
};

export default function CommentCard({
    comment,
}: CommentCardProps): JSX.Element {
    const user = useCurrentUser();
    const { toggleLike } = useToggleLike();

    const {
        author: { firstName, lastName, photos, _id: authorId },
        createdAt,
        likes,
        likesCount,
        repliesCount,
        text,
        imageUrl,
        _id: commentId,
        postId,
        isLiked,
        recordReplies: commentReplies,
    } = comment;

    const handleToggleLike = async () => {
        await toggleLike(comment, user, updateComment, commentId, "Comment");
    };

    const [loadingReplies, setLoadingReplies] = useState(false);

    const fetchReplies = async () => {
        if (repliesCount === 0) return;
        setLoadingReplies(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await repliesService.getRepliesByComment(commentId, user._id);
        } catch (err: any) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoadingReplies(false);
        }
    };

    return (
        <>
            <div className="fade-in text-black p-4 antialiased flex items-start relative">
                <div className="flex items-start w-full pr-12">
                    <NavLink to={`/user-profile/${authorId}`}>
                        <img
                            className="rounded-full h-8 w-8 mr-2 mt-1"
                            src={photos?.profilePhoto}
                            alt={`${firstName} ${lastName}`}
                        />
                    </NavLink>
                    <div className="flex flex-col">
                        <div className="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
                            <div className="font-semibold text-xs leading-relaxed">
                                {firstName} {lastName}
                            </div>
                            <div className="text-xs leading-snug md:leading-normal">
                                {text}
                            </div>
                        </div>
                        <div className="text-xs mt-0.5 text-gray-500">
                            {dateFormat(createdAt)}
                        </div>
                        <div className="mt-2 bg-white border border-white rounded-full flex items-center shadow">
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
                                    <NavLink key={like._id} to={`/user-profile/${like._id}`}>
                                        <img
                                            className="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                                            src={like?.photos?.profilePhoto}
                                            alt="like"
                                        />
                                    </NavLink>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
                {authorId === user._id && (
                    <div className="absolute right-0 top-0">
                        <DeleteButton
                            targetId={commentId}
                            targetType="Comment"
                            fnQuery={() => commentsService.deleteComment(comment)}
                        />
                    </div>
                )}
            </div>

            <div onClick={fetchReplies} className="m-8 text-gray-400 text-ms cursor-pointer">
                Replies: {repliesCount}
            </div>

            {loadingReplies ? (
                <Loader />
            ) : (
                <div className="mt-3 border-l-2 ml-12 pl-4 border-gray-300">
                    {commentReplies &&
                        Object.values(commentReplies).map((reply) => (
                            <ReplyCard key={reply._id} reply={reply} />
                        ))}
                </div>
            )}

            <AddReply commentId={commentId} postId={postId} />
        </>
    );
}