"use client";

import * as React from "react";
import Link from "next/link";
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
  Sparkles,
  Calendar,
  AlertCircle,
  Tag,
} from "@/components/ui/GoogleIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types/task";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusToggle: (task: Task) => void;
  onStatusChange?: (taskId: string, completed: boolean) => void;
  onOpenCreateModal: (defaultCompleted?: boolean) => void;
  onLoadStarterTasks?: () => void;
}

export function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusToggle,
  onStatusChange,
  onOpenCreateModal,
  onLoadStarterTasks,
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
      subtitle: "Pending & Active Studies",
      dotColor: "bg-blue-600",
      badgeColor: "bg-blue-100 text-blue-700",
      borderColor: "hover:border-blue-300",
      items: pendingTasks,
    },
    {
      id: "COMPLETED" as const,
      completedValue: true,
      title: "Completed",
      subtitle: "Finished & Verified",
      dotColor: "bg-emerald-600",
      badgeColor: "bg-emerald-100 text-emerald-700",
      borderColor: "hover:border-emerald-300",
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
    <div className="space-y-4">
      {/* Top Helper Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs text-slate-600">
        <span className="flex items-center gap-2 font-medium">
          <GripVertical className="h-4 w-4 text-slate-400" />
          <span>Drag and drop cards across columns to progress work in real time.</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-500">
            {tasks.length} total tasks
          </span>
          {onLoadStarterTasks && tasks.length === 0 && (
            <button
              type="button"
              onClick={onLoadStarterTasks}
              className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Reset Sample Tasks</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {columns.map((col) => {
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.completedValue)}
              className={`flex flex-col rounded-2xl border transition-all duration-200 min-h-[580px] p-3.5 space-y-3 ${
                isOver
                  ? "border-blue-400 bg-blue-50/50 shadow-md ring-2 ring-blue-400/20"
                  : "border-slate-200/80 bg-slate-100/70"
              }`}
            >
              {/* Column Header (Linear / Jira style) */}
              <div className="flex items-center justify-between pb-2 px-1 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor} shrink-0`} />
                  <h3 className="font-bold text-sm text-slate-800 tracking-tight">
                    {col.title}
                  </h3>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${col.badgeColor}`}>
                    {col.items.length}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenCreateModal(col.completedValue)}
                  className="h-7 px-2 text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/80 gap-1 cursor-pointer"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Cards List inside column */}
              <div className="space-y-3 flex-1 flex flex-col">
                {col.items.length === 0 ? (
                  /* Compact Human Dropzone (No giant cartoon voids!) */
                  <div
                    onClick={() => onOpenCreateModal(col.completedValue)}
                    className="h-28 rounded-xl border-2 border-dashed border-slate-300/80 hover:border-blue-400 bg-white/40 hover:bg-white/80 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition-all cursor-pointer text-xs gap-1 group"
                  >
                    <div className="flex items-center gap-1 font-semibold text-slate-600 group-hover:text-blue-600">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add a task to {col.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      or drag cards into this column
                    </span>
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
                        className={`group relative bg-white rounded-xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-md transition-all duration-150 p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing ${
                          isDraggingThis ? "opacity-40 scale-95" : ""
                        }`}
                      >
                        {/* Card Top Row: Course Tag & Priority & Dropdown Menu */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            {task.course && (
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70 font-bold text-[10px] tracking-wide shrink-0">
                                {task.course}
                              </span>
                            )}
                            {task.priority && (
                              <span
                                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] flex items-center gap-1 shrink-0 ${
                                  task.priority === "HIGH"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200/70"
                                    : task.priority === "MEDIUM"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200/70"
                                    : "bg-slate-50 text-slate-600 border border-slate-200/70"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    task.priority === "HIGH"
                                      ? "bg-rose-500"
                                      : task.priority === "MEDIUM"
                                      ? "bg-amber-500"
                                      : "bg-slate-400"
                                  }`}
                                />
                                <span>{task.priority}</span>
                              </span>
                            )}
                          </div>

                          {/* Menu dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-slate-800 rounded-md"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 shadow-lg">
                              <DropdownMenuItem asChild>
                                <Link href={`/task/${task.id}`}>
                                  <ExternalLink className="mr-2 h-4 w-4 text-slate-500" />
                                  <span>View Details</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit(task)}>
                                <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                                <span>Edit Task</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {onStatusChange && (
                                <DropdownMenuItem
                                  onClick={() => onStatusChange(task.id, !task.completed)}
                                >
                                  <ArrowRight className="mr-2 h-4 w-4 text-blue-500" />
                                  <span>Mark as {task.completed ? "To Do" : "Completed"}</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(task.id)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Task</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Card Title & Description */}
                        <div>
                          <h4
                            onClick={() => onEdit(task)}
                            className={`text-xs sm:text-sm font-bold leading-snug cursor-pointer hover:text-blue-600 transition-colors line-clamp-2 ${
                              task.completed ? "line-through text-slate-400" : "text-slate-900"
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Card Bottom Row: Date & Status Action Button */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>
                              {task.dueDate
                                ? `Due ${formatDate(task.dueDate)}`
                                : formatDate(task.createdAt)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange && onStatusChange(task.id, !task.completed);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              task.completed
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70"
                            }`}
                          >
                            {task.completed ? (
                              <>
                                <ArrowRight className="h-3 w-3 rotate-180" />
                                <span>To Do</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>Done</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Drop placeholder while dragging over this column */}
                {isOver && draggedTaskId && (
                  <div className="h-16 rounded-xl border-2 border-dashed border-blue-400 bg-blue-100/40 flex items-center justify-center text-blue-600 font-bold text-xs animate-pulse">
                    Drop task here
                  </div>
                )}
              </div>

              {/* Bottom Quick-Add Row (Trello / Linear style) */}
              <button
                type="button"
                onClick={() => onOpenCreateModal(col.completedValue)}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add a task to {col.title}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
