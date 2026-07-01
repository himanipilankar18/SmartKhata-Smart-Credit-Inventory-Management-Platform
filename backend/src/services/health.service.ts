import { APP_MESSAGES } from "../constants";
import type { HealthStatus } from "../interfaces";
import { verifyDatabaseConnection } from "../utils";

export const healthService = {
  getStatus: async (): Promise<HealthStatus> => {
    const databaseHealth = await verifyDatabaseConnection();

    return {
      message: APP_MESSAGES.BACKEND_RUNNING,
      databaseConnected: databaseHealth.connected,
    };
  },
};