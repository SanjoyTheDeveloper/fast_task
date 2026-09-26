"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Calendar, GraduationCap, Tag, ChevronDown } from "lucide-react";
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
      course: initialData?.course || "0611CSE321",
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
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600 border border-red-200/80">
          {serverError}
        </div>
      )}

      {/* Task Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1" htmlFor="task-title">
          <span>Title</span>
          <span className="text-red-500">*</span>
        </label>
        <Input
          id="task-title"
          placeholder="e.g. Design landing page hero section"
          {...register("title")}
          className={`h-11 px-3.5 text-sm rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-[#315BFF]/10 focus-visible:border-[#315BFF] transition ${
            errors.title ? "border-red-500 focus-visible:ring-red-500/15 focus-visible:border-red-500" : ""
          }`}
        />
        {errors.title && (
          <p className="text-xs font-medium text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Task Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600" htmlFor="task-description">
          Description
        </label>
        <Textarea
          id="task-description"
          rows={3}
          placeholder="Provide context, acceptance criteria, or relevant links..."
          {...register("description")}
          className={`min-h-[96px] p-3 text-sm rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-[#315BFF]/10 focus-visible:border-[#315BFF] transition resize-none leading-relaxed ${
            errors.description ? "border-red-500 focus-visible:ring-red-500/15 focus-visible:border-red-500" : ""
          }`}
        />
        {errors.description && (
          <p className="text-xs font-medium text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Course / Subject & Task Type Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Course / Subject Dropdown (Dark Dropdown) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5" htmlFor="task-course">
            <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
            <span>Course / Subject</span>
          </label>
          <div className="relative">
            <select
              id="task-course"
              value={selectedCourse || "0611CSE321"}
              onChange={(e) => setValue("course", e.target.value)}
              className="w-full h-11 pl-3.5 pr-9 text-sm font-medium rounded-xl bg-slate-900 text-white border border-slate-700/80 focus:outline-none focus:border-[#315BFF] focus:ring-4 focus:ring-[#315BFF]/20 transition cursor-pointer appearance-none shadow-xs"
            >
              {COURSES.map((c) => {
                const labelMap: Record<string, string> = {
                  "0611CSE321": "0611CSE321 • AIES",
                  "0613CSE333": "0613CSE333 • AP",
                  "0541MAT337": "0541MAT337 • MACS",
                  "0612CSE315": "0612CSE315 • CN",
                  "0031CSE320": "0031CSE320 • TWRM",
                  "0612CSE316": "0612CSE316 • CN Sess.",
                  "0611CSE322": "0611CSE322 • AIES Sess.",
                  "0613CSE334": "0613CSE334 • AP Sess.",
                  General: "General Routine / Academic",
                };
                return (
                  <option key={c} value={c} className="bg-slate-900 text-white py-1.5">
                    {labelMap[c] || c}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Task Type Dropdown (Dark Dropdown) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5" htmlFor="task-category">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <span>Task Type</span>
          </label>
          <div className="relative">
            <select
              id="task-category"
              value={selectedCategory || "Assignment"}
              onChange={(e) => setValue("category", e.target.value)}
              className="w-full h-11 pl-3.5 pr-9 text-sm font-medium rounded-xl bg-slate-900 text-white border border-slate-700/80 focus:outline-none focus:border-[#315BFF] focus:ring-4 focus:ring-[#315BFF]/20 transition cursor-pointer appearance-none shadow-xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white py-1.5">
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Due Date Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5" htmlFor="task-due-date">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Due Date</span>
          </label>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setValue("dueDate", new Date().toISOString().split("T")[0])}
              className="text-[#315BFF] hover:text-[#254BE3] font-semibold hover:underline cursor-pointer transition-colors"
            >
              Today
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setValue("dueDate", tomorrow.toISOString().split("T")[0]);
              }}
              className="text-[#315BFF] hover:text-[#254BE3] font-semibold hover:underline cursor-pointer transition-colors"
            >
              Tomorrow
            </button>
            {selectedDueDate && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setValue("dueDate", "")}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Calendar className="h-4 w-4" />
          </div>
          <Input
            id="task-due-date"
            type="date"
            placeholder="mm/dd/yyyy"
            {...register("dueDate")}
            className="h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-[#315BFF]/10 focus-visible:border-[#315BFF] transition"
          />
        </div>
      </div>

      {/* Completed Status Checkbox */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
        <div className="flex items-center space-x-2.5">
          <Checkbox
            id="task-form-completed"
            checked={isCompleted}
            onCheckedChange={(checked) => setValue("completed", Boolean(checked))}
            className="h-4 w-4 rounded-md border-slate-300 data-[state=checked]:bg-[#315BFF] data-[state=checked]:border-[#315BFF]"
          />
          <label
            htmlFor="task-form-completed"
            className="text-sm font-medium text-slate-800 cursor-pointer select-none"
          >
            Mark as completed
          </label>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
            isCompleted
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-slate-200/70 text-slate-600 border border-slate-300/60"
          }`}
        >
          {isCompleted ? "Completed" : "Pending"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold w-full sm:w-auto h-11 px-5 cursor-pointer shadow-2xs transition active:scale-[0.99]"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#315BFF] hover:bg-[#254BE3] text-white font-semibold w-full sm:w-auto h-11 px-6 shadow-md shadow-blue-500/25 transition active:scale-[0.99] cursor-pointer"
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
