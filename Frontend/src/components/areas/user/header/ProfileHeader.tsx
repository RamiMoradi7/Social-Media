import { ChangeEvent, useState } from "react";
import { User } from "../../../../models/User";
import { handleUserImageChange } from "../../../../utilities/user-utils/UserImages";
import ProfileModal from "../ProfileModal";
import CoverPhoto from "./CoverPhoto";
import ProfileButtons from "./ProfileButtons";
import ProfileInfo from "./ProfileInfo";
import ProfilePhoto from "./ProfilePhoto";

type ProfileHeaderProps = {
  profileUser: User;
  currentUser: User;
  isOwnProfile: boolean;
};

export default function ProfileHeader({
  profileUser,
  currentUser,
  isOwnProfile,
}: ProfileHeaderProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const toggleModal = (type: string | null) => {
    setIsOpen(type);
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => {
    const imageFile = event.target.files[0];
    await handleUserImageChange({
      imageFile,
      imageType,
      userId: profileUser._id,
    });
  };

  return (
    <div className="max-w-[1250px] bg-gray-100 mx-auto flex flex-col dark:bg-dark-second dark:text-white">
      <CoverPhoto
        coverPhoto={profileUser?.photos?.coverPhoto}
        isCurrentUser={isOwnProfile}
        onImageChange={handleImageChange}
        toggleModal={toggleModal}
      />
      <div className="w-full mx-auto flex justify-end">
        <div className="text-center">
          <ProfileInfo
            currentUser={currentUser}
            profileUser={profileUser}
            isCurrentUser={isOwnProfile}
          />
          {
            <ProfileButtons
              currentUser={currentUser}
              profileUser={profileUser}
              isCurrentUser={isOwnProfile}
            />
          }
        </div>
        <ProfilePhoto
          profilePhoto={profileUser?.photos?.profilePhoto}
          isCurrentUser={isOwnProfile}
          onImageChange={handleImageChange}
          toggleModal={toggleModal}
        />
        {
          <ProfileModal
            isModalOpen={isOpen}
            toggleModal={toggleModal}
            profileUserId={profileUser?._id}
          />
        }
      </div>
    </div>
  );
}
