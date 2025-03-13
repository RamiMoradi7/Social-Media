import { postsService } from "../../../../services/PostsService";
import DeleteButton from "../../../common/buttons/DeleteButton";
import EditButton from "../../../common/buttons/EditButton";

type PostActionsProps = {
  postId: string;
  toggleEdit: () => void;
};

export default function PostActions({ postId, toggleEdit }: PostActionsProps) {
  return (
    <>
      <DeleteButton
        targetType="Post"
        targetId={postId}
        fnQuery={postsService.deletePost}
      />
      <EditButton onClick={toggleEdit} />
    </>
  );
}
