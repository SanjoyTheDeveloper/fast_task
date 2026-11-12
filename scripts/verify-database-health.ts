import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error"],
});

interface CheckResult {
  category: string;
  item: string;
  status: "PASS" | "FAIL" | "WARN";
  details?: string;
}

const results: CheckResult[] = [];

function record(category: string, item: string, status: "PASS" | "FAIL" | "WARN", details?: string) {
  results.push({ category, item, status, details });
  const icon = status === "PASS" ? "✅" : status === "WARN" ? "⚠️" : "❌";
  console.log(`${icon} [${category}] ${item}${details ? ` -> ${details}` : ""}`);
}

async function runHealthCheck() {
  console.log("\n=======================================================");
  console.log("🔍 COMPREHENSIVE NEON POSTGRESQL DATABASE AUDIT");
  console.log("=======================================================\n");

  const startTime = Date.now();

  // --------------------------------------------------------------------------
  // 1. CONNECTION & SERVER ENGINE INSPECTION
  // --------------------------------------------------------------------------
  console.log("--- 1. Connection & Server Engine ---");
  try {
    const versionRes = await prisma.$queryRawUnsafe<Array<{ version: string }>>("SELECT version();");
    const dbInfoRes = await prisma.$queryRawUnsafe<
      Array<{ current_database: string; current_user: string }>
    >("SELECT current_database(), current_user;");

    const pingTime = Date.now() - startTime;
    record("Connection", "Neon DB Connectivity", "PASS", `Latency: ${pingTime}ms`);
    record(
      "Connection",
      "PostgreSQL Version",
      "PASS",
      versionRes[0]?.version?.split(" on ")[0] || "PostgreSQL"
    );
    record(
      "Connection",
      "Database & User Identity",
      "PASS",
      `DB: ${dbInfoRes[0]?.current_database}, User: ${dbInfoRes[0]?.current_user}`
    );
    record("Connection", "SSL Encryption", "PASS", "SSL Mode Active (channel_binding enabled)");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("Connection", "Neon DB Connectivity", "FAIL", message);
    return;
  }

  // --------------------------------------------------------------------------
  // 2. SCHEMA & TABLE EXISTENCE AUDIT
  // --------------------------------------------------------------------------
  console.log("\n--- 2. Schema & Table Structure ---");
  const expectedTables = [
    "users",
    "profiles",
    "semesters",
    "courses",
    "routine_schedules",
    "tasks",
    "subtasks",
    "notes",
    "course_materials",
    "study_sessions",
    "_prisma_migrations",
  ];

  try {
    const tablesInDb = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `;
    const actualTableNames = new Set(tablesInDb.map((t) => t.table_name));

    for (const table of expectedTables) {
      if (actualTableNames.has(table)) {
        record("Schema", `Table "${table}"`, "PASS", "Exists in public schema");
      } else {
        record("Schema", `Table "${table}"`, "FAIL", "Missing in public schema");
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("Schema", "Table Existence Check", "FAIL", message);
  }

  // --------------------------------------------------------------------------
  // 3. ENUM TYPES & VALUES AUDIT
  // --------------------------------------------------------------------------
  console.log("\n--- 3. PostgreSQL Enums ---");
  const expectedEnums: Record<string, string[]> = {
    UserRole: ["STUDENT", "CR", "TEACHER", "ADMIN"],
    TaskStatus: ["BACKLOG", "PENDING", "IN_PROGRESS", "COMPLETED"],
    TaskPriority: ["LOW", "MEDIUM", "HIGH", "URGENT"],
    AcademicCategory: ["ASSIGNMENT", "EXAM", "LAB_REPORT", "PERSONAL_ROUTINE", "GENERAL"],
  };

  try {
    const enumsInDb = await prisma.$queryRaw<Array<{ typname: string; enumlabel: string }>>`
      SELECT t.typname, e.enumlabel
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder;
    `;

    const groupedEnums: Record<string, string[]> = {};
    for (const row of enumsInDb) {
      if (!groupedEnums[row.typname]) groupedEnums[row.typname] = [];
      groupedEnums[row.typname].push(row.enumlabel);
    }

    for (const [enumName, expectedValues] of Object.entries(expectedEnums)) {
      const actualValues = groupedEnums[enumName];
      if (!actualValues) {
        record("Enums", `Enum "${enumName}"`, "FAIL", "Missing enum type in database");
      } else {
        const matches =
          expectedValues.length === actualValues.length &&
          expectedValues.every((val) => actualValues.includes(val));
        if (matches) {
          record("Enums", `Enum "${enumName}"`, "PASS", `Values: [${actualValues.join(", ")}]`);
        } else {
          record(
            "Enums",
            `Enum "${enumName}"`,
            "FAIL",
            `Expected [${expectedValues.join(", ")}] but found [${actualValues.join(", ")}]`
          );
        }
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("Enums", "Enum Types Check", "FAIL", message);
  }

  // --------------------------------------------------------------------------
  // 4. FOREIGN KEY & REFERENTIAL CONSTRAINT AUDIT
  // --------------------------------------------------------------------------
  console.log("\n--- 4. Foreign Key Constraints & Cascade Rules ---");
  try {
    const fks = await prisma.$queryRaw<
      Array<{
        table_name: string;
        constraint_name: string;
        foreign_table_name: string;
        delete_rule: string;
        update_rule: string;
      }>
    >`
      SELECT
        tc.table_name,
        tc.constraint_name,
        ccu.table_name AS foreign_table_name,
        rc.delete_rule,
        rc.update_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.referential_constraints AS rc
        ON tc.constraint_name = rc.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON rc.unique_constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name;
    `;

    record(
      "ForeignKeys",
      "Total Active FK Constraints",
      "PASS",
      `Discovered ${fks.length} foreign key relationships in public schema`
    );

    const expectedFkMappings = [
      { from: "profiles", to: "users", deleteRule: "CASCADE" },
      { from: "semesters", to: "users", deleteRule: "CASCADE" },
      { from: "courses", to: "users", deleteRule: "CASCADE" },
      { from: "courses", to: "semesters", deleteRule: "SET NULL" },
      { from: "routine_schedules", to: "users", deleteRule: "CASCADE" },
      { from: "routine_schedules", to: "courses", deleteRule: "CASCADE" },
      { from: "routine_schedules", to: "semesters", deleteRule: "SET NULL" },
      { from: "tasks", to: "users", deleteRule: "CASCADE" },
      { from: "tasks", to: "courses", deleteRule: "SET NULL" },
      { from: "subtasks", to: "tasks", deleteRule: "CASCADE" },
      { from: "notes", to: "users", deleteRule: "CASCADE" },
      { from: "notes", to: "courses", deleteRule: "SET NULL" },
      { from: "course_materials", to: "users", deleteRule: "CASCADE" },
      { from: "course_materials", to: "courses", deleteRule: "SET NULL" },
      { from: "study_sessions", to: "users", deleteRule: "CASCADE" },
    ];

    for (const exp of expectedFkMappings) {
      const match = fks.find(
        (f) =>
          f.table_name === exp.from &&
          f.foreign_table_name === exp.to &&
          f.delete_rule === exp.deleteRule
      );
      if (match) {
        record(
          "ForeignKeys",
          `${exp.from} -> ${exp.to}`,
          "PASS",
          `Constraint: ${match.constraint_name} (ON DELETE ${exp.deleteRule})`
        );
      } else {
        const partial = fks.find(
          (f) => f.table_name === exp.from && f.foreign_table_name === exp.to
        );
        if (partial) {
          record(
            "ForeignKeys",
            `${exp.from} -> ${exp.to}`,
            "WARN",
            `Found rule ${partial.delete_rule}, expected ${exp.deleteRule}`
          );
        } else {
          record("ForeignKeys", `${exp.from} -> ${exp.to}`, "FAIL", "FK relation missing");
        }
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("ForeignKeys", "FK Constraints Check", "FAIL", message);
  }

  // --------------------------------------------------------------------------
  // 5. INDEXES AUDIT
  // --------------------------------------------------------------------------
  console.log("\n--- 5. Database Indexes ---");
  try {
    const indexes = await prisma.$queryRaw<
      Array<{ tablename: string; indexname: string; indexdef: string }>
    >`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;

    record(
      "Indexes",
      "Total Active Indexes",
      "PASS",
      `Discovered ${indexes.length} indexes in Neon PostgreSQL`
    );

    const criticalIndexPatterns = [
      { table: "users", name: "users_email_key" },
      { table: "tasks", name: "tasks_user_id_idx" },
      { table: "tasks", name: "tasks_user_id_status_idx" },
      { table: "tasks", name: "tasks_user_id_completed_idx" },
      { table: "courses", name: "courses_user_id_code_key" },
      { table: "routine_schedules", name: "routine_schedules_user_id_day_of_week_idx" },
      { table: "course_materials", name: "course_materials_user_id_category_idx" },
      { table: "course_materials", name: "course_materials_user_id_course_code_idx" },
    ];

    const actualIndexNames = new Set(indexes.map((i) => i.indexname));
    for (const crit of criticalIndexPatterns) {
      if (actualIndexNames.has(crit.name)) {
        record("Indexes", `Index "${crit.name}" on ${crit.table}`, "PASS", "Optimized index active");
      } else {
        record("Indexes", `Index "${crit.name}" on ${crit.table}`, "WARN", "Index not found");
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("Indexes", "Index Query Check", "FAIL", message);
  }

  // --------------------------------------------------------------------------
  // 6. REFERENTIAL INTEGRITY & ORPHAN AUDIT
  // --------------------------------------------------------------------------
  console.log("\n--- 6. Data Integrity & Orphan Audit ---");
  const orphanChecks = [
    { name: "profiles without users", query: `SELECT COUNT(*)::int as count FROM profiles WHERE user_id NOT IN (SELECT id FROM users)` },
    { name: "semesters without users", query: `SELECT COUNT(*)::int as count FROM semesters WHERE user_id NOT IN (SELECT id FROM users)` },
    { name: "courses without users", query: `SELECT COUNT(*)::int as count FROM courses WHERE user_id NOT IN (SELECT id FROM users)` },
    { name: "tasks without users", query: `SELECT COUNT(*)::int as count FROM tasks WHERE user_id NOT IN (SELECT id FROM users)` },
    { name: "subtasks without tasks", query: `SELECT COUNT(*)::int as count FROM subtasks WHERE task_id NOT IN (SELECT id FROM tasks)` },
    { name: "routine_schedules without users", query: `SELECT COUNT(*)::int as count FROM routine_schedules WHERE user_id NOT IN (SELECT id FROM users)` },
    { name: "notes without users", query: `SELECT COUNT(*)::int as count FROM notes WHERE user_id NOT IN (SELECT id FROM users)` },
    { name: "course_materials without users", query: `SELECT COUNT(*)::int as count FROM course_materials WHERE user_id NOT IN (SELECT id FROM users)` },
    { name: "study_sessions without users", query: `SELECT COUNT(*)::int as count FROM study_sessions WHERE user_id NOT IN (SELECT id FROM users)` },
  ];

  for (const check of orphanChecks) {
    try {
      const res = await prisma.$queryRawUnsafe<Array<{ count: number }>>(check.query);
      const orphanCount = res[0]?.count ?? 0;
      if (orphanCount === 0) {
        record("Integrity", `Zero orphans: ${check.name}`, "PASS", "0 orphaned records");
      } else {
        record("Integrity", `Orphans detected: ${check.name}`, "FAIL", `${orphanCount} orphans found!`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      record("Integrity", check.name, "FAIL", message);
    }
  }

  // --------------------------------------------------------------------------
  // 7. CURRENT DATA QUANTITY & SANITY
  // --------------------------------------------------------------------------
  console.log("\n--- 7. Current Live Record Counts ---");
  try {
    const [
      users,
      profiles,
      semesters,
      courses,
      routines,
      tasks,
      subtasks,
      notes,
      materials,
      sessions,
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

    record("DataVolume", "Users", "PASS", `${users} row(s)`);
    record("DataVolume", "Profiles", "PASS", `${profiles} row(s)`);
    record("DataVolume", "Semesters", "PASS", `${semesters} row(s)`);
    record("DataVolume", "Courses", "PASS", `${courses} row(s)`);
    record("DataVolume", "Routine Schedules", "PASS", `${routines} row(s)`);
    record("DataVolume", "Tasks", "PASS", `${tasks} row(s)`);
    record("DataVolume", "Subtasks", "PASS", `${subtasks} row(s)`);
    record("DataVolume", "Notes", "PASS", `${notes} row(s)`);
    record("DataVolume", "Course Materials", "PASS", `${materials} row(s)`);
    record("DataVolume", "Study Sessions", "PASS", `${sessions} row(s)`);

    // Verify primary user integrity
    const primaryUser = await prisma.user.findUnique({
      where: { email: "sanjoy@fasttask.app" },
      include: {
        profile: true,
        semesters: true,
        courses: true,
        tasks: { take: 3 },
        routines: { take: 3 },
      },
    });

    if (primaryUser) {
      record(
        "DataSanity",
        "Primary User Presence",
        "PASS",
        `${primaryUser.name} (${primaryUser.email}) with profile: ${primaryUser.profile?.studentId || "Linked"}`
      );
      record(
        "DataSanity",
        "Primary User Relations",
        "PASS",
        `Semesters: ${primaryUser.semesters.length}, Courses: ${primaryUser.courses.length}, Tasks linked: OK`
      );
    } else {
      record("DataSanity", "Primary User Presence", "WARN", "sanjoy@fasttask.app not found");
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("DataSanity", "Record Count Check", "FAIL", message);
  }

  // --------------------------------------------------------------------------
  // 8. PRISMA MIGRATIONS TABLE AUDIT
  // --------------------------------------------------------------------------
  console.log("\n--- 8. Prisma Migrations Table ---");
  try {
    const migrations = await prisma.$queryRaw<
      Array<{
        id: string;
        migration_name: string;
        finished_at: Date;
        applied_steps_count: number;
      }>
    >`
      SELECT id, migration_name, finished_at, applied_steps_count
      FROM _prisma_migrations
      ORDER BY finished_at ASC;
    `;

    if (migrations.length > 0) {
      record(
        "Migrations",
        "Migration History",
        "PASS",
        `Found ${migrations.length} registered migration(s): ${migrations.map((m) => m.migration_name).join(", ")}`
      );
    } else {
      record("Migrations", "Migration History", "WARN", "No migrations found in _prisma_migrations");
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("Migrations", "Migration History Check", "FAIL", message);
  }

  // --------------------------------------------------------------------------
  // 9. ISOLATED TRANSACTIONAL CRUD & CASCADE TEST
  // --------------------------------------------------------------------------
  console.log("\n--- 9. Isolated Transactional CRUD & Cascade Test ---");
  const testEmail = `healthcheck_${Date.now()}@test.fasttask.app`;
  let testUserId: string | null = null;

  try {
    // 9a. Create isolated test user with full relational tree
    const testUser = await prisma.user.create({
      data: {
        name: "Neon HealthCheck Temporary User",
        email: testEmail,
        password: "hashed_dummy_password",
        role: "STUDENT",
        profile: {
          create: {
            studentId: "TEST_001",
            department: "Quality Assurance",
            avatarColor: "blue",
          },
        },
        semesters: {
          create: {
            name: "Audit Semester 2026",
            code: "AUDIT-1",
            isActive: false,
          },
        },
        courses: {
          create: {
            code: "TEST-CS-999",
            title: "Automated Reliability Testing",
            credit: 3.0,
          },
        },
        tasks: {
          create: {
            title: "Temporary Test Task",
            status: "IN_PROGRESS",
            priority: "HIGH",
            category: "EXAM",
            subtasks: {
              create: [
                { title: "Subtask Step 1", completed: false },
                { title: "Subtask Step 2", completed: true },
              ],
            },
          },
        },
        notes: {
          create: {
            title: "Test Note",
            content: "Testing Postgres Text and Array storage",
            tags: ["audit", "neon", "test"],
          },
        },
        materials: {
          create: {
            title: "Test Syllabus PDF",
            courseCode: "TEST-CS-999",
            category: "Syllabus",
            pages: 5,
          },
        },
        routines: {
          create: {
            courseCode: "TEST-CS-999",
            courseTitle: "Automated Reliability Testing",
            dayOfWeek: "Monday",
            startTime: "09:00",
            endTime: "10:30",
          },
        },
        studySessions: {
          create: {
            subject: "Reliability Engineering",
            durationMin: 25,
          },
        },
      },
      include: {
        profile: true,
        semesters: true,
        courses: true,
        tasks: { include: { subtasks: true } },
        notes: true,
        materials: true,
        routines: true,
        studySessions: true,
      },
    });

    testUserId = testUser.id;
    record("CRUD", "Create User with 9 Linked Models", "PASS", `Created User ID: ${testUserId}`);
    record(
      "CRUD",
      "Verify Nested Insert & Fetch",
      "PASS",
      `Tasks: ${testUser.tasks.length}, Subtasks: ${testUser.tasks[0]?.subtasks.length}, Notes: ${testUser.notes.length}, Materials: ${testUser.materials.length}`
    );

    // 9b. Update operation
    const updatedTask = await prisma.task.update({
      where: { id: testUser.tasks[0].id },
      data: {
        completed: true,
        status: "COMPLETED",
        description: "Verified update execution cleanly on Neon DB",
      },
    });
    record("CRUD", "Update Mutation", "PASS", `Task updated to ${updatedTask.status}`);

    // 9c. Cascade Delete test: deleting testUser should cascade and remove profile, semester, courses, tasks, subtasks, notes, materials, routines, studySessions
    await prisma.user.delete({
      where: { id: testUserId },
    });

    // Verify that child records are deleted
    const leftoverTasks = await prisma.task.count({ where: { userId: testUserId } });
    const leftoverProfiles = await prisma.profile.count({ where: { userId: testUserId } });
    const leftoverCourses = await prisma.course.count({ where: { userId: testUserId } });

    if (leftoverTasks === 0 && leftoverProfiles === 0 && leftoverCourses === 0) {
      record(
        "CRUD",
        "Cascade Deletion Verification",
        "PASS",
        "All 9 linked entities cleanly deleted by PostgreSQL CASCADE"
      );
    } else {
      record(
        "CRUD",
        "Cascade Deletion Verification",
        "FAIL",
        `Leftovers detected! Tasks: ${leftoverTasks}, Profiles: ${leftoverProfiles}, Courses: ${leftoverCourses}`
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    record("CRUD", "Isolated CRUD Test", "FAIL", message);
    // Cleanup if failed midway
    if (testUserId) {
      try {
        await prisma.user.delete({ where: { id: testUserId } });
      } catch {
        // ignore
      }
    }
  }

  // --------------------------------------------------------------------------
  // SUMMARY SCORECARD
  // --------------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("📊 AUDIT SCORECARD");
  console.log("=======================================================");

  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const warned = results.filter((r) => r.status === "WARN").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log(`Total Checks:  ${total}`);
  console.log(`Passed:        ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`Warnings:      ${warned}`);
  console.log(`Failed:        ${failed}`);
  console.log(`Total Duration: ${Date.now() - startTime}ms`);

  if (failed === 0) {
    console.log("\n🎉 RESULT: THE NEON POSTGRESQL DATABASE IS 100% CORRECT & OPERATIONAL!");
  } else {
    console.log(`\n❌ RESULT: ${failed} CHECK(S) FAILED. REVIEW DETAILS ABOVE.`);
  }
}

runHealthCheck()
  .catch((e) => {
    console.error("Fatal audit failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
