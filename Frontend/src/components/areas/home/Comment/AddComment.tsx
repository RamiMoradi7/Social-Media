import { FormProvider, useForm } from "react-hook-form";
import { useCurrentUser } from "../../../../context/UserContext";
import { commentsService } from "../../../../services/CommentsService";
import { notify } from "../../../../utilities/Notify";
import StringInput from "../../../common/inputs/StringInput";
import UploadImage from "../../../common/inputs/UploadImage";
import Send from "../../../common/svgs/Send";
import { Comment } from "../../../../models/Comment";

type AddCommentProps = {
  postId: string;
};

export default function AddComment({ postId }: AddCommentProps): JSX.Element {
  const methods = useForm<Comment>();
  const { reset } = methods;
  const { user } = useCurrentUser();
  const { photos, _id } = user;

  const addComment = async (comment: Comment) => {
    try {
      await commentsService.addComment(comment, postId, _id);
      reset();
    } catch (err: any) {
      console.error(err);
      notify.error(err.message || "Failed to add comment.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      methods.handleSubmit(addComment)();
    }
  };

  return (
    <div className="relative flex items-center self-center w-full p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
      <img
        className="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
        alt="User avatar"
        src={photos?.profilePhoto}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(addComment)}
          onKeyDown={handleKeyDown}
          className="shadow bg-white dark:bg-dark-second dark:text-dark-txt mt-4 rounded-lg w-full"
        >
          <StringInput
            registerName="text"
            name="comment"
            type="textarea"
            className="w-full rounded-lg p-2 text-sm bg-gray-100 dark:bg-dark-second border border-transparent appearance-none placeholder-gray-400"
            placeholder="Post a comment..."
          />
          <div className="absolute inset-y-0 right-0 top-0 flex items-center pr-6">
            <UploadImage id={postId} registerName="image" required={false} />
            <button
              className="p-1 ml-2 focus:outline-none focus:shadow-none hover:text-blue-500"
              type="submit"
            >
              <Send />
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
