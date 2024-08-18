import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../../../context/UserContext";
import { Reply } from "../../../../models/Reply";
import { useToggleLike } from "../../../../hooks/useToggleLike";
import { updateReply } from "../../../../redux/PostsSlice";
import DeleteButton from "../../../common/buttons/DeleteButton";
import { repliesService } from "../../../../services/RepliesService";
import { dateFormat } from "../../../../utilities/DateFormat";
import Like from "../../../common/svgs/Like";


type ReplyCardProps = {
  reply: Reply;
};

export default function ReplyCard({ reply }: ReplyCardProps): JSX.Element {
  const { user } = useCurrentUser();
  const { toggleLike } = useToggleLike();
  const {
    author: { _id: authorId, photos: authorPhotos, lastName, firstName },
    _id,
    createdAt,
    text,
    isLiked,
    likes,
    likesCount,
    imageUrl,
  } = reply;

  const handleToggleLike = async () => {
    await toggleLike(reply, user, updateReply, reply._id, "Reply");
  };

  return (
    <div key={reply._id} className="flex items-start mb-2">
      <NavLink to={`/user-profile/${authorId}`}>
        <img
          className="rounded-full h-6 w-6 mr-2"
          src={authorPhotos.profilePhoto}
          alt={`${firstName} ${lastName}`}
        />
      </NavLink>
      <DeleteButton
        fnQuery={() => repliesService.deleteReply(reply)}
        targetId={reply._id}
        key={reply._id}
      />
      <div className="bg-gray-50 rounded-lg px-3 py-1 text-sm">
        <div className="font-semibold">
          {firstName} {lastName}
        </div>
        <div>{text}</div>
        <div className="text-xs text-gray-500">{dateFormat(createdAt)}</div>
      </div>
      <div className="mt-2 bg-white border border-white rounded-full float-right mr-0.5 flex shadow items-center ">
        {imageUrl && (
          <img src={imageUrl} alt="reply-img" width={80} height={80} />
        )}
        <span
          onClick={handleToggleLike}
          className="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
        >
          <Like key={_id} isLiked={isLiked} />
        </span>
        <span className="text-sm ml-1 pr-1.5 text-gray-500">
          {likesCount}
          {likes?.map((like) => (
            <NavLink key={like._id} to={`/user-profile/${authorId}`}>
              <img
                className="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                src={like.photos.profilePhoto}
                alt=""
              />
            </NavLink>
          ))}
        </span>
      </div>
    </div>
  );
}
