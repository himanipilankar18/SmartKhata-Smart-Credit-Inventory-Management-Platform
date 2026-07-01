import { Router } from "express";
import { healthController } from "../controllers";
import { asyncHandler } from "../utils";

export const healthRouter = Router();

healthRouter.get("/health", asyncHandler(healthController.getHealth));