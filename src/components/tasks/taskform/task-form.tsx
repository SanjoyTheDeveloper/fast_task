"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatForInput } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | Date | null;
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface TaskFormProps {
  initialData?: TaskItem | null;
  onSuccess: (task: TaskItem) => void;
  onCancel?: () => void;
}

export function TaskForm({ initialData, onSuccess, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "PENDING",
      priority: initialData?.priority || "MEDIUM",
      dueDate: initialData?.dueDate ? formatForInput(initialData.dueDate) : "",
    },
  });

  const selectedStatus = watch("status");
  const selectedPriority = watch("priority");

  const onSubmit = async (values: TaskInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const url = isEditing ? `/api/tasks/${initialData.id}` : "/api/tasks";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Failed to save task");
        setIsSubmitting(false);
        return;
      }

      onSuccess(data.task);
    } catch (err: any) {
      setServerError(err.message || "Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {serverError}
        </div>
      )}

      {/* Task Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-900" htmlFor="task-title">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="task-title"
          placeholder="e.g. Design landing page hero section"
          {...register("title")}
          className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.title && (
          <p className="text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Task Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-900" htmlFor="task-description">
          Description
        </label>
        <Textarea
          id="task-description"
          rows={3}
          placeholder="Provide context, acceptance criteria, or relevant links..."
          {...register("description")}
          className={errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Status & Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">Status</label>
          <Select
            value={selectedStatus}
            onValueChange={(val: any) => setValue("status", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-xs text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">Priority</label>
          <Select
            value={selectedPriority}
            onValueChange={(val: any) => setValue("priority", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-xs text-red-600">{errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-900" htmlFor="task-dueDate">
          Due Date
        </label>
        <Input
          id="task-dueDate"
          type="date"
          {...register("dueDate")}
          className={errors.dueDate ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.dueDate && (
          <p className="text-xs text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Task"
          )}
        </Button>
      </div>
    </form>
  );
}
