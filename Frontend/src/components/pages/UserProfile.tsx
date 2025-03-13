import { useTitle } from "../../hooks/useTitle";
import { useUserProfile } from "../../hooks/useUserProfile";
import ProfileHeader from "../areas/user/header/ProfileHeader";
import ProfileMainSection from "../areas/user/ProfileMainSection";
import Loader from "../common/loader/Loader";

export default function UserProfile(): JSX.Element {
  const { currentUser, profileUser, isOwnProfile, status } = useUserProfile();

  useTitle(profileUser ? `${profileUser.firstName}'s Profile` : "Loading...");
  if (status === "loading" || !profileUser) return <Loader />;
  return (
    <section
      className="mt-28 lg:mt-6 md:mt-4 max-w-[1350px]
         bg-white dark:bg-dark-second dark:text-dark-txt mx-auto flex flex-col border-l border-r "
    >
      <div className="w-full mx-auto">
        <ProfileHeader
          isOwnProfile={isOwnProfile}
          profileUser={profileUser}
          currentUser={currentUser}
        />
        <ProfileMainSection />
      </div>
    </section>
  );
}
