import mongoose from "mongoose";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { INotification, Notification } from "../4-models/notification";
import { User } from "../4-models/user";
import { socketService } from "./socket-service";

class NotificationsService {
  public async getUserNotifications(
    userId: mongoose.Types.ObjectId
  ): Promise<INotification[]> {
    const notifications = await Notification.find({ userId })
      .sort({
        timestamp: -1,
      })
      .populate({
        path: "userId",
        select: "firstName lastName profilePicture coverPhoto",
      })
      .populate({
        path: "senderId",
        select: "firstName lastName profilePicture coverPhoto",
      });
    if (!notifications)
      throw new Error(`No notifications found for user ${userId}`);

    return notifications;
  }

  public async createNotification(
    notification: INotification
  ): Promise<INotification> {
    const errors = notification.validateSync();
    if (errors) throw new ValidationError(errors.message);
    const addedNotification = await notification.save();

    await User.updateOne(
      { _id: notification.userId },
      { $push: { notifications: addedNotification._id } }
    );

    const populatedNotification = await Notification.findById(
      addedNotification._id
    ).populate(["userId", "referenceId", "senderId"]);

    return populatedNotification;
  }

  public async handleAddNotification(
    notification: Partial<INotification>
  ): Promise<void> {
    const {
      userId: receiverId,
      type,
      message,
      referenceId,
      senderId,
    } = notification;

    const newNotification = new Notification({
      userId: receiverId,
      type,
      message,
      referenceId,
      senderId,
    });
    const addedNotification = await this.createNotification(newNotification);
    socketService.emitNotification(addedNotification);
  }

  public async handleRemoveNotification(
    notification: Partial<INotification>
  ): Promise<void> {
    const { userId, senderId, referenceId, type } = notification;
    const existingNotification = await Notification.findOne({
      userId,
      senderId,
      referenceId,
      type,
    });
    if (existingNotification) {
      const notificationId = existingNotification._id.toString();
      await this.deleteNotification(notificationId);
      socketService.emitNotificationRemoval({
        notificationId,
      });
    }
  }

  public async markNotificationAsRead(
    notificationId: mongoose.Types.ObjectId
  ): Promise<void> {
    await Notification.updateOne(
      { _id: notificationId },
      { $set: { isRead: true } }
    );
  }

  public async markNotificationsAsRead(
    notificationIds: mongoose.Types.ObjectId[]
  ): Promise<void> {
    if (
      !Array.isArray(notificationIds) ||
      notificationIds.some((id) => !mongoose.Types.ObjectId.isValid(id))
    ) {
      throw new ValidationError("Invalid notification IDs.");
    }

    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isRead: true } }
    );
  }

  public async deleteNotification(notificationId: string): Promise<void> {
    const notificationToDelete = await Notification.findByIdAndDelete({
      _id: notificationId,
    });
    if (!notificationToDelete) throw new ResourceNotFoundError(notificationId);
  }

  public async deleteAllNotifications(userId: string): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await Notification.deleteMany({ userId: userObjectId });
  }

  
}

export const notificationsService = new NotificationsService();
