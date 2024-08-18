import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { Credentials } from "../models/Credentials";
import { User } from "../models/User";
import { login, logout, register, updateUser } from "../redux/AuthSlice";
import { resetPosts } from "../redux/PostsSlice";
import { store } from "../redux/Store";
import { appConfig } from "../utilities/AppConfig";
import { usersService } from "./UsersService";

class AuthService {
  public constructor() {
    this.initAuthorization();
  }

  private async initAuthorization() {
    const token = sessionStorage.getItem("token");
    if (token) {
      const loggedInUser = jwtDecode<{ user: User }>(token).user;
      store.dispatch(login(loggedInUser));
      const user = await usersService.getUser(loggedInUser._id);
      store.dispatch(updateUser(user));
    }
  }

  public async register(user: User): Promise<void> {
    const response = await axios.post<string>(appConfig.registerUrl, user);
    const token = response.data;
    const registeredUser = jwtDecode<{ user: User }>(token).user;
    store.dispatch(register(registeredUser));
    user = await usersService.getUser(registeredUser._id);
    store.dispatch(updateUser(user));
    sessionStorage.setItem("token", token);
  }
  public async login(credentials: Credentials): Promise<void> {
    const response = await axios.post<string>(appConfig.loginUrl, credentials);
    const token = response.data;
    const loggedInUser = jwtDecode<{ user: User }>(token).user;
    store.dispatch(login(loggedInUser));
    const user = await usersService.getUser(loggedInUser._id);
    store.dispatch(updateUser(user));
    sessionStorage.setItem("token", token);
  }
  public async logOut(): Promise<void> {
    const user = store.getState().user;
    await usersService.updateUser({
      userId: user._id,
      userFields: {
        isActive: false,
      },
    });
    store.dispatch(logout());
    sessionStorage.removeItem("token");
    store.dispatch(resetPosts());
  }
}
export const authService = new AuthService();
