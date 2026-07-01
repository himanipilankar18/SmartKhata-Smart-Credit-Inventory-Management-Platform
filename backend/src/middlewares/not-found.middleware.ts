import type { Request, Response } from "express";
import { APP_MESSAGES, HTTP_STATUS } from "../constants";
import { sendError } from "../utils";

export const notFoundMiddleware = (_req: Request, res: Response) => {
  return sendError(res, APP_MESSAGES.ROUTE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
};