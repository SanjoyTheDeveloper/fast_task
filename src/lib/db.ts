// Single canonical Prisma Client singleton & resilient DB accessor
import { prisma, db } from "@/database/db";

export { prisma, db };
export default prisma;
