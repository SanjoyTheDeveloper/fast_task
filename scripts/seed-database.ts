import { PrismaClient, TaskStatus, TaskPriority, AcademicCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("🚀 Starting database population with authentic FastTask academic data...");

  // 1. Create or retrieve primary Student User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const email = "sanjoy@fasttask.app";

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Sanjoy Chandro Bhowmick",
        email,
        password: hashedPassword,
        emailVerified: new Date(),
        role: "STUDENT",
        profile: {
          create: {
            studentId: "0611CSE321",
            department: "Computer Science & Engineering",
            batch: "CSE-2026",
            avatarColor: "purple",
            bio: "Computer Science student specializing in AI algorithms, distributed systems, and modern web architectures.",
          },
        },
      },
    });
    console.log(`✅ Created student user: ${user.name} (${user.email})`);
  } else {
    console.log(`ℹ️ User already exists: ${user.name} (${user.email})`);
  }

  // 2. Create Active Semester
  let semester = await prisma.semester.findFirst({
    where: { userId: user.id, isActive: true },
  });

  if (!semester) {
    semester = await prisma.semester.create({
      data: {
        userId: user.id,
        name: "Spring 2026",
        code: "2026-1",
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-06-30"),
        isActive: true,
      },
    });
    console.log(`✅ Created semester: ${semester.name}`);
  }

  // 3. Create Academic Courses
  const courseData = [
    {
      code: "0611CSE321",
      title: "Artificial Intelligence & Expert Systems",
      credit: 3.0,
      color: "#315BFF",
      instructor: "Dr. A. Rahman",
    },
    {
      code: "0613CSE333",
      title: "Advanced Programming & Architecture",
      credit: 3.0,
      color: "#8C6BD4",
      instructor: "Prof. K. Hasan",
    },
    {
      code: "0541MAT337",
      title: "Discrete Mathematics & Graph Theory",
      credit: 3.0,
      color: "#22C55E",
      instructor: "Dr. S. Sultana",
    },
    {
      code: "0612CSE315",
      title: "Computer Networks & Protocols",
      credit: 3.0,
      color: "#F59E0B",
      instructor: "Engr. M. Islam",
    },
  ];

  const coursesMap = new Map<string, string>();
  for (const c of courseData) {
    let course = await prisma.course.findFirst({
      where: { userId: user.id, code: c.code },
    });
    if (!course) {
      course = await prisma.course.create({
        data: {
          userId: user.id,
          semesterId: semester.id,
          code: c.code,
          title: c.title,
          credit: c.credit,
          color: c.color,
          instructor: c.instructor,
        },
      });
      console.log(`✅ Created course: ${course.code} - ${course.title}`);
    }
    coursesMap.set(c.code, course.id);
  }

  // 4. Create Academic Routine Schedules
  const routineData = [
    {
      courseCode: "0611CSE321",
      courseTitle: "Artificial Intelligence & Expert Systems",
      dayOfWeek: "Sunday",
      startTime: "09:00",
      endTime: "10:30",
      roomNo: "Lab 402",
      instructor: "Dr. A. Rahman",
    },
    {
      courseCode: "0613CSE333",
      courseTitle: "Advanced Programming & Architecture",
      dayOfWeek: "Sunday",
      startTime: "11:00",
      endTime: "12:30",
      roomNo: "Room 305",
      instructor: "Prof. K. Hasan",
    },
    {
      courseCode: "0541MAT337",
      courseTitle: "Discrete Mathematics & Graph Theory",
      dayOfWeek: "Tuesday",
      startTime: "10:00",
      endTime: "11:30",
      roomNo: "Room 201",
      instructor: "Dr. S. Sultana",
    },
    {
      courseCode: "0612CSE315",
      courseTitle: "Computer Networks & Protocols",
      dayOfWeek: "Wednesday",
      startTime: "14:00",
      endTime: "15:30",
      roomNo: "Lab 501",
      instructor: "Engr. M. Islam",
    },
  ];

  for (const r of routineData) {
    const existing = await prisma.routineSchedule.findFirst({
      where: { userId: user.id, courseCode: r.courseCode, dayOfWeek: r.dayOfWeek },
    });
    if (!existing) {
      await prisma.routineSchedule.create({
        data: {
          userId: user.id,
          semesterId: semester.id,
          courseId: coursesMap.get(r.courseCode),
          ...r,
        },
      });
      console.log(`✅ Added routine slot: ${r.dayOfWeek} ${r.startTime} - ${r.courseCode}`);
    }
  }

  // 5. Populate Tasks in Database
  const tasksData = [
    {
      title: "AI Search Algorithm Implementations (A* & Minimax Alpha-Beta)",
      description: "Implement graph state space search heuristics and minimax adversarial search.",
      completed: false,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      category: AcademicCategory.ASSIGNMENT,
      courseCode: "0611CSE321",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
    },
    {
      title: "Advanced Programming Lab Report: Socket Communication",
      description: "Complete socket client-server multi-client concurrency benchmark.",
      completed: false,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      category: AcademicCategory.LAB_REPORT,
      courseCode: "0613CSE333",
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Computer Networks Packet Sniffing & WireShark Analysis",
      description: "Analyze TCP 3-way handshake and DNS request response traces.",
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      category: AcademicCategory.ASSIGNMENT,
      courseCode: "0612CSE315",
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Discrete Mathematics Proofs: Graph Theory & Trees",
      description: "Formal mathematical proofs for Eulerian paths and bipartite graph coloring.",
      completed: true,
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.LOW,
      category: AcademicCategory.ASSIGNMENT,
      courseCode: "0541MAT337",
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Midterm Preparation: AI State Space Search & Heuristics",
      description: "Review chapters 3-6 of Russell & Norvig AI textbook.",
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      category: AcademicCategory.EXAM,
      courseCode: "0611CSE321",
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Operating Systems Concurrency & Semaphores Assignment",
      description: "Dining philosophers problem solution using POSIX semaphores and mutexes.",
      completed: true,
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      category: AcademicCategory.ASSIGNMENT,
      courseCode: "0611CSE321",
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Web Engineering User Authentication & JWT Architecture",
      description: "Implement Auth.js session handling with bcrypt password hashing.",
      completed: false,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      category: AcademicCategory.ASSIGNMENT,
      courseCode: "0613CSE333",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Algorithm Design: Dynamic Programming & Greedy Proofs",
      description: "Longest common subsequence and optimal binary search tree implementations.",
      completed: true,
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      category: AcademicCategory.ASSIGNMENT,
      courseCode: "0611CSE321",
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Database Indexing & Query Plan Optimization Lab",
      description: "Analyze EXPLAIN ANALYZE execution costs with B-Tree vs Hash indexes.",
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      category: AcademicCategory.LAB_REPORT,
      courseCode: "0613CSE333",
      dueDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Weekly Academic Routine & Timetable Synchronization",
      description: "Synchronize class schedule and set reminder notifications.",
      completed: true,
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.LOW,
      category: AcademicCategory.PERSONAL_ROUTINE,
      courseCode: "General",
      dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Past Due: Literature Review on Neural Networks",
      description: "Early research draft writeup for final year project proposal.",
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      category: AcademicCategory.ASSIGNMENT,
      courseCode: "0611CSE321",
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue!
    },
  ];

  for (const t of tasksData) {
    const existing = await prisma.task.findFirst({
      where: { userId: user.id, title: t.title },
    });
    if (!existing) {
      const courseId = coursesMap.get(t.courseCode) || null;
      await prisma.task.create({
        data: {
          userId: user.id,
          courseId,
          title: t.title,
          description: t.description,
          completed: t.completed,
          status: t.status,
          priority: t.priority,
          category: t.category,
          dueDate: t.dueDate,
        },
      });
      console.log(`✅ Seeded task in database: "${t.title}"`);
    }
  }

  const finalTaskCount = await prisma.task.count({ where: { userId: user.id } });
  console.log(`\n🎉 Success! Database now contains ${finalTaskCount} live tasks for user ${user.name}`);
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
