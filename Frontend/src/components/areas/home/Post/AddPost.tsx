import { Send } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";
import { useCurrentUser } from "../../../../context/UserContext";
import { useToggle } from "../../../../hooks/useToggle";
import { Post } from "../../../../models/Post";
import { postsService } from "../../../../services/PostsService";
import { notify } from "../../../../utilities/Notify";
import DragNDrop from "../../../common/inputs/DragNDrop";
import SelectInput from "../../../common/inputs/SelectInput";
import StringInput from "../../../common/inputs/StringInput";

export default function AddPost(): JSX.Element {
  const methods = useForm<Post>({ defaultValues: { privacy: "Public" } });
  const { reset } = methods;
  const { user } = useCurrentUser();
  const { isOpen, toggle } = useToggle();
  const privacyOptions = ["Public", "Private", "Friends"];

  const addPost = async (post: Post) => {
    try {
      const postToAdd = {
        ...post,
        privacy: post.privacy || "Public",
      };
      await postsService.addPost(postToAdd, user._id);
      reset();
      if (isOpen) toggle();
    } catch (err: any) {
      notify.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(addPost)}
        className="bg-white dark:bg-dark-second shadow-lg rounded-lg overflow-hidden mt-4 mb-4"
      >
        <header className="bg-blue-100 dark:bg-dark-third p-2 flex items-center space-x-4 border-b border-gray-200 dark:border-gray-600">
          <SelectInput
            defaultOption="Privacy"
            options={privacyOptions}
            registerName="privacy"
            className="bg-blue-200 dark:bg-dark-third text-blue-600 dark:text-dark-txt rounded-full cursor-pointer px-4 py-1 text-sm font-medium hover:bg-blue-300 dark:hover:bg-dark-third transition duration-300"
          />
        </header>

        <main className="p-12">
          <StringInput
            registerName="content"
            type="textarea"
            name="content"
            placeholder={`What’s on your mind, ${user?.firstName}?`}
            className="w-full rounded-lg p-3 text-sm bg-gray-100 dark:bg-dark-second border border-gray-300 dark:text-dark-txt placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-200"
          />

          <div className="flex justify-center items-center mt-4">
            <button
              type="button"
              onClick={toggle}
              className="flex items-center space-x-4 bg-dark-third dark:bg-dark-fourth p-2 rounded-lg cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-dark-third transition-all ease-out duration-300"
            >
              <i className="bx bx-images text-xl sm:text-2xl"></i>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-dark-txt">
                Attach Media
              </span>
              <i className="bx bxs-video-plus text-xl sm:text-2xl"></i>
            </button>
          </div>

          {isOpen && (
            <footer className="mt-4">
              <DragNDrop required={true} registerName="images" />
            </footer>
          )}
        </main>

        <div className="bg-blue-50 dark:bg-dark-third p-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
          <button
            type="submit"
            className="flex items-center py-2 px-4 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            <span className="text-sm font-semibold">Post</span>
            <Send />
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
