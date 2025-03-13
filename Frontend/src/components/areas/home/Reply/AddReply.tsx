import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Reply } from "../../../../models/Reply";
import { repliesService } from "../../../../services/RepliesService";
import StringInput from "../../../common/inputs/StringInput";
import UploadImage from "../../../common/inputs/UploadImage";
import Send from "../../../common/svgs/Send";
import { useCurrentUser } from "../../../../redux/Selectors";

type AddReplyProps = {
    commentId: string;
    postId: string
};

export default function AddReply({ commentId, postId }: AddReplyProps): JSX.Element {
    const methods = useForm<Reply>();
    const { reset } = methods;
    const user = useCurrentUser();
    const { photos, _id } = user
    const addReply = async (reply: Reply) => {
        try {
            await repliesService.addReply(reply, _id, commentId, postId);
            reset();
        } catch (err: any) {
            toast.error(err);
        }
    };
    return (
        <>
            <div className="relative flex items-center self-center w-2/3  p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                <img
                    className="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
                    alt="User avatar"
                    src={photos?.profilePhoto}
                />

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(addReply)}
                        className="dark:bg-dark-second dark:text-dark-txt shadow rounded-lg p-4 w-full relative"
                    >
                        <StringInput
                            registerName="text"
                            name="reply"
                            type="textarea"
                            className="w-full rounded-lg p-2 text-sm bg-gray-100 dark:bg-dark-second border border-transparent appearance-none placeholder-gray-400"
                            placeholder="Add a reply..."
                        />
                        <div className="absolute inset-y-0 right-0 top-0 flex items-center pr-6">
                            <UploadImage
                                registerName="image"
                                required={false}
                                id={commentId}
                            />
                            <button className="p-1 ml-2 focus:outline-none focus:shadow-none hover:text-blue-500">
                                <Send />
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </>
    );
}
