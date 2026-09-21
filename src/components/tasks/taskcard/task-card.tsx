"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, Pencil, Trash2, ExternalLink, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { TaskItem } from "../taskform/task-form";

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
  onStatusToggle: (task: TaskItem) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusToggle }: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";

  const priorityBadgeVariant =
    task.priority === "HIGH"
      ? "high"
      : task.priority === "MEDIUM"
      ? "medium"
      : "low";

  const statusBadgeVariant =
    task.status === "COMPLETED"
      ? "completed"
      : task.status === "IN_PROGRESS"
      ? "in_progress"
      : "pending";

  const statusLabel =
    task.status === "COMPLETED"
      ? "Completed"
      : task.status === "IN_PROGRESS"
      ? "In Progress"
      : "Pending";

  const priorityBorderColor =
    task.priority === "HIGH"
      ? "border-l-rose-500 hover:border-l-rose-600"
      : task.priority === "MEDIUM"
      ? "border-l-amber-500 hover:border-l-amber-600"
      : "border-l-emerald-500 hover:border-l-emerald-600";

  return (
    <Card
      className={`group relative border-l-4 ${priorityBorderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-zinc-200/90 bg-white/95 backdrop-blur-xs`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onStatusToggle(task)}
              className="mt-1 transition-transform duration-200 group-hover:scale-110 active:scale-95"
              aria-label={`Mark task ${task.title} as ${isCompleted ? "pending" : "completed"}`}
            />
            <div className="space-y-1 flex-1 min-w-0">
              <Link
                href={`/task/${task.id}`}
                className={`font-semibold text-base block hover:text-blue-600 transition-colors truncate ${
                  isCompleted ? "line-through text-zinc-400" : "text-zinc-900"
                }`}
              >
                {task.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={statusBadgeVariant as any} className="transition-transform group-hover:scale-105">
                  {statusLabel}
                </Badge>
                <Badge variant={priorityBadgeVariant as any} className="transition-transform group-hover:scale-105">
                  {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-800 transition-transform group-hover:scale-105"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Task actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 shadow-xl border-zinc-200">
              <DropdownMenuItem asChild>
                <Link href={`/task/${task.id}`} className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4 text-zinc-500" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 h-4 w-4 text-zinc-500" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {task.description && (
        <CardContent className="px-4 py-2 pt-0">
          <p className="text-sm text-zinc-600 line-clamp-2 pl-7 leading-relaxed">
            {task.description}
          </p>
        </CardContent>
      )}

      <CardFooter className="px-4 py-3 pt-2 border-t border-zinc-100/90 flex items-center justify-between text-xs text-zinc-500 mt-2 bg-zinc-50/40">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(task.createdAt)}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1.5 font-medium text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-200/60 shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
