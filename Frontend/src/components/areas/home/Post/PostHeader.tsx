import { NavLink } from "react-router-dom";
import { dateFormat } from "../../../../utilities/DateFormat";
import DeleteButton from "../../../common/buttons/DeleteButton";
import { postsService } from "../../../../services/PostsService";
import EditButton from "../../../common/buttons/EditButton";
import { User } from "../../../../models/User";

type PostHeaderProps = {
  postId: string;
  author: User;
  isOwnPost: boolean;
  toggleEdit: () => void;
  privacy: string;
  postedAt: Date;
};

export default function PostHeader({
  postId,
  author,
  isOwnPost,
  toggleEdit,
  privacy,
  postedAt,
}: PostHeaderProps): JSX.Element {
  const { photos, firstName, lastName, _id: authorId } = author;
  return (
    <>
      <div className="w-auto h-auto rounded-full">
        <NavLink to={`/user-profile/${authorId}`}>
          <img
            className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
            alt="User avatar"
            src={photos?.profilePhoto}
          />
        </NavLink>
      </div>

      <div className="flex flex-col mb-2 ml-4 mt-1 w-full ">
        <NavLink to={`/user-profile/${authorId}`}>
          <div className="text-gray-600 dark:text-dark-txt text-sm font-semibold">
            {firstName} {lastName}
          </div>
        </NavLink>

        <div className="flex w-full mt-1">
          <div className="text-blue-700 font-base text-xs mr-1">{privacy}</div>
          <div className="text-gray-400 font-thin text-xs">
            {dateFormat(postedAt)}
          </div>
        </div>

        <div className="flex justify-end space-x-4 m-3 mb-2">
          {isOwnPost && (
            <>
              <DeleteButton
                targetId={postId}
                fnQuery={postsService.deletePost}
              />
              <EditButton onClick={toggleEdit} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
