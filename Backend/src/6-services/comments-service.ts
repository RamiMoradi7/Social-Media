import { UploadedFile } from "express-fileupload";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { Comment, IComment } from "../4-models/comment";
import { Post } from "../4-models/post";
import { imageHandlers } from "../2-utils/image-handlers";
import { fileSaver } from "uploaded-file-saver";
import mongoose, { Types } from "mongoose";
import { Like } from "../4-models/like";
import { Reply } from "../4-models/reply";
import { notificationsService } from "./notifications-service";
import { NotificationTypes } from "../4-models/notification";
import { socketService } from "./socket-service";

type CommentProps = {
  comment: IComment;
  image: UploadedFile;
};

class CommentsService {
  public async getComment(
    commentId: string,
    userId: mongoose.Types.ObjectId
  ): Promise<IComment> {
    const comment = await Comment.findById({ _id: commentId })
      .populate("postId")
      .populate({
        path: "author",
        select: "firstName lastName profilePicture coverPhoto",
      })
      .exec();
    if (!comment) throw new ResourceNotFoundError(commentId);
    comment.isLiked = comment.isLikedByUser(userId);

    return comment;
  }
  public async addComment({ comment, image }: CommentProps): Promise<IComment> {
    const errors = comment.validateSync();
    if (errors) throw new ValidationError(errors.message);

    comment.createdAt = new Date();

    if (image) {
      imageHandlers.configureFileSaver("1-assets", "comments-images");
      const imageName = await fileSaver.add(image);
      comment.imageName = imageName;
    }
    const addedComment = await Comment.create(comment);

    const post = await Post.findByIdAndUpdate(
      comment.postId,
      {
        $push: { comments: addedComment._id },
      },
      { new: true }
    );

    comment = await this.getComment(addedComment._id as string, comment.author);

    await notificationsService.handleAddNotification({
      userId: post.author,
      senderId: comment.author,
      referenceId: post._id as Types.ObjectId,
      type: NotificationTypes.Comment,
      message: "Commented on your post!",
    });
    socketService.emitComment(comment);

    return comment;
  }
  public async updateComment({
    comment,
    image,
  }: CommentProps): Promise<IComment> {
    const errors = comment.validateSync();
    if (errors) throw new ValidationError(errors.message);

    if (image) {
      imageHandlers.configureFileSaver("1-assets", "comments-images");
      const oldImageName = await this.getImageName(comment._id as string);
      const newImageName = await fileSaver.update(oldImageName, image);
      comment.imageName = newImageName;
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      comment._id,
      comment,
      { new: true }
    );
    if (!updatedComment) throw new ResourceNotFoundError(comment._id as string);
    return updatedComment;
  }
  public async deleteComment(commentId: string): Promise<void> {
    const imageName = await this.getImageName(commentId);
    const commentToDelete = await Comment.findByIdAndDelete(commentId);
    if (!commentToDelete) throw new ResourceNotFoundError(commentId);

    await Like.deleteMany({ targetId: commentId });
    await Reply.deleteMany({ commentId: commentId });

    await fileSaver.delete(imageName);
    const postId = commentToDelete.postId;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: commentToDelete._id },
      },
      { new: true }
    );
    await notificationsService.handleRemoveNotification({
      userId: updatedPost.author,
      senderId: commentToDelete.author,
      referenceId: commentToDelete._id as Types.ObjectId,
      type: NotificationTypes.Comment,
    });
    if (!updatedPost) throw new ResourceNotFoundError(postId.toString());
  }

  private async getImageName(_id: string): Promise<string> {
    const comment = await Comment.findById(_id).select("imageName");
    if (!comment) throw new ResourceNotFoundError(_id);
    const imageName = comment.imageName || "";
    return imageName;
  }
}
export const commentsService = new CommentsService();
