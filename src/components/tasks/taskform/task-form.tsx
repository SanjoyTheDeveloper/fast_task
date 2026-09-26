"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Calendar, GraduationCap, Tag } from "lucide-react";
import type { Task } from "@/types/task";
import { COURSES, CATEGORIES } from "@/lib/academic";

export type { Task };
export type TaskItem = Task;

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title cannot exceed 255 characters" }),
  description: z
    .string()
    .max(2000, { message: "Description cannot exceed 2000 characters" })
    .optional(),
  dueDate: z.string().optional(),
  course: z.string().optional(),
  category: z.string().optional(),
  completed: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  initialData?: Task | null;
  onSuccess: (task: Task) => void;
  onCancel?: () => void;
}

export function TaskForm({ initialData, onSuccess, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const isEditing = !!initialData?.id;

  const initialDueDate = React.useMemo(() => {
    if (!initialData?.dueDate) return "";
    try {
      return new Date(initialData.dueDate).toISOString().split("T")[0];
    } catch {
      return "";
    }
  }, [initialData?.dueDate]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialDueDate,
      course: initialData?.course || "CSE231",
      category: initialData?.category || "Assignment",
      completed: Boolean(initialData?.completed),
    },
  });

  const isCompleted = watch("completed");
  const selectedDueDate = watch("dueDate");
  const selectedCourse = watch("course");
  const selectedCategory = watch("category");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setServerError(null);
  
    try {
      const url = isEditing ? `/api/tasks/${initialData.id}` : "/api/tasks";
      const method = isEditing ? "PATCH" : "POST";

      const payload: {
        title: string;
        description: string | null;
        completed: boolean;
        dueDate?: string | null;
        course?: string | null;
        category?: string | null;
      } = {
        title: values.title.trim(),
        description: values.description?.trim() ? values.description.trim() : null,
        completed: Boolean(values.completed),
        dueDate: values.dueDate && values.dueDate.trim() ? new Date(values.dueDate.trim()).toISOString() : null,
        course: values.course || null,
        category: values.category || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        const errorMsg =
          json.error?.message ||
          (json.error?.details
            ? Object.values(json.error.details as Record<string, string[]>)
                .flat()
                .join(", ")
            : null) ||
          "Failed to save task";
        setServerError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Canonical contract: read task strictly from response.data: Task
      const savedTask: Task = json.data;
      onSuccess(savedTask);
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

      {/* Academic Course & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Course Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900 flex items-center gap-1.5" htmlFor="task-course">
            <GraduationCap className="h-4 w-4 text-zinc-500" />
            <span>Course / Subject</span>
          </label>
          <select
            id="task-course"
            value={selectedCourse || "CSE231"}
            onChange={(e) => setValue("course", e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c === "CSE231"
                  ? "CSE231 • Operating Systems"
                  : c === "EEPP"
                  ? "EEPP • Ethics & Practice"
                  : c === "MAT112"
                  ? "MAT112 • Linear Algebra"
                  : c === "PHY101"
                  ? "PHY101 • Engineering Physics"
                  : "General Routine / Academic"}
              </option>
            ))}
          </select>
        </div>

        {/* Category / Type Selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900 flex items-center gap-1.5" htmlFor="task-category">
            <Tag className="h-4 w-4 text-zinc-500" />
            <span>Task Type</span>
          </label>
          <select
            id="task-category"
            value={selectedCategory || "Assignment"}
            onChange={(e) => setValue("category", e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-900 flex items-center gap-1.5" htmlFor="task-due-date">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <span>Due Date</span>
          </label>
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setValue("dueDate", new Date().toISOString().split("T")[0])}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
            >
              Today
            </button>
            <span className="text-zinc-300">•</span>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setValue("dueDate", tomorrow.toISOString().split("T")[0]);
              }}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
            >
              Tomorrow
            </button>
            {selectedDueDate && (
              <>
                <span className="text-zinc-300">•</span>
                <button
                  type="button"
                  onClick={() => setValue("dueDate", "")}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <Input
            id="task-due-date"
            type="date"
            {...register("dueDate")}
            className="h-10 text-sm rounded-xl border-zinc-200 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900"
          />
        </div>
      </div>

      {/* Completed Status Checkbox */}
      <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/70">
        <Checkbox
          id="task-form-completed"
          checked={isCompleted}
          onCheckedChange={(checked) => setValue("completed", Boolean(checked))}
        />
        <label
          htmlFor="task-form-completed"
          className="text-sm font-medium text-zinc-800 cursor-pointer select-none flex-1"
        >
          Mark as completed
        </label>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isCompleted
              ? "bg-emerald-100 text-emerald-800"
              : "bg-zinc-200 text-zinc-600"
          }`}
        >
          {isCompleted ? "Completed" : "Pending"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-zinc-100">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border-zinc-200 w-full sm:w-auto h-11 sm:h-10 cursor-pointer"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto h-11 sm:h-10 cursor-pointer"
        >
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
