import { Prisma, PrismaClient } from "@prisma/client";
import net from "net";
import fs from "fs";
import path from "path";

// Prevent multiple Prisma instances in Next.js development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  postgresAvailable: boolean | undefined;
  lastCheckTime: number | undefined;
  isChecking: boolean | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Determines whether an error thrown during a Prisma operation is a genuine
 * connectivity failure (allowing graceful fallback to local disk store), or
 * an application/query engine error (constraint violation, invalid input, etc.)
 * which MUST be re-thrown so data integrity is not silently compromised.
 */
function isConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1xxx are database connection errors (P1001, P1002, etc.)
    // P2xxx are query engine errors (P2002 unique constraint, P2025 record not found, etc.)
    return error.code.startsWith("P1");
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    const msg = error.message.toLowerCase();
    return msg.includes("connect") || msg.includes("econnrefused") || msg.includes("timeout");
  }
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: unknown }).code);
    if (code === "ECONNREFUSED" || code === "ETIMEDOUT" || code === "ENOTFOUND") {
      return true;
    }
  }
  return false;
}

/**
 * Fast, non-blocking check to determine if PostgreSQL server is reachable.
 * Caches the result in memory for 60 seconds to eliminate multi-second TCP timeouts
 * on every single query when running without a local PostgreSQL daemon.
 */
export async function isPostgresAvailable(): Promise<boolean> {
  const now = Date.now();
  if (
    globalForPrisma.postgresAvailable !== undefined &&
    globalForPrisma.lastCheckTime !== undefined &&
    now - globalForPrisma.lastCheckTime < 60000
  ) {
    return globalForPrisma.postgresAvailable;
  }

  if (globalForPrisma.isChecking) {
    return globalForPrisma.postgresAvailable ?? false;
  }

  globalForPrisma.isChecking = true;

  return new Promise<boolean>((resolve) => {
    try {
      const dbUrl = process.env.DATABASE_URL || "";
      let host = "localhost";
      let port = 5432;

      if (dbUrl) {
        try {
          const parsed = new URL(
            dbUrl.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:")
          );
          host = parsed.hostname || "localhost";
          port = parsed.port ? parseInt(parsed.port, 10) : 5432;
        } catch {
          if (dbUrl.includes("@")) {
            const afterAt = dbUrl.split("@").pop() || "";
            const hostPort = afterAt.split("/")[0];
            const parts = hostPort.split(":");
            host = parts[0] || "localhost";
            port = parts[1] ? parseInt(parts[1], 10) : 5432;
          }
        }
      }

      const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
      const timeoutMs = isLocal ? 300 : 2000;

      const socket = new net.Socket();
      let finished = false;

      const done = (status: boolean) => {
        if (!finished) {
          finished = true;
          socket.destroy();
          globalForPrisma.postgresAvailable = status;
          globalForPrisma.lastCheckTime = Date.now();
          globalForPrisma.isChecking = false;
          resolve(status);
        }
      };

      socket.setTimeout(timeoutMs);
      socket.on("connect", () => done(true));
      socket.on("timeout", () => done(false));
      socket.on("error", () => done(false));

      socket.connect(port, host);
    } catch {
      globalForPrisma.postgresAvailable = false;
      globalForPrisma.lastCheckTime = Date.now();
      globalForPrisma.isChecking = false;
      resolve(false);
    }
  });
}

/**
 * Resilient disk-backed fallback store when local PostgreSQL is not active.
 * Permanently persists users and tasks to local JSON files so they are NEVER
 * lost when the computer restarts, shuts down, or when dev server reloads.
 */
interface MockUser {
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

interface MockTask {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
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
  } catch (err) {
    console.error("Failed to create local_data directory:", err);
  }
}

let mockUsers: MockUser[] = [];
let mockTasks: MockTask[] = [];

function loadUsersFromDisk(): MockUser[] {
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
          verificationTokenExpires: u.verificationTokenExpires ? new Date(u.verificationTokenExpires) : null,
        }));
      }
    }
  } catch (err) {
    console.error("Failed to read users from disk:", err);
  }
  return [];
}

function saveUsersToDisk(users: MockUser[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save users to disk:", err);
  }
}

function getUsers(): MockUser[] {
  const diskUsers = loadUsersFromDisk();
  mockUsers = diskUsers;
  return mockUsers;
}

function loadTasksFromDisk(): MockTask[] {
  ensureDataDir();
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const content = fs.readFileSync(TASKS_FILE, "utf-8");
      const list = JSON.parse(content);
      if (Array.isArray(list) && list.length > 0) {
        return list.map((t: any) => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
          updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        }));
      }
    }
  } catch (err) {
    console.error("Failed to read tasks from disk:", err);
  }

  // Initial default tasks if no persistent tasks exist yet
  const defaultUserId = "user_demo_default";
  const defaultTasks: MockTask[] = [
    {
      id: "task_1",
      title: "Set up PostgreSQL and run Prisma migrations",
      description: "Run npx prisma migrate dev to sync models with your PostgreSQL database.",
      completed: true,
      status: "COMPLETED",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 86400000),
      userId: defaultUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "task_2",
      title: "Design dashboard layout with shadcn/ui components",
      description: "Build clean, accessible task cards, dialogs, and filters using Tailwind CSS.",
      completed: false,
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 172800000),
      userId: defaultUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "task_3",
      title: "Implement task search and priority sorting",
      description: "Allow users to quickly search by title and filter by status and priority.",
      completed: false,
      status: "PENDING",
      priority: "LOW",
      dueDate: new Date(Date.now() + 259200000),
      userId: defaultUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  saveTasksToDisk(defaultTasks);
  return defaultTasks;
}

function saveTasksToDisk(tasks: MockTask[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save tasks to disk:", err);
  }
}

function getTasks(): MockTask[] {
  const diskTasks = loadTasksFromDisk();
  mockTasks = diskTasks;
  return mockTasks;
}

// Initial boot load
mockUsers = loadUsersFromDisk();
mockTasks = loadTasksFromDisk();

/**
 * Safe Database Access Layer
 */
export const db = {
  prisma,
  async $transaction<T extends (Promise<any> | any)[]>(
    arg: T | ((prisma: PrismaClient) => Promise<any>)
  ): Promise<any> {
    if (typeof arg === "function") {
      if (await isPostgresAvailable()) {
        try {
          return await prisma.$transaction(arg as any);
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
      }
      return await arg(prisma);
    }
    if (Array.isArray(arg)) {
      return await Promise.all(arg);
    }
    return await Promise.resolve(arg);
  },
  user: {
    async findUnique({ where }: { where: { id?: string; email?: string; verificationToken?: string } }) {
      if (await isPostgresAvailable()) {
        try {
          return await prisma.user.findUnique({ where: where as any });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
      }
      const users = getUsers();
      return (
        users.find(
          (u) =>
            (where.id && u.id === where.id) ||
            (where.email && u.email.toLowerCase() === where.email.toLowerCase()) ||
            (where.verificationToken && u.verificationToken === where.verificationToken)
        ) || null
      );
    },
    async create({
      data,
    }: {
      data: {
        name: string;
        email: string;
        password: string;
        emailVerified?: Date | null;
        verificationToken?: string | null;
        verificationTokenExpires?: Date | null;
      };
    }) {
      if (await isPostgresAvailable()) {
        try {
          return await prisma.user.create({ data: data as any });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
      }
      const users = getUsers();
      const newUser: MockUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        email: data.email.toLowerCase(),
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
      if (await isPostgresAvailable()) {
        try {
          return await prisma.user.update({ where: where as any, data });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
      }
      const users = getUsers();
      const index = users.findIndex(
        (u) =>
          (where.id && u.id === where.id) ||
          (where.email && u.email.toLowerCase() === where.email.toLowerCase()) ||
          (where.verificationToken && u.verificationToken === where.verificationToken)
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
  },
  task: {
    async count({ where }: { where?: any } = {}): Promise<number> {
      if (await isPostgresAvailable()) {
        try {
          return await prisma.task.count({ where });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
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
        const searchTerms = where.OR.map((o: any) =>
          (o.title?.contains || o.description?.contains || "").toLowerCase()
        ).filter(Boolean);
        if (searchTerms.length > 0) {
          const query = searchTerms[0];
          tasks = tasks.filter(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              (t.description && t.description.toLowerCase().includes(query))
          );
        }
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
      if (await isPostgresAvailable()) {
        try {
          return await prisma.task.findMany({
            where,
            orderBy,
            skip,
            take,
          });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
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
        const searchTerms = where.OR.map((o: any) =>
          (o.title?.contains || o.description?.contains || "").toLowerCase()
        ).filter(Boolean);
        if (searchTerms.length > 0) {
          const query = searchTerms[0];
          tasks = tasks.filter(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              (t.description && t.description.toLowerCase().includes(query))
          );
        }
      }

      // Sorting
      if (Array.isArray(orderBy)) {
        const primary = orderBy[0];
        if (primary) {
          const [field, dir] = Object.entries(primary)[0] as [string, string];
          tasks.sort((a: any, b: any) => {
            const valA = a[field];
            const valB = b[field];
            if (valA instanceof Date && valB instanceof Date) {
              return dir === "asc"
                ? valA.getTime() - valB.getTime()
                : valB.getTime() - valA.getTime();
            }
            if (typeof valA === "string" && typeof valB === "string") {
              return dir === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
            }
            return dir === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
          });
        }
      } else if (orderBy && typeof orderBy === "object") {
        const [field, dir] = Object.entries(orderBy)[0] as [string, string];
        tasks.sort((a: any, b: any) => {
          const valA = a[field];
          const valB = b[field];
          if (valA instanceof Date && valB instanceof Date) {
            return dir === "asc"
              ? valA.getTime() - valB.getTime()
              : valB.getTime() - valA.getTime();
          }
          if (typeof valA === "string" && typeof valB === "string") {
            return dir === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
          }
          return dir === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });
      }

      // Pagination
      const s = skip || 0;
      const t = take !== undefined ? take : tasks.length;
      return tasks.slice(s, s + t);
    },
    async findUnique({ where }: { where: { id: string } }) {
      if (await isPostgresAvailable()) {
        try {
          return await prisma.task.findUnique({ where });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
      }
      const tasks = getTasks();
      return tasks.find((t) => t.id === where.id) || null;
    },
    async create({
      data,
    }: {
      data: {
        title: string;
        description?: string | null;
        completed?: boolean;
        status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        priority?: "LOW" | "MEDIUM" | "HIGH";
        dueDate?: Date | null;
        userId: string;
      };
    }) {
      if (await isPostgresAvailable()) {
        try {
          const payload: any = { ...data };
          if (payload.completed === undefined) {
            payload.completed = payload.status === "COMPLETED";
          }
          return await prisma.task.create({ data: payload });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
      }
      const tasks = getTasks();
      const isCompleted = data.completed ?? (data.status === "COMPLETED");
      const status = data.status || (isCompleted ? "COMPLETED" : "PENDING");
      const newTask: MockTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        description: data.description || null,
        completed: isCompleted,
        status,
        priority: data.priority || "MEDIUM",
        dueDate: data.dueDate || null,
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
        status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        priority?: "LOW" | "MEDIUM" | "HIGH";
        dueDate?: Date | null;
      };
    }) {
      if (await isPostgresAvailable()) {
        try {
          const payload: any = { ...data };
          if (payload.completed !== undefined && payload.status === undefined) {
            payload.status = payload.completed ? "COMPLETED" : "PENDING";
          } else if (payload.status !== undefined && payload.completed === undefined) {
            payload.completed = payload.status === "COMPLETED";
          }
          return await prisma.task.update({ where, data: payload });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
      }
      const tasks = getTasks();
      const index = tasks.findIndex((t) => t.id === where.id);
      if (index === -1) throw new Error("Task not found");

      const updatedCompleted = data.completed !== undefined ? data.completed : (data.status ? data.status === "COMPLETED" : tasks[index].completed);
      const updatedStatus = data.status ? data.status : (data.completed !== undefined ? (data.completed ? "COMPLETED" : "PENDING") : tasks[index].status);

      tasks[index] = {
        ...tasks[index],
        ...data,
        completed: updatedCompleted,
        status: updatedStatus,
        updatedAt: new Date(),
      };
      saveTasksToDisk(tasks);
      return tasks[index];
    },
    async delete({ where }: { where: { id: string } }) {
      if (await isPostgresAvailable()) {
        try {
          return await prisma.task.delete({ where });
        } catch (error) {
          if (!isConnectionError(error)) throw error;
          globalForPrisma.postgresAvailable = false;
        }
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
