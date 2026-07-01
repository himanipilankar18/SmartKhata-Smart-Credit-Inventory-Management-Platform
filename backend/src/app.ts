import express from "express";
import { registerMiddlewares } from "./config";
import { errorMiddleware, notFoundMiddleware } from "./middlewares";
import { registerRoutes } from "./routes";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");

  registerMiddlewares(app);
  registerRoutes(app);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};