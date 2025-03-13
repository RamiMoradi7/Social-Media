import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { Reply } from "../models/Reply";

export enum ContextType {
  Home = "home",
  Profile = "profile",
}

export interface PostsState {
  posts: Record<string, Post>;
  userProfilePosts: Record<string, Post>;
  currentUserProfileId: string;
  isLoading: boolean;
  context: ContextType;
}

const initialState: PostsState = {
  posts: {},
  userProfilePosts: {},
  currentUserProfileId: "",
  isLoading: true,
  context: ContextType.Home,
};

export const getPostsState = (state: PostsState) =>
  state.context === ContextType.Home ? state.posts : state.userProfilePosts;

const getPost = (state: PostsState, postId: string) => {
  const currentState = getPostsState(state);
  if (!currentState[postId]) return;
  return currentState;
};

const setPosts = (posts: Post[], state: PostsState) => {
  const current = getPostsState(state);
  state.isLoading = true;
  posts.forEach((post) => {
    if (!current[post._id]) {
      current[post._id] = post;
    }
  });
  state.isLoading = false;
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    initPosts(
      state,
      action: PayloadAction<{
        posts: Post[];
        context: ContextType;
        currentUserId?: string;
      }>
    ) {
      const { posts, context, currentUserId } = action.payload;
      state.context = context;
      switch (context) {
        case ContextType.Home:
          setPosts(posts, state);
          break;
        case ContextType.Profile:
          if (state.currentUserProfileId !== currentUserId) {
            state.userProfilePosts = {};
            state.currentUserProfileId = currentUserId;
          }
          setPosts(posts, state);
      }
    },
    addPost(state, action: PayloadAction<Post>) {
      const post = action.payload;
      const postsState = getPostsState(state);
      postsState[post._id] = post;
    },
    updatePost(state, action: PayloadAction<Post>) {
      const post = action.payload;
      const postsState = getPost(state, post._id);
      postsState[post._id] = post;
    },
    deletePost(state, action: PayloadAction<string>) {
      const postId = action.payload;
      const postsState = getPost(state, postId);
      delete postsState[postId];
    },
    initCommentsForPost(
      state,
      action: PayloadAction<{
        postId: string;
        comments: Record<string, Comment>;
      }>
    ) {
      const { postId, comments } = action.payload;
      const postsState = getPost(state, postId);
      postsState[postId].recordComments = comments;
    },
    addComment(state, action: PayloadAction<Comment>) {
      const { postId, _id: commentId } = action.payload;
      const postsState = getPost(state, postId);
      if (!postsState[postId].recordComments) {
        postsState[postId].recordComments = {};
      }
      postsState[postId].recordComments[commentId] = action.payload;
      postsState[postId].commentsCount += 1;
    },
    updateComment(state, action: PayloadAction<Comment>) {
      const { postId, _id: commentId } = action.payload;
      const postsState = getPost(state, postId);
      postsState[postId].recordComments[commentId] = action.payload;
    },
    deleteComment(state, action: PayloadAction<Comment>) {
      const { _id: commentId, postId } = action.payload;
      const postsState = getPost(state, postId);
      if (postsState[postId].recordComments[commentId]) {
        delete postsState[postId].recordComments[commentId];
      }
    },
    initRepliesForComment(
      state,
      action: PayloadAction<{
        postId: string;
        commentId: string;
        replies: Record<string, Reply>;
      }>
    ) {
      const { postId, commentId, replies } = action.payload;
      const postsState = getPost(state, postId);

      if (!postsState[postId].recordComments[commentId]) return;
      postsState[postId].recordComments[commentId].recordReplies = replies;
    },
    addReply(state, action: PayloadAction<Reply>) {
      const { commentId, postId, _id: replyId } = action.payload;
      const postsState = getPost(state, postId);
      if (!postsState[postId].recordComments[commentId].recordReplies) {
        postsState[postId].recordComments[commentId].recordReplies = {};
      }
      postsState[postId].recordComments[commentId].recordReplies[replyId] =
        action.payload;
    },
    updateReply(state, action: PayloadAction<Reply>) {
      const { postId, commentId, _id: replyId } = action.payload;
      const postsState = getPost(state, postId);

      if (postsState[postId].recordComments[commentId].recordReplies[replyId]) {
        postsState[postId].recordComments[commentId].recordReplies[replyId] =
          action.payload;
      }
    },
    deleteReply(state, action: PayloadAction<Reply>) {
      const { _id: replyId, commentId, postId } = action.payload;
      const postsState = getPost(state, postId);

      if (postsState[postId].recordComments[commentId].recordReplies[replyId]) {
        delete postsState[postId].recordComments[commentId].recordReplies[
          replyId
        ];
      }
    },
    resetPosts(state) {
      state.posts = {};
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  initPosts,
  addPost,
  updatePost,
  deletePost,
  initCommentsForPost,
  setLoading,
  addComment,
  updateComment,
  deleteComment,
  initRepliesForComment,
  addReply,
  updateReply,
  deleteReply,
  resetPosts,
} = postsSlice.actions;

export const postsReducers = postsSlice.reducer;
