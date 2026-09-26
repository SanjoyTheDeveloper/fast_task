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
  Clock,
  ArrowRight,
  GripVertical,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types/task";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusToggle: (task: Task) => void;
  onStatusChange?: (taskId: string, completed: boolean) => void;
  onOpenCreateModal: (defaultCompleted?: boolean) => void;
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

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const columns = [
    {
      id: "PENDING" as const,
      completedValue: false,
      title: "To Do",
      subtitle: "Pending & Active Tasks",
      badgeVariant: "pending",
      icon: Circle,
      topAccent: "from-blue-500 to-indigo-600",
      accentBorder: "border-l-indigo-500",
      items: pendingTasks,
    },
    {
      id: "COMPLETED" as const,
      completedValue: true,
      title: "Completed",
      subtitle: "Done & Verified",
      badgeVariant: "completed",
      icon: CheckCircle2,
      topAccent: "from-emerald-500 to-teal-600",
      accentBorder: "border-l-emerald-500",
      items: completedTasks,
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
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent, completedValue: boolean) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);
    setDragOverCol(null);

    if (taskId && onStatusChange) {
      onStatusChange(taskId, completedValue);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Visual instructions banner */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-700">
        <span className="flex items-center gap-1.5 font-medium">
          <GripVertical className="h-4 w-4 text-blue-500" />
          Drag and drop any task card between columns to update its status instantly.
        </span>
        <span className="text-[11px] text-blue-500 font-semibold hidden sm:inline">
          {tasks.length} total tasks
        </span>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {columns.map((col) => {
          const Icon = col.icon;
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.completedValue)}
              className={`flex flex-col rounded-2xl border transition-all duration-300 min-h-[240px] sm:min-h-[400px] md:min-h-[500px] ${
                isOver
                  ? "border-blue-400 bg-blue-50/40 shadow-md ring-2 ring-blue-400/30 scale-[1.01]"
                  : "border-zinc-200/90 bg-zinc-100/50 hover:border-zinc-300 shadow-2xs"
              }`}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-zinc-200/80 bg-white/80 rounded-t-2xl backdrop-blur-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-lg bg-gradient-to-br ${col.topAccent} text-white flex items-center justify-center shadow-xs`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-zinc-900 leading-none">
                        {col.title}
                      </h3>
                      <Badge
                        variant={col.badgeVariant as any}
                        className="text-xs px-2 py-0.5 rounded-full"
                      >
                        {col.items.length}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{col.subtitle}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenCreateModal(col.completedValue)}
                  className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Column Tasks List */}
              <div className="p-3 space-y-3 flex-1 flex flex-col">
                {col.items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl border-2 border-dashed border-zinc-200/70 text-zinc-400 my-2">
                    <p className="text-xs font-medium">No tasks in {col.title}</p>
                    <button
                      onClick={() => onOpenCreateModal(col.completedValue)}
                      className="mt-2 text-blue-600 hover:underline flex items-center gap-1 font-medium text-xs cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add a task
                    </button>
                  </div>
                ) : (
                  col.items.map((task) => {
                    const isDraggingThis = draggedTaskId === task.id;

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
                          className={`relative border-l-4 ${col.accentBorder} border-zinc-200/90 bg-white shadow-xs hover:shadow-md transition-shadow group`}
                        >
                          <CardHeader className="p-3.5 pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <GripVertical className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 mt-0.5 shrink-0" />
                                <div className="space-y-1 flex-1 min-w-0">
                                  <Link
                                    href={`/task/${task.id}`}
                                    className={`font-semibold text-sm block hover:text-blue-600 transition-colors truncate ${
                                      task.completed ? "line-through text-zinc-400" : "text-zinc-900"
                                    }`}
                                  >
                                    {task.title}
                                  </Link>
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
                                  {onStatusChange && (
                                    <DropdownMenuItem
                                      onClick={() => onStatusChange(task.id, !task.completed)}
                                    >
                                      <ArrowRight className="mr-2 h-4 w-4 text-blue-500" />
                                      Mark as {task.completed ? "To Do" : "Completed"}
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
                            {onStatusChange && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStatusChange(task.id, !task.completed);
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold transition-all active:scale-95 cursor-pointer ${
                                  task.completed
                                    ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/70"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70"
                                }`}
                                title={task.completed ? "Move to To Do" : "Mark as Completed"}
                                aria-label={task.completed ? "Move task to To Do" : "Move task to Completed"}
                              >
                                {task.completed ? (
                                  <>
                                    <ArrowRight className="h-3 w-3 rotate-180" />
                                    <span>To Do</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Done</span>
                                  </>
                                )}
                              </button>
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
