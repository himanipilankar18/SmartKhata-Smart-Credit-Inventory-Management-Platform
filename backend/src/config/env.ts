import dotenv from "dotenv";
import { z } from "zod";
import { ENVIRONMENTS } from "../constants";

dotenv.config();

const emptyStringToUndefined = (value: unknown) => (value === "" ? undefined : value);

const envSchema = z.object({
  PORT: z.preprocess(emptyStringToUndefined, z.coerce.number().int().positive().default(3001)),
  NODE_ENV: z.preprocess(
    emptyStringToUndefined,
    z.enum([ENVIRONMENTS.DEVELOPMENT, ENVIRONMENTS.TEST, ENVIRONMENTS.PRODUCTION]).default(
      ENVIRONMENTS.DEVELOPMENT,
    ),
  ),
  DATABASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "DATABASE_URL is required"),
  ),
});

const parsedEnv = envSchema.safeParse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
});

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Environment validation failed: ${details.join("; ")}`);
}

export const env = parsedEnv.data;