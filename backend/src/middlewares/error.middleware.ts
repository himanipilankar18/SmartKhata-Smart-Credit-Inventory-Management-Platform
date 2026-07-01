import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { APP_MESSAGES, HTTP_STATUS } from "../constants";
import { env } from "../config";
import { AppError, sendError } from "../utils";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (res.headersSent) {
    return;
  }

  if (error instanceof AppError) {
    return sendError(res, error.message, error.statusCode);
  }

  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join(", ");
    return sendError(res, `${APP_MESSAGES.VALIDATION_FAILED}: ${message}`, HTTP_STATUS.BAD_REQUEST);
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return sendError(res, APP_MESSAGES.SOMETHING_WENT_WRONG, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};