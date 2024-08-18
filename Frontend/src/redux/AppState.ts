import { User } from "../models/User";
import { ChatsState } from "./ChatsSlice";
import { NotificationsState } from "./NotificationsSlice";
import { PostsState } from "./PostsSlice";

export type AppState = {
  user: User;
  postsState: PostsState;
  chatState: ChatsState;
  notificationsState: NotificationsState;
};
