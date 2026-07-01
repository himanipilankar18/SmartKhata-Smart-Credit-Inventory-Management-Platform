import type { Response } from "express";
import { HTTP_STATUS } from "../constants";
import type { ApiErrorResponse, ApiSuccessResponse } from "../types";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = HTTP_STATUS.OK,
) => {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
) => {
  const payload: ApiErrorResponse = {
    success: false,
    message,
  };

  return res.status(statusCode).json(payload);
};