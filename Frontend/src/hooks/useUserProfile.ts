import { useParams } from "react-router-dom";
import { useCurrentUser } from "../context/UserContext";
import { useFetch } from "./useFetch";
import { User } from "../models/User";
import { usersService } from "../services/UsersService";

export const useUserProfile = () => {
  const { _id: userProfileId } = useParams();
  const { user: currentUser } = useCurrentUser();

  const {
    data: profileUser,
    isLoading,
    setData: setUser,
  } = useFetch<User>(
    () => usersService.getUserProfile(userProfileId, currentUser?._id),
    userProfileId
  );

  return {
    currentUser,
    profileUser,
    setUser,
    isLoading,
  };
};
