"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus, SlidersHorizontal, RotateCcw, X, Flame } from "lucide-react";

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  sortBy: "newest" | "oldest" | "dueDate" | "priority";
}

export interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onOpenCreateModal: () => void;
  activeView?: "grid" | "kanban";
}

export function TaskFilters({
  filters,
  onFilterChange,
  onOpenCreateModal,
  activeView = "grid",
}: TaskFiltersProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (val: string) => {
    onFilterChange({ ...filters, status: val });
  };

  const handlePriorityChange = (val: string) => {
    onFilterChange({ ...filters, priority: val });
  };

  const handleSortChange = (val: any) => {
    onFilterChange({ ...filters, sortBy: val });
  };

  const resetFilters = () => {
    onFilterChange({
      search: "",
      status: "ALL",
      priority: "ALL",
      sortBy: "newest",
    });
  };

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "ALL" ||
    filters.priority !== "ALL" ||
    filters.sortBy !== "newest";

  // When in Kanban mode, show filters that make sense for multi-column workflow
  const quickFilterTabs = activeView === "kanban"
    ? [
        { label: "All Columns", status: "ALL", priority: "ALL" },
        { label: "High Priority", status: "ALL", priority: "HIGH" },
        { label: "Medium Priority", status: "ALL", priority: "MEDIUM" },
        { label: "Low Priority", status: "ALL", priority: "LOW" },
      ]
    : [
        { label: "All Tasks", status: "ALL", priority: "ALL" },
        { label: "Pending", status: "PENDING", priority: "ALL" },
        { label: "In Progress", status: "IN_PROGRESS", priority: "ALL" },
        { label: "Completed", status: "COMPLETED", priority: "ALL" },
        { label: "High Priority", status: "ALL", priority: "HIGH" },
      ];

  return (
    <div className="space-y-3.5 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-shadow">
      {/* Top row: Search + Quick Add */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input with shortcut badge and clear button */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
          <Input
            ref={searchInputRef}
            placeholder={activeView === "kanban" ? "Search board cards..." : "Search tasks by title or notes..."}
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 pr-16 h-10 w-full rounded-xl border-zinc-300/80 focus-visible:ring-blue-500 bg-zinc-50/50"
          />
          {filters.search ? (
            <button
              onClick={() => onFilterChange({ ...filters, search: "" })}
              className="absolute right-3 top-2.5 p-1 text-zinc-400 hover:text-zinc-600 rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-3 top-2.5 h-5 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
              /
            </kbd>
          )}
        </div>

        {/* Primary CTA button with pulse animation */}
        <Button
          onClick={onOpenCreateModal}
          className="h-10 px-5 gap-2 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span className="font-semibold">Add New Task</span>
        </Button>
      </div>

      {/* Quick Filter Pills Row */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {quickFilterTabs.map((tab) => {
          const isActive =
            filters.status === tab.status && filters.priority === tab.priority;
          return (
            <button
              key={tab.label}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  status: tab.status,
                  priority: tab.priority,
                })
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900"
              }`}
            >
              {tab.label.includes("High") && (
                <Flame className={`inline-block mr-1 h-3 w-3 ${isActive ? "text-amber-200" : "text-rose-500"}`} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Detailed Dropdown Controls */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2.5 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Sort & Filter:</span>
        </div>

        {/* Status Dropdown */}
        <div className="w-36">
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8.5 text-xs rounded-lg border-zinc-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                {activeView === "kanban" ? "All Columns" : "All Statuses"}
              </SelectItem>
              <SelectItem value="PENDING">Pending (To Do)</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Dropdown */}
        <div className="w-36">
          <Select value={filters.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="h-8.5 text-xs rounded-lg border-zinc-200">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low Priority</SelectItem>
              <SelectItem value="MEDIUM">Medium Priority</SelectItem>
              <SelectItem value="HIGH">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-40">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="h-8.5 text-xs rounded-lg border-zinc-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="dueDate">Due Date (Soonest)</SelectItem>
              <SelectItem value="priority">Priority (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8.5 text-xs text-zinc-500 hover:text-zinc-900 gap-1 ml-auto rounded-lg transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All
          </Button>
        )}
      </div>
    </div>
  );
}
