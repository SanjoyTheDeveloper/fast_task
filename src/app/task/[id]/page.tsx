"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskNote } from "@/components/tasks/tasknote/task-note";
import type { TaskItem } from "@/components/tasks/taskform/task-form";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;

  const [task, setTask] = React.useState<TaskItem | null>(null);
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

        // Fetch task
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

        const taskData = await taskRes.json();
        setTask(taskData.task);
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
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setTask(data.task);
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
      if (res.ok) {
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

  const priorityBadgeVariant =
    task.priority === "HIGH" ? "high" : task.priority === "MEDIUM" ? "medium" : "low";

  const statusBadgeVariant =
    task.status === "COMPLETED"
      ? "completed"
      : task.status === "IN_PROGRESS"
      ? "in_progress"
      : "pending";

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16">
      <Navbar user={currentUser} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-zinc-600 hover:text-zinc-900">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tasks</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Banner */}
        {showDeleteConfirm && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Delete this task permanently?
                </p>
                <p className="text-xs text-red-700">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        )}

        {/* Main Task Header Card */}
        <Card className="border-zinc-200/90 shadow-sm">
          <CardHeader className="p-6 pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={statusBadgeVariant as any} className="text-xs uppercase px-2.5">
                {task.status.replace("_", " ")}
              </Badge>
              <Badge variant={priorityBadgeVariant as any} className="text-xs uppercase px-2.5">
                {task.priority} Priority
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-zinc-900 leading-snug">
              {task.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-6">
            {/* Quick Status Selector */}
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200/60 max-w-sm">
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                Update Status:
              </span>
              <div className="flex-1">
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description / Notes */}
            <TaskNote description={task.description} />

            {/* Metadata Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <span className="block font-medium text-zinc-700">Due Date</span>
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <div>
                  <span className="block font-medium text-zinc-700">Created At</span>
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                <div>
                  <span className="block font-medium text-zinc-700">Last Updated</span>
                  <span>{formatDate(task.updatedAt)}</span>
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
