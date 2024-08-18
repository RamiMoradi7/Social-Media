import express, { NextFunction, Request, Response } from "express";
import { Comment } from "../4-models/comment";
import { StatusCode } from "../4-models/enums";
import { commentsService } from "../6-services/comments-service";
import { UploadedFile } from "express-fileupload";
import { imageHandlers } from "../2-utils/image-handlers";

class CommentsController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.get("/comments/:_id([a-f0-9A-F]{24})", this.getComment);
    this.router.post("/comments", this.addComment);
    this.router.put("/comments/:_id([a-f0-9A-F]{24})", this.updateComment);
    this.router.delete("/comments/:_id([a-f0-9A-F]{24})", this.deleteComment);
    this.router.get(
      "/friendify/images/:folderPath/:imageName",
      imageHandlers.getImageFile
    );
  }

  private async getComment(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = request.params._id;
      const userId = request.body;
      const comment = await commentsService.getComment(_id, userId);
      response.json(comment);
    } catch (err: any) {
      next(err);
    }
  }
  private async addComment(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const comment = new Comment(request.body);
      let image: UploadedFile | undefined;
      if (request.files && request.files.image) {
        image = request.files.image as UploadedFile;
      }
      const addedComment = await commentsService.addComment({ comment, image });
      response.status(StatusCode.Created).json(addedComment);
    } catch (err: any) {
      next(err);
    }
  }
  private async updateComment(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      request.body._id = request.params._id;
      const comment = new Comment(request.body);
      let image: UploadedFile | undefined;
      if (request.files && request.files.image) {
        image = request.files.image as UploadedFile;
      }

      const updatedComment = await commentsService.updateComment({
        comment,
        image,
      });
      response.json(updatedComment);
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteComment(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commentId = request.params._id;
      await commentsService.deleteComment(commentId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

const commentsController = new CommentsController();
export const commentsRouter = commentsController.router;
