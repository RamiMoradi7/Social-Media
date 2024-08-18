import { useTitle } from "../../hooks/useTitle";
import { useUserProfile } from "../../hooks/useUserProfile";
import { isCurrentUser } from "../../utilities/user-utils/userUtils";
import ProfileHeader from "../areas/user/header/ProfileHeader";
import ProfileMainSection from "../areas/user/ProfileMainSection";
import Loader from "../common/loader/Loader";

export default function UserProfile(): JSX.Element {
    useTitle("Profile");
    const { currentUser, profileUser, setUser, isLoading } = useUserProfile();
    const isOwnProfile = isCurrentUser(profileUser?._id, currentUser?._id);
    const displayCurrentUser = isOwnProfile ? currentUser : profileUser;

    return (
        <section className="mt-28 lg:mt-6 md:mt-4 max-w-[1350px] bg-white dark:bg-dark-second dark:text-dark-txt mx-auto flex flex-col border-l border-r ">
            <div className="w-full mx-auto">
                {isLoading && <Loader />}

                <ProfileHeader
                    profileUser={displayCurrentUser}
                    currentUser={currentUser}
                    setUser={setUser}
                />
                <ProfileMainSection user={displayCurrentUser} setUser={setUser} isOwnProfile={isOwnProfile} />
            </div>
        </section>
    );
}
