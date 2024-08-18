import axios from "axios";
import { User } from "../models/User";
import { updateUser } from "../redux/AuthSlice";
import { initPosts } from "../redux/PostsSlice";
import { store } from "../redux/Store";
import { appConfig } from "../utilities/AppConfig";
import { chatsService } from "./ChatsService";
import { notificationsService } from "./NotificationsService";

export type UpdateUserProps = {
  userId: string;
  userFields?: Partial<User>;
  imageFile?: File | null;
  imageType?: string;
};

export type UserFilters = {
  name?: string;
  photos?: string;
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
    await chatsService.getChats(userId);
    await notificationsService.getUserNotifications(userId);

    return user;
  }

  public async getUserProfile(
    userId: string,
    currentUserId: string
  ): Promise<User> {
    const response = await axios.get<User>(
      `${appConfig.usersUrl + userId}/${currentUserId}`
    );
    const userProfile = response.data;
    return userProfile;
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
    const response = await axios.put(
      appConfig.usersUrl + userId,
      formData,
      appConfig.axiosOptions
    );
    const user = response.data;
    store.dispatch(updateUser(user));

    if (imageType) {
      store.dispatch(initPosts(user.posts));
    }
  }

  public async sendFriendRequest(
    senderUserId: string,
    receiverUserId: string
  ): Promise<{ senderUser: User; receiverUser: User }> {
    const response = await axios.post(appConfig.usersUrl + "add-friend", {
      senderUserId,
      receiverUserId,
    });

    const { senderUser, receiverUser } = response.data;
    return { senderUser, receiverUser };
  }

  public async acceptFriendRequest(
    senderUserId: string,
    receiverUserId: string
  ): Promise<{ senderUser: User; receiverUser: User }> {
    const response = await axios.post(
      appConfig.baseFriendRequestUrl + "accept",
      {
        senderUserId,
        receiverUserId,
      }
    );
    const { senderUser, receiverUser } = response.data;
    console.log(senderUser, receiverUser);

    return { senderUser, receiverUser };
  }
  public async deleteFriendRequest(
    senderUserId: string,
    receiverUserId: string
  ): Promise<{ senderUser: User; receiverUser: User }> {
    const response = await axios.delete(
      appConfig.baseFriendRequestUrl + "delete",
      {
        data: { senderUserId, receiverUserId },
      }
    );
    const { senderUser, receiverUser } = response.data;
    return { senderUser, receiverUser };
  }

  public async deleteFriendship(
    senderUserId: string,
    receiverUserId: string
  ): Promise<{ senderUser: User; receiverUser: User }> {
    const response = await axios.delete(appConfig.deleteFriendshipUrl, {
      data: { senderUserId, receiverUserId },
    });
    const { senderUser, receiverUser } = response.data;
    return { senderUser, receiverUser };
  }
}
export const usersService = new UsersService();
