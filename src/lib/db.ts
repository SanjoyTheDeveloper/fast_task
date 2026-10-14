import { PrismaClient, Prisma, TaskStatus, TaskPriority } from "@prisma/client";

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
};

export default prisma;
