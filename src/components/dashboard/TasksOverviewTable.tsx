"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Search,
  SlidersHorizontal,
  LayoutList,
  Kanban as KanbanIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import type { Task } from "@/types/task";

export interface TaskRowItem {
  id: string;
  index: string;
  name: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  tag: string;
  status: "Completed" | "On progress" | "On review" | "Not Started";
  completed: boolean;
  rawTask?: Task;
}

export interface TasksOverviewTableProps {
  tasks?: Task[];
  onToggleStatus?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onOpenCreateModal?: () => void;
  activeView?: "table" | "kanban";
  onViewChange?: (view: "table" | "kanban") => void;
}

export function TasksOverviewTable({
  tasks = [],
  onToggleStatus,
  onEditTask,
  onOpenCreateModal,
  activeView = "table",
  onViewChange,
}: TasksOverviewTableProps) {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("ALL");

  // Map real database tasks into the reference table structure
  const rows: TaskRowItem[] = React.useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    return tasks.map((t, idx) => {
      const indexStr = String(idx + 1).padStart(2, "0");

      // Format date range (e.g., 05 Nov - 15 Nov)
      let dateStr = "Flexible Due";
      if (t.dueDate) {
        const d = new Date(t.dueDate);
        const start = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startDay = String(start.getDate()).padStart(2, "0");
        const startMonth = start.toLocaleDateString("en-US", { month: "short" });
        const endDay = String(d.getDate()).padStart(2, "0");
        const endMonth = d.toLocaleDateString("en-US", { month: "short" });
        dateStr = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
      }

      // Priority
      let priority: "High" | "Medium" | "Low" = "Medium";
      if (t.priority === "HIGH") priority = "High";
      else if (t.priority === "LOW") priority = "Low";

      // Status
      let status: "Completed" | "On progress" | "On review" | "Not Started" = "Not Started";
      if (t.completed) {
        status = "Completed";
      } else if (priority === "High") {
        status = "On review";
      } else if (priority === "Medium") {
        status = "On progress";
      }

      // Tag
      const tag = t.category || (t.course ? t.course.slice(-6) : "Assignment");

      return {
        id: t.id,
        index: indexStr,
        name: t.title,
        date: dateStr,
        priority,
        tag,
        status,
        completed: t.completed,
        rawTask: t,
      };
    });
  }, [tasks]);

  // Filtered rows
  const filteredRows = React.useMemo(() => {
    return rows.filter((r) => {
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchName = r.name.toLowerCase().includes(query);
        const matchTag = r.tag.toLowerCase().includes(query);
        if (!matchName && !matchTag) return false;
      }
      if (priorityFilter !== "ALL" && r.priority.toUpperCase() !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [rows, searchFilter, priorityFilter]);

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all duration-200 space-y-4">
      {/* Top Header & Actions Bar matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100/80">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Tasks overview
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status tracking for courses and assignments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search tasks... pill input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search tasks..."
              className="h-9 pl-9 pr-3 text-xs rounded-full border border-slate-200/90 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 sm:w-56 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter button */}
          <button
            type="button"
            onClick={() => {
              setPriorityFilter((prev) =>
                prev === "ALL" ? "HIGH" : prev === "HIGH" ? "MEDIUM" : prev === "MEDIUM" ? "LOW" : "ALL"
              );
            }}
            className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              priorityFilter !== "ALL"
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "border-slate-200/90 bg-slate-50/50 text-slate-500 hover:text-slate-800"
            }`}
            title={`Filter Priority: ${priorityFilter}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interactive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium text-[11px]">
              <th className="py-2.5 px-3 w-10 text-center font-mono">#</th>
              <th className="py-2.5 px-3 font-medium">Name</th>
              <th className="py-2.5 px-3 font-medium">Date</th>
              <th className="py-2.5 px-3 font-medium">Priority</th>
              <th className="py-2.5 px-3 font-medium">Tags</th>
              <th className="py-2.5 px-3 font-medium text-right sm:text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <p className="text-sm font-semibold text-slate-600">No tasks found</p>
                    <p className="text-xs text-slate-400">
                      {searchFilter ? "No tasks matching your search query." : "No tasks recorded in database."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                // Priority Pill styling matching screenshot
                const isHigh = row.priority === "High";
                const isMed = row.priority === "Medium";

                const priorityPill = isHigh
                  ? "text-rose-700 bg-rose-50/90 border-rose-200/80 shadow-2xs"
                  : isMed
                  ? "text-amber-800 bg-amber-50/90 border-amber-200/80 shadow-2xs"
                  : "text-slate-700 bg-slate-100 border-slate-200 shadow-2xs";

                const priorityDot = isHigh
                  ? "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]"
                  : isMed
                  ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                  : "bg-slate-400";

                // Status text styling matching screenshot
                const isCompleted = row.status === "Completed";
                const isOnProgress = row.status === "On progress";
                const isOnReview = row.status === "On review";

                const statusColor = isCompleted
                  ? "text-[#10B981] font-bold"
                  : isOnProgress
                  ? "text-[#6366F1] font-bold"
                  : isOnReview
                  ? "text-[#F59E0B] font-bold"
                  : "text-slate-500 font-semibold";

                // Curated vibrant tag colors
                const tName = row.tag.toLowerCase();
                const tagColor = tName.includes("web")
                  ? "bg-blue-50 text-blue-700 border-blue-200/70"
                  : tName.includes("app")
                  ? "bg-purple-50 text-purple-700 border-purple-200/70"
                  : tName.includes("market")
                  ? "bg-amber-50 text-amber-800 border-amber-200/70"
                  : tName.includes("dash")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                  : tName.includes("design") || tName.includes("rev")
                  ? "bg-rose-50 text-rose-700 border-rose-200/70"
                  : "bg-cyan-50 text-cyan-700 border-cyan-200/70";

                return (
                  <tr
                    key={row.id}
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    {/* # Column */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-400 text-[11px]">
                      {row.index}
                    </td>

                    {/* Name Column matching reference */}
                    <td className="py-3.5 px-3 min-w-[200px] max-w-[340px]">
                      <span
                        className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block truncate text-[13px]"
                        title={row.name}
                      >
                        {row.name}
                      </span>
                    </td>

                    {/* Date Column */}
                    <td className="py-3.5 px-3 text-slate-400 font-medium text-[11px] whitespace-nowrap">
                      {row.date}
                    </td>

                    {/* Priority Column */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${priorityPill}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${priorityDot}`} />
                        <span>{row.priority}</span>
                      </span>
                    </td>

                    {/* Tags Column */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border shadow-2xs ${tagColor}`}>
                        {row.tag}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className={`py-3.5 px-3 text-right sm:text-left whitespace-nowrap text-[12px] ${statusColor}`}>
                      {row.status}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
