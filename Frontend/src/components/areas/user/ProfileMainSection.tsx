import { useState } from "react";
import { useCurrentUser, useProfileUser } from "../../../redux/Selectors";
import AddPost from "../home/Post/AddPost";
import ProfileFilterMenu, { FilterOption } from "./menu/ProfileFilterMenu";
import ProfilePostList from "./ProfilePostList";
import { UserDetails } from "./UserDetails";
import UserFriends from "./UserFriends";
import UserPhotos from "./UserPhotos";
import { isFriendWith } from "../../../utilities/user-utils/userUtils";

export default function ProfileMainSection(): JSX.Element {
  const profileUser = useProfileUser();
  const currentUser = useCurrentUser();
  const isFriend = isFriendWith(currentUser, profileUser?._id);
  const isOwnProfile = profileUser?._id === currentUser?._id;
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("posts");

  return (
    <div className="mt-20 xl:w-[80%] lg:w-[90%] md:w-[94%] sm:w-[96%] xs:w-[92%] mx-auto flex flex-col gap-6 justify-center items-center relative xl:-top-[6rem] lg:-top-[6rem] md:-top-[4rem] sm:-top-[3rem] xs:-top-[2.2rem]">
      <div className="w-full flex flex-col space-y-6">
        <ProfileFilterMenu
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        <div className="w-full flex flex-col-reverse md:flex-row gap-6">
          <main className="w-full md:w-[70%] flex-1 bg-white dark:bg-dark-third rounded-lg shadow-lg p-6">
            {selectedFilter === "posts" && (
              <>
                {(isOwnProfile || isFriend) && (
                  <AddPost targetUserId={profileUser?._id} />
                )}
                <ProfilePostList />
              </>
            )}
            {selectedFilter === "photos" && <UserPhotos />}
            {selectedFilter === "friends" && <UserFriends />}
            {selectedFilter === "about" && (
              <div className="text-center text-gray-500">About Content</div>
            )}
          </main>

          <UserDetails />
        </div>
      </div>
    </div>
  );
}
