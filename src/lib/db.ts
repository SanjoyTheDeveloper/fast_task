import { PrismaClient } from "@prisma/client";

// Global singleton pattern to prevent multiple Prisma Client instances in Next.js development hot reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export db helper to maintain backward compatibility with existing components and mock store
export { db } from "@/database/db";
export default prisma;
