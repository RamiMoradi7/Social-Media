import { ChangeEvent, SetStateAction, useState } from "react";
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
    setUser: (value: SetStateAction<User>) => void;
};

export default function ProfileHeader({
    profileUser,
    currentUser,
    setUser,
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
    const isCurrentUser = currentUser?._id === profileUser?._id;

    return (
        <div className="max-w-[1250px] bg-gray-100 mx-auto flex flex-col dark:bg-dark-second dark:text-white">
            <CoverPhoto
                coverPhoto={profileUser?.photos?.coverPhoto}
                isCurrentUser={isCurrentUser}
                onImageChange={handleImageChange}
                toggleModal={toggleModal}
            />
            <div className="w-full mx-auto flex justify-end">
                <div className="text-center">
                    <ProfileInfo
                        currentUser={currentUser}
                        profileUser={profileUser}
                        isCurrentUser={isCurrentUser}
                    />
                    <ProfileButtons
                        currentUser={currentUser}
                        profileUser={profileUser}
                        isCurrentUser={isCurrentUser}
                        setUser={setUser}
                    />
                </div>
                <ProfilePhoto
                    profilePhoto={profileUser?.photos?.profilePhoto}
                    isCurrentUser={isCurrentUser}
                    onImageChange={handleImageChange}
                    toggleModal={toggleModal}
                />
                {
                    <ProfileModal
                        albums={profileUser?.albums}
                        isModalOpen={isOpen}
                        toggleModal={toggleModal}
                        currentUserId={currentUser?._id}
                    />
                }
            </div>
        </div>
    );
}
