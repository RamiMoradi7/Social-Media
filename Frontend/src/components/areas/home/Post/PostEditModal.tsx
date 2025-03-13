import Modal from "../../../common/Modal";
import EditPost from "./EditPost";

function PostEditModal({
  postId,
  isEditMode,
  toggleEdit,
}: {
  postId: string;
  isEditMode: boolean;
  toggleEdit: () => void;
}) {
  return (
    <>
      {isEditMode && (
        <Modal
          title="Editing Post"
          component={
            <EditPost
              postId={postId}
              toggle={toggleEdit}
            />
          }
          toggleModal={toggleEdit}
        />
      )}
    </>
  );
}

export default PostEditModal;
