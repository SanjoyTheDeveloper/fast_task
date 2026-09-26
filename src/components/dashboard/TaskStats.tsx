"use client";

import * as React from "react";
import { ListTodo, Clock, CheckCircle2 } from "lucide-react";
import type { Task } from "@/types/task";

export interface TaskStatsProps {
  tasks?: Task[];
  totalCount?: number;
  activeCount?: number;
  completedCount?: number;
  className?: string;
}

export function TaskStats({
  tasks = [],
  totalCount,
  activeCount,
  completedCount,
  className = "",
}: TaskStatsProps) {
  // Calculated dynamically from explicit counts or task list
  const total = totalCount !== undefined ? totalCount : tasks.length;
  const active =
    activeCount !== undefined
      ? activeCount
      : tasks.filter((t) => !t.completed).length;
  const completed =
    completedCount !== undefined
      ? completedCount
      : tasks.filter((t) => t.completed).length;

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: ListTodo,
      iconBg: "bg-slate-100 text-slate-700",
      accentBorder: "border-slate-200/90",
    },
    {
      label: "Active Tasks",
      value: active,
      icon: Clock,
      iconBg: "bg-blue-50 text-blue-600",
      accentBorder: "border-blue-200/80",
    },
    {
      label: "Completed Tasks",
      value: completed,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
      accentBorder: "border-emerald-200/80",
    },
  ];

  return (
    <div
      role="region"
      aria-label="Task statistics"
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full ${className}`}
    >
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center justify-between p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-200"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider truncate">
                {item.label}
              </p>
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 truncate">
                {item.value}
              </p>
            </div>
            <div
              className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg} border border-black/5 shadow-2xs transition-transform duration-200 hover:scale-105`}
              aria-hidden="true"
            >
              <Icon className="h-6 w-6 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
