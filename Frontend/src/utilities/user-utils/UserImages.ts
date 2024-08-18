import { usersService } from "../../services/UsersService";
import { notify } from "../Notify";

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
    notify.error(err);
  }
};
