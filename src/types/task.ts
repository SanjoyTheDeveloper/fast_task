/**
 * Canonical Task type across the entire application for the Student Academic Workspace.
 */
export type AcademicCategory =
  | "Assignment"
  | "Exam"
  | "Lab Report"
  | "Personal Routine"
  | string;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate?: string | null;
  course?: string | null;
  category?: AcademicCategory | null;
  priority?: "LOW" | "MEDIUM" | "HIGH" | string;
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
