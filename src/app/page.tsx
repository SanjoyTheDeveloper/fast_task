"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { StatsOverview } from "@/components/stats-overview";
import { PriorityDistribution } from "@/components/priority-distribution";
import { TaskFilters, FilterState } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDialog } from "@/components/tasks/task-dialog";
import type { TaskItem } from "@/components/tasks/taskform/task-form";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Kanban, Sparkles } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeView, setActiveView] = React.useState<"grid" | "kanban">("grid");

  // Dynamic greeting based on current time
  const [greeting, setGreeting] = React.useState("Welcome back");
  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskItem | null>(null);

  // Filters & sorting state
  const [filters, setFilters] = React.useState<FilterState>({
    search: "",
    status: "ALL",
    priority: "ALL",
    sortBy: "newest",
  });

  // Handle switching views seamlessly without losing context
  const handleSwitchView = (newView: "grid" | "kanban") => {
    if (newView === activeView) return;
    setActiveView(newView);
    // In Kanban board, all columns (PENDING, IN_PROGRESS, COMPLETED) should be visible.
    // If a user was previously filtering by a single status in Grid view, reset it so all columns populate.
    if (newView === "kanban" && filters.status !== "ALL") {
      setFilters((prev) => ({ ...prev, status: "ALL" }));
    }
  };

  // Fetch current user
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    }
    checkAuth();
  }, []);

  // Fetch tasks
  const fetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.status !== "ALL") query.set("status", filters.status);
      if (filters.priority !== "ALL") query.set("priority", filters.priority);
      if (filters.search) query.set("search", filters.search);

      const res = await fetch(`/api/tasks?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      } else {
        toast.error("Failed to load tasks");
      }
    } catch (err) {
      toast.error("Network error while loading tasks");
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.priority, filters.search]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Client-side sorting
  const sortedTasks = React.useMemo(() => {
    const sorted = [...tasks];
    switch (filters.sortBy) {
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      case "dueDate":
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      case "priority": {
        const weight: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return sorted.sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
      }
      case "newest":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    }
  }, [tasks, filters.sortBy]);

  // Handle drag-and-drop or explicit status change
  const handleStatusChange = async (
    taskId: string,
    newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
        const statusLabel =
          newStatus === "COMPLETED"
            ? "Completed! 🎉"
            : newStatus === "IN_PROGRESS"
            ? "In Progress ⏳"
            : "To Do 📋";
        toast.success(`Task moved to ${statusLabel}`);
      } else {
        fetchTasks();
        toast.error("Failed to update task status");
      }
    } catch {
      fetchTasks();
      toast.error("Network error while updating status");
    }
  };

  // Open create task modal with optional default column status
  const handleOpenCreateModal = (defaultStatus?: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    if (defaultStatus) {
      setEditingTask({
        id: "",
        title: "",
        description: "",
        status: defaultStatus,
        priority: "MEDIUM",
        dueDate: null,
      });
    } else {
      setEditingTask(null);
    }
    setIsDialogOpen(true);
  };

  // Open edit task modal
  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch {
      toast.error("Network error while deleting task");
    }
  };

  // Status toggle (completed <-> pending)
  const handleStatusToggle = async (task: TaskItem) => {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    handleStatusChange(task.id, nextStatus);
  };

  // Task form success callback
  const handleFormSuccess = (savedTask: TaskItem) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
    toast.success(editingTask?.id ? "Task updated successfully" : "Task created successfully 🚀");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-zinc-50/50 to-slate-100/60 pb-24 overflow-x-hidden">
      {/* Decorative Ambient Background Glow Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute top-32 right-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <Toaster position="top-right" richColors />
      <Navbar user={currentUser} onOpenCreateModal={() => handleOpenCreateModal()} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-7 animate-fade-in-up">
        {/* Welcome Hero Banner with Animation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7 rounded-2xl bg-white/80 backdrop-blur-md border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-1 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-spin" style={{ animationDuration: "8s" }} />
              <span>Personal Task Workspace</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              {greeting}, <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">{currentUser?.name || "Developer"}</span> 👋
            </h1>
            <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Track tasks, update priorities, and manage projects with speed. Here is your productivity overview for today.
            </p>
          </div>

          {/* View Mode Switcher with Interactive Transitions */}
          <div className="flex items-center gap-1.5 bg-zinc-100/90 p-1.5 rounded-2xl border border-zinc-200/90 shadow-inner self-start lg:self-auto">
            <button
              type="button"
              onClick={() => handleSwitchView("grid")}
              className={`flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === "grid"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-zinc-200/80 scale-[1.02]"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
              }`}
            >
              <LayoutGrid className="h-4 w-4 text-blue-600" />
              <span>Grid View</span>
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600">
                {tasks.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchView("kanban")}
              className={`flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === "kanban"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-zinc-200/80 scale-[1.02]"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
              }`}
            >
              <Kanban className="h-4 w-4 text-indigo-600" />
              <span>Kanban Board</span>
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600">
                3 Cols
              </span>
            </button>
          </div>
        </div>

        {/* Metric Cards Overview */}
        <StatsOverview tasks={tasks} />

        {/* Priority & Deadline Distribution Widget */}
        <PriorityDistribution tasks={tasks} />

        {/* Filters and Controls */}
        <TaskFilters
          filters={filters}
          onFilterChange={setFilters}
          onOpenCreateModal={() => handleOpenCreateModal()}
          activeView={activeView}
        />

        {/* Animated View Content with key for instant clean transition */}
        <div key={activeView} className="pt-1 transition-all duration-300 animate-fade-in-up">
          {activeView === "grid" ? (
            <TaskList
              tasks={sortedTasks}
              isLoading={isLoading}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusToggle={handleStatusToggle}
              onOpenCreateModal={() => handleOpenCreateModal()}
            />
          ) : (
            <KanbanBoard
              tasks={sortedTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusToggle={handleStatusToggle}
              onStatusChange={handleStatusChange}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}
        </div>
      </main>

      {/* Reusable Create/Edit Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingTask}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
