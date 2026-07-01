import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { env } from "./env";

let prismaClient: PrismaClient | undefined;
let pool: Pool | undefined;

const getPool = () => {
  if (!pool) {
    pool = new Pool({ connectionString: env.DATABASE_URL });
  }

  return pool;
};

export const getPrismaClient = () => {
  if (!prismaClient) {
    const adapter = new PrismaPg(getPool());
    prismaClient = new PrismaClient({
      adapter,
      log: env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
    });
  }

  return prismaClient;
};

export const connectDatabase = async () => {
  const prisma = getPrismaClient();
  await prisma.$connect();
  return prisma;
};

export const disconnectDatabase = async () => {
  if (!prismaClient) {
    if (pool) {
      await pool.end();
      pool = undefined;
    }
    return;
  }

  await prismaClient.$disconnect();
  prismaClient = undefined;

  if (pool) {
    await pool.end();
    pool = undefined;
  }
};