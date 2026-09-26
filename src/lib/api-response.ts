import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "INVALID_TASK_ID"
  | "TASK_NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

import type { Task, PaginationMeta } from "@/types/task";
export type { Task, PaginationMeta };
export type TaskDto = Task;

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function paginatedSuccessResponse<T>(
  data: T,
  pagination: PaginationMeta,
  status = 200
): NextResponse {
  return NextResponse.json({ success: true, data, pagination }, { status });
}

export function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: Record<string, string[]>
): NextResponse {
  const errorBody: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, string[]>;
  } = {
    code,
    message,
  };

  if (details && Object.keys(details).length > 0) {
    errorBody.details = details;
  }

  return NextResponse.json({ success: false, error: errorBody }, { status });
}

import { parseTaskDescription } from "@/lib/academic";

export function serializeTask(task: any): Task {
  const createdAt = task.createdAt instanceof Date ? task.createdAt.toISOString() : new Date(task.createdAt).toISOString();
  const updatedAt = task.updatedAt instanceof Date ? task.updatedAt.toISOString() : new Date(task.updatedAt).toISOString();

  const rawDesc = task.description != null ? String(task.description).trim() : null;
  const parsedMeta = parseTaskDescription(rawDesc);

  let dueDate: string | null = null;
  if (task.dueDate) {
    dueDate = task.dueDate instanceof Date ? task.dueDate.toISOString() : new Date(task.dueDate).toISOString();
  }

  return {
    id: String(task.id),
    title: String(task.title),
    description: parsedMeta.description,
    completed: Boolean(task.completed ?? task.status === "COMPLETED"),
    dueDate,
    course: task.course || parsedMeta.course,
    category: task.category || parsedMeta.category,
    priority: task.priority || "MEDIUM",
    userId: String(task.userId),
    createdAt,
    updatedAt,
  };
}
