import axios from "axios";
import { Post } from "../models/Post";
import {
  addPost,
  ContextType,
  deletePost,
  initPosts,
  updatePost,
} from "../redux/PostsSlice";
import { store } from "../redux/Store";
import { appConfig } from "../utilities/AppConfig";

export interface PostsResponse {
  posts: Post[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

class PostsService {
  public async getPosts(
    userId: string,
    query?: string,
    page = 1
  ): Promise<PostsResponse> {
    console.log("initializing getPosts");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const params = new URLSearchParams();
    if (query) {
      params.append("query", query);
    }
    params.append("page", page.toString());

    const response = await axios.get<PostsResponse>(
      `${appConfig.postsUrl}user/${userId}?${params.toString()}`
    );
    const postsResponse = response.data;
    store.dispatch(
      initPosts({ posts: postsResponse.posts, context: ContextType.Home })
    );
    return postsResponse;
  }

  public async getUserProfilePosts(
    userId: string,
    currentUserId: string,
    page = 1
  ): Promise<PostsResponse> {
    const response = await axios.get<PostsResponse>(
      `${appConfig.postsUrl}user/${userId}/${currentUserId}?page=${page}`
    );

    const postsResponse = response.data;
    store.dispatch(
      initPosts({
        posts: postsResponse.posts,
        context: ContextType.Profile,
        currentUserId: userId,
      })
    );

    return postsResponse;
  }

  public async getPost(postId: string, userId?: string): Promise<Post> {
    const response = await axios.get<Post>(appConfig.postsUrl + postId);
    const post = response.data;
    return post;
  }

  public async getPostByUser(postId: string, userId: string): Promise<Post> {
    const response = await axios.get<Post>(
      appConfig.postsUrl + postId + `/${userId}`
    );
    const post = response.data;
    return post;
  }

  public async addPost(post: Partial<Post>, userId: string): Promise<void> {
    const formData = new FormData();
    if (post.images) {
      Array.from(post.images).map((image) => formData.append("images", image));
    }
    formData.append("content", post.content);
    formData.append("privacy", post.privacy);
    formData.append("author", userId);
    if (post.targetUserId) {
      formData.append("targetUser", post.targetUserId);
    }
    const response = await axios.post<Post>(
      appConfig.postsUrl,
      formData,
      appConfig.axiosOptions
    );
    const addedPost = response.data;
    store.dispatch(addPost(addedPost));
  }

  public async updatePost(
    post: Post,
    userId: string,
    targetUser?: string
  ): Promise<void> {
    const formData = new FormData();
    if (post.images) {
      Array.from(post.images).map((image) => formData.append("images", image));
    }
    formData.append("content", post.content);
    formData.append("privacy", post.privacy);
    formData.append("author", userId);
    if (targetUser) {
      formData.append("targetUser", targetUser);
    }
    const response = await axios.put<Post>(
      appConfig.postsUrl + post._id,
      formData,
      appConfig.axiosOptions
    );
    const updatedPost = response.data;
    store.dispatch(updatePost(updatedPost));
  }

  public async deletePost(postId: string): Promise<void> {
    await axios.delete<Post>(appConfig.postsUrl + postId);
    store.dispatch(deletePost(postId));
  }
}
export const postsService = new PostsService();
