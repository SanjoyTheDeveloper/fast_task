"use client";

import * as React from "react";
import Link from "next/link";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { TaskFilters, FilterState } from "@/components/tasks/taskfilter";
import type { Task, SessionUser } from "@/types";
import { Button } from "@/components/ui/button";
import { GIcon } from "@/components/ui/GIcon";
import { LayoutGrid } from "@/components/ui/GoogleIcon";
import { toast, Toaster } from "sonner";

// Initial Semester Tasks for instant zero-latency render (Batch 82A)
const DEFAULT_SEMESTER_TASKS: Task[] = [
  {
    id: "sample-1",
    title: "AIES • Revise Expert Systems Architecture & Rule Engines",
    description:
      "Review First-Order Logic formulas and forward-chaining deduction trace for Dr. Sahedul's lecture notes.",
    completed: false,
    course: "0611CSE321 • AIES",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    userId: "demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "CN • Cisco Packet Tracer Subnetting Lab 1",
    description:
      "Configure IPv4 default gateway and verify ping connectivity across VLAN 10 and 20 topology.",
    completed: false,
    course: "0612CSE315 • CN",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    userId: "demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sample-3",
    title: "MACS • Complex Analysis Problem Set 3",
    description:
      "Complete contour integration exercises 12 to 18 and review Cauchy-Riemann equations before quiz.",
    completed: false,
    course: "0541MAT337 • MACS",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    userId: "demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sample-4",
    title: "AP • Socket Client-Server Multi-threading Handout",
    description:
      "Implemented multi-threaded TCP socket client in C++ with mutex synchronization locks and error checking.",
    completed: true,
    course: "0613CSE333 • AP",
    priority: "LOW",
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    userId: "demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function KanbanPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  // Initialize with DEFAULT_SEMESTER_TASKS for immediate instant display without empty flash
  const [tasks, setTasks] = React.useState<Task[]>(DEFAULT_SEMESTER_TASKS);
  const [isLoading, setIsLoading] = React.useState(false);

  // Filters State for live instant filtering on Kanban Board without reload
  const [filters, setFilters] = React.useState<FilterState>({
    search: "",
    status: "ALL",
    priority: "ALL",
    course: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  // Auth check
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
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

  // Fetch tasks strictly from response.data: Task[]
  const fetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks?limit=50", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        const list: Task[] = json.data || [];
        if (list.length > 0) {
          setTasks(list);
        } else {
          // If DB has no tasks, keep or set initial semester tasks
          setTasks((prev) => (prev.length > 0 ? prev : DEFAULT_SEMESTER_TASKS));
        }
      }
    } catch {
      // Retain existing tasks
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Compute live filtered tasks without reload
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search filter
      if (filters.search && filters.search.trim() !== "") {
        const q = filters.search.toLowerCase().trim();
        const titleMatch = task.title.toLowerCase().includes(q);
        const descMatch = task.description?.toLowerCase().includes(q);
        const courseMatch = task.course?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !courseMatch) return false;
      }

      // 2. Status filter
      const normStatus = (filters.status || "ALL").toUpperCase();
      if (normStatus === "ACTIVE" && task.completed) return false;
      if (normStatus === "COMPLETED" && !task.completed) return false;

      // 3. Priority filter
      const normPriority = (filters.priority || "ALL").toUpperCase();
      if (
        normPriority !== "ALL" &&
        (task.priority || "").toUpperCase() !== normPriority
      ) {
        return false;
      }

      // 4. Course filter
      const normCourse = (filters.course || "ALL").toUpperCase();
      if (normCourse !== "ALL") {
        const taskCourse = (task.course || "").toUpperCase();
        if (!taskCourse.includes(normCourse)) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  // Handle open create modal
  const handleOpenCreateModal = (defaultCompleted?: boolean) => {
    if (defaultCompleted !== undefined) {
      setEditingTask({
        id: "",
        title: "",
        description: null,
        completed: defaultCompleted,
        userId: "",
        createdAt: "",
        updatedAt: "",
      });
    } else {
      setEditingTask(null);
    }
    setIsDialogOpen(true);
  };

  // Handle edit
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (taskId.startsWith("sample-")) {
      toast.success("Task removed from board");
      return;
    }
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.status === 204 || res.ok) {
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch {
      toast.error("Network error while deleting task");
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (task: Task) => {
    handleStatusChange(task.id, !task.completed);
  };

  // Handle drag-and-drop or explicit status change
  const handleStatusChange = async (taskId: string, completed: boolean) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
    );

    if (taskId.startsWith("sample-")) {
      toast.success(
        completed ? "Task moved to Completed! 🎉" : "Task moved to To Do 📋"
      );
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (res.ok) {
        const json = await res.json();
        const updated: Task = json.data;
        if (updated) {
          setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        }
        toast.success(
          completed ? "Task moved to Completed! 🎉" : "Task moved to To Do 📋"
        );
      } else {
        fetchTasks(); // Revert on failure
        toast.error("Failed to update task status");
      }
    } catch {
      fetchTasks();
      toast.error("Network error while updating status");
    }
  };

  // Handle form success
  const handleFormSuccess = (savedTask: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
    toast.success(
      editingTask?.id ? "Task updated" : "Task created in Kanban board! 🚀"
    );
  };

  // Handle load starter semester tasks
  const handleLoadStarterTasks = async () => {
    const starterTasks = [
      {
        title: "AIES • Revise Expert Systems Architecture & Rule Engines",
        description: "Review First-Order Logic formulas and forward-chaining deduction trace for lecture.",
        completed: false,
      },
      {
        title: "CN • Cisco Packet Tracer Subnetting Lab 1",
        description: "Configure IPv4 default gateway and verify ping connectivity across VLAN 10 and 20.",
        completed: false,
      },
      {
        title: "MACS • Complex Analysis Problem Set 3",
        description: "Solve contour integration exercises 12 to 18 before submission deadline.",
        completed: false,
      },
      {
        title: "AP • Socket Client-Server Demo Handout",
        description: "Implemented multi-threaded TCP socket client in C++ with mutex synchronization locks.",
        completed: true,
      },
    ];

    try {
      const createdList: Task[] = [];
      for (const t of starterTasks) {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) createdList.push(json.data);
        }
      }
      if (createdList.length > 0) {
        setTasks((prev) => [...createdList, ...prev]);
        toast.success("Semester study tasks loaded onto your Kanban board! 🚀");
      } else {
        // Optimistic fallback if DB offline
        const localTasks: Task[] = starterTasks.map((t, i) => ({
          id: `local-task-${Date.now()}-${i}`,
          title: t.title,
          description: t.description,
          completed: t.completed,
          userId: "current-user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setTasks((prev) => [...localTasks, ...prev]);
        toast.success("Sample tasks added to your Kanban board! ✨");
      }
    } catch {
      const localTasks: Task[] = starterTasks.map((t, i) => ({
        id: `local-task-${Date.now()}-${i}`,
        title: t.title,
        description: t.description,
        completed: t.completed,
        userId: "current-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setTasks((prev) => [...localTasks, ...prev]);
      toast.success("Sample tasks added to your Kanban board! ✨");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-zinc-50/50 to-slate-100/60 pb-24 overflow-x-hidden">
      {/* Decorative Ambient Background Glow Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute top-32 right-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <Toaster position="top-right" richColors />

      <main className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-zinc-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25">
              <GIcon name="view_kanban" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
                  Kanban Project Board
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Organize workflow visually. Drag cards across columns to progress work.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 text-xs rounded-xl flex-1 sm:flex-initial justify-center">
              <Link href="/dashboard">
                <LayoutGrid className="h-4 w-4 text-zinc-500" />
                <span>Dashboard</span>
              </Link>
            </Button>
            <Button
              onClick={() => handleOpenCreateModal()}
              size="sm"
              className="h-9 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 flex-1 sm:flex-initial justify-center"
            >
              <GIcon name="add" size={16} />
              <span>Add Task</span>
            </Button>
          </div>
        </div>

        {/* Task Filters on Kanban Page (Live instant filtering without reload) */}
        <TaskFilters
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
          onOpenCreateModal={() => handleOpenCreateModal()}
          isLoading={isLoading}
          activeView="kanban"
        />

        {/* The Kanban Board */}
        <KanbanBoard
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusToggle={handleStatusToggle}
          onStatusChange={handleStatusChange}
          onOpenCreateModal={handleOpenCreateModal}
          onLoadStarterTasks={handleLoadStarterTasks}
        />
      </main>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingTask}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
