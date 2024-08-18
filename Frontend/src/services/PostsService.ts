import axios from "axios";
import { Post } from "../models/Post";
import { appConfig } from "../utilities/AppConfig";
import { store } from "../redux/Store";
import {
  addPost,
  deletePost,
  initPosts,
  updatePost,
} from "../redux/PostsSlice";
import { updateUser } from "../redux/AuthSlice";

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
    const params = new URLSearchParams();
    if (query) {
      params.append("query", query);
    }
    params.append("page", page.toString());

    const response = await axios.get<PostsResponse>(
      `${appConfig.postsUrl}user/${userId}?${params.toString()}`
    );
    const postsResponse = response.data;
    store.dispatch(initPosts({ posts: postsResponse.posts, context: "home" }));
    return postsResponse;
  }

  public async getUserProfilePosts(
    userId: string,
    currentUserId: string,
    page = 1
  ): Promise<PostsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    const response = await axios.get<PostsResponse>(
      `${
        appConfig.postsUrl
      }user/${userId}/${currentUserId}?${params.toString()}`
    );

    const postsResponse = response.data;
    store.dispatch(
      initPosts({
        posts: postsResponse.posts,
        context: "profile",
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
    const response = await axios.post<Post>(
      appConfig.postsUrl,
      formData,
      appConfig.axiosOptions
    );
    const addedPost = response.data;
    store.dispatch(addPost(addedPost));
    const user = store.getState().user;
    store.dispatch(updateUser({ ...user, posts: [...user.posts, addedPost] }));
  }

  public async updatePost(post: Post, userId: string): Promise<void> {
    const formData = new FormData();
    if (post.images) {
      Array.from(post.images).map((image) => formData.append("images", image));
    }
    formData.append("content", post.content);
    formData.append("privacy", post.privacy);
    formData.append("author", userId);
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
    const user = store.getState().user;
    const updatedUserPosts = user.posts.filter((post) => post._id !== postId);
    store.dispatch(
      updateUser({
        ...user,
        posts: updatedUserPosts,
      })
    );
  }
}
export const postsService = new PostsService();
