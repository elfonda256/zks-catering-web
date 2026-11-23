import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Every serverless instance opens its own pool; a small cap keeps all instances
// together under the Supabase pooler's client limit.
const POOL_MAX_CONNECTIONS = 3;

const adapter = new PrismaPg({
  connectionString: databaseUrl,
  max: POOL_MAX_CONNECTIONS,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
