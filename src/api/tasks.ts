import type { Task, PaginationMeta, PaginatedTasksResponse } from "@/types/task";

export type { Task, PaginationMeta, PaginatedTasksResponse };

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  completed?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export type TaskPayload = CreateTaskInput;

export interface GetTasksParams {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

function buildTaskQueryString(params?: GetTasksParams): string {
  if (!params) return "";
  const query = new URLSearchParams();
  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.status && params.status.toUpperCase() !== "ALL") {
    query.set("status", params.status.toLowerCase());
  }
  if (params.priority && params.priority.toUpperCase() !== "ALL") {
    query.set("priority", params.priority.toLowerCase());
  }
  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }
  if (params.sortOrder) {
    query.set("sortOrder", params.sortOrder);
  }
  if (params.page !== undefined && params.page > 0) {
    query.set("page", String(params.page));
  }
  if (params.limit !== undefined && params.limit > 0) {
    query.set("limit", String(params.limit));
  }
  const str = query.toString();
  return str ? `?${str}` : "";
}

/**
 * Fetch paginated tasks response with data and pagination metadata.
 */
export async function getPaginatedTasks(
  params?: GetTasksParams
): Promise<PaginatedTasksResponse> {
  const queryString = buildTaskQueryString(params);
  const url = `/api/tasks${queryString}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: "Failed to fetch tasks" } }));
    throw new Error(error.error?.message || error.message || "Failed to fetch tasks");
  }
  const json: PaginatedTasksResponse = await res.json();
  return json;
}

/**
 * Fetch all tasks for authenticated user.
 * Reads task collection strictly from response.data: Task[]
 */
export async function getTasks(params?: GetTasksParams): Promise<Task[]> {
  const paginated = await getPaginatedTasks(params);
  return paginated.data;
}

/**
 * Fetch single task by ID.
 * Reads single task strictly from response.data: Task
 */
export async function getTaskById(taskId: string): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: "Failed to fetch task" } }));
    throw new Error(error.error?.message || error.message || "Failed to fetch task");
  }
  const json: { success: boolean; data: Task } = await res.json();
  return json.data;
}

/**
 * Create a new task.
 * Returns response.data: Task
 */
export async function createTask(payload: CreateTaskInput): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description || null,
      completed: Boolean(payload.completed),
    }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: "Failed to create task" } }));
    throw new Error(error.error?.message || error.message || "Failed to create task");
  }
  const json: { success: boolean; data: Task } = await res.json();
  return json.data;
}

/**
 * Update an existing task.
 * Returns response.data: Task
 */
export async function updateTask(
  taskId: string,
  payload: UpdateTaskInput
): Promise<Task> {
  const body: UpdateTaskInput = {};
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.completed !== undefined) body.completed = payload.completed;

  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: "Failed to update task" } }));
    throw new Error(error.error?.message || error.message || "Failed to update task");
  }
  const json: { success: boolean; data: Task } = await res.json();
  return json.data;
}

/**
 * Delete a task.
 * Endpoint returns HTTP 204 No Content with empty body.
 */
export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: "Failed to delete task" } }));
    throw new Error(error.error?.message || error.message || "Failed to delete task");
  }
}
