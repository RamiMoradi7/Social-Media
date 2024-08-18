import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { imageHandlers } from "../2-utils/image-handlers";
import { StatusCode } from "../4-models/enums";
import { Post } from "../4-models/post";
import { postsService } from "../6-services/posts-service";

class PostsController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.get("/posts/user/:_id([a-f0-9A-F]{24})", this.getPosts);
    this.router.get(
      "/posts/user/:_id([a-f0-9A-F]{24})/:currentUserId([a-f0-9A-F]{24})",
      this.getUserProfilePosts
    );
    this.router.get("/posts/:_id([a-f0-9A-F]{24})", this.getPost);
    this.router.get(
      "/posts/:postId([a-f0-9A-F]{24})/:userId([a-f0-9A-F]{24})",
      this.getPostByUser
    );
    this.router.post("/posts", this.addPost);
    this.router.put("/posts/:_id([a-f0-9A-F]{24})", this.updatePost);
    this.router.delete("/posts/:_id([a-f0-9A-F]{24})", this.deletePost);
    this.router.get(
      "/friendify/images/:folderPath/:imageName",
      imageHandlers.getImageFile
    );
  }

  private async getPosts(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id } = request.params;
      const query = request.query.query as string | undefined;
      const page = parseInt(request.query.page as string) || 1;
      const userObj = new mongoose.Types.ObjectId(_id);
      const posts = await postsService.getPosts({
        userId: userObj,
        query,
        page,
      });
      response.json(posts);
    } catch (err: any) {
      next(err);
    }
  }

  private async getUserProfilePosts(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id, currentUserId } = request.params;
      const page = parseInt(request.query.page as string) || 1;
      const userObj = new mongoose.Types.ObjectId(_id);
      const currentUserObj = new mongoose.Types.ObjectId(currentUserId);

      const posts = await postsService.getUserProfilePosts({
        userId: userObj,
        currentUserId: currentUserObj,
        page,
      });
      response.json(posts);
    } catch (err: any) {
      next(err);
    }
  }

  private async getPost(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = request.params._id;
      const post = await postsService.getPost(_id);
      response.json(post);
    } catch (err: any) {
      next(err);
    }
  }
  private async getPostByUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId, userId } = request.params;
      const post = await postsService.getPost(
        postId,
        new mongoose.Types.ObjectId(userId)
      );
      response.json(post);
    } catch (err: any) {
      next(err);
    }
  }
  private async addPost(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const post = new Post(request.body);
      const imagesArray = await imageHandlers.extractImagesFromRequest(request);
      const addedPost = await postsService.addPost({
        post,
        images: imagesArray,
      });
      response.status(StatusCode.Created).json(addedPost);
    } catch (err: any) {
      next(err);
    }
  }
  private async updatePost(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      request.body._id = request.params._id;
      const post = new Post(request.body);
      const imagesArray = await imageHandlers.extractImagesFromRequest(request);
      const updatedPost = await postsService.updatePost({
        post,
        images: imagesArray,
      });
      response.json(updatedPost);
    } catch (err: any) {
      next(err);
    }
  }
  private async deletePost(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = request.params._id;
      await postsService.deletePost(postId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

const postsController = new PostsController();
export const postsRouter = postsController.router;
