"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AcademicHeader } from "@/components/academic/AcademicHeader";
import { StudentStats } from "@/components/academic/StudentStats";
import { PomodoroWidget } from "@/components/academic/PomodoroWidget";
import { AcademicQuickLinks } from "@/components/academic/AcademicQuickLinks";
import { MobileNavBar } from "@/components/academic/MobileNavBar";
import {
  TaskFilters,
  FilterState,
  TaskList,
  TaskDialog,
  TaskPagination,
} from "@/components/tasks";
import { toast, Toaster } from "sonner";
import type { Task, PaginationMeta, PaginatedTasksResponse } from "@/types/task";

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
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Dialog & Action States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);

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
        params.delete("page"); // Defaults to page 1
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

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Client-side course filter matching for instant response
  const displayedTasks = React.useMemo(() => {
    if (!course || course === "ALL") return tasks;
    return tasks.filter((t) => (t.course || "").toUpperCase() === course);
  }, [tasks, course]);

  // Filter change handler: updates URL params and resets page to 1
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
      true // Reset page to 1
    );
  };

  // Page change handler: preserves search, filters, and sort
  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage }, false);
  };

  // Clear filters handler
  const handleClearFilter = () => {
    updateQueryParams(
      {
        search: "",
        status: "ALL",
        priority: "ALL",
        course: "ALL",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      true
    );
  };

  // Clear search only
  const handleClearSearch = () => {
    updateQueryParams({ search: "" }, true);
  };

  const isFiltered =
    Boolean(search && search.trim() !== "") ||
    status !== "ALL" ||
    priority !== "ALL" ||
    course !== "ALL" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  // 4. Create Task Modal Handler
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // 5. Edit Task Modal Handler
  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // 6. Form Success (Create or Edit)
  const handleFormSuccess = (_savedTask: Task) => {
    // Re-fetch current query from database
    fetchTasks();
    toast.success(
      editingTask?.id ? "Task updated successfully" : "Task added to course list 🚀"
    );
  };

  // 7. Delete Task Trigger & Confirm
  const handleOpenDeleteModal = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || null;
    if (task) {
      setDeletingTask(task);
    }
  };

  const handleConfirmDelete = async (taskId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.status === 204 || res.ok) {
        setDeletingTask(null);
        toast.success("Task deleted successfully");

        if (tasks.length === 1 && page > 1) {
          updateQueryParams({ page: page - 1 }, false);
        } else {
          fetchTasks();
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson?.error?.message || "Failed to delete task");
      }
    } catch {
      toast.error("Network error while deleting task");
    } finally {
      setIsDeleting(false);
    }
  };

  // 8. Toggle Status (Active <-> Completed)
  const handleStatusToggle = async (task: Task) => {
    if (updatingTaskId) return;
    const nextCompleted = !task.completed;
    setUpdatingTaskId(task.id);

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (res.ok) {
        const json = await res.json();
        const updatedTask: Task = json.data;
        if (updatedTask) {
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? updatedTask : t))
          );
        }
        if (status === "ACTIVE" || status === "COMPLETED") {
          fetchTasks();
        }
        toast.success(
          nextCompleted ? "Completed! One step closer to semester goals 🎉" : "Task reactivated 📋"
        );
      } else {
        fetchTasks();
        toast.error("Failed to update status");
      }
    } catch {
      fetchTasks();
      toast.error("Network error while updating status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/60 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pb-24 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient atmospheric glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-indigo-300/20 via-blue-200/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-10 -right-32 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-cyan-300/20 via-indigo-200/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-96 w-96 rounded-full bg-violet-200/10 blur-3xl" />

      <Toaster position="top-right" richColors />

      {/* 1. Navbar */}
      <DashboardHeader user={currentUser} />

      <main className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 space-y-5 sm:space-y-6 pb-28 md:pb-16 animate-fade-in-up">
        {/* Anchor point for Top Overview */}
        <div id="top" className="sr-only" />

        {/* 2. Academic Header & Today's Routine Strip */}
        <AcademicHeader
          userName={currentUser?.name}
          onOpenCreateModal={handleOpenCreateModal}
        />

        {/* 3. Student Metric Cards (Pending Assignments, Upcoming Exams, Study Target) */}
        <StudentStats tasks={tasks} totalCount={pagination.total} />

        {/* 4. Unified Search & Filter Toolbar */}
        <TaskFilters
          filters={{
            search,
            status,
            priority,
            course,
            sortBy,
            sortOrder,
          }}
          onFilterChange={handleFilterChange}
          onOpenCreateModal={handleOpenCreateModal}
          isLoading={isLoading}
          activeView="grid"
        />

        {/* 5. Main Content Grid: Academic Tasks List (First on mobile) + Focus & Utility (Second on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Tasks Column (Primary, Order 1) */}
          <div id="tasks" className="lg:col-span-8 space-y-5 order-1">
            <TaskList
              tasks={displayedTasks}
              isLoading={isLoading}
              isError={!!loadError}
              errorMessage={loadError}
              onRetry={fetchTasks}
              isFiltered={isFiltered}
              filterStatus={status}
              searchQuery={search}
              onClearFilter={handleClearFilter}
              onClearSearch={handleClearSearch}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onStatusToggle={handleStatusToggle}
              onOpenCreateModal={handleOpenCreateModal}
              updatingTaskId={updatingTaskId}
            />

            {/* Pagination Controls */}
            {pagination.total > 0 && (
              <TaskPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Academic Focus & Utility Column (Order 2 on mobile, sidebar on desktop) */}
          <div id="pomodoro" className="lg:col-span-4 space-y-5 sm:space-y-6 order-2">
            {/* Pomodoro Study Timer */}
            <PomodoroWidget />

            {/* Academic Quick Links Repository */}
            <AcademicQuickLinks />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on md and larger screens) */}
      <MobileNavBar />

      {/* Create / Edit Task Dialog */}
      <TaskDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingTask}
        onSuccess={handleFormSuccess}
        mode="form"
      />

      {/* Delete Confirmation Dialog */}
      <TaskDialog
        open={!!deletingTask}
        onOpenChange={(open) => {
          if (!open) setDeletingTask(null);
        }}
        mode="delete"
        taskToDelete={deletingTask}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
