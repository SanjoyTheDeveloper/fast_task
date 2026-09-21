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
  createdAt: Date;
  updatedAt: Date;
}

interface MockTask {
  id: string;
  title: string;
  description: string | null;
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
  user: {
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      try {
        return await prisma.user.findUnique({ where: where as any });
      } catch {
        return (
          mockUsers.find(
            (u) =>
              (where.id && u.id === where.id) ||
              (where.email && u.email.toLowerCase() === where.email.toLowerCase())
          ) || null
        );
      }
    },
    async create({ data }: { data: { name: string; email: string; password: string } }) {
      try {
        return await prisma.user.create({ data });
      } catch {
        const newUser: MockUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: data.name,
          email: data.email.toLowerCase(),
          password: data.password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockUsers.push(newUser);
        return newUser;
      }
    },
  },
  task: {
    async findMany({
      where,
      orderBy,
    }: {
      where: { userId: string; status?: any; priority?: any; search?: string };
      orderBy?: { [key: string]: "asc" | "desc" };
    }) {
      try {
        const prismaWhere: any = { userId: where.userId };
        if (where.status) prismaWhere.status = where.status;
        if (where.priority) prismaWhere.priority = where.priority;
        return await prisma.task.findMany({
          where: prismaWhere,
          orderBy: orderBy || { createdAt: "desc" },
        });
      } catch {
        let tasks = mockTasks.filter(
          (t) => t.userId === where.userId || t.userId === "user_demo_default"
        );
        if (where.status) tasks = tasks.filter((t) => t.status === where.status);
        if (where.priority) tasks = tasks.filter((t) => t.priority === where.priority);
        return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
        status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        priority?: "LOW" | "MEDIUM" | "HIGH";
        dueDate?: Date | null;
        userId: string;
      };
    }) {
      try {
        return await prisma.task.create({ data: data as any });
      } catch {
        const newTask: MockTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          title: data.title,
          description: data.description || null,
          status: data.status || "PENDING",
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
        status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        priority?: "LOW" | "MEDIUM" | "HIGH";
        dueDate?: Date | null;
      };
    }) {
      try {
        return await prisma.task.update({ where, data: data as any });
      } catch {
        const index = mockTasks.findIndex((t) => t.id === where.id);
        if (index === -1) throw new Error("Task not found");
        mockTasks[index] = {
          ...mockTasks[index],
          ...data,
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
