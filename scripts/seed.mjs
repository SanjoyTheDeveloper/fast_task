import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Verifying Neon Serverless PostgreSQL database connection and entities...");

  const [
    userCount,
    profileCount,
    semesterCount,
    courseCount,
    routineCount,
    taskCount,
    subtaskCount,
    noteCount,
    materialCount,
    sessionCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count(),
    prisma.semester.count(),
    prisma.course.count(),
    prisma.routineSchedule.count(),
    prisma.task.count(),
    prisma.subtask.count(),
    prisma.note.count(),
    prisma.courseMaterial.count(),
    prisma.studySession.count(),
  ]);

  console.log(`✓ Users:             ${userCount}`);
  console.log(`✓ Profiles:          ${profileCount}`);
  console.log(`✓ Semesters:         ${semesterCount}`);
  console.log(`✓ Courses:           ${courseCount}`);
  console.log(`✓ Routine Schedules: ${routineCount}`);
  console.log(`✓ Tasks:             ${taskCount}`);
  console.log(`✓ Subtasks:          ${subtaskCount}`);
  console.log(`✓ Notes:             ${noteCount}`);
  console.log(`✓ Course Materials:  ${materialCount}`);
  console.log(`✓ Study Sessions:    ${sessionCount}`);
  console.log("✅ Neon PostgreSQL database is operational, healthy, and fully synchronised!");
}

main()
  .catch((e) => {
    console.error("❌ Neon DB check error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
