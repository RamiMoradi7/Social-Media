import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useCurrentUser, useProfileUser } from "../redux/Selectors";
import { usersService } from "../services/UsersService";
import { Status } from "./useSearchResults";

export const useUserProfile = () => {
  const { _id: userProfileId } = useParams();
  const currentUser = useCurrentUser();
  const profileUser = useProfileUser();
  const [status, setStatus] = useState<Status>("idle");
  const isOwnProfile = userProfileId === currentUser?._id;

  useEffect(() => {
    if (!currentUser) return;
    if (!userProfileId || profileUser?._id === userProfileId) return;

    setStatus("loading");
    usersService
      .getUserProfile(userProfileId, currentUser?._id)
      .then(() => {
        setStatus("success");
      })
      .catch((err: any) => {
        toast.error(err);
        setStatus("error");
      });
  }, [userProfileId]);

  return {
    currentUser,
    profileUser: isOwnProfile ? currentUser : profileUser,
    status,
    isOwnProfile,
  };
};
