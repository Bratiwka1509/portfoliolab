import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type PrismaGlobal = {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const globalForPrisma = globalThis as unknown as PrismaGlobal;

function getPool() {
  if (globalForPrisma.pgPool) return globalForPrisma.pgPool;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;
  return pool;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(getPool()),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

