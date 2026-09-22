"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskNote } from "@/components/tasks/tasknote/task-note";
import type { Task } from "@/types/task";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  User,
} from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;

  const [task, setTask] = React.useState<Task | null>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Load current user and task details
  React.useEffect(() => {
    async function loadData() {
      try {
        // Fetch current user
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData.user);
        }

        // Fetch task strictly from response.data: Task
        const taskRes = await fetch(`/api/tasks/${taskId}`);
        if (!taskRes.ok) {
          if (taskRes.status === 404) {
            setError("Task not found or you don't have permission to view it.");
          } else {
            setError("Failed to load task details.");
          }
          setIsLoading(false);
          return;
        }

        const json = await taskRes.json();
        // Canonical shape: response.data: Task
        const canonicalTask: Task = json.data;
        setTask(canonicalTask);
      } catch {
        setError("Network error while loading task.");
      } finally {
        setIsLoading(false);
      }
    }

    if (taskId) {
      loadData();
    }
  }, [taskId]);

  // Handle status update
  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    const isCompleted = newStatus === "COMPLETED";
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: isCompleted }),
      });
      if (res.ok) {
        const json = await res.json();
        const updated: Task = json.data;
        if (updated) {
          setTask(updated);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      if (res.status === 204 || res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50/60">
        <Navbar user={currentUser} />
        <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-sm text-zinc-500">Loading task details...</p>
        </main>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-zinc-50/60">
        <Navbar user={currentUser} />
        <main className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Task Unavailable</h1>
          <p className="text-sm text-zinc-600 max-w-md mb-6">{error || "Task not found."}</p>
          <Button asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Dashboard
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  const isCompleted = task.completed;
  const statusBadgeVariant = isCompleted ? "completed" : "pending";
  const statusLabel = isCompleted ? "Completed" : "Pending";

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16">
      <Navbar user={currentUser} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Navigation bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-zinc-600 hover:text-zinc-900 self-start sm:self-auto cursor-pointer"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tasks</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="gap-1.5 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Banner */}
        {showDeleteConfirm && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-900">
                  Delete this task permanently?
                </p>
                <p className="text-xs text-red-700">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        )}

        {/* Main Task Header Card */}
        <Card className="border-zinc-200/90 shadow-sm overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={statusBadgeVariant as any} className="text-xs uppercase px-2.5">
                {statusLabel}
              </Badge>
            </div>
            <CardTitle
              className={`text-xl sm:text-2xl font-bold leading-snug break-words ${
                isCompleted ? "line-through text-zinc-400" : "text-zinc-900"
              }`}
            >
              {task.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-2 space-y-6">
            {/* Quick Status Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 w-full sm:max-w-sm">
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wide shrink-0">
                Update Status:
              </span>
              <div className="flex-1">
                <Select
                  value={isCompleted ? "COMPLETED" : "PENDING"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="h-8.5 text-xs bg-white w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description / Notes */}
            <div className="break-words">
              <TaskNote description={task.description} />
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500">
              <div className="flex items-center gap-2.5 min-w-0">
                <Clock className="h-4 w-4 text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <span className="block font-medium text-zinc-700">Created At</span>
                  <span className="truncate block">{formatDate(task.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <span className="block font-medium text-zinc-700">Last Updated</span>
                  <span className="truncate block">{formatDate(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <TaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={task}
        onSuccess={(updatedTask) => setTask(updatedTask)}
      />
    </div>
  );
}
