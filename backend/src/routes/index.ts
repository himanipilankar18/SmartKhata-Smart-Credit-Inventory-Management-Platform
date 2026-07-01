import type { Express } from "express";
import { apiRouter } from "./api.routes";

export const registerRoutes = (app: Express) => {
  app.use("/api", apiRouter);
};