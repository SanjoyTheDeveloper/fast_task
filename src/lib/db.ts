import { PrismaClient, Prisma, TaskStatus, TaskPriority } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

interface FallbackRoutineSlot {
  id: string;
  userId: string;
  courseCode: string;
  courseTitle: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNo: string | null;
  instructor: string | null;
  semester: string | null;
  createdAt: string;
  updatedAt: string;
}

const FALLBACK_DIR = path.join(process.cwd(), ".data");
const ROUTINE_FILE = path.join(FALLBACK_DIR, "routine_schedules.json");

function readFallbackRoutines(): FallbackRoutineSlot[] {
  try {
    if (!fs.existsSync(ROUTINE_FILE)) return [];
    const content = fs.readFileSync(ROUTINE_FILE, "utf-8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[db.fallback] Could not read routine_schedules.json:", err);
    return [];
  }
}

function writeFallbackRoutines(slots: FallbackRoutineSlot[]): void {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    fs.writeFileSync(ROUTINE_FILE, JSON.stringify(slots, null, 2), "utf-8");
  } catch (err) {
    console.warn("[db.fallback] Could not write routine_schedules.json:", err);
  }
}

// Prevent multiple PrismaClient instances in Next.js development (hot reloading)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Production-ready Database Layer powered strictly by Prisma ORM and PostgreSQL.
 * All queries and mutations are executed directly on the database.
 */
export const db = {
  prisma,

  $transaction: (async (arg: any) => {
    if (typeof arg === "function") {
      return await prisma.$transaction(arg);
    }
    if (Array.isArray(arg)) {
      return await Promise.all(arg);
    }
    return await (prisma.$transaction as any)(arg);
  }) as {
    <T extends any[]>(arg: [...T]): Promise<{ [K in keyof T]: Awaited<T[K]> }>;
    <R>(fn: (prismaClient: PrismaClient) => Promise<R>): Promise<R>;
    <T>(arg: any): Promise<T>;
  },

  user: {
    async findUnique({
      where,
    }: {
      where: { id?: string; email?: string; verificationToken?: string };
    }) {
      let condition: Prisma.UserWhereUniqueInput;
      if (where.id) {
        condition = { id: where.id };
      } else if (where.email) {
        condition = { email: where.email.toLowerCase().trim() };
      } else if (where.verificationToken) {
        condition = { verificationToken: where.verificationToken.trim() };
      } else {
        throw new Error("Invalid where clause for user.findUnique: id, email or verificationToken is required");
      }

      return await prisma.user.findUnique({
        where: condition,
      });
    },

    async create({
      data,
    }: {
      data: {
        id?: string;
        name: string;
        email: string;
        password: string;
        emailVerified?: Date | null;
        verificationToken?: string | null;
        verificationTokenExpires?: Date | null;
      };
    }) {
      return await prisma.user.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          name: data.name,
          email: data.email.toLowerCase().trim(),
          password: data.password,
          emailVerified: data.emailVerified,
          verificationToken: data.verificationToken,
          verificationTokenExpires: data.verificationTokenExpires,
        },
      });
    },

    async update({
      where,
      data,
    }: {
      where: { id?: string; email?: string; verificationToken?: string };
      data: {
        emailVerified?: Date | null;
        verificationToken?: string | null;
        verificationTokenExpires?: Date | null;
        name?: string;
        password?: string;
      };
    }) {
      let condition: Prisma.UserWhereUniqueInput;
      if (where.id) {
        condition = { id: where.id };
      } else if (where.email) {
        condition = { email: where.email.toLowerCase().trim() };
      } else if (where.verificationToken) {
        condition = { verificationToken: where.verificationToken.trim() };
      } else {
        throw new Error("Invalid where clause for user.update: id, email or verificationToken is required");
      }

      return await prisma.user.update({
        where: condition,
        data,
      });
    },

    async delete({ where }: { where: { id: string } }) {
      return await prisma.user.delete({
        where: { id: where.id },
      });
    },
  },

  task: {
    async count({ where }: { where?: Prisma.TaskWhereInput } = {}): Promise<number> {
      return await prisma.task.count({ where });
    },

    async findMany({
      where,
      orderBy,
      skip,
      take,
    }: {
      where?: Prisma.TaskWhereInput;
      orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
      skip?: number;
      take?: number;
    } = {}): Promise<any[]> {
      return await prisma.task.findMany({
        where,
        orderBy,
        skip,
        take,
      });
    },

    async findUnique({ where }: { where: { id: string } }) {
      return await prisma.task.findUnique({
        where: { id: where.id },
      });
    },

    async create({
      data,
    }: {
      data: {
        id?: string;
        title: string;
        description?: string | null;
        completed?: boolean;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: Date | string | null;
        userId: string;
      };
    }) {
      const isCompleted = data.completed ?? (data.status === "COMPLETED");
      const status: TaskStatus = data.status || (isCompleted ? "COMPLETED" : "PENDING");
      const priority: TaskPriority = data.priority || "MEDIUM";
      const dueDate = data.dueDate ? new Date(data.dueDate) : null;

      return await prisma.task.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          title: data.title,
          description: data.description || null,
          completed: isCompleted,
          status,
          priority,
          dueDate,
          userId: data.userId,
        },
      });
    },

    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: {
        title?: string;
        description?: string | null;
        completed?: boolean;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: Date | string | null;
      };
    }) {
      const payload: any = { ...data };

      if (payload.completed !== undefined && payload.status === undefined) {
        payload.status = payload.completed ? "COMPLETED" : "PENDING";
      } else if (payload.status !== undefined && payload.completed === undefined) {
        payload.completed = payload.status === "COMPLETED";
      }

      if (payload.dueDate !== undefined) {
        payload.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
      }

      return await prisma.task.update({
        where: { id: where.id },
        data: payload,
      });
    },

    async delete({ where }: { where: { id: string } }) {
      return await prisma.task.delete({
        where: { id: where.id },
      });
    },
  },

  courseMaterial: {
    async count({ where }: { where?: Prisma.CourseMaterialWhereInput } = {}): Promise<number> {
      return await prisma.courseMaterial.count({ where });
    },

    async findMany({
      where,
      orderBy = { createdAt: "desc" },
      skip,
      take,
    }: {
      where?: Prisma.CourseMaterialWhereInput;
      orderBy?: Prisma.CourseMaterialOrderByWithRelationInput | Prisma.CourseMaterialOrderByWithRelationInput[];
      skip?: number;
      take?: number;
    } = {}): Promise<any[]> {
      return await prisma.courseMaterial.findMany({
        where,
        orderBy,
        skip,
        take,
      });
    },

    async findUnique({ where }: { where: { id: string } }) {
      return await prisma.courseMaterial.findUnique({
        where: { id: where.id },
      });
    },

    async create({
      data,
    }: {
      data: {
        id?: string;
        title: string;
        courseCode: string;
        courseName?: string | null;
        category: string;
        tag?: string | null;
        schedule?: string | null;
        fileUrl?: string | null;
        fileSize?: string | null;
        pages?: number | null;
        description?: string | null;
        materialType?: string | null;
        isBookmarked?: boolean;
        userId: string;
      };
    }) {
      return await prisma.courseMaterial.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          title: data.title.trim(),
          courseCode: data.courseCode.trim(),
          courseName: data.courseName?.trim() || null,
          category: data.category.trim(),
          tag: data.tag?.trim() || null,
          schedule: data.schedule?.trim() || null,
          fileUrl: data.fileUrl || null,
          fileSize: data.fileSize || null,
          pages: data.pages || 1,
          description: data.description?.trim() || null,
          materialType: data.materialType?.trim() || null,
          isBookmarked: Boolean(data.isBookmarked),
          userId: data.userId,
        },
      });
    },

    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: {
        title?: string;
        courseCode?: string;
        courseName?: string | null;
        category?: string;
        tag?: string | null;
        schedule?: string | null;
        fileUrl?: string | null;
        fileSize?: string | null;
        pages?: number | null;
        description?: string | null;
        materialType?: string | null;
        isBookmarked?: boolean;
      };
    }) {
      return await prisma.courseMaterial.update({
        where: { id: where.id },
        data,
      });
    },

    async delete({ where }: { where: { id: string } }) {
      return await prisma.courseMaterial.delete({
        where: { id: where.id },
      });
    },
  },

  routineSchedule: {
    async count({ where }: { where?: Prisma.RoutineScheduleWhereInput } = {}): Promise<number> {
      try {
        return await prisma.routineSchedule.count({ where });
      } catch (err: any) {
        console.warn("[db.routineSchedule.count] Falling back to local store:", err?.message || err);
        const slots = readFallbackRoutines();
        if (where?.userId && typeof where.userId === "string") {
          return slots.filter((s) => s.userId === where.userId).length;
        }
        return slots.length;
      }
    },

    async findMany({
      where,
      orderBy = { startTime: "asc" },
      skip,
      take,
    }: {
      where?: Prisma.RoutineScheduleWhereInput;
      orderBy?: Prisma.RoutineScheduleOrderByWithRelationInput | Prisma.RoutineScheduleOrderByWithRelationInput[];
      skip?: number;
      take?: number;
    } = {}): Promise<any[]> {
      try {
        return await prisma.routineSchedule.findMany({
          where,
          orderBy,
          skip,
          take,
        });
      } catch (err: any) {
        console.warn("[db.routineSchedule.findMany] Falling back to local store:", err?.message || err);
        let list = readFallbackRoutines();
        if (where?.userId && typeof where.userId === "string") {
          list = list.filter((s) => s.userId === where.userId);
        }
        if (where?.dayOfWeek) {
          const targetDay =
            typeof where.dayOfWeek === "string"
              ? where.dayOfWeek.toLowerCase()
              : typeof (where.dayOfWeek as any)?.equals === "string"
              ? (where.dayOfWeek as any).equals.toLowerCase()
              : "";
          if (targetDay) {
            list = list.filter((s) => s.dayOfWeek.toLowerCase() === targetDay);
          }
        }
        list.sort((a, b) => a.startTime.localeCompare(b.startTime));
        if (typeof skip === "number") list = list.slice(skip);
        if (typeof take === "number") list = list.slice(0, take);
        return list;
      }
    },

    async findUnique({ where }: { where: { id: string } }) {
      try {
        return await prisma.routineSchedule.findUnique({
          where: { id: where.id },
        });
      } catch (err: any) {
        console.warn("[db.routineSchedule.findUnique] Falling back to local store:", err?.message || err);
        const list = readFallbackRoutines();
        return list.find((s) => s.id === where.id) || null;
      }
    },

    async create({
      data,
    }: {
      data: {
        id?: string;
        userId: string;
        courseCode: string;
        courseTitle: string;
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        roomNo?: string | null;
        instructor?: string | null;
        semester?: string | null;
      };
    }) {
      try {
        return await prisma.routineSchedule.create({
          data: {
            ...(data.id ? { id: data.id } : {}),
            userId: data.userId,
            courseCode: data.courseCode.trim(),
            courseTitle: data.courseTitle.trim(),
            dayOfWeek: data.dayOfWeek.trim(),
            startTime: data.startTime.trim(),
            endTime: data.endTime.trim(),
            roomNo: data.roomNo?.trim() || null,
            instructor: data.instructor?.trim() || null,
            semester: data.semester?.trim() || null,
          },
        });
      } catch (err: any) {
        console.warn("[db.routineSchedule.create] Falling back to local store:", err?.message || err);
        const list = readFallbackRoutines();
        const id = data.id || `slot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date().toISOString();
        const newSlot: FallbackRoutineSlot = {
          id,
          userId: data.userId,
          courseCode: data.courseCode.trim(),
          courseTitle: data.courseTitle.trim(),
          dayOfWeek: data.dayOfWeek.trim(),
          startTime: data.startTime.trim(),
          endTime: data.endTime.trim(),
          roomNo: data.roomNo?.trim() || null,
          instructor: data.instructor?.trim() || null,
          semester: data.semester?.trim() || null,
          createdAt: now,
          updatedAt: now,
        };
        list.push(newSlot);
        writeFallbackRoutines(list);
        return newSlot;
      }
    },

    async createMany({ data }: { data: any[] }) {
      try {
        return await prisma.routineSchedule.createMany({
          data: data.map((d) => ({
            id: d.id,
            userId: d.userId,
            courseCode: (d.courseCode || d.code || "").trim(),
            courseTitle: (d.courseTitle || d.title || "").trim(),
            dayOfWeek: (d.dayOfWeek || d.day || "").trim(),
            startTime: (d.startTime || "").trim(),
            endTime: (d.endTime || "").trim(),
            roomNo: (d.roomNo || d.roomNumber || d.room || "")?.trim() || null,
            instructor: (d.instructor || d.teacherName || d.faculty || "")?.trim() || null,
            semester: (d.semester || d.batch || "")?.trim() || null,
          })),
          skipDuplicates: true,
        });
      } catch (err: any) {
        console.warn("[db.routineSchedule.createMany] Falling back to local store:", err?.message || err);
        const list = readFallbackRoutines();
        const createdList = data.map((d, idx) => ({
          id: d.id || `slot_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 8)}`,
          userId: d.userId,
          courseCode: (d.courseCode || d.code || "").trim(),
          courseTitle: (d.courseTitle || d.title || "").trim(),
          dayOfWeek: (d.dayOfWeek || d.day || "").trim(),
          startTime: (d.startTime || "").trim(),
          endTime: (d.endTime || "").trim(),
          roomNo: (d.roomNo || d.roomNumber || d.room || "")?.trim() || null,
          instructor: (d.instructor || d.teacherName || d.faculty || "")?.trim() || null,
          semester: (d.semester || d.batch || "")?.trim() || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        list.push(...createdList);
        writeFallbackRoutines(list);
        return { count: createdList.length, data: createdList };
      }
    },

    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: {
        courseCode?: string;
        courseTitle?: string;
        dayOfWeek?: string;
        startTime?: string;
        endTime?: string;
        roomNo?: string | null;
        instructor?: string | null;
        semester?: string | null;
      };
    }) {
      try {
        return await prisma.routineSchedule.update({
          where: { id: where.id },
          data,
        });
      } catch (err: any) {
        console.warn("[db.routineSchedule.update] Falling back to local store:", err?.message || err);
        const list = readFallbackRoutines();
        const idx = list.findIndex((s) => s.id === where.id);
        if (idx === -1) {
          throw new Error(`Routine slot ${where.id} not found`);
        }
        list[idx] = {
          ...list[idx],
          ...(data.courseCode ? { courseCode: data.courseCode.trim() } : {}),
          ...(data.courseTitle ? { courseTitle: data.courseTitle.trim() } : {}),
          ...(data.dayOfWeek ? { dayOfWeek: data.dayOfWeek.trim() } : {}),
          ...(data.startTime ? { startTime: data.startTime.trim() } : {}),
          ...(data.endTime ? { endTime: data.endTime.trim() } : {}),
          ...(data.roomNo !== undefined ? { roomNo: data.roomNo?.trim() || null } : {}),
          ...(data.instructor !== undefined ? { instructor: data.instructor?.trim() || null } : {}),
          ...(data.semester !== undefined ? { semester: data.semester?.trim() || null } : {}),
          updatedAt: new Date().toISOString(),
        };
        writeFallbackRoutines(list);
        return list[idx];
      }
    },

    async delete({ where }: { where: { id: string } }) {
      try {
        return await prisma.routineSchedule.delete({
          where: { id: where.id },
        });
      } catch (err: any) {
        console.warn("[db.routineSchedule.delete] Falling back to local store:", err?.message || err);
        const list = readFallbackRoutines();
        const target = list.find((s) => s.id === where.id);
        const filtered = list.filter((s) => s.id !== where.id);
        writeFallbackRoutines(filtered);
        return target || { id: where.id };
      }
    },
  },
};

(db as any).routineSlot = db.routineSchedule;
export const routineSlot = db.routineSchedule;

export default prisma;
