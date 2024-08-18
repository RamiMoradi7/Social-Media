import { ResourceNotFoundError } from "../4-models/client-errors";
import { Comment } from "../4-models/comment";
import { ILike, Like } from "../4-models/like";
import { NotificationTypes } from "../4-models/notification";
import { Post } from "../4-models/post";
import { Reply } from "../4-models/reply";
import { User } from "../4-models/user";
import { notificationsService } from "./notifications-service";

class LikesService {
  public async togglePostLike(like: ILike): Promise<void> {
    const { userId, targetId: postId, targetType } = like;

    const post = await Post.findById(postId);
    if (!post) throw new ResourceNotFoundError(postId?.toString());

    const existingLike = await Like.findOne({
      targetType,
      targetId: postId,
      userId,
    });

    if (existingLike) {
      post.likes = post.likes.filter((like) => !like.equals(userId));
      await existingLike.deleteOne();
      await User.findByIdAndUpdate(userId, {
        $pull: { likedPosts: postId },
      });
      await notificationsService.handleRemoveNotification({
        userId: post.author,
        referenceId: postId,
        senderId: userId,
        type: NotificationTypes.Like,
      });
    } else {
      post.likes.push(userId);
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      await Like.create({ targetType, targetId: postId, userId });
      await notificationsService.handleAddNotification({
        userId: post.author,
        referenceId: postId,
        senderId: userId,
        type: NotificationTypes.Like,
        message: "Liked your post!",
      });
    }
    await post.save();
  }

  public async toggleCommentLike(like: ILike): Promise<void> {
    const { targetId: commentId, userId, targetType } = like;
    const comment = await Comment.findById({ _id: commentId });
    if (!comment) throw new ResourceNotFoundError(commentId.toString());
    const existingLike = await Like.findOne({
      targetId: commentId,
      userId,
      targetType,
    });
    if (existingLike) {
      comment.likes = comment.likes.filter((like) => !like.equals(userId));
      await existingLike.deleteOne();
      await notificationsService.handleRemoveNotification({
        userId: comment.author,
        referenceId: comment.postId,
        senderId: userId,
        type: NotificationTypes.Like,
      });
    } else {
      comment.likes.push(userId);
      await like.save();
      await notificationsService.handleAddNotification({
        userId: comment.author,
        referenceId: comment.postId,
        senderId: userId,
        type: NotificationTypes.Like,
        message: "Liked your comment!",
      });
    }
    await comment.save();
  }

  public async toggleReplyLike(like: ILike): Promise<void> {
    const { targetId: replyId, userId, targetType } = like;
    const reply = await Reply.findById({ _id: replyId });
    if (!reply) throw new ResourceNotFoundError(replyId.toString());
    const existingLike = await Like.findOne({
      targetId: reply,
      userId,
      targetType,
    });
    const comment = await Comment.findById(reply.commentId);
    if (existingLike) {
      reply.likes = reply.likes.filter((like) => !like.equals(userId));
      await existingLike.deleteOne();
      await notificationsService.handleRemoveNotification({
        userId: reply.author,
        referenceId: comment.postId,
        senderId: userId,
        type: NotificationTypes.Like,
      });
    } else {
      reply.likes.push(userId);
      await like.save();
      await notificationsService.handleAddNotification({
        userId: reply.author,
        referenceId: comment.postId,
        senderId: userId,
        type: NotificationTypes.Like,
        message: "Liked your reply!",
      });
    }
    await reply.save();
  }
}

export const likesService = new LikesService();
