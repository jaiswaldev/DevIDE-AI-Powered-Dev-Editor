import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  __dbProxyInitialized?: boolean;
};

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  logger.warn("DATABASE_URL environment variable is not set. DB operations will be no-ops.");
}

if (!globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma = new PrismaClient();
  } catch (err) {
    // If Prisma client cannot be instantiated, log and continue with a stubbed proxy
    logger.warn("Failed to instantiate PrismaClient; DB will be stubbed.", (err as Error).message || err);
    globalForPrisma.prisma = undefined;
  }
}

// Create a lightweight stub for model methods to avoid throwing at runtime when DB is unreachable.
const createModelStub = (modelName: string) => {
  const stub = {
    findMany: async (..._args: any[]) => {
      logger.debug(`DB stub: ${modelName}.findMany called - returning empty array`);
      return [];
    },
    findUnique: async (..._args: any[]) => {
      logger.debug(`DB stub: ${modelName}.findUnique called - returning null`);
      return null;
    },
    findFirst: async (..._args: any[]) => {
      logger.debug(`DB stub: ${modelName}.findFirst called - returning null`);
      return null;
    },
    create: async (..._args: any[]) => {
      logger.warn(`DB stub: ${modelName}.create called while DB is unreachable`);
      return null;
    },
    delete: async (..._args: any[]) => {
      logger.warn(`DB stub: ${modelName}.delete called while DB is unreachable`);
      return null;
    },
    update: async (..._args: any[]) => {
      logger.warn(`DB stub: ${modelName}.update called while DB is unreachable`);
      return null;
    },
  } as any;
  return new Proxy(stub, {
    get(target, prop) {
      if (prop in target) return (target as any)[prop];
      return async () => {
        logger.debug(`DB stub: ${modelName}.${String(prop)} called - no-op`);
        return null;
      };
    },
  });
};

// If Prisma client exists, return it; otherwise return a proxy that provides model stubs.
const prisma = globalForPrisma.prisma;

const wrapModel = (modelName: string, modelObj: any) => {
  return new Proxy(modelObj, {
    get(target, prop) {
      const orig = (target as any)[prop as any];
      if (typeof orig === 'function') {
        return async (...args: any[]) => {
          try {
            return await orig.apply(target, args);
          } catch (err) {
            const msg = (err as any)?.message || String(err);
            logger.warn(`Prisma model call failed: ${modelName}.${String(prop)} - returning safe default.`, { detail: msg });
            // Safe defaults
            if (String(prop) === 'findMany') return [];
            if (String(prop).startsWith('find')) return null;
            return null;
          }
        };
      }
      return orig;
    },
  });
};

const dbProxy = new Proxy(prisma || {}, {
  get(target: any, prop: string | symbol) {
    const key = typeof prop === 'string' ? prop : String(prop);
    if (target && key in target) {
      const modelObj = target[key as any];
      // If it's an object (model), wrap its methods; otherwise return directly.
      if (modelObj && typeof modelObj === 'object') return wrapModel(key, modelObj);
      return modelObj;
    }

    // Fallback stub for unknown models
    return createModelStub(key as string);
  },
});

export const db: any = dbProxy;
