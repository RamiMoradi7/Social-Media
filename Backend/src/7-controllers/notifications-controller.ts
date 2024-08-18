import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { StatusCode } from "../4-models/enums";
import { Notification } from "../4-models/notification";
import { notificationsService } from "../6-services/notifications-service";

class NotificationsController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.get(
      "/notifications/:_id([a-f0-9A-F]{24})",
      this.getUserNotifications
    );
    this.router.post("/notifications", this.createNotification);
    this.router.put(
      "/notifications/:_id([a-f0-9A-F]{24})",
      this.markNotificationAsRead
    );
    this.router.put("/notifications", this.markNotificationsAsRead);
    this.router.delete(
      "/notifications/:_id([a-f-0-9-A-F]{24})",
      this.deleteNotification
    );
    this.router.delete(
      "/notifications/user/:_id([a-f-0-9-A-F]{24})",
      this.deleteAllNotifications
    );
  }

  private async getUserNotifications(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      const notifications = await notificationsService.getUserNotifications(
        new mongoose.Types.ObjectId(userId)
      );
      response.json(notifications);
    } catch (err: any) {
      next(err);
    }
  }
  private async createNotification(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notification = new Notification(request.body);
      const addedNotification = await notificationsService.createNotification(
        notification
      );
      response.status(StatusCode.Created).json(addedNotification);
    } catch (err: any) {
      next(err);
    }
  }
  private async markNotificationAsRead(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notificationId = request.params._id;
      await notificationsService.markNotificationAsRead(
        new mongoose.Types.ObjectId(notificationId)
      );
      response.sendStatus(StatusCode.OK);
    } catch (err: any) {
      next(err);
    }
  }

  private async markNotificationsAsRead(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notificationIds = request.body;
      await notificationsService.markNotificationsAsRead(notificationIds);
      response.sendStatus(StatusCode.OK);
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteNotification(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notificationId = request.params._id;
      await notificationsService.deleteNotification(notificationId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }

  private async deleteAllNotifications(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      await notificationsService.deleteAllNotifications(userId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

const notificationsController = new NotificationsController();
export const notificationsRouter = notificationsController.router;
