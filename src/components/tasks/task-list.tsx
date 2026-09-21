"use client";

import * as React from "react";
import { TaskCard } from "./taskcard/task-card";
import type { TaskItem } from "./taskform/task-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Inbox, Sparkles } from "lucide-react";

interface TaskListProps {
  tasks: TaskItem[];
  isLoading: boolean;
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
  onStatusToggle: (task: TaskItem) => void;
  onOpenCreateModal: () => void;
}

export function TaskList({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusToggle,
  onOpenCreateModal,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 border border-zinc-200 rounded-xl bg-white space-y-3.5 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-zinc-200/90 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/15 to-blue-600/20 text-blue-600 flex items-center justify-center mb-4 animate-float shadow-sm">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-1">No tasks found</h3>
        <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
          You don&apos;t have any tasks matching your filters. Create a new task or adjust your filters to get started.
        </p>
        <Button onClick={onOpenCreateModal} className="gap-2 shadow-md shadow-blue-500/20 hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" />
          Create First Task
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusToggle={onStatusToggle}
        />
      ))}
    </div>
  );
}
