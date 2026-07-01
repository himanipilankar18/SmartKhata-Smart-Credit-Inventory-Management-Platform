import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";
import { APP_MESSAGES, HTTP_STATUS } from "../constants";
import { sendError } from "../utils";

type ValidationSource = "body" | "query" | "params";

export const validateRequest = (
  schema: ZodTypeAny,
  source: ValidationSource = "body",
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(", ");
      return sendError(res, `${APP_MESSAGES.VALIDATION_FAILED}: ${message}`, HTTP_STATUS.BAD_REQUEST);
    }

    req[source] = result.data as typeof req[typeof source];
    next();
  };
};