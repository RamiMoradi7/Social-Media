import { ChangeEvent } from "react";
import defaultProfile from "../../../../assets/images/default-profile-pic.jpg";
import ImageInput from "../inputs/ImageInput";

type ProfilePictureProps = {
  profilePhoto: string;
  isCurrentUser: boolean;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => Promise<void>;
  toggleModal: (type: string | null) => void;
};

export default function ProfilePhoto({
  profilePhoto,
  isCurrentUser,
  onImageChange,
  toggleModal,
}: ProfilePictureProps): JSX.Element {
  return (
    <div className="relative">
      <img
        src={profilePhoto || defaultProfile}
        alt="User Profile"
        className=" rounded-full object-cover shadow-xl outline-2 outline-offset-2 outline-gray-800 relative w-32 h-32 md:w-48 md:h-48 lg:w-48 lg:h-48 xl:w-48 xl:h-48 md:bottom-24 lg:bottom-32 xl:bottom-28"
        onClick={() => toggleModal("profilePicture")}
      />
      {isCurrentUser && (
        <ImageInput
          onChange={onImageChange}
          imageType="profilePicture"
          id="upload_profile"
          className=" max-w-20 absolute top-12 left-0 inline-flex cursor-pointer bg-white bg-opacity-50 p-2 rounded-full"
        />
      )}
    </div>
  );
}
