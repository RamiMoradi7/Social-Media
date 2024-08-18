import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { Reply } from "../models/Reply";
import { WritableDraft } from "immer";

export type ContextType = "home" | "profile";

export interface PostsState {
  posts: Post[];
  userProfilePosts: Post[];
  currentUserProfileId: string;
  isLoading: boolean;
  context: ContextType;
}

const initialState: PostsState = {
  posts: [],
  userProfilePosts: [],
  currentUserProfileId: "",
  isLoading: true,
  context: "home",
};

const findArrIndex = <T>(arr: T[], key: keyof T, value: string) =>
  arr.findIndex((item) => item[key] === value);

const getPostsArray = (state: WritableDraft<PostsState>) => {
  return state.context === "home" ? state.posts : state.userProfilePosts;
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

      if (context === "home") {
        state.context = "home";
        const existingPostIds = new Set(state.posts.map((post) => post._id));
        state.posts = [
          ...state.posts,
          ...posts.filter((post) => !existingPostIds.has(post._id)),
        ] as Post[];
      } else if (context === "profile") {
        if (currentUserId && currentUserId !== state.currentUserProfileId) {
          state.userProfilePosts = [];
          state.currentUserProfileId = currentUserId;
        }
        state.context = "profile";
        const existingPostIds = new Set(
          state.userProfilePosts.map((post) => post._id)
        );
        state.userProfilePosts = [
          ...state.userProfilePosts,
          ...posts.filter((post) => !existingPostIds.has(post._id)),
        ];
      }

      state.isLoading = false;
    },

    addPost(state, action: PayloadAction<Post>) {
      const post = action.payload;
      const postsArr = getPostsArray(state);
      postsArr.unshift(post);
    },
    updatePost(state, action: PayloadAction<Post>) {
      const post = action.payload;
      const postsArr = getPostsArray(state);
      const index = findArrIndex(postsArr, "_id", post._id);
      if (index !== -1) {
        postsArr[index] = post;
      }
    },
    deletePost(state, action: PayloadAction<string>) {
      const postId = action.payload;
      const postsArr = getPostsArray(state);
      const index = findArrIndex(postsArr, "_id", postId);
      if (index !== -1) {
        postsArr.splice(index, 1);
      }
    },

    resetPosts(state) {
      state.posts = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    addComment(state, action: PayloadAction<Comment>) {
      const { postId } = action.payload;
      const postsArr = getPostsArray(state);
      const postIndex = postsArr.findIndex((post) => post._id === postId);
      if (postIndex !== -1) {
        postsArr[postIndex].comments.push(action.payload);
      }
    },
    updateComment(state, action: PayloadAction<Comment>) {
      const updatedComment = action.payload;
      const postsArr = getPostsArray(state);
      const postIndex = findArrIndex(postsArr, "_id", updatedComment.postId);

      if (postIndex !== -1) {
        const commentIndex = findArrIndex(
          postsArr[postIndex].comments,
          "_id",
          updatedComment._id
        );

        if (commentIndex !== -1) {
          postsArr[postIndex].comments[commentIndex] = updatedComment;
        }
      }
    },
    deleteComment(state, action: PayloadAction<Comment>) {
      const { _id, postId } = action.payload;
      const postsArr = getPostsArray(state);
      const postIndex = findArrIndex(postsArr, "_id", postId);

      if (postIndex !== -1) {
        const comments = postsArr[postIndex].comments;
        const commentIndex = findArrIndex(comments, "_id", _id);
        if (commentIndex !== -1) {
          postsArr[postIndex].comments.splice(commentIndex, 1);
        }
      }
    },
    addReply(state, action: PayloadAction<Reply>) {
      const postsArr = getPostsArray(state);
      const postIndex = postsArr.findIndex((post) =>
        post.comments.some(
          (comment) => comment._id === action.payload.commentId
        )
      );
      if (postIndex !== -1) {
        const commentIndex = postsArr[postIndex].comments.findIndex(
          (comment) => comment._id === action.payload.commentId
        );
        if (commentIndex !== -1) {
          postsArr[postIndex].comments[commentIndex].replies.push(
            action.payload
          );
        }
      }
    },
    updateReply(state, action: PayloadAction<Reply>) {
      const updatedReply = action.payload;
      const postsArr = getPostsArray(state);

      const post = postsArr.find((post) =>
        post.comments.some((comment) =>
          comment.replies.some((reply) => reply._id === updatedReply._id)
        )
      );

      if (post) {
        const comment = post.comments.find((comment) =>
          comment.replies.some((reply) => reply._id === updatedReply._id)
        );

        if (comment) {
          const replyIndex = comment.replies.findIndex(
            (reply) => reply._id === updatedReply._id
          );

          if (replyIndex !== -1) {
            comment.replies[replyIndex] = updatedReply;
          }
        }
      }
    },
    deleteReply(state, action: PayloadAction<Reply>) {
      const { _id, commentId } = action.payload;
      const postsArr = getPostsArray(state);
      const postIndex = postsArr.findIndex((post) =>
        post.comments.some((comment) => comment._id === commentId)
      );

      if (postIndex !== -1) {
        const comments = postsArr[postIndex].comments;
        const commentIndex = findArrIndex(comments, "_id", commentId);

        if (commentIndex !== -1) {
          const currentCommentReplies =
            postsArr[postIndex].comments[commentIndex].replies;

          const replyIndex = findArrIndex(currentCommentReplies, "_id", _id);

          if (replyIndex !== -1) {
            currentCommentReplies.splice(replyIndex, 1);
          }
        }
      }
    },
  },
});

export const {
  initPosts,
  addPost,
  updatePost,
  deletePost,
  setLoading,
  addComment,
  updateComment,
  deleteComment,
  addReply,
  updateReply,
  deleteReply,
  resetPosts,
} = postsSlice.actions;

export const postsReducers = postsSlice.reducer;
