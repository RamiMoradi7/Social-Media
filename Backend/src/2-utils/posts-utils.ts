import { Types } from "mongoose";
import { IPost } from "../4-models/post";
import { IReply } from "../4-models/reply";

export const postPopulateFields = [
  {
    path: "author",
    select: "firstName lastName profilePicture coverPhoto photos isActive",
  },
  {
    path: "likes",
    select:
      "firstName lastName gender profilePicture coverPhoto photos isActive lastLogin",
  },
  {
    path: "comments",
    populate: [
      {
        path: "author",
        select:
          "firstName profilePicture coverPhoto photos lastName gender isActive",
      },
      {
        path: "likes",
        select:
          "firstName  profilePicture coverPhoto photos lastName gender isActive",
      },
      {
        path: "replies",
        populate: [
          {
            path: "author",
            select:
              "firstName lastName gender profilePicture coverPhoto photos isActive",
          },
          {
            path: "likes",
            select:
              "firstName lastName gender profilePicture coverPhoto photos isActive",
          },
        ],
      },
    ],
  },
];

export function getPostsWithLikes(
  userId: Types.ObjectId,
  posts: IPost[]
): IPost[] {
  const postsWithLikes = posts.map((post) => {
    const populatedPost: IPost = {
      ...post.toJSON(),
      isLiked: post.isLikedByUser(userId),
      comments: post.comments.map((comment) => {
        const isCommentLiked = comment.isLikedByUser(userId);
        const repliesWithLikes = comment.replies.map((reply) => ({
          ...reply.toJSON(),
          isLiked: reply.isLikedByUser(userId),
        }));

        return {
          ...comment.toJSON(),
          isLiked: isCommentLiked,
          replies: repliesWithLikes as IReply[],
        };
      }),
    };
    return populatedPost;
  });
  return postsWithLikes;
}
