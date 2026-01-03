import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

export const db = globalForPrisma.prisma;
