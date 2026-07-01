import type { EnvironmentName } from "../constants";

export type AppEnvironment = {
  PORT: number;
  NODE_ENV: EnvironmentName;
};