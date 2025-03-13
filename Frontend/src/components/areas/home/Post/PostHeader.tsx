import { usePostSelector } from "../../../../redux/Selectors";
import ArrowRight from "../../../common/svgs/ArrowRight";
import PostActions from "./PostActions";
import PostMeta from "./PostMeta";
import UserProfileLink from "./UserProfileLink";

type PostHeaderProps = {
  postId: string;
  isOwnPost: boolean;
  toggleEdit: () => void;
};

export default function PostHeader({
  postId,
  isOwnPost,
  toggleEdit,
}: PostHeaderProps): JSX.Element {
  const { author, privacy, postedAt, targetUser } = usePostSelector(postId);
  const { photos, firstName, lastName, _id: authorId } = author;

  return (
    <div className="w-full h-auto rounded-full">
      <PostMeta
        privacy={privacy}
        postedAt={postedAt}
      />
      <div className="flex justify-end gap-3">
        {isOwnPost && (
          <PostActions
            postId={postId}
            toggleEdit={toggleEdit}
          />
        )}
      </div>
      <div className="flex gap-2 p-4 items-center">
        <UserProfileLink
          userId={authorId}
          profilePhotoUrl={photos?.profilePhoto}
          firstName={firstName}
          lastName={lastName}
        />
        {targetUser && (
          <>
            <ArrowRight />
            <UserProfileLink
              userId={targetUser._id}
              profilePhotoUrl={targetUser.photos?.profilePhoto}
              firstName={targetUser.firstName}
              lastName={targetUser.lastName}
            />
          </>
        )}
      </div>
    </div>
  );
}
