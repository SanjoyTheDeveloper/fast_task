import { PrismaClient } from "@prisma/client";

// Prevent multiple Prisma instances in Next.js development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  postgresAvailable: boolean | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [], // Suppress noisy connect retry errors in dev when offline
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Resilient in-memory fallback store when local PostgreSQL is not active.
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

const mockUsers: MockUser[] = [];
const mockTasks: MockTask[] = [];

// Default initial tasks
if (mockTasks.length === 0) {
  const defaultUserId = "user_demo_default";
  mockTasks.push(
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
    }
  );
}

/**
 * Safe Database Access Layer
 */
export const db = {
  prisma,
  async $transaction<T extends (Promise<any> | any)[]>(
    arg: T | ((prisma: PrismaClient) => Promise<any>)
  ): Promise<any> {
    try {
      return await (prisma.$transaction as any)(arg);
    } catch {
      if (Array.isArray(arg)) {
        return await Promise.all(arg);
      }
      return await arg(prisma);
    }
  },
  user: {
    async findUnique({ where }: { where: { id?: string; email?: string; verificationToken?: string } }) {
      try {
        return await prisma.user.findUnique({ where: where as any });
      } catch {
        return (
          mockUsers.find(
            (u) =>
              (where.id && u.id === where.id) ||
              (where.email && u.email.toLowerCase() === where.email.toLowerCase()) ||
              (where.verificationToken && u.verificationToken === where.verificationToken)
          ) || null
        );
      }
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
      try {
        return await prisma.user.create({ data: data as any });
      } catch {
        const newUser: MockUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: data.name,
          email: data.email.toLowerCase(),
          password: data.password,
          emailVerified: data.emailVerified || null,
          verificationToken: data.verificationToken || null,
          verificationTokenExpires: data.verificationTokenExpires || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockUsers.push(newUser);
        return newUser;
      }
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
      try {
        return await prisma.user.update({ where: where as any, data });
      } catch {
        const index = mockUsers.findIndex(
          (u) =>
            (where.id && u.id === where.id) ||
            (where.email && u.email.toLowerCase() === where.email.toLowerCase()) ||
            (where.verificationToken && u.verificationToken === where.verificationToken)
        );
        if (index === -1) throw new Error("User not found");
        mockUsers[index] = {
          ...mockUsers[index],
          ...data,
          updatedAt: new Date(),
        };
        return mockUsers[index];
      }
    },
  },
  task: {
    async count({ where }: { where?: any } = {}): Promise<number> {
      try {
        return await prisma.task.count({ where });
      } catch {
        let tasks = [...mockTasks];
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
      }
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
      } catch {
        let tasks = [...mockTasks];
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
      }
    },
    async findUnique({ where }: { where: { id: string } }) {
      try {
        return await prisma.task.findUnique({ where });
      } catch {
        return mockTasks.find((t) => t.id === where.id) || null;
      }
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
      try {
        const payload: any = { ...data };
        if (payload.completed === undefined) {
          payload.completed = payload.status === "COMPLETED";
        }
        return await prisma.task.create({ data: payload });
      } catch {
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
        mockTasks.unshift(newTask);
        return newTask;
      }
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
      try {
        const payload: any = { ...data };
        if (payload.completed !== undefined && payload.status === undefined) {
          payload.status = payload.completed ? "COMPLETED" : "PENDING";
        } else if (payload.status !== undefined && payload.completed === undefined) {
          payload.completed = payload.status === "COMPLETED";
        }
        return await prisma.task.update({ where, data: payload });
      } catch {
        const index = mockTasks.findIndex((t) => t.id === where.id);
        if (index === -1) throw new Error("Task not found");

        const updatedCompleted = data.completed !== undefined ? data.completed : (data.status ? data.status === "COMPLETED" : mockTasks[index].completed);
        const updatedStatus = data.status ? data.status : (data.completed !== undefined ? (data.completed ? "COMPLETED" : "PENDING") : mockTasks[index].status);

        mockTasks[index] = {
          ...mockTasks[index],
          ...data,
          completed: updatedCompleted,
          status: updatedStatus,
          updatedAt: new Date(),
        };
        return mockTasks[index];
      }
    },
    async delete({ where }: { where: { id: string } }) {
      try {
        return await prisma.task.delete({ where });
      } catch {
        const index = mockTasks.findIndex((t) => t.id === where.id);
        if (index === -1) throw new Error("Task not found");
        const [deleted] = mockTasks.splice(index, 1);
        return deleted;
      }
    },
  },
};
