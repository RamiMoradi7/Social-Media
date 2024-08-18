import express, { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import mongoose, { FilterQuery } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import { StatusCode } from "../4-models/enums";
import { usersService } from "../6-services/users-service";
import { IAlbum } from "../4-models/album";

type UserFilters = {
  firstName: string;
  lastName: string;
  albums: IAlbum[];
};

class UsersController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.get("/users", this.getUsers);
    this.router.get("/users/:_id([a-f0-9A-F]{24})", this.getUser);
    this.router.get(
      "/users/:_id([a-f0-9A-F]{24})/:currentUserId([a-f0-9A-F]{24})",
      this.getUserProfile
    );
    this.router.put("/users/:_id([a-f0-9A-F]{24})", this.updateUser);
    this.router.post("/users/add-friend", this.sendFriendRequest);
    this.router.post("/friend-requests/accept", this.acceptFriendRequest);
    this.router.delete("/friend-requests/delete", this.deleteFriendRequest);
    this.router.delete("/friend-ship/delete", this.deleteFriendship);
    this.router.delete("/users/:_id([a-f0-9A-F]{24})", this.deleteUser);
    this.router.get(
      "/friendify/images/:folderPath/:imageName",
      imageHandlers.getImageFile
    );
  }

  private async getUsers(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const queryFilters: FilterQuery<UserFilters> = {};
      const { name, location, currentUserId } = request.query;

      if (name) {
        const nameParts = (name as string).split(/\s+/);
        queryFilters.$or = nameParts.map((part) => ({
          firstName: { $regex: new RegExp(part, "i") },
        }));

        queryFilters.$or.push(
          ...nameParts.map((part) => ({
            lastName: { $regex: new RegExp(part, "i") },
          }))
        );
      }

      if (location) {
        queryFilters["address.country"] = location as string;
      }

      const users = await usersService.getUsers(queryFilters);

      if (!currentUserId) {
        response.json(users);
      } else {
        const currentUserFriendsIds = await usersService.getUserFriendsIds(
          currentUserId as string
        );
        const filteredUsers = users.filter(
          (user) =>
            user._id.toString() !== currentUserId &&
            !currentUserFriendsIds.includes(user._id.toString())
        );
        
        response.json(filteredUsers);
      }
    } catch (err: any) {
      next(err);
    }
  }
  private async getUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = request.params._id;
      const user = await usersService.getUser(new mongoose.Types.ObjectId(_id));
      response.json(user);
    } catch (err: any) {
      next(err);
    }
  }

  private async getUserProfile(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const targetUserId = request.params._id;
      const currentUserId = request.params.currentUserId;

      const userProfile = await usersService.fetchUserProfile(
        targetUserId,
        currentUserId
      );
      response.json(userProfile);
    } catch (err: any) {
      next(err);
    }
  }

  private async updateUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      const { userFields } = request.body;
      const coverPhoto = request.files?.coverPhoto as UploadedFile | undefined;
      const profilePicture = request.files?.profilePicture as
        | UploadedFile
        | undefined;
      const parsedUserFields = userFields ? JSON.parse(userFields) : null;
      const updatedUser = await usersService.updateUser({
        userId,
        userFields: parsedUserFields,
        coverPhoto,
        profilePicture,
      });

      response.json(updatedUser);
    } catch (err: any) {
      next(err);
    }
  }
  private async sendFriendRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderUserId, receiverUserId } = request.body;
      const { senderUser, receiverUser } = await usersService.sendFriendRequest(
        senderUserId,
        receiverUserId
      );
      response.json({ senderUser, receiverUser });
    } catch (err: any) {
      next(err);
    }
  }
  private async acceptFriendRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderUserId, receiverUserId } = request.body;
      const { senderUser, receiverUser } =
        await usersService.acceptFriendRequest(senderUserId, receiverUserId);
      response.json({ senderUser, receiverUser });
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteFriendRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderUserId, receiverUserId } = request.body;
      const { senderUser, receiverUser } =
        await usersService.deleteFriendRequest(senderUserId, receiverUserId);
      response.json({ senderUser, receiverUser });
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteFriendship(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderUserId, receiverUserId } = request.body;
      const { senderUser, receiverUser } = await usersService.deleteFriendship(
        senderUserId,
        receiverUserId
      );
      response.json({ senderUser, receiverUser });
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      await usersService.deleteUser(userId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
  public async getImageFile(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { imageName } = request.params;
      const imagePath = fileSaver.getFilePath(imageName);
      response.sendFile(imagePath);
    } catch (err: any) {
      next(err);
    }
  }
}

const usersController = new UsersController();
export const usersRouter = usersController.router;
