"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDialog } from "@/components/tasks/task-dialog";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Kanban, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function KanbanPage() {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  // Auth check
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

  // Fetch tasks strictly from response.data: Task[]
  const fetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const json = await res.json();
        const list: Task[] = json.data || [];
        setTasks(list);
      }
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.status === 204 || res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
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
        toast.success(completed ? "Task moved to Completed! 🎉" : "Task moved to To Do 📋");
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
    toast.success(editingTask?.id ? "Task updated" : "Task created in Kanban board! 🚀");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-zinc-50/50 to-slate-100/60 pb-24 overflow-x-hidden">
      {/* Decorative Ambient Background Glow Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute top-32 right-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <Toaster position="top-right" richColors />
      <Navbar user={currentUser} />

      <main className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-zinc-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25">
              <Kanban className="h-5 w-5" />
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
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>
        </div>

        {/* The Kanban Board */}
        <KanbanBoard
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusToggle={handleStatusToggle}
          onStatusChange={handleStatusChange}
          onOpenCreateModal={handleOpenCreateModal}
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
