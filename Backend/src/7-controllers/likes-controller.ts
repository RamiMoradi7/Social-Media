import express, { NextFunction, Request, Response } from "express";
import { likesService } from "../6-services/likes-service";
import { StatusCode } from "../4-models/enums";
import { Like } from "../4-models/like";

class LikesController {
  public readonly router = express.Router();
  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.put("/posts/like", this.togglePostLike);
    this.router.put("/comments/like", this.toggleCommentLike);
    // this.router.put("/user-photos/like/:photoType", this.toggleUserPhotosLike);
    this.router.put("/replies/like", this.toggleReplyLike);
  }

  private async togglePostLike(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const like = new Like(request.body);
      await likesService.togglePostLike(like);
      response.sendStatus(StatusCode.OK);
    } catch (err: any) {
      next(err);
    }
  }
  private async toggleCommentLike(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const like = new Like(request.body);
      await likesService.toggleCommentLike(like);
      response.sendStatus(StatusCode.OK);
    } catch (err: any) {
      next(err);
    }
  }
  private async toggleReplyLike(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const like = new Like(request.body);
      await likesService.toggleReplyLike(like);
      response.sendStatus(StatusCode.OK);
    } catch (err: any) {
      next(err);
    }
  }
//   private async toggleUserPhotosLike(
//     request: Request,
//     response: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const { photoType } = request.params;
//       const like = new Like(request.body);
//       if (photoType === "profile") {
//         await likesService.toggleUserPhotosLike(like, "profilePictureLikes");
//       } else if (photoType === "cover") {
//         await likesService.toggleUserPhotosLike(like, "coverPhotoLikes");
//       }

//       response.sendStatus(StatusCode.OK);
//     } catch (err: any) {
//       next(err);
//     }
//   }
}

const likesController = new LikesController();
export const likesRouter = likesController.router;
