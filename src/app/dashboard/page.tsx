"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskStats } from "@/components/dashboard/TaskStats";
import {
  TaskFilters,
  FilterState,
  TaskList,
  TaskDialog,
  TaskPagination,
} from "@/components/tasks";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
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

  // Dynamic greeting based on current local time
  const [greeting, setGreeting] = React.useState("Welcome back");
  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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

  // Filter change handler: updates URL params and resets page to 1
  const handleFilterChange = (newFilters: FilterState) => {
    updateQueryParams(
      {
        search: newFilters.search,
        status: newFilters.status,
        priority: newFilters.priority,
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
    // Re-fetch current query from database to maintain proper pagination & order
    fetchTasks();
    toast.success(
      editingTask?.id ? "Task updated successfully" : "Task created successfully 🚀"
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

        // If this was the last task on page > 1, navigate to page - 1
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
        // If status filter is active, re-fetch to keep page accurate with database query
        if (status === "ACTIVE" || status === "COMPLETED") {
          fetchTasks();
        }
        toast.success(
          nextCompleted ? "Task marked as completed! 🎉" : "Task marked as active 📋"
        );
      } else {
        // Revert on failure
        fetchTasks();
        toast.error("Failed to update task status");
      }
    } catch {
      fetchTasks();
      toast.error("Network error while updating status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-zinc-50/50 to-slate-100/60 pb-24 overflow-x-hidden">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute top-32 right-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

      <Toaster position="top-right" richColors />

      {/* 1. Header / Navbar */}
      <DashboardHeader
        user={currentUser}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-7 animate-fade-in-up">
        {/* 2. Dashboard Title & Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-7 rounded-2xl bg-white/80 backdrop-blur-md border border-zinc-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-1 shadow-2xs">
              <Sparkles
                className="h-3.5 w-3.5 text-blue-600 animate-spin"
                style={{ animationDuration: "8s" }}
              />
              <span>Personal Task Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                {currentUser?.name || "Developer"}
              </span>{" "}
              👋
            </h1>
            <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">
              Track your daily goals, manage active work items, and stay organized.
            </p>
          </div>

          <Button
            onClick={handleOpenCreateModal}
            className="h-10 px-5 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 self-start sm:self-auto cursor-pointer"
            aria-label="Add new task"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="font-semibold">+ Add Task</span>
          </Button>
        </div>

        {/* 3. Task Statistics */}
        <TaskStats
          tasks={tasks}
          totalCount={pagination.total}
          activeCount={
            status === "ACTIVE"
              ? pagination.total
              : status === "COMPLETED"
              ? 0
              : undefined
          }
          completedCount={
            status === "COMPLETED"
              ? pagination.total
              : status === "ACTIVE"
              ? 0
              : undefined
          }
        />

        {/* 4. Task Filters (Search, Status, Priority, Sort) */}
        <TaskFilters
          filters={{
            search,
            status,
            priority,
            sortBy,
            sortOrder,
          }}
          onFilterChange={handleFilterChange}
          onOpenCreateModal={handleOpenCreateModal}
          isLoading={isLoading}
          activeView="grid"
        />

        {/* 5. Task List (Loading, Error, Empty, and Task Cards) */}
        <TaskList
          tasks={tasks}
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

        {/* 6. Database-Level Pagination Controls */}
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
      </main>

      {/* 7. Create / Edit Task Dialog */}
      <TaskDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingTask}
        onSuccess={handleFormSuccess}
        mode="form"
      />

      {/* 8. Delete Confirmation Dialog */}
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
