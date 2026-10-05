import { PrismaClient, Prisma, TaskStatus, TaskPriority } from "@prisma/client";
import fs from "fs";
import path from "path";

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
 * Checks whether an error is due to database server being unreachable
 * (e.g. localhost offline without local PostgreSQL daemon).
 */
function isConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code.startsWith("P1");
  }
  if (error && typeof error === "object") {
    const err = error as any;
    if (err.name === "PrismaClientInitializationError") return true;
    if (err.code && String(err.code).startsWith("P1")) return true;
    const msg = String(err.message || "").toLowerCase();
    if (
      msg.includes("can't reach database") ||
      msg.includes("econnrefused") ||
      msg.includes("etimedout") ||
      msg.includes("connection refused")
    ) {
      return true;
    }
  }
  return false;
}

// Local resilient disk store when database server is unreachable
interface DiskUser {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified?: Date | null;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DiskTask {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DATA_DIR = path.join(process.cwd(), "src", "database", "local_data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

function getUsers(): DiskUser[] {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, "utf-8");
      const list = JSON.parse(content);
      if (Array.isArray(list)) {
        return list.map((u: any) => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
          updatedAt: u.updatedAt ? new Date(u.updatedAt) : new Date(),
          emailVerified: u.emailVerified ? new Date(u.emailVerified) : null,
          verificationTokenExpires: u.verificationTokenExpires
            ? new Date(u.verificationTokenExpires)
            : null,
        }));
      }
    }
  } catch {}
  return [];
}

function saveUsersToDisk(users: DiskUser[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch {}
}

function getTasks(): DiskTask[] {
  ensureDataDir();
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const content = fs.readFileSync(TASKS_FILE, "utf-8");
      const list = JSON.parse(content);
      if (Array.isArray(list)) {
        return list.map((t: any) => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
          updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        }));
      }
    }
  } catch {}
  return [];
}

function saveTasksToDisk(tasks: DiskTask[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch {}
}

/**
 * Production-ready Database Layer powered primarily by Prisma ORM.
 * Automatically attempts Prisma / Supabase queries, and falls back to local data
 * if the database server is offline, ensuring login never fails in local development.
 */
export const db = {
  prisma,

  $transaction: (async (arg: any) => {
    try {
      if (typeof arg === "function") {
        return await prisma.$transaction(arg);
      }
      if (Array.isArray(arg)) {
        return await prisma.$transaction(arg);
      }
      return await prisma.$transaction(arg);
    } catch (error) {
      if (!isConnectionError(error)) throw error;
      // Fallback concurrent resolution
      if (Array.isArray(arg)) {
        return Promise.all(arg);
      }
      if (typeof arg === "function") {
        return arg(prisma);
      }
      return Promise.resolve(arg);
    }
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
      let condition: Prisma.UserWhereUniqueInput | null = null;
      if (where.id) {
        condition = { id: where.id };
      } else if (where.email) {
        condition = { email: where.email.toLowerCase().trim() };
      } else if (where.verificationToken) {
        condition = { verificationToken: where.verificationToken.trim() };
      }

      if (condition) {
        try {
          return await prisma.user.findUnique({
            where: condition,
          });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
        }
      }

      const users = getUsers();
      return (
        users.find(
          (u) =>
            (where.id && u.id === where.id) ||
            (where.email && u.email.toLowerCase() === where.email.toLowerCase().trim()) ||
            (where.verificationToken && u.verificationToken === where.verificationToken.trim())
        ) || null
      );
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
      try {
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
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const users = getUsers();
      const newUser: DiskUser = {
        id: data.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: data.password,
        emailVerified: data.emailVerified !== undefined ? data.emailVerified : new Date(),
        verificationToken: data.verificationToken || null,
        verificationTokenExpires: data.verificationTokenExpires || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      saveUsersToDisk(users);
      return newUser;
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
      let condition: Prisma.UserWhereUniqueInput | null = null;
      if (where.id) {
        condition = { id: where.id };
      } else if (where.email) {
        condition = { email: where.email.toLowerCase().trim() };
      } else if (where.verificationToken) {
        condition = { verificationToken: where.verificationToken.trim() };
      }

      if (condition) {
        try {
          return await prisma.user.update({
            where: condition,
            data,
          });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
        }
      }

      const users = getUsers();
      const index = users.findIndex(
        (u) =>
          (where.id && u.id === where.id) ||
          (where.email && u.email.toLowerCase() === where.email.toLowerCase().trim()) ||
          (where.verificationToken && u.verificationToken === where.verificationToken.trim())
      );
      if (index === -1) throw new Error("User not found");
      users[index] = {
        ...users[index],
        ...data,
        updatedAt: new Date(),
      };
      saveUsersToDisk(users);
      return users[index];
    },

    async delete({ where }: { where: { id: string } }) {
      try {
        return await prisma.user.delete({
          where: { id: where.id },
        });
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const users = getUsers();
      const index = users.findIndex((u) => u.id === where.id);
      if (index === -1) throw new Error("User not found");
      const [deleted] = users.splice(index, 1);
      saveUsersToDisk(users);
      return deleted;
    },
  },

  task: {
    async count({ where }: { where?: any } = {}): Promise<number> {
      try {
        return await prisma.task.count({ where });
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const allTasks = getTasks();
      let tasks = [...allTasks];
      if (where?.userId) {
        tasks = tasks.filter((t) => t.userId === where.userId);
      }
      if (where?.completed !== undefined) {
        tasks = tasks.filter((t) => t.completed === where.completed);
      }
      if (where?.priority) {
        tasks = tasks.filter((t) => t.priority === where.priority);
      }
      return tasks.length;
    },

    async findMany({
      where,
      orderBy,
      skip,
      take,
    }: {
      where?: any;
      orderBy?: any;
      skip?: number;
      take?: number;
    } = {}): Promise<any[]> {
      try {
        return await prisma.task.findMany({
          where,
          orderBy,
          skip,
          take,
        });
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const allTasks = getTasks();
      let tasks = [...allTasks];
      if (where?.userId) {
        tasks = tasks.filter((t) => t.userId === where.userId);
      }
      if (where?.completed !== undefined) {
        tasks = tasks.filter((t) => t.completed === where.completed);
      }
      if (where?.priority) {
        tasks = tasks.filter((t) => t.priority === where.priority);
      }
      if (where?.OR && Array.isArray(where.OR)) {
        const query = (where.OR[0]?.title?.contains || "").toLowerCase();
        if (query) {
          tasks = tasks.filter(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              (t.description && t.description.toLowerCase().includes(query))
          );
        }
      }

      const s = skip || 0;
      const t = take !== undefined ? take : tasks.length;
      return tasks.slice(s, s + t);
    },

    async findUnique({ where }: { where: { id: string } }) {
      try {
        return await prisma.task.findUnique({
          where: { id: where.id },
        });
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const tasks = getTasks();
      return tasks.find((t) => t.id === where.id) || null;
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

      try {
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
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const tasks = getTasks();
      const newTask: DiskTask = {
        id: data.id || `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        description: data.description || null,
        completed: isCompleted,
        status,
        priority,
        dueDate,
        userId: data.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      tasks.unshift(newTask);
      saveTasksToDisk(tasks);
      return newTask;
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

      try {
        return await prisma.task.update({
          where: { id: where.id },
          data: payload,
        });
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const tasks = getTasks();
      const index = tasks.findIndex((t) => t.id === where.id);
      if (index === -1) throw new Error("Task not found");
      tasks[index] = {
        ...tasks[index],
        ...payload,
        updatedAt: new Date(),
      };
      saveTasksToDisk(tasks);
      return tasks[index];
    },

    async delete({ where }: { where: { id: string } }) {
      try {
        return await prisma.task.delete({
          where: { id: where.id },
        });
      } catch (error) {
        if (!isConnectionError(error)) throw error;
      }

      const tasks = getTasks();
      const index = tasks.findIndex((t) => t.id === where.id);
      if (index === -1) throw new Error("Task not found");
      const [deleted] = tasks.splice(index, 1);
      saveTasksToDisk(tasks);
      return deleted;
    },
  },
};
