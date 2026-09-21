"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TaskForm, TaskItem } from "./taskform/task-form";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TaskItem | null;
  onSuccess: (task: TaskItem) => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: TaskDialogProps) {
  const isEditing = !!initialData?.id;

  const handleSuccess = (task: TaskItem) => {
    onSuccess(task);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-900">
            {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details, status, or priority of this task."
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
