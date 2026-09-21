"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  ArrowRight,
  GripVertical,
  CheckCircle2,
  Circle,
  Timer,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { TaskItem } from "./taskform/task-form";

interface KanbanBoardProps {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
  onStatusToggle: (task: TaskItem) => void;
  onStatusChange?: (taskId: string, newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => void;
  onOpenCreateModal: (defaultStatus?: "PENDING" | "IN_PROGRESS" | "COMPLETED") => void;
}

export function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusToggle,
  onStatusChange,
  onOpenCreateModal,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);

  const columns = [
    {
      id: "PENDING" as const,
      title: "To Do",
      subtitle: "Backlog & Planned",
      badgeVariant: "pending",
      icon: Circle,
      topAccent: "from-slate-500 to-zinc-600",
      accentBorder: "border-l-zinc-400",
      items: tasks.filter((t) => t.status === "PENDING"),
    },
    {
      id: "IN_PROGRESS" as const,
      title: "In Progress",
      subtitle: "Actively Working",
      badgeVariant: "in_progress",
      icon: Timer,
      topAccent: "from-blue-500 to-indigo-600",
      accentBorder: "border-l-blue-500",
      items: tasks.filter((t) => t.status === "IN_PROGRESS"),
    },
    {
      id: "COMPLETED" as const,
      title: "Completed",
      subtitle: "Done & Verified",
      badgeVariant: "completed",
      icon: CheckCircle2,
      topAccent: "from-emerald-500 to-teal-600",
      accentBorder: "border-l-emerald-500",
      items: tasks.filter((t) => t.status === "COMPLETED"),
    },
  ];

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: string) => {
    // Only clear if leaving the column element itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);
    setDragOverCol(null);

    if (taskId && onStatusChange) {
      onStatusChange(taskId, colId);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Visual instructions banner */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-700">
        <span className="flex items-center gap-1.5 font-medium">
          <GripVertical className="h-4 w-4 text-blue-500" />
          Drag and drop any task card between columns to update its status instantly.
        </span>
        <span className="font-semibold text-blue-600 bg-white px-2 py-0.5 rounded-md border border-blue-200/60 shadow-2xs">
          Interactive Kanban
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const ColIcon = col.icon;
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`relative flex flex-col rounded-2xl border transition-all duration-300 p-4 min-h-[520px] shadow-xs overflow-hidden ${
                isOver
                  ? "border-blue-400 bg-blue-50/40 ring-2 ring-blue-400/20 shadow-lg scale-[1.01]"
                  : "border-zinc-200/80 bg-zinc-50/60 backdrop-blur-xs hover:shadow-md"
              }`}
            >
              {/* Column top gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${col.topAccent}`} />

              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 mb-3.5 mt-1">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-white shadow-2xs text-zinc-700`}>
                    <ColIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-zinc-900 tracking-tight block">
                      {col.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {col.subtitle}
                    </span>
                  </div>
                  <Badge variant={col.badgeVariant as any} className="text-xs font-bold px-2 py-0.5 ml-1">
                    {col.items.length}
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenCreateModal(col.id)}
                  className="h-7 px-2.5 text-xs text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>

              {/* Column Tasks Container */}
              <div className="flex-1 space-y-3">
                {col.items.length === 0 ? (
                  <div
                    className={`flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors text-xs text-zinc-400 ${
                      isOver
                        ? "border-blue-400 bg-blue-100/30 text-blue-600 font-semibold"
                        : "border-zinc-200/90 bg-white/40"
                    }`}
                  >
                    <span>{isOver ? "Release to drop task here" : "No tasks in this stage"}</span>
                    {!isOver && (
                      <button
                        onClick={() => onOpenCreateModal(col.id)}
                        className="mt-2 text-blue-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Plus className="h-3 w-3" /> Add a task
                      </button>
                    )}
                  </div>
                ) : (
                  col.items.map((task) => {
                    const isDraggingThis = draggedTaskId === task.id;
                    const priorityBorderColor =
                      task.priority === "HIGH"
                        ? "border-l-rose-500"
                        : task.priority === "MEDIUM"
                        ? "border-l-amber-500"
                        : "border-l-emerald-500";

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${
                          isDraggingThis ? "opacity-40 scale-95" : "hover:-translate-y-0.5"
                        }`}
                      >
                        <Card
                          className={`relative border-l-4 ${priorityBorderColor} border-zinc-200/90 bg-white shadow-xs hover:shadow-md transition-shadow group`}
                        >
                          <CardHeader className="p-3.5 pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <GripVertical className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 mt-0.5 shrink-0" />
                                <div className="space-y-1 flex-1 min-w-0">
                                  <Link
                                    href={`/task/${task.id}`}
                                    className="font-semibold text-sm block hover:text-blue-600 transition-colors truncate text-zinc-900"
                                  >
                                    {task.title}
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-1">
                                    <Badge
                                      variant={
                                        task.priority === "HIGH"
                                          ? "high"
                                          : task.priority === "MEDIUM"
                                          ? "medium"
                                          : "low"
                                      }
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {task.priority.toLowerCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Card Actions */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-zinc-400 hover:text-zinc-800"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44 shadow-lg">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/task/${task.id}`}>
                                      <ExternalLink className="mr-2 h-4 w-4 text-zinc-500" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onEdit(task)}>
                                    <Pencil className="mr-2 h-4 w-4 text-zinc-500" />
                                    Edit Task
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {/* Quick move status actions */}
                                  {col.id !== "PENDING" && onStatusChange && (
                                    <DropdownMenuItem onClick={() => onStatusChange(task.id, "PENDING")}>
                                      <ArrowRight className="mr-2 h-4 w-4 text-zinc-500 rotate-180" />
                                      Move to To Do
                                    </DropdownMenuItem>
                                  )}
                                  {col.id !== "IN_PROGRESS" && onStatusChange && (
                                    <DropdownMenuItem onClick={() => onStatusChange(task.id, "IN_PROGRESS")}>
                                      <ArrowRight className="mr-2 h-4 w-4 text-blue-500" />
                                      Move to In Progress
                                    </DropdownMenuItem>
                                  )}
                                  {col.id !== "COMPLETED" && onStatusChange && (
                                    <DropdownMenuItem onClick={() => onStatusChange(task.id, "COMPLETED")}>
                                      <ArrowRight className="mr-2 h-4 w-4 text-emerald-500" />
                                      Move to Completed
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => onDelete(task.id)}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Task
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>

                          {task.description && (
                            <CardContent className="px-3.5 py-1.5 pt-0">
                              <p className="text-xs text-zinc-500 line-clamp-2 pl-6 leading-relaxed">
                                {task.description}
                              </p>
                            </CardContent>
                          )}

                          <CardFooter className="px-3.5 py-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 bg-zinc-50/40 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(task.createdAt)}</span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 font-medium text-zinc-700 bg-white px-1.5 py-0.5 rounded border border-zinc-200/60 shadow-2xs">
                                <Calendar className="h-3 w-3 text-blue-600" />
                                <span>{formatDate(task.dueDate)}</span>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      </div>
                    );
                  })
                )}

                {/* Drop placeholder while dragging over this column */}
                {isOver && draggedTaskId && (
                  <div className="h-16 rounded-xl border-2 border-dashed border-blue-400 bg-blue-100/40 flex items-center justify-center text-xs font-semibold text-blue-600 animate-pulse">
                    Drop here to move to {col.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
