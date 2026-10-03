"use client";

import * as React from "react";
import { TaskCard } from "./taskcard/TaskCard";
import { TaskEmptyState } from "./TaskEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "@/components/ui/GoogleIcon";
import type { Task } from "@/types/task";

export interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  isFiltered?: boolean;
  filterStatus?: string;
  searchQuery?: string;
  onClearFilter?: () => void;
  onClearSearch?: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusToggle: (task: Task) => void;
  onOpenCreateModal: () => void;
  updatingTaskId?: string | null;
  onOpenZenMode?: () => void;
}

export function TaskList({
  tasks,
  isLoading,
  isError = false,
  errorMessage = null,
  onRetry,
  isFiltered = false,
  filterStatus = "ALL",
  searchQuery = "",
  onClearFilter,
  onClearSearch,
  onEdit,
  onDelete,
  onStatusToggle,
  onOpenCreateModal,
  updatingTaskId = null,
  onOpenZenMode,
}: TaskListProps) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading tasks"
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 border border-zinc-200/90 rounded-2xl bg-white/90 space-y-3.5 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-md" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-red-200 bg-red-50/70 backdrop-blur-md shadow-xs space-y-3.5 my-4"
      >
        <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-red-950">
            Failed to load tasks
          </h3>
          <p className="text-xs text-red-700 max-w-md mt-1">
            {errorMessage || "An unexpected error occurred while loading your tasks. Please try again."}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="rounded-xl border-red-200 bg-white hover:bg-red-50 text-red-700 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </Button>
        )}
      </div>
    );
  }

  // 3. Empty State (Handles both 'No Tasks' and 'No Filtered Results')
  if (tasks.length === 0) {
    return (
      <TaskEmptyState
        isFiltered={isFiltered}
        filterStatus={filterStatus}
        searchQuery={searchQuery}
        onOpenCreateModal={onOpenCreateModal}
        onClearFilter={onClearFilter}
        onClearSearch={onClearSearch}
        onOpenZenMode={onOpenZenMode}
      />
    );
  }

  // 4. Task List Grid
  return (
    <div
      role="list"
      aria-label="Tasks list"
      className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 animate-fade-in-up"
    >
      {tasks.map((task) => (
        <div role="listitem" key={task.id}>
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusToggle={onStatusToggle}
            isUpdating={updatingTaskId === task.id}
          />
        </div>
      ))}
    </div>
  );
}
