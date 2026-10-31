"use client";

import * as React from "react";
import { Suspense } from "react";
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
  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [_isLoading, setIsLoading] = React.useState(true);
  const [_loadError, setLoadError] = React.useState<string | null>(null);

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
    setIsLoading(true);
    setLoadError(null);
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
      const res = await fetch(url);

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
        setLoadError(errJson?.error?.message || "Failed to load tasks");
      }
    } catch {
      setLoadError("Network error while connecting to server");
    } finally {
      setIsLoading(false);
    }
  }, [search, status, priority, sortBy, sortOrder, page, limit, router]);

  // Database-Level Query: Fetch user's active academic courses
  const fetchCourses = React.useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
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
    return tasks.filter((t) => (t.course || "").toUpperCase() === course);
  }, [tasks, course]);

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
