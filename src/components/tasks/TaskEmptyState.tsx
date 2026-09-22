"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Inbox, Plus, FilterX, SearchX } from "lucide-react";

export interface TaskEmptyStateProps {
  isFiltered?: boolean;
  filterStatus?: "ALL" | "ACTIVE" | "COMPLETED" | string;
  searchQuery?: string;
  onOpenCreateModal?: () => void;
  onClearFilter?: () => void;
  onClearSearch?: () => void;
}

export function TaskEmptyState({
  isFiltered = false,
  filterStatus = "ALL",
  searchQuery = "",
  onOpenCreateModal,
  onClearFilter,
  onClearSearch,
}: TaskEmptyStateProps) {
  // Case 2: No filtered or search results
  if (isFiltered) {
    const isSearchEmpty = Boolean(searchQuery && searchQuery.trim().length > 0);
    const normalizedStatus = (filterStatus || "ALL").toUpperCase();

    let title = "No matching tasks found";
    let message = "No tasks found matching your filter criteria.";
    let actionLabel = "Clear Filters";
    let actionHandler = onClearFilter;

    if (isSearchEmpty) {
      title = `No tasks found for "${searchQuery.trim()}"`;
      message = `We couldn't find any tasks matching "${searchQuery.trim()}". Try checking for typos or searching for a different keyword.`;
      actionLabel = "Clear Search";
      actionHandler = onClearSearch || onClearFilter;
    } else if (normalizedStatus === "COMPLETED") {
      title = "No completed tasks found";
      message = "You have not completed any tasks yet. Keep progressing!";
      actionLabel = "Clear Filters";
      actionHandler = onClearFilter;
    } else if (normalizedStatus === "ACTIVE" || normalizedStatus === "PENDING") {
      title = "No active tasks found";
      message = "All tasks are completed or no active tasks match your filters.";
      actionLabel = "Clear Filters";
      actionHandler = onClearFilter;
    }

    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center p-6 sm:p-12 text-center rounded-2xl border-2 border-dashed border-zinc-200/90 bg-white/80 backdrop-blur-md shadow-xs transition-all duration-300 animate-fade-in-up"
      >
        <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center mb-4 shadow-2xs">
          {isSearchEmpty ? (
            <SearchX className="h-8 w-8" />
          ) : (
            <FilterX className="h-8 w-8" />
          )}
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-1">{title}</h3>
        <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionHandler && (
            <Button
              variant="outline"
              onClick={actionHandler}
              className="gap-2 rounded-xl border-zinc-300 hover:bg-zinc-100 cursor-pointer"
            >
              {actionLabel}
            </Button>
          )}
          {onOpenCreateModal && (
            <Button
              onClick={onOpenCreateModal}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Case 1: No tasks created yet in entire account
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-6 sm:p-12 text-center rounded-2xl border-2 border-dashed border-zinc-200/90 bg-white/80 backdrop-blur-md shadow-xs transition-all duration-300 animate-fade-in-up"
    >
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/15 to-blue-600/20 text-blue-600 flex items-center justify-center mb-4 animate-float shadow-2xs">
        <Inbox className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-1">
        You don&apos;t have any tasks yet.
      </h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
        Create your first task to start organizing your workflow and reaching your goals.
      </p>
      {onOpenCreateModal && (
        <Button
          onClick={onOpenCreateModal}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 hover:scale-105 transition-transform cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      )}
    </div>
  );
}
