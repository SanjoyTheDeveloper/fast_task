export interface TaskPayload {
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string | null;
}

export async function getTasks(params?: {
  status?: string;
  priority?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "ALL") query.set("status", params.status);
  if (params?.priority && params.priority !== "ALL") query.set("priority", params.priority);
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`/api/tasks?${query.toString()}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to fetch tasks" }));
    throw new Error(error.message || "Failed to fetch tasks");
  }
  return res.json();
}

export async function getTaskById(taskId: string) {
  const res = await fetch(`/api/tasks/${taskId}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to fetch task" }));
    throw new Error(error.message || "Failed to fetch task");
  }
  return res.json();
}

export async function createTask(payload: TaskPayload) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to create task" }));
    throw new Error(error.message || "Failed to create task");
  }
  return res.json();
}

export async function updateTask(taskId: string, payload: Partial<TaskPayload>) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to update task" }));
    throw new Error(error.message || "Failed to update task");
  }
  return res.json();
}

export async function deleteTask(taskId: string) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to delete task" }));
    throw new Error(error.message || "Failed to delete task");
  }
  return res.json();
}
