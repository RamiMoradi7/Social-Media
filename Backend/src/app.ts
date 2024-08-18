import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import { appConfig } from "./2-utils/app-config";
import { dal } from "./2-utils/dal";
import { errorsMiddleware } from "./5-middleware/errors-middleware";
import { loggerMiddleware } from "./5-middleware/logger-middleware";
import { socketService } from "./6-services/socket-service";
import { authRouter } from "./7-controllers/auth-controller";
import { chatsRouter } from "./7-controllers/chats-controller";
import { commentsRouter } from "./7-controllers/comments-controller";
import { likesRouter } from "./7-controllers/likes-controller";
import { messagesRouter } from "./7-controllers/messages-controller";
import { postsRouter } from "./7-controllers/posts-controller";
import { usersRouter } from "./7-controllers/users-controller";
import { repliesRouter } from "./7-controllers/replies-controller";
import { notificationsRouter } from "./7-controllers/notifications-controller";
import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 30, // Limit each IP to 30 req per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

class App {
  private server = express();

  // Start app:
  public async start(): Promise<void> {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(expressFileUpload());

    this.server.use(rateLimiter);
    // Register middleware:
    this.server.use(loggerMiddleware.logToConsole);
    // Connect any controller route to the server:
    this.server.use(
      "/api",
      authRouter,
      usersRouter,
      postsRouter,
      commentsRouter,
      repliesRouter,
      likesRouter,
      notificationsRouter,
      chatsRouter,
      messagesRouter
    );

    // Route not found middleware:
    this.server.use(errorsMiddleware.routeNotFound);

    // Catch all middleware:
    this.server.use(errorsMiddleware.catchAll);
    await dal.connect();
    const httpServer = this.server.listen(appConfig.port, () =>
      console.log("Listening on http://localhost:" + appConfig.port)
    );
    socketService.handleSocketMessages(httpServer);
  }
}

const app = new App();
app.start();
