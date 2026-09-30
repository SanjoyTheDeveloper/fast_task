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
import { RotateCcw, CheckCircle2, Clock, ShieldAlert, GraduationCap, BookOpen, LayoutGrid, Kanban } from "lucide-react";
import { COURSES } from "@/lib/academic";

export interface FilterState {
  search: string;
  status: "ALL" | "ACTIVE" | "COMPLETED" | "all" | "active" | "completed" | string;
  priority?: "ALL" | "LOW" | "MEDIUM" | "HIGH" | "all" | "low" | "medium" | "high" | string;
  course?: string;
  category?: string;
  sortBy: string;
  sortOrder: "asc" | "desc" | string;
  sortOption?: string;
}

export interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onOpenCreateModal?: () => void;
  isLoading?: boolean;
  activeView?: "grid" | "kanban";
  onViewChange?: (view: "grid" | "kanban") => void;
}

export function TaskFilters({
  filters,
  onFilterChange,
  isLoading = false,
  activeView = "grid",
  onViewChange,
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

  const handleCourseChange = (val: string) => {
    onFilterChange({ ...filters, course: val });
  };

  const resetFilters = () => {
    onFilterChange({
      search: "",
      status: "ALL",
      priority: "ALL",
      course: "ALL",
      category: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
      sortOption: "newest",
    });
  };

  const normalizedStatus = (filters.status || "ALL").toUpperCase();
  const normalizedPriority = (filters.priority || "ALL").toUpperCase();
  const normalizedCourse = (filters.course || "ALL").toUpperCase();

  const isFiltered =
    Boolean(filters.search && filters.search.trim() !== "") ||
    normalizedStatus !== "ALL" ||
    normalizedPriority !== "ALL" ||
    normalizedCourse !== "ALL" ||
    currentSortOption !== "newest";

  const quickFilterTabs = [
    { label: "All", status: "ALL", icon: null },
    { label: "Active", status: "ACTIVE", icon: Clock },
    { label: "Completed", status: "COMPLETED", icon: CheckCircle2 },
  ];

  return (
    <div className="w-full bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all space-y-3">
      {/* 1. Top Row: Full Search Bar + View Mode Toggle & Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex-1 min-w-[220px]">
          <TaskSearch
            value={filters.search}
            onChange={handleSearchChange}
            isLoading={isLoading}
            placeholder={
              activeView === "kanban"
                ? "Search board cards..."
                : "Search academic tasks, notes, or course codes..."
            }
          />
        </div>

        {/* View Switcher & Reset button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10 px-2.5 text-xs text-slate-500 hover:text-slate-900 gap-1.5 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset</span>
            </Button>
          )}

          {onViewChange && (
            <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shrink-0">
              <button
                type="button"
                onClick={() => onViewChange("grid")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === "grid"
                    ? "bg-white text-[#315BFF] shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewChange("kanban")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === "kanban"
                    ? "bg-white text-[#315BFF] shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Kanban Board View"
              >
                <Kanban className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Bottom Row: Filters (Status Tabs, Course, Priority, Sort) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5">
        {/* Segmented Status Tabs */}
        <div
          className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shrink-0"
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Course Filter Dropdown */}
        <div className="w-[125px] sm:w-[140px] shrink-0">
          <Select
            value={filters.course || "ALL"}
            onValueChange={handleCourseChange}
          >
            <SelectTrigger
              className="h-9.5 text-xs rounded-xl border-slate-200 bg-white shadow-2xs"
              aria-label="Filter by course"
            >
              <div className="flex items-center gap-1.5 truncate">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <SelectValue placeholder="Course" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Courses</SelectItem>
              {COURSES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Dropdown */}
        <div className="w-[120px] sm:w-[130px] shrink-0">
          <Select
            value={normalizedPriority}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger
              className="h-9.5 text-xs rounded-xl border-slate-200 bg-white shadow-2xs"
              aria-label="Filter by priority"
            >
              <div className="flex items-center gap-1.5 truncate">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <SelectValue placeholder="Priority" />
              </div>
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
        <div className="w-[130px] sm:w-[140px] shrink-0">
          <Select value={currentSortOption} onValueChange={handleSortChange}>
            <SelectTrigger
              className="h-9.5 text-xs rounded-xl border-slate-200 bg-white shadow-2xs"
              aria-label="Sort tasks by"
            >
              <SelectValue placeholder="Sort" />
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
    </div>
  );
}
