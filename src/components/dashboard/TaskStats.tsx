"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      gradient: "from-slate-600 to-zinc-800",
      lightBg: "bg-slate-50 border-slate-200/80",
      iconBg: "bg-zinc-800 text-white shadow-zinc-300/40",
      pillBg: "bg-zinc-100 text-zinc-700",
    },
    {
      label: "Active Tasks",
      value: active,
      icon: Clock,
      gradient: "from-blue-600 to-indigo-600",
      lightBg: "bg-blue-50/50 border-blue-100/90",
      iconBg: "bg-blue-600 text-white shadow-blue-300/40",
      pillBg: "bg-blue-100 text-blue-800",
    },
    {
      label: "Completed Tasks",
      value: completed,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50/50 border-emerald-100/90",
      iconBg: "bg-emerald-600 text-white shadow-emerald-300/40",
      pillBg: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div
      role="region"
      aria-label="Task statistics"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 ${className}`}
    >
      {stats.map((item, index) => {
        const Icon = item.icon;
        const isThird = index === 2;
        return (
          <Card
            key={item.label}
            className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${item.lightBg} border rounded-2xl ${
              isThird ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Top gradient highlight on hover */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider truncate">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight transition-transform duration-200 group-hover:scale-105 origin-left truncate">
                    {item.value}
                  </p>
                </div>
              </div>
              <div
                className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${item.iconBg} shadow-md transition-transform duration-300 group-hover:scale-110`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5 stroke-[2.5]" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
