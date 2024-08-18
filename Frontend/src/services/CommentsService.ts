import axios from "axios";
import { Comment } from "../models/Comment";
import { addComment, deleteComment } from "../redux/PostsSlice";
import { store } from "../redux/Store";
import { appConfig } from "../utilities/AppConfig";

class CommentsService {
  public async addComment(
    comment: Comment,
    postId: string,
    userId: string
  ): Promise<void> {
    const commentData = this.convertToFormData(comment, postId, userId);
    const response = await axios.post<Comment>(
      appConfig.commentsUrl,
      commentData,
      appConfig.axiosOptions
    );
    const addedComment = response.data;
    console.log(addedComment);
  }

  public async updateComment(
    comment: Comment,
    postId: string,
    userId: string
  ): Promise<void> {
    const commentData = this.convertToFormData(comment, postId, userId);
    const response = await axios.put<Comment>(
      appConfig.commentsUrl,
      commentData,
      appConfig.axiosOptions
    );
    const updatedComment = response.data;
    store.dispatch(addComment(updatedComment));
  }

  public async deleteComment(comment: Comment): Promise<void> {
    await axios.delete<Comment>(appConfig.commentsUrl + comment._id);
    store.dispatch(deleteComment(comment));
  }

  private convertToFormData(comment: Comment, postId: string, userId: string) {
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("author", userId);
    formData.append("text", comment.text);
    if (comment.image) {
      formData.append("image", comment.image);
    }

    return formData;
  }
}
export const commentsService = new CommentsService();
