import express, { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { imageHandlers } from "../2-utils/image-handlers";
import { StatusCode } from "../4-models/enums";
import { Reply } from "../4-models/reply";
import { repliesService } from "../6-services/replies-service";

class RepliesController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.post("/replies", this.addReply);
    this.router.put("/replies/:_id([a-f0-9A-F]{24})", this.updateReply);
    this.router.delete("/replies/:_id([a-f0-9A-F]{24})", this.deleteReply);
    this.router.get(
      "/friendify/images/:folderPath/:imageName",
      imageHandlers.getImageFile
    );
  }

  private async addReply(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reply = new Reply(request.body);
      let image: UploadedFile | undefined;
      if (request.files && request.files.image) {
        image = request.files.image as UploadedFile;
      }
      const addedReply = await repliesService.addReply({ reply, image });
      response.status(StatusCode.Created).json(addedReply);
    } catch (err: any) {
      next(err);
    }
  }
  private async updateReply(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      request.body._id = request.params._id;
      const reply = new Reply(request.body);
      let image: UploadedFile | undefined;
      if (request.files && request.files.image) {
        image = request.files.image as UploadedFile;
      }
      const updatedReply = await repliesService.updateReply({
        reply,
        image,
      });
      response.json(updatedReply);
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteReply(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const replyId = request.params._id;
      await repliesService.deleteReply(replyId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

const repliesController = new RepliesController();
export const repliesRouter = repliesController.router;
