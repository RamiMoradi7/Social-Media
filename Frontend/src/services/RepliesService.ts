import axios from "axios";
import { Reply } from "../models/Reply";
import { appConfig } from "../utilities/AppConfig";
import { store } from "../redux/Store";
import {
  addReply,
  deleteReply,
  initRepliesForComment,
  updateReply,
} from "../redux/PostsSlice";

class RepliesService {
  public async getRepliesByComment(
    commentId: string,
    userId: string
  ): Promise<Reply[]> {
    const response = await axios.get<{ replies: Reply[]; postId: string }>(
      appConfig.repliesUrl + `commentId/${commentId}/userId/${userId}`
    );
    const { replies, postId } = response.data;

    const repliesRecord = replies.reduce((acc, reply) => {
      acc[reply._id] = reply;
      return acc;
    }, {} as Record<string, Reply>);

    store.dispatch(
      initRepliesForComment({ postId, commentId, replies: repliesRecord })
    );
    return replies;
  }

  public async addReply(
    reply: Reply,
    userId: string,
    commentId: string,
    postId: string
  ): Promise<void> {
    const formData = this.convertToFormData(reply, userId, commentId, postId);
    const response = await axios.post<Reply>(
      appConfig.repliesUrl,
      formData,
      appConfig.axiosOptions
    );
    const addedReply = response.data;
    store.dispatch(addReply(addedReply));
  }
  public async updateReply(
    reply: Reply,
    userId: string,
    commentId: string
  ): Promise<void> {
    const formData = this.convertToFormData(reply, userId, commentId);
    const response = await axios.put<Reply>(
      appConfig.repliesUrl,
      formData,
      appConfig.axiosOptions
    );
    const updatedReply = response.data;
    store.dispatch(updateReply(updatedReply));
  }
  public async deleteReply(reply: Reply): Promise<void> {
    await axios.delete<Reply>(appConfig.repliesUrl + reply._id);
    store.dispatch(deleteReply(reply));
  }
  private convertToFormData(
    reply: Reply,
    userId: string,
    commentId: string,
    postId?: string
  ) {
    const formData = new FormData();
    formData.append("author", userId);
    formData.append("text", reply.text);
    formData.append("commentId", commentId);
    formData.append("postId", postId);
    if (reply.image) {
      formData.append("image", reply.image);
    }
    return formData;
  }
}

export const repliesService = new RepliesService();
