import { AppError } from "./app-error";
import { HTTP_STATUS, APP_MESSAGES } from "../constants";
import { getPrismaClient } from "../config/prisma";

export type DatabaseHealth = {
  connected: boolean;
};

export const verifyDatabaseConnection = async (): Promise<DatabaseHealth> => {
  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error) {
    throw new AppError(
      `${APP_MESSAGES.SOMETHING_WENT_WRONG}: failed to connect to PostgreSQL`,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};