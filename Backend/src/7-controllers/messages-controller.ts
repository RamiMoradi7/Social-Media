import express, { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCode } from "../4-models/enums";
import { Message } from "../4-models/message";
import { messagesService } from "../6-services/messages-service";
import { imageHandlers } from "../2-utils/image-handlers";

class MessagesController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.post("/new-message/", this.sendMessage);
    this.router.put(
      "/update-message/:_id([a-f0-9A-F]{24})",
      this.updateMessage
    );
    this.router.delete("/messages/:_id([a-f0-9A-F]{24})", this.deleteMessage);
    this.router.get(
      "/friendify/images/:folderPath/:imageName",
      imageHandlers.getImageFile
    );
  }

  private async sendMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const message = new Message(request.body);
      const image = request.files?.image as UploadedFile;
      const sentMessage = await messagesService.sendMessage({
        message,
        image: image,
      });
      response.status(StatusCode.Created).json(sentMessage);
    } catch (err: any) {
      next(err);
    }
  }
  private async updateMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      request.body._id = request.params._id;
      const message = new Message(request.body);
      const image = request.files?.image as UploadedFile;
      const updatedMessage = await messagesService.updateMessage({
        message,
        image,
      });
      response.json(updatedMessage);
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const messageId = request.params._id;
    await messagesService.deleteMessage(messageId);
    response.sendStatus(StatusCode.NoContent);

    try {
    } catch (err: any) {
      next(err);
    }
  }
}

const messagesController = new MessagesController();
export const messagesRouter = messagesController.router;
