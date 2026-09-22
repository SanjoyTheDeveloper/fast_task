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
import { MoreVertical, Pencil, Trash2, ExternalLink, Clock, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TaskStatusBadge } from "../TaskStatusBadge";
import type { Task } from "@/types/task";

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

  const borderColor = isCompleted
    ? "border-l-emerald-500 hover:border-l-emerald-600"
    : "border-l-indigo-500 hover:border-l-indigo-600";

  return (
    <Card
      className={`group relative border-l-4 ${borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-zinc-200/90 bg-white/95 backdrop-blur-xs`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {isUpdating ? (
              <div className="mt-1 h-4 w-4 flex items-center justify-center shrink-0">
                <Loader2 className="h-3.5 w-3.5 text-blue-600 animate-spin" />
              </div>
            ) : (
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => onStatusToggle(task)}
                disabled={isUpdating}
                className="mt-1 shrink-0 transition-transform duration-200 group-hover:scale-110 active:scale-95 cursor-pointer"
                aria-label={isCompleted ? "Mark task as active" : "Mark task as completed"}
              />
            )}
            <div className="space-y-1 flex-1 min-w-0">
              <Link
                href={`/task/${task.id}`}
                className={`font-semibold text-base block hover:text-blue-600 transition-colors break-words line-clamp-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm ${
                  isCompleted ? "line-through text-zinc-400" : "text-zinc-900"
                }`}
              >
                {task.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5">
                <TaskStatusBadge completed={isCompleted} />
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-zinc-400 hover:text-zinc-800 transition-transform group-hover:scale-105 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
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

      <CardFooter className="px-4 py-3 pt-2 border-t border-zinc-100/90 flex items-center justify-between text-xs text-zinc-500 mt-2 bg-zinc-50/40">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
