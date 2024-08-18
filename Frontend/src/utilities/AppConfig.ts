class AppConfig {
  public readonly socketUrl = "http://localhost:4000/";
  public readonly baseUrl = "http://localhost:4000/api";
  public readonly loginUrl = `${this.baseUrl}/login/`;
  public readonly registerUrl = `${this.baseUrl}/register/`;
  public readonly usersUrl = `${this.baseUrl}/users/`;
  public readonly postsUrl = `${this.baseUrl}/posts/`;
  public readonly chatsUrl = `${this.baseUrl}/chats/`;
  public readonly commentsUrl = `${this.baseUrl}/comments/`;
  public readonly notificationsUrl = `${this.baseUrl}/notifications/`;
  public readonly repliesUrl = `${this.baseUrl}/replies/`;
  public readonly baseFriendRequestUrl = `${this.baseUrl}/friend-requests/`;
  public readonly deleteFriendshipUrl = `${this.baseUrl}/friend-ship/delete/`;

  public extractLikeUrl(type: string) {
    return `${this.baseUrl}/${type}/like/`;
  }

  public readonly axiosOptions = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
}

export const appConfig = new AppConfig();
