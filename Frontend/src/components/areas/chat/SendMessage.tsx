import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Message } from "../../../models/Message";
import { socketService } from "../../../services/SocketService";
import { notify } from "../../../utilities/Notify";
import UploadImage from "../../common/inputs/UploadImage";

type sendMessageProps = {
  chatId: string;
  senderUserId: string;
  receiverUserId: string;
};

export default function SendMessage({
  chatId,
  receiverUserId,
  senderUserId,
}: sendMessageProps): JSX.Element {
  const methods = useForm();
  const { register, handleSubmit, reset } = methods;

  const sendMessage = async (message: Message) => {
    try {
      socketService.sendMessage({
        ...message,
        senderId: senderUserId,
        receiverId: receiverUserId,
        chatId: chatId,
      });
      reset();
    } catch (err: any) {
      notify.error(err);
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        className="flex items-center dark:bg-dark-second dark:text-dark-txt"
        onSubmit={handleSubmit(sendMessage as SubmitHandler<FieldValues>)}
      >
        <div className="relative flex-1 ">
          <input
            className="w-full rounded-lg h-10 px-3 py-2 text-sm bg-gray-100 dark:bg-dark-second border border-transparent appearance-none placeholder-gray-400 pr-14"
            type="text"
            placeholder="Type your message..."
            {...register("content")}
            required
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
            <UploadImage id={chatId} required={false} registerName="image" />
          </div>
        </div>
        <button className="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
          Send
        </button>
      </form>
    </FormProvider>
  );
}
