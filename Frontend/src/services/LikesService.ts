import axios from "axios";
import { appConfig } from "../utilities/AppConfig";

export type LikeProps = {
  targetId: string;
  userId: string;
  targetType: "Post" | "Comment" | "Reply" | "ProfilePhoto" | "CoverPhoto";
};

class LikesService {
  public async toggleLike({
    targetId,
    userId,
    targetType,
  }: LikeProps): Promise<void> {
    let url: string = appConfig.baseUrl + "/";
    switch (targetType) {
      case "Post":
        url = url + "posts/like";
        break;

      case "Comment":
        url = url + "comments/like";
        break;

      case "Reply":
        url = url + "replies/like";
        break;

      case "ProfilePhoto":
        url = url + "user-photos/like/profile";
        break;

      case "CoverPhoto":
        url = url + "user-photos/like/cover";
        break;
    }
    await axios.put<LikeProps>(url, {
      targetId,
      userId,
      targetType,
    });
  }
}
export const likesService = new LikesService();
