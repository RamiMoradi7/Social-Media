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
    <div className="relative flex justify-center items-center">
      <img
        src={profilePhoto || defaultProfile}
        alt="User Profile"
        className="rounded-full object-cover shadow-xl outline-2 outline-offset-2 outline-gray-800 w-32 h-32 md:w-48 md:h-48 lg:w-48 lg:h-48 xl:w-48 xl:h-48"
        onClick={() => toggleModal("profilePicture")}
      />
      
      {isCurrentUser && (
        <ImageInput
          onChange={onImageChange}
          imageType="profilePicture"
          id="upload_profile"
          className="absolute bottom-0 left-0 mb-2 ml-2 bg-white bg-opacity-60 p-2 rounded-full cursor-pointer"
        />
      )}
    </div>
  );
}
