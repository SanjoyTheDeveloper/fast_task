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
