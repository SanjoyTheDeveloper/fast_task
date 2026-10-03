"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Inbox, Plus, FilterX, SearchX } from "@/components/ui/GoogleIcon";
import { FocusPomodoro } from "@/components/dashboard/FocusPomodoro";

export interface TaskEmptyStateProps {
  isFiltered?: boolean;
  filterStatus?: "ALL" | "ACTIVE" | "COMPLETED" | string;
  searchQuery?: string;
  onOpenCreateModal?: () => void;
  onClearFilter?: () => void;
  onClearSearch?: () => void;
  onOpenZenMode?: () => void;
}

export function TaskEmptyState({
  isFiltered = false,
  filterStatus = "ALL",
  searchQuery = "",
  onOpenCreateModal,
  onClearFilter,
  onClearSearch,
  onOpenZenMode,
}: TaskEmptyStateProps) {
  // Case 1: No matching filtered or search results
  if (isFiltered) {
    const isSearchEmpty = Boolean(searchQuery && searchQuery.trim().length > 0);
    const normalizedStatus = (filterStatus || "ALL").toUpperCase();

    let title = "No matching tasks found";
    let message = "No tasks found matching your filter criteria.";
    let actionLabel = "Clear Filters";
    let actionHandler = onClearFilter;

    if (isSearchEmpty) {
      title = `No tasks found for "${searchQuery.trim()}"`;
      message = `We couldn't find any tasks matching "${searchQuery.trim()}". Try checking for typos or clear your search query.`;
      actionLabel = "Clear Search";
      actionHandler = onClearSearch || onClearFilter;
    } else if (normalizedStatus === "COMPLETED") {
      title = "No completed tasks yet";
      message = "You haven't completed any tasks yet. Keep moving forward!";
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
        className="w-full flex flex-col items-center justify-center py-16 px-6 sm:px-12 text-center rounded-2xl border border-dashed border-zinc-300/80 bg-white/70 backdrop-blur-md shadow-xs transition-all duration-300 animate-fade-in-up"
      >
        <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center mb-4 shadow-2xs">
          {isSearchEmpty ? (
            <SearchX className="h-6 w-6 stroke-[2.2]" />
          ) : (
            <FilterX className="h-6 w-6 stroke-[2.2]" />
          )}
        </div>
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{title}</h3>
        <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {actionHandler && (
            <Button
              variant="outline"
              onClick={actionHandler}
              className="h-10 px-4 rounded-xl border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium cursor-pointer"
            >
              {actionLabel}
            </Button>
          )}
          {onOpenCreateModal && (
            <Button
              onClick={onOpenCreateModal}
              className="h-10 px-5 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm shadow-blue-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Create Task</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Case 2: No tasks created yet in entire account
  return (
    <div className="w-full space-y-6">
      <div
        role="status"
        aria-live="polite"
        className="w-full flex flex-col items-center justify-center py-16 px-6 sm:px-12 text-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white shadow-2xs transition-all duration-300 animate-fade-in-up"
      >
        <div className="h-14 w-14 rounded-2xl bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center mb-4 shadow-2xs">
          <Inbox className="h-6 w-6 stroke-[2.2]" />
        </div>
        <h3 className="text-base font-bold text-[#172033] tracking-tight">
          You don&apos;t have any tasks yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
          Create your first task or add an assignment to get started.
        </p>
        {onOpenCreateModal && (
          <Button
            onClick={onOpenCreateModal}
            className="h-10 px-5 gap-2 bg-[#315BFF] hover:bg-[#254BE3] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Assignment</span>
          </Button>
        )}
      </div>

      {/* Focus Pomodoro Shifted Directly Under Add Assignment */}
      <div className="w-full">
        <FocusPomodoro onOpenZenMode={onOpenZenMode} />
      </div>
    </div>
  );
}
