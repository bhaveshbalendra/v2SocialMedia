import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import http from "http";
import { config } from "./config/app.config";
import { connectToMongoDB } from "./config/mongoDB.config";
import { initializeSocketServer } from "./utils/socket";

import { handleError } from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import postRouter from "./routes/post.route";

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
      })
    );

    //Health Check Route
    app.get("/", (req, res) => {
      res.send("Hello, World!");
    });

    //API Routes
    app.use("/api/v2/auth", authRouter);
    app.use("/api/v2/post", postRouter);

    app.use(handleError);

    const PORT = config.port;
    const httpServer = http.createServer(app);

    // Initialize Socket.IO with authentication
    const io = initializeSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();
