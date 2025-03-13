import { UploadedFile } from "express-fileupload";
import mongoose, { Types } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { Comment } from "../4-models/comment";
import { NotificationTypes } from "../4-models/notification";
import { IReply, Reply } from "../4-models/reply";
import { notificationsService } from "./notifications-service";
import { populateOptions } from "../2-utils/populate-fields";

type ReplyProps = {
  reply: IReply;
  image?: UploadedFile;
};

class RepliesService {
  public async getRepliesByComment(
    commentId: string,
    userId: mongoose.Types.ObjectId
  ): Promise<{ replies: IReply[]; postId: string }> {
    const replies = await Reply.find({ commentId })
      .populate(populateOptions)
      .exec();

    if (!replies) throw new ResourceNotFoundError(commentId);
    const withLikes = replies.map((reply) => ({
      ...reply.toJSON(),
      isLiked: reply.isLikedByUser(userId),
    }));

    const postId = replies[0].postId.toString();
    return { replies: withLikes, postId };
  }

  public async getReply(replyId: string): Promise<IReply> {
    const reply = await Reply.findById({ _id: replyId })
      .populate("author")
      .populate("likes")
      .exec();
    if (!reply) throw new ResourceNotFoundError(replyId.toString());

    return reply;
  }

  public async addReply({ reply, image }: ReplyProps): Promise<IReply> {
    const errors = reply.validateSync();
    if (errors) throw new ValidationError(errors.message);

    if (image) {
      imageHandlers.configureFileSaver("1-assets", "replies-images");
      const webpImage = await imageHandlers.convertImageToWebP(image);
      const imageName = await fileSaver.add(webpImage);
      reply.imageName = imageName;
    }

    const addedReply = await Reply.create(reply);
    const comment = await Comment.findByIdAndUpdate(
      addedReply.commentId,
      {
        $push: { replies: addedReply },
      },
      { new: true }
    );

    reply = await this.getReply(addedReply._id as string);

    await notificationsService.handleAddNotification({
      userId: comment.author,
      senderId: reply.author,
      referenceId: comment.postId as Types.ObjectId,
      type: NotificationTypes.Reply,
      message: "Reply to your comment!",
    });
    return reply;
  }

  public async updateReply({ reply, image }: ReplyProps): Promise<IReply> {
    const errors = reply.validateSync();
    if (errors) throw new ValidationError(errors.message);

    if (image) {
      imageHandlers.configureFileSaver("1-assets", "replies-images");
      const oldImageName = await this.getImageName(reply._id.toString());
      const webpImage = await imageHandlers.convertImageToWebP(image);
      const newImageName = await fileSaver.update(oldImageName, webpImage);
      reply.imageName = newImageName;
    }

    const updatedReply = await Reply.findByIdAndUpdate(reply._id, reply, {
      new: true,
    });
    if (!updatedReply)
      throw new ResourceNotFoundError(updatedReply._id.toString());

    return updatedReply;
  }

  public async deleteReply(replyId: string): Promise<void> {
    const imageName = await this.getImageName(replyId);

    const replyToDelete = await Reply.findByIdAndDelete({ _id: replyId });
    if (!replyToDelete) throw new ResourceNotFoundError(replyId);

    await fileSaver.delete(imageName);
    const comment = await Comment.findByIdAndUpdate(
      replyToDelete.commentId,
      {
        $pull: { replies: replyToDelete._id },
      },
      { new: true }
    );

    await notificationsService.handleRemoveNotification({
      userId: comment.author,
      senderId: replyToDelete.author,
      referenceId: comment.postId as Types.ObjectId,
      type: NotificationTypes.Reply,
    });
  }

  private async getImageName(replyId: string): Promise<string> {
    const reply = await Reply.findById({ _id: replyId }).select("imageName");
    if (!reply) throw new ResourceNotFoundError(replyId);
    return reply.imageName || "";
  }
}

export const repliesService = new RepliesService();
