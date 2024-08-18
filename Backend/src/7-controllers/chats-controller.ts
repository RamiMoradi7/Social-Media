import express, { NextFunction, Request, Response } from "express";
import { Chat } from "../4-models/chat";
import { StatusCode } from "../4-models/enums";
import { chatsService } from "../6-services/chats-service";
import mongoose from "mongoose";

class ChatsController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.get("/chats/:_id([a-f0-9A-F]{24})", this.getChats);
    this.router.post("/chats/", this.startChat);
    this.router.put("/chats/:_id([a-f0-9A-F]{24})", this.updateChat);
    this.router.delete(
      "/chats/:chatId([a-f0-9A-F]{24})/:userId([a-f0-9A-F]{24})",
      this.deleteChat
    );
  }

  private async getChats(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.params._id;
      const chats = await chatsService.getChats(userId);
      response.json(chats);
    } catch (err: any) {
      next(err);
    }
  }
  private async startChat(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const chat = new Chat(request.body);
      const startedChat = await chatsService.startChat(chat);
      response.status(StatusCode.Created).json(startedChat);
    } catch (err: any) {
      next(err);
    }
  }
  private async updateChat(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      request.body._id = request.params._id;
      const chat = new Chat(request.body);
      const updatedChat = await chatsService.updateChat(chat);
      response.json(updatedChat);
    } catch (err: any) {
      next(err);
    }
  }
  private async deleteChat(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const chatId = request.params.chatId;
      const userId = request.params.userId;
      await chatsService.deleteChat(
        chatId,
        new mongoose.Types.ObjectId(userId)
      );
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

const chatsController = new ChatsController();
export const chatsRouter = chatsController.router;
