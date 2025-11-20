import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import http from "http";
import { config } from "./config/app.config";
import { connectToMongoDB } from "./config/mongoDB.config";
import { handleError } from "./middleware/error.middleware";
import authRouter from "./routes/auth.routes";
import chatRouter from "./routes/chat.routes";
import commentRouter from "./routes/comment.routes";
import followRouter from "./routes/follow.routes";
import likeRouter from "./routes/like.routes";
import notificationRouter from "./routes/notification.routes";
import postRouter from "./routes/post.routes";
import profileRouter from "./routes/profile.routes";
import settingsRouter from "./routes/settings.routes";
import { initializeSocketServer } from "./utils/socket.util";
async function startServer() {
  try {
    await connectToMongoDB();

    const app: Application = express();

    //Middlewares
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Enable CORS with appropriate configuration
    app.use(
      cors({
        origin:
          config.node_env === "production"
            ? config.allowed_origins
            : config.allowed_origins,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        maxAge: 86400, // 24 hours
        exposedHeaders: ["Authorization"],
      })
    );

    //Health Check Route
    app.get("/", (req, res) => {
      res.send("Hello, World!");
    });

    //API Routes
    app.use("/api/v2/auth", authRouter);
    app.use("/api/v2/posts", postRouter);
    app.use("/api/v2/follows", followRouter);
    app.use("/api/v2/notifications", notificationRouter);
    app.use("/api/v2/settings", settingsRouter);
    app.use("/api/v2/likes", likeRouter);
    app.use("/api/v2/comments", commentRouter);
    app.use("/api/v2/profiles", profileRouter);
    app.use("/api/v2/chat", chatRouter);

    app.use(handleError);

    const PORT = config.port;
    const httpServer = http.createServer(app);

    // Initialize Socket.IO with authentication
    initializeSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();
