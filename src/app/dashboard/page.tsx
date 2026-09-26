"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Sidebar,
  TopHeader,
  WelcomeCard,
  TodaySchedule,
  StatCards,
  CalendarWidget,
  FocusPomodoro,
} from "@/components/dashboard";
import {
  TaskFilters,
  FilterState,
  TaskList,
  TaskDialog,
  TaskPagination,
} from "@/components/tasks";
import { SemesterSetupModal } from "@/components/academic/SemesterSetupModal";
import { CourseScheduleModal } from "@/components/academic/CourseScheduleModal";
import {
  DEFAULT_SEMESTER_CONFIG,
  SemesterConfig,
  CourseSession,
} from "@/lib/academic";
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

  // UI Drawer & Modal States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);
  const [isSemesterSetupOpen, setIsSemesterSetupOpen] = React.useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = React.useState(false);
  const [semesterConfig, setSemesterConfig] = React.useState<SemesterConfig>(DEFAULT_SEMESTER_CONFIG);

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

  // Search input handler
  const handleGlobalSearch = (val: string) => {
    updateQueryParams({ search: val }, true);
  };

  // Page change handler
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

  // Task Dialog Actions
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSuccess = (_savedTask: Task) => {
    fetchTasks();
    toast.success(
      editingTask?.id ? "Assignment updated successfully" : "Assignment added to your list 🚀"
    );
  };

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
        toast.success("Assignment removed successfully");

        if (tasks.length === 1 && page > 1) {
          updateQueryParams({ page: page - 1 }, false);
        } else {
          fetchTasks();
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson?.error?.message || "Failed to delete assignment");
      }
    } catch {
      toast.error("Network error while deleting assignment");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Wrapper with Left Margin for Desktop Sidebar */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={currentUser}
          searchQuery={search}
          onSearchChange={handleGlobalSearch}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dashboard Main Content Body */}
        <main className="flex-1 w-full max-w-[1550px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* 3. Hero / Welcome Card */}
          <WelcomeCard
            userName={currentUser?.name}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenSemesterSetup={() => setIsSemesterSetupOpen(true)}
          />

          {/* 4. Today's Schedule (3 Cards in a Row) */}
          <TodaySchedule
            onManageRoutine={() => setIsRoutineModalOpen(true)}
            onSelectSession={(item) => {
              toast.info(`${item.courseCode} ${item.type}: ${item.title}`);
            }}
          />

          {/* 5. Summary Stat Cards (3 Columns) */}
          <StatCards tasks={tasks} totalCount={pagination.total} />

          {/* 6. Responsive Two-Column Layout: Tasks Area (Left) + Calendar & Pomodoro (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Area: Tasks Management */}
            <div id="tasks" className="lg:col-span-8 space-y-5">
              {/* Task Filters & Status Toolbar */}
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

              {/* Tasks List / Empty State */}
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

            {/* Right Area: Calendar, Upcoming Tasks & Focus Pomodoro */}
            <div id="calendar" className="lg:col-span-4 space-y-6">
              {/* Compact Calendar Widget & Upcoming Tasks */}
              <CalendarWidget
                onSelectTask={(id) => toast.info(`Viewing task: ${id}`)}
                onViewAll={() => {
                  const tasksElement = document.getElementById("tasks");
                  tasksElement?.scrollIntoView({ behavior: "smooth" });
                }}
              />

              {/* Dark Navy Focus Pomodoro Widget */}
              <FocusPomodoro />
            </div>
          </div>
        </main>
      </div>

      {/* Task Creation / Editing Dialog */}
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

      {/* Semester Duration Setup Modal */}
      <SemesterSetupModal
        open={isSemesterSetupOpen}
        onOpenChange={setIsSemesterSetupOpen}
        config={semesterConfig}
        onSave={(newConfig: SemesterConfig) => {
          setSemesterConfig(newConfig);
          setIsSemesterSetupOpen(false);
          toast.success("Semester timetable settings updated!");
        }}
      />

      {/* Routine & Course Schedule Modal */}
      <CourseScheduleModal
        open={isRoutineModalOpen}
        onOpenChange={setIsRoutineModalOpen}
        onSave={(_session: CourseSession) => {
          setIsRoutineModalOpen(false);
          toast.success("Course session added to routine 📚");
        }}
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
