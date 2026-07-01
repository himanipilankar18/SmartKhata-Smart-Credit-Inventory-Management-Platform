import { createApp } from "./app";
import { connectDatabase, disconnectDatabase, env } from "./config";
import { logger } from "./utils";

const app = createApp();

const shutdown = async (server: ReturnType<typeof app.listen>, signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

const bootstrap = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`SmartKhata backend listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    process.on("SIGINT", () => {
      void shutdown(server, "SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown(server, "SIGTERM");
    });
  } catch (error) {
    logger.error("Failed to start SmartKhata backend", error);
    process.exit(1);
  }
};

void bootstrap();