import express, { NextFunction, Request, Response } from "express";
import { User } from "../4-models/user";
import { authService } from "../6-services/auth-service";
import { StatusCode } from "../4-models/enums";
import { Credentials } from "../4-models/credentials";

class AuthController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }
  private registerRoutes(): void {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
  }

  private async register(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = new User(request.body);
      const token = await authService.register(user);
      response.status(StatusCode.Created).json(token);
    } catch (err: any) {
      next(err);
    }
  }

  private async login(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const credentials = new Credentials(request.body);
      const token = await authService.login(credentials);
      response.json(token);
    } catch (err: any) {
      next(err);
    }
  }
}

const authController = new AuthController();
export const authRouter = authController.router;
