import express, { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import mongoose, { FilterQuery } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import { IAlbum } from "../4-models/album";
import { MediaTypes, StatusCode } from "../4-models/enums";
import { userRequestsService } from "../6-services/user-requests-service";
import { usersService } from "../6-services/users-service";
import { albumsService } from "../6-services/albums-service";
import { ValidationError } from "../4-models/client-errors";
import { User } from "../4-models/user";

type UserFilters = {
  firstName: string;
  lastName: string;
  currentUserId: string;
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
    this.router.get("/users/albums/:_id([a-f0-9A-F]{24})", this.getUserAlbums);
    this.router.get(
      "/users/albums/:_id([a-f0-9A-F]{24})/:albumType",
      this.getUserMediaItem
    );
    this.router.put("/users/:_id([a-f0-9A-F]{24})", this.updateUser);
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
        0;
      }

      if (location) {
        queryFilters["address.country"] = location as string;
      }

      const currentUser = await User.findById(currentUserId).select("friends");
      const friendsList = currentUser?.friends || [];

      if (currentUserId) {
        queryFilters._id = { $ne: currentUserId };
        queryFilters._id = {
          ...queryFilters._id,
          $nin: friendsList,
        };
      }

      const users = await usersService.getUsers(queryFilters);
      response.json(users);
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
      const userObjId = new mongoose.Types.ObjectId(_id);
      const user = await usersService.getUser(userObjId);
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

  private async getUserAlbums(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = request.params._id;
      const albums = await albumsService.getUserAlbums(_id);
      response.json(albums);
    } catch (err: any) {
      next(err);
    }
  }

  private async getUserMediaItem(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = request.params._id;
      const albumType = request.params.albumType as MediaTypes;
      if (!Object.values(MediaTypes).includes(albumType)) {
        throw new ValidationError(`Invalid album type ${albumType}`);
      }
      const mediaItem = await albumsService.getUserMediaItem(_id, albumType);
      response.json(mediaItem);
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
