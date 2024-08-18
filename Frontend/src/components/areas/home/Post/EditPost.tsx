import { useEffect, useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useCurrentUser } from "../../../../context/UserContext";
import { Post } from "../../../../models/Post";
import { postsService } from "../../../../services/PostsService";
import { notify } from "../../../../utilities/Notify";
import SelectInput from "../../../common/inputs/SelectInput";
import StringInput from "../../../common/inputs/StringInput";
import DragNDrop from "../../../common/inputs/DragNDrop";
import Send from "../../../common/svgs/Send";

type EditPostProps = {
  postId: string;
  toggle: () => void;
};

export default function EditPost({
  postId,
  toggle,
}: EditPostProps): JSX.Element {
  const methods = useForm();
  const { user } = useCurrentUser();
  const [post, setPost] = useState<Post | null>(null);
  const { setValue } = methods;

  useEffect(() => {
    postsService
      .getPost(postId)
      .then((post) => {
        if (post) {
          setPost(post);
          Object.entries(post).forEach(([key, value]) => {
            setValue(key, value);
          });
        }
      })
      .catch((err: any) => notify.error(err));
  }, [postId]);

  const editPost = async (post: Post) => {
    try {
      await postsService.updatePost(post, user?._id);
      toggle();
    } catch (err: any) {
      notify.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(editPost as SubmitHandler<FieldValues>)}
        className="bg-white shadow rounded-lg mb-6 p-4"
      >
        <span>
          <SelectInput
            defaultOption="Privacy"
            options={["Public", "Private", "Friends"]}
            registerName="privacy"
            className="flex items-center justify-end transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 h-7 px-2 rounded-full text-blue-400 cursor-pointer ml-auto"
          />
        </span>
        <StringInput
          registerName="content"
          type="textarea"
          name="content"
          placeholder={`What are you thinking about,${user?.firstName}?`}
          className="w-full rounded-lg p-2 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
        />

        <div className="p-2 flex">
          <div className="w-1/3 flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-red-500">
            <i className="bx bxs-video-plus"></i>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-dark-txt">
              Live video
            </span>
          </div>
          <div className="w-1/3 flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-green-500">
            <i className="bx bx-images"></i>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-dark-txt">
              Photo
            </span>
          </div>
          <div className="w-1/3 flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xl sm:text-3xl py-2 rounded-lg cursor-pointer text-yellow-500">
            <i className="bx bx-smile"></i>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-dark-txt">
              Live video
            </span>
          </div>
        </div>
        <footer className="flex justify-between  mt-2">
          <div className="flex justify-center w-full">
            <DragNDrop
              required={false}
              registerName="images"
              existingImageUrls={post?.photos}
            />
          </div>
        </footer>
        <div className="flex justify-end">
          <button className="flex py-2 px-4 justify-start rounded-lg text-sm bg-blue-600 text-white shadow-lg">
            Send
            <Send />
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
