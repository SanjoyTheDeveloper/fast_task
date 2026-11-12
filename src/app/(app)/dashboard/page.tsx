"use client";

import * as React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  StatCards,
  ProjectOverviewCards,
  ProjectCardItem,
  TaskProgressGauge,
  LatestActivityTimeline,
  TasksOverviewTable,
} from "@/components/dashboard";
import { FilterState } from "@/components/tasks";
import { toast, Toaster } from "sonner";
import type { Task, PaginationMeta, PaginatedTasksResponse, SessionUser } from "@/types";

const TaskDialog = dynamic(
  () => import("@/components/tasks/TaskDialog").then((m) => m.TaskDialog),
  { ssr: false }
);

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Read URL Search Parameters as the Single Source of Truth
  const search = searchParams.get("search") || "";
  const status = (searchParams.get("status") || "ALL").toUpperCase();
  const priority = (searchParams.get("priority") || "ALL").toUpperCase();
  const course = (searchParams.get("course") || "ALL").toUpperCase();
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10)
  );

  // User & Task State
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [courses, setCourses] = React.useState<ProjectCardItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
    
  // 2. Load authenticated user
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("User check failed:", err);
      }
    }
    loadUser();
  }, [router]);

  // Helper to update URL search parameters
  const updateQueryParams = React.useCallback(
    (
      newParams: Record<string, string | number | undefined | null>,
      resetPage = false
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          val === "ALL" ||
          val === "all"
        ) {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      if (resetPage) {
        params.delete("page");
      }

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    },
    [router, pathname, searchParams]
  );

  // 3. Database-Level Query: Fetch tasks strictly matching current URL query params
  const fetchTasks = React.useCallback(async () => {
    
    try {
      const query = new URLSearchParams();
      if (search.trim()) {
        query.set("search", search.trim());
      }
      if (status && status !== "ALL") {
        query.set("status", status.toLowerCase());
      }
      if (priority && priority !== "ALL") {
        query.set("priority", priority.toLowerCase());
      }
      if (sortBy) {
        query.set("sortBy", sortBy);
      }
      if (sortOrder) {
        query.set("sortOrder", sortOrder);
      }
      if (page > 1) {
        query.set("page", String(page));
      }
      if (limit !== 10) {
        query.set("limit", String(limit));
      }

      const url = `/api/tasks${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const json: PaginatedTasksResponse = await res.json();
        const taskCollection: Task[] = json.data || [];
        setTasks(taskCollection);
        if (json.pagination) {
          setPagination(json.pagination);
        }
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.error(errJson?.error?.message || "Failed to load tasks");
      }
    } catch {
      console.error("Network error while connecting to server");
    }
  }, [search, status, priority, sortBy, sortOrder, page, limit, router]);

  // Database-Level Query: Fetch user's active academic courses
  const fetchCourses = React.useCallback(async () => {
    try {
      const res = await fetch("/api/courses", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        setCourses(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchTasks();
    fetchCourses();
  }, [fetchTasks, fetchCourses]);

  // Client-side course filter matching
  const displayedTasks = React.useMemo(() => {
    if (!course || course === "ALL") return tasks;
    const courseUpper = course.toUpperCase().trim();
    return tasks.filter((t) => {
      const taskCourse = (t.course || "").toUpperCase().trim();
      return (
        taskCourse === courseUpper ||
        taskCourse.includes(courseUpper) ||
        courseUpper.includes(taskCourse)
      );
    });
  }, [tasks, course]);

  // Handle task created/updated from modal
  const handleTaskSaved = (savedTask: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === savedTask.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedTask;
        return updated;
      }
      return [savedTask, ...prev];
    });
    setIsCreateModalOpen(false);
    setEditingTask(null);
    toast.success(editingTask ? "Task updated!" : "New task created!");
    fetchTasks();
  };

  // Handle toggle task status directly from table
  const handleToggleStatus = async (task: Task) => {
    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });
      if (!res.ok) {
        fetchTasks();
        toast.error("Failed to update status");
      }
    } catch {
      fetchTasks();
    }
  };

  // Filter change handler
  const handleFilterChange = (newFilters: FilterState) => {
    updateQueryParams(
      {
        search: newFilters.search,
        status: newFilters.status,
        priority: newFilters.priority,
        course: newFilters.course,
        sortBy: newFilters.sortBy,
        sortOrder: newFilters.sortOrder,
      },
      true
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Main Executive Dashboard Viewport matching reference screenshot */}
      <main className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Row 1: Top 4 Stat Cards: Total task, On progress, Completed, Overdue */}
        <StatCards tasks={tasks} totalCount={pagination.total} />

        {/* Row 2: 2-Column Responsive Layout matching reference screenshot exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (~67% / 8 cols): Project overview + Tasks overview */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Project overview (3 Folder tab cards: Green, Purple, Blue) */}
            <ProjectOverviewCards
              projects={courses}
              tasks={tasks}
              onSelectProject={(proj) => {
                toast.info(`Filtered for ${proj.name}`);
                handleFilterChange({
                  search: proj.name,
                  status: "ALL",
                  priority: "ALL",
                  course: "ALL",
                  sortBy: "createdAt",
                  sortOrder: "desc",
                });
              }}
            />

            {/* 2. Tasks overview (Reference styled Table) */}
            <TasksOverviewTable
              tasks={displayedTasks}
              onToggleStatus={handleToggleStatus}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsCreateModalOpen(true);
              }}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setIsCreateModalOpen(true);
              }}
            />
          </div>

          {/* Right Column (~33% / 4 cols): Tasks progress + Latest Activity */}
          <div className="lg:col-span-4 space-y-6">
            {/* 3. Tasks progress (Semi-circle donut gauge chart with legend) */}
            <TaskProgressGauge
              tasks={tasks}
              totalCount={pagination.total}
            />

            {/* 4. Latest Activity (Timeline with avatars and updates) */}
            <LatestActivityTimeline
              tasks={tasks}
              currentUser={currentUser}
            />
          </div>
        </div>
      </main>

      {/* Task Creation & Editing Dialog */}
      <TaskDialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setEditingTask(null);
        }}
        initialData={editingTask}
        onSuccess={handleTaskSaved}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="h-8 w-8 rounded-full border-2 border-[#315BFF] border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
