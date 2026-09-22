"use client";

import * as React from "react";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, RotateCcw, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

export interface FilterState {
  search: string;
  status: "ALL" | "ACTIVE" | "COMPLETED" | "all" | "active" | "completed" | string;
  priority?: "ALL" | "LOW" | "MEDIUM" | "HIGH" | "all" | "low" | "medium" | "high" | string;
  sortBy: string;
  sortOrder: "asc" | "desc" | string;
  sortOption?: string;
}

export interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onOpenCreateModal: () => void;
  isLoading?: boolean;
  activeView?: "grid" | "kanban";
}

export function TaskFilters({
  filters,
  onFilterChange,
  onOpenCreateModal,
  isLoading = false,
  activeView = "grid",
}: TaskFiltersProps) {
  // Determine current sort option from sortBy and sortOrder
  const currentSortOption = React.useMemo(() => {
    if (filters.sortOption) return filters.sortOption;
    if (filters.sortBy === "title") {
      return filters.sortOrder === "desc" ? "title-desc" : "title-asc";
    }
    if (filters.sortBy === "updatedAt") {
      return "updated";
    }
    if (filters.sortBy === "createdAt" && filters.sortOrder === "asc") {
      return "oldest";
    }
    return "newest";
  }, [filters.sortBy, filters.sortOrder, filters.sortOption]);

  const handleSearchChange = (searchVal: string) => {
    onFilterChange({ ...filters, search: searchVal });
  };

  const handleStatusChange = (val: string) => {
    onFilterChange({ ...filters, status: val });
  };

  const handlePriorityChange = (val: string) => {
    onFilterChange({ ...filters, priority: val });
  };

  const handleSortChange = (val: string) => {
    let sortBy = "createdAt";
    let sortOrder = "desc";

    switch (val) {
      case "oldest":
        sortBy = "createdAt";
        sortOrder = "asc";
        break;
      case "updated":
        sortBy = "updatedAt";
        sortOrder = "desc";
        break;
      case "title-asc":
        sortBy = "title";
        sortOrder = "asc";
        break;
      case "title-desc":
        sortBy = "title";
        sortOrder = "desc";
        break;
      case "newest":
      default:
        sortBy = "createdAt";
        sortOrder = "desc";
        break;
    }

    onFilterChange({
      ...filters,
      sortBy,
      sortOrder,
      sortOption: val,
    });
  };

  const resetFilters = () => {
    onFilterChange({
      search: "",
      status: "ALL",
      priority: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
      sortOption: "newest",
    });
  };

  const normalizedStatus = (filters.status || "ALL").toUpperCase();
  const normalizedPriority = (filters.priority || "ALL").toUpperCase();

  const isFiltered =
    Boolean(filters.search && filters.search.trim() !== "") ||
    (normalizedStatus !== "ALL") ||
    (normalizedPriority !== "ALL") ||
    currentSortOption !== "newest";

  const quickFilterTabs = [
    { label: "All", status: "ALL", icon: null },
    { label: "Active", status: "ACTIVE", icon: Clock },
    { label: "Completed", status: "COMPLETED", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-3.5 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-shadow">
      {/* Top row: Search + Quick Add */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <TaskSearch
          value={filters.search}
          onChange={handleSearchChange}
          isLoading={isLoading}
          placeholder={
            activeView === "kanban"
              ? "Search board cards..."
              : "Search tasks by title or description..."
          }
        />

        {/* Primary CTA button */}
        <Button
          onClick={onOpenCreateModal}
          className="h-10 px-5 gap-2 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto"
          aria-label="Add new task"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span className="font-semibold">+ Add Task</span>
        </Button>
      </div>

      {/* Quick Filter Pills Row: All, Active, Completed */}
      <div
        className="flex flex-wrap items-center gap-1.5 pt-1"
        role="tablist"
        aria-label="Task status filters"
      >
        {quickFilterTabs.map((tab) => {
          const isActive =
            normalizedStatus === tab.status ||
            (tab.status === "ACTIVE" && normalizedStatus === "PENDING");
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleStatusChange(tab.status)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Dropdown Controls: Status, Priority, Sort */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 pt-2.5 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        {/* Dropdowns container */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 min-w-0">
          {/* Status Dropdown */}
          <div className="w-full">
            <Select
              value={normalizedStatus === "PENDING" ? "ACTIVE" : normalizedStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                className="h-9 text-xs rounded-lg border-zinc-200 w-full"
                aria-label="Filter by status"
              >
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Status: All</SelectItem>
                <SelectItem value="ACTIVE">Status: Active</SelectItem>
                <SelectItem value="COMPLETED">Status: Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Dropdown (Supported at database level) */}
          <div className="w-full">
            <Select
              value={normalizedPriority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger
                className="h-9 text-xs rounded-lg border-zinc-200 w-full"
                aria-label="Filter by priority"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldAlert className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <SelectValue placeholder="Priority: All" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Priority: All</SelectItem>
                <SelectItem value="LOW">Priority: Low</SelectItem>
                <SelectItem value="MEDIUM">Priority: Medium</SelectItem>
                <SelectItem value="HIGH">Priority: High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full">
            <Select value={currentSortOption} onValueChange={handleSortChange}>
              <SelectTrigger
                className="h-9 text-xs rounded-lg border-zinc-200 w-full"
                aria-label="Sort tasks by"
              >
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 text-xs text-zinc-500 hover:text-zinc-900 gap-1 w-full sm:w-auto sm:ml-auto rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All
          </Button>
        )}
      </div>
    </div>
  );
}
