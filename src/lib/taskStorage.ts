"use client";

import type { Task } from "@/types";
import type { ProjectCardItem } from "@/components/dashboard/ProjectOverviewCards";

const TASKS_STORAGE_KEY = "fasttask_cached_tasks_v1";
const COURSES_STORAGE_KEY = "fasttask_cached_courses_v1";

// In-memory runtime cache for instantaneous tab switching within the session
let memoryTasksCache: Task[] | null = null;
let memoryCoursesCache: ProjectCardItem[] | null = null;

/**
 * Retrieve cached tasks for 0ms initial render
 */
export function getStoredTasks(): Task[] {
  if (memoryTasksCache && memoryTasksCache.length > 0) {
    return memoryTasksCache;
  }
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = sessionStorage.getItem(TASKS_STORAGE_KEY) || localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryTasksCache = parsed;
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return [];
}

/**
 * Save tasks to runtime and storage cache
 */
export function saveStoredTasks(tasks: Task[]): void {
  memoryTasksCache = tasks;
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(tasks);
    sessionStorage.setItem(TASKS_STORAGE_KEY, serialized);
    localStorage.setItem(TASKS_STORAGE_KEY, serialized);
  } catch {
    // Quota or access error handled gracefully
  }
}

/**
 * Retrieve cached project courses for 0ms dashboard render
 */
export function getStoredCourses(): ProjectCardItem[] {
  if (memoryCoursesCache && memoryCoursesCache.length > 0) {
    return memoryCoursesCache;
  }
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = sessionStorage.getItem(COURSES_STORAGE_KEY) || localStorage.getItem(COURSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCoursesCache = parsed;
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return [];
}

/**
 * Save project courses to cache
 */
export function saveStoredCourses(courses: ProjectCardItem[]): void {
  memoryCoursesCache = courses;
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(courses);
    sessionStorage.setItem(COURSES_STORAGE_KEY, serialized);
    localStorage.setItem(COURSES_STORAGE_KEY, serialized);
  } catch {
    // Graceful fallback
  }
}
