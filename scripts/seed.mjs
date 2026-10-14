import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Verifying PostgreSQL database connection and records...");

  const userCount = await prisma.user.count();
  const taskCount = await prisma.task.count();

  console.log(`✓ Current users in database: ${userCount}`);
  console.log(`✓ Current tasks in database: ${taskCount}`);
  console.log("✅ Database is ready and operational!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
