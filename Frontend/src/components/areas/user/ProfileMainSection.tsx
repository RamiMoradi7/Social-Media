import { useState } from "react";
import ProfileFilterMenu, { FilterOption } from "./menu/ProfileFilterMenu";
import ProfilePostList from "./ProfilePostList";
import UserPhotos from "./UserPhotos";
import UserFriends from "./UserFriends";
import SidebarSection from "./SidebarSection";
import { User } from "../../../models/User";

type ProfileMainSectionProps = {
    user: User
    setUser: (user: User) => void
    isOwnProfile: boolean

}


export default function ProfileMainSection({ user, setUser, isOwnProfile }: ProfileMainSectionProps): JSX.Element {
    const [selectedFilter, setSelectedFilter] = useState<FilterOption>("posts");


    return (
        <div className="mt-20 xl:w-[80%] lg:w-[90%] md:w-[94%] sm:w-[96%] xs:w-[92%] mx-auto flex flex-col gap-4 justify-center items-center relative xl:-top-[6rem] lg:-top-[6rem] md:-top-[4rem] sm:-top-[3rem] xs:-top-[2.2rem]">
            <div className="w-full flex flex-col">
                <ProfileFilterMenu
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />
                <div className="w-full flex">
                    <main className="w-full m-4 dark:bg-dark-third">
                        {selectedFilter === "posts" && <ProfilePostList />}
                        {selectedFilter === "photos" && (
                            <UserPhotos currentUser={user} />
                        )}
                        {selectedFilter === "friends" && <UserFriends user={user} setUser={setUser} isOwnProfile={isOwnProfile} />}
                        {selectedFilter === "about" && (
                            <div className="text-center text-gray-500">About Content</div>
                        )}
                    </main>
                    <SidebarSection
                        displayCurrentUser={user}
                        isOwnProfile={isOwnProfile}
                    />
                </div>
            </div>
        </div>
    )
}