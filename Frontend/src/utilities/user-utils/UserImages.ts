import toast from "react-hot-toast";
import { usersService } from "../../services/UsersService";

type UserImageChangeProps = {
  userId: string;
  imageFile: File;
  imageType: string;
};

export const handleUserImageChange = async ({
  userId,
  imageFile,
  imageType,
}: UserImageChangeProps) => {
  try {
    if (imageFile) {
      await usersService.updateUser({ userId, imageFile, imageType });
    }
  } catch (err: any) {
    toast.error(err);
  }
};
