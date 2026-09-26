"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./taskform/task-form";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";

export interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Task | null;
  onSuccess?: (task: Task) => void;
  // Delete confirmation mode support
  mode?: "form" | "delete";
  taskToDelete?: Task | null;
  onConfirmDelete?: (taskId: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export function TaskDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
  mode = "form",
  taskToDelete,
  onConfirmDelete,
  isDeleting = false,
}: TaskDialogProps) {
  // Delete Confirmation Mode
  if (mode === "delete") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[460px] p-5 sm:p-6">
          <DialogHeader className="space-y-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200/70">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              Delete Task
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 leading-relaxed">
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {taskToDelete && (
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5 my-2">
              <p className="text-sm font-bold text-zinc-900 break-words">
                {taskToDelete.title}
              </p>
              <div className="flex items-center gap-2">
                <TaskStatusBadge completed={taskToDelete.completed} />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-2 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="rounded-xl border-zinc-200 w-full sm:w-auto h-11 sm:h-10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (taskToDelete && onConfirmDelete) {
                  onConfirmDelete(taskToDelete.id);
                }
              }}
              disabled={isDeleting}
              className="rounded-xl gap-1.5 w-full sm:w-auto h-11 sm:h-10 cursor-pointer"
              aria-label="Confirm delete task"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Task</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Create / Edit Form Mode
  const isEditing = !!initialData?.id;

  const handleSuccess = (task: Task) => {
    if (onSuccess) onSuccess(task);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-900">
            {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {isEditing
              ? "Update the details and completion status of this task."
              : "Fill out the fields below to add a new task to your dashboard."}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <TaskForm
            initialData={initialData}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
