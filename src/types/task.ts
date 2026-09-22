/**
 * Canonical Task type across the entire application.
 * All backend API endpoints, TypeScript types, frontend components,
 * forms, filters, dialogs, and API client code consume this exact shape.
 */
export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskItem = Task;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTasksResponse {
  success: true;
  data: Task[];
  pagination: PaginationMeta;
}
