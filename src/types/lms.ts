/**
 * LMS & Course Material types for FastTask
 */

export interface LmsPdfDocument {
  id: string;
  title: string;
  courseCode: string;
  courseName?: string;
  size: string;
  category: string;
  pages?: number;
  uploadedAt?: string;
  description?: string;
  isBookmarked?: boolean;
  fileUrl?: string;
  isCustomUpload?: boolean;
  materialType?: string;
  schedule?: string;
  tag?: string;
  userId?: string;
}

export type LmsSortOption = "recent" | "name" | "size";
export type LmsViewMode = "grid" | "list";
