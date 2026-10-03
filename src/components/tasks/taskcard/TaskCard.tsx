"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, ExternalLink, Clock, Loader2, Calendar } from "@/components/ui/GoogleIcon";
import { formatDate } from "@/lib/utils";
import { TaskStatusBadge } from "../TaskStatusBadge";
import type { Task } from "@/types/task";
import { COURSE_BADGES, CATEGORY_STYLES } from "@/lib/academic";

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusToggle: (task: Task) => void;
  isUpdating?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusToggle,
  isUpdating = false,
}: TaskCardProps) {
  const isCompleted = task.completed;

  // Determine if task is due soon (within 72 hours)
  const isDueSoon = React.useMemo(() => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 72;
  }, [task.dueDate, task.completed]);

  const borderColor = isCompleted
    ? "border-l-emerald-500 hover:border-l-emerald-600"
    : isDueSoon
    ? "border-l-amber-500 hover:border-l-amber-600"
    : "border-l-indigo-500 hover:border-l-indigo-600";

  return (
    <Card
      className={`group relative border-l-4 ${borderColor} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300/90 border-slate-200/80 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {isUpdating ? (
              <div className="mt-1 h-5 w-5 flex items-center justify-center shrink-0">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="mt-0.5 flex items-center justify-center min-w-[32px] min-h-[32px]">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => onStatusToggle(task)}
                  disabled={isUpdating}
                  className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 active:scale-95 cursor-pointer rounded-md border-slate-300"
                  aria-label={isCompleted ? "Mark task as active" : "Mark task as completed"}
                />
              </div>
            )}
            <div className="space-y-1.5 flex-1 min-w-0">
              <Link
                href={`/task/${task.id}`}
                className={`font-semibold text-base block hover:text-indigo-600 transition-colors break-words line-clamp-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm tracking-tight py-0.5 ${
                  isCompleted ? "line-through text-slate-400" : "text-slate-900"
                }`}
              >
                {task.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {task.course && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                      COURSE_BADGES[task.course]
                        ? `${COURSE_BADGES[task.course].bg} ${COURSE_BADGES[task.course].text} ${COURSE_BADGES[task.course].border}`
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}
                  >
                    {task.course}
                  </span>
                )}
                {task.category && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                      CATEGORY_STYLES[task.category]
                        ? `${CATEGORY_STYLES[task.category].bg} ${CATEGORY_STYLES[task.category].border}`
                        : "bg-zinc-50 text-zinc-700 border-zinc-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        CATEGORY_STYLES[task.category]?.dot || "bg-zinc-400"
                      }`}
                    />
                    {task.category}
                  </span>
                )}
                <TaskStatusBadge completed={isCompleted} dueSoon={isDueSoon} />
              </div>
            </div>
          </div>

          {/* Action Menu (Touch-friendly 44px min tap area on mobile) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 sm:h-9 sm:w-9 shrink-0 text-slate-400 hover:text-slate-800 transition-transform group-hover:scale-105 rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label="Task actions"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 shadow-xl border-zinc-200">
              <DropdownMenuItem asChild>
                <Link href={`/task/${task.id}`} className="flex items-center cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4 text-zinc-500" />
                  <span>View Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(task)}
                className="cursor-pointer"
                aria-label="Edit task"
              >
                <Pencil className="mr-2 h-4 w-4 text-zinc-500" />
                <span>Edit Task</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                aria-label="Delete task"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {task.description && (
        <CardContent className="px-4 py-2 pt-0">
          <p className="text-sm text-zinc-600 line-clamp-2 pl-7 leading-relaxed break-words">
            {task.description}
          </p>
        </CardContent>
      )}

      <CardFooter className="px-4 py-2.5 border-t border-zinc-100/90 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 mt-2 bg-zinc-50/40">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(task.createdAt)}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <Calendar className="h-3 w-3" />
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
