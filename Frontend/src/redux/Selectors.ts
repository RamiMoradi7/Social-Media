import { useSelector } from "react-redux";
import { User } from "../models/User";
import { AppState } from "./AppState";
import { getPostsState } from "./PostsSlice";

// Posts selectors
export const usePostSelector = (postId: string) => {
  return useSelector((state: AppState) => {
    const currentState = getPostsState(state.postsState);
    return currentState[postId];
  });
};

export const usePostsSelector = () => {
  return useSelector((state: AppState) => {
    const currentState = getPostsState(state.postsState);
    return currentState;
  });
};

export const useStateStatus = () => {
  return useSelector((state: AppState) => {
    return state.postsState.isLoading;
  });
};

// currentUser Selector
export const useCurrentUser = (): User | null => {
  return useSelector((state: AppState) => state?.user || null);
};

// profileUser Selector
export const useProfileUser = (): User => {
  return useSelector((state: AppState) => state.profileUser);
};
