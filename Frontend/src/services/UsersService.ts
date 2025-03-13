import axios from "axios";
import { Album, User } from "../models/User";
import { updateUser } from "../redux/AuthSlice";
import { addPost } from "../redux/PostsSlice";
import { setProfileUser } from "../redux/ProfileUserSlice";
import { store } from "../redux/Store";
import { appConfig } from "../utilities/AppConfig";
import { MediaItem } from "./../types/UserTypes";
import { chatsService } from "./ChatsService";
import { notificationsService } from "./NotificationsService";
import { postsService } from "./PostsService";

export type UpdateUserProps = {
  userId: string;
  userFields?: Partial<User>;
  imageFile?: File | null;
  imageType?: string;
};

export type UserFilters = {
  name?: string;
  photos?: string;
  userId?: string;
  currentUserId?: string;
  location?: string;
};

class UsersService {
  public async getUsers(filters?: UserFilters): Promise<User[]> {
    const { name, photos, currentUserId, location } = filters;
    const params = new URLSearchParams();

    if (name) {
      params.append("name", name);
    }
    if (photos) {
      params.append("photos", photos);
    }
    if (location) {
      params.append("location", location);
    }
    if (currentUserId) {
      params.append("currentUserId", currentUserId);
    }

    const response = await axios.get<User[]>(
      `${appConfig.usersUrl}?${params.toString()}`
    );
    const users = response.data;
    return users;
  }

  public async getUser(userId: string): Promise<User> {
    const response = await axios.get<User>(`${appConfig.usersUrl + userId}`);
    const user = response.data;
    // await chatsService.getChats(userId);
    await notificationsService.getUserNotifications(userId);

    return user;
  }

  public async getUserAlbums(userId: string): Promise<Album[]> {
    const response = await axios.get<Album[]>(
      `${appConfig.usersUrl}albums/${userId}`
    );
    const albums = response.data;
    return albums;
  }

  public async getUserMediaItem(
    userId: string,
    albumType: string
  ): Promise<MediaItem> {
    const response = await axios.get<MediaItem>(
      `${appConfig.usersUrl}albums/${userId}/${albumType}`
    );
    const userMediaItem = response.data;
    let post =
      store.getState().postsState.userProfilePosts[userMediaItem.postId];

    if (!post) {
      post = await postsService.getPostByUser(userMediaItem.postId, userId);
      store.dispatch(addPost(post));
    }

    return userMediaItem;
  }

  public async getUserProfile(
    userProfileId: string,
    currentUserId: string
  ): Promise<void> {
    console.log("getUserProfile service.");
    const response = await axios.get<User>(
      `${appConfig.usersUrl + userProfileId}/${currentUserId}`
    );
    const userProfile = response.data;
    store.dispatch(setProfileUser(userProfile));
  }

  public async updateUser({
    userId,
    userFields,
    imageFile,
    imageType,
  }: UpdateUserProps): Promise<void> {
    let formData = new FormData();
    if (userFields) {
      formData.append("userFields", JSON.stringify(userFields));
    }

    if (imageType === "profilePicture") {
      formData.append("profilePicture", imageFile);
    }
    if (imageType === "coverPhoto") {
      formData.append("coverPhoto", imageFile);
    }
    const response = await axios.put<User>(
      appConfig.usersUrl + userId,
      formData,
      appConfig.axiosOptions
    );
    const user = response.data;
    store.dispatch(updateUser(user));
  }
}
export const usersService = new UsersService();
