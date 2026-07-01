import type { Request, Response } from "express";
import { HTTP_STATUS } from "../constants";
import { healthService } from "../services";
import { sendSuccess } from "../utils";

export const healthController = {
  getHealth: async (_req: Request, res: Response): Promise<void> => {
    const status = await healthService.getStatus();

    sendSuccess(
      res,
      status.message,
      {
        backendRunning: true,
        databaseConnected: status.databaseConnected,
      },
      HTTP_STATUS.OK,
    );
  },
};