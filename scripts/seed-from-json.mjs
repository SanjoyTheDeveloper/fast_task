/**
 * Safe Data Migration Script: JSON -> Supabase PostgreSQL via Prisma
 *
 * Reads existing users.json and tasks.json without modifying or deleting them,
 * and upserts all records into the PostgreSQL database using Prisma Client.
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const DATA_DIR = path.join(__dirname, "..", "src", "database", "local_data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

async function main() {
  console.log("🚀 Starting data migration from local JSON to PostgreSQL...\n");

  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL environment variable is not defined.");
    process.exit(1);
  }

  // 1. Read Users
  if (!fs.existsSync(USERS_FILE)) {
    console.warn(`⚠️ Warning: Users file not found at ${USERS_FILE}`);
  } else {
    const rawUsers = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    console.log(`Found ${rawUsers.length} user record(s) in users.json.`);

    let importedUsers = 0;
    for (const u of rawUsers) {
      const email = u.email.toLowerCase().trim();
      const emailVerified = u.emailVerified ? new Date(u.emailVerified) : null;
      const verificationTokenExpires = u.verificationTokenExpires
        ? new Date(u.verificationTokenExpires)
        : null;
      const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();
      const updatedAt = u.updatedAt ? new Date(u.updatedAt) : new Date();

      await prisma.user.upsert({
        where: { email },
        update: {
          name: u.name,
          password: u.password,
          emailVerified,
          verificationToken: u.verificationToken || null,
          verificationTokenExpires,
          updatedAt,
        },
        create: {
          id: u.id,
          name: u.name,
          email,
          password: u.password,
          emailVerified,
          verificationToken: u.verificationToken || null,
          verificationTokenExpires,
          createdAt,
          updatedAt,
        },
      });
      importedUsers++;
      console.log(`  ✓ User processed: ${email} (${u.id})`);
    }
    console.log(`✅ Successfully migrated ${importedUsers} user(s).\n`);
  }

  // 2. Read Tasks
  if (!fs.existsSync(TASKS_FILE)) {
    console.warn(`⚠️ Warning: Tasks file not found at ${TASKS_FILE}`);
  } else {
    const rawTasks = JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));
    console.log(`Found ${rawTasks.length} task record(s) in tasks.json.`);

    // Fetch existing users to ensure foreign key integrity
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    if (allUsers.length === 0) {
      console.error("❌ No users found in database. Cannot associate tasks without a valid user.");
      process.exit(1);
    }

    const fallbackUserId = allUsers[0].id;
    let importedTasks = 0;

    for (const t of rawTasks) {
      const targetUser = allUsers.find((u) => u.id === t.userId);
      const userId = targetUser ? targetUser.id : fallbackUserId;

      const isCompleted = Boolean(t.completed ?? t.status === "COMPLETED");
      const status = t.status || (isCompleted ? "COMPLETED" : "PENDING");
      const priority = t.priority || "MEDIUM";
      const dueDate = t.dueDate ? new Date(t.dueDate) : null;
      const createdAt = t.createdAt ? new Date(t.createdAt) : new Date();
      const updatedAt = t.updatedAt ? new Date(t.updatedAt) : new Date();

      await prisma.task.upsert({
        where: { id: t.id },
        update: {
          title: t.title,
          description: t.description || null,
          completed: isCompleted,
          status,
          priority,
          dueDate,
          userId,
          updatedAt,
        },
        create: {
          id: t.id,
          title: t.title,
          description: t.description || null,
          completed: isCompleted,
          status,
          priority,
          dueDate,
          userId,
          createdAt,
          updatedAt,
        },
      });
      importedTasks++;
      console.log(`  ✓ Task processed: "${t.title}" -> User: ${userId}`);
    }
    console.log(`✅ Successfully migrated ${importedTasks} task(s).\n`);
  }

  console.log("🎉 Migration finished successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Migration failed with error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
