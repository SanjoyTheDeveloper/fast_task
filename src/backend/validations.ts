import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password cannot exceed 100 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const taskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);
export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters" })
    .optional(),
  status: taskStatusEnum,
  priority: taskPriorityEnum,
  dueDate: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;

export const updateTaskSchema = taskSchema.partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * Task API Schemas for Strict Endpoint Contracts
 */
export const taskIdSchema = z
  .string({
    required_error: "Task ID is required",
    invalid_type_error: "Task ID must be a string",
  })
  .trim()
  .min(1, { message: "Task ID cannot be empty" })
  .max(128, { message: "Task ID is too long" });

export const createTaskApiSchema = z
  .object({
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      })
      .trim()
      .min(1, { message: "Title is required" })
      .max(255, { message: "Title cannot exceed 255 characters" }),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .max(2000, { message: "Description cannot exceed 2000 characters" })
      .nullable()
      .optional(),
    completed: z
      .boolean({
        invalid_type_error: "Completed must be a boolean",
      })
      .optional()
      .default(false),
  })
  .strict(); // Rejects protected fields like id, userId, etc.

export type CreateTaskApiInput = z.infer<typeof createTaskApiSchema>;

export const updateTaskApiSchema = z
  .object({
    title: z
      .string({
        invalid_type_error: "Title must be a string",
      })
      .trim()
      .min(1, { message: "Title cannot be empty" })
      .max(255, { message: "Title cannot exceed 255 characters" })
      .optional(),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .max(2000, { message: "Description cannot exceed 2000 characters" })
      .nullable()
      .optional(),
    completed: z
      .boolean({
        invalid_type_error: "Completed must be a boolean",
      })
      .optional(),
  })
  .strict() // Rejects protected fields like id, userId, createdAt, updatedAt
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.completed !== undefined,
    {
      message: "At least one field must be provided",
    }
  );

export type UpdateTaskApiInput = z.infer<typeof updateTaskApiSchema>;

export const allowedTaskSortFields = [
  "createdAt",
  "updatedAt",
  "title",
  "completed",
] as const;

export const taskQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z
    .enum(["all", "active", "completed", "ALL", "ACTIVE", "COMPLETED"])
    .optional()
    .default("all"),
  priority: z
    .enum(["all", "low", "medium", "high", "ALL", "LOW", "MEDIUM", "HIGH"])
    .optional()
    .default("all"),
  sortBy: z
    .enum(allowedTaskSortFields)
    .optional()
    .default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc", "ASC", "DESC"])
    .optional()
    .default("desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

