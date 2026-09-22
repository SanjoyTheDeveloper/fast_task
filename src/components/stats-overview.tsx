"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, ListTodo, TrendingUp, Sparkles } from "lucide-react";
import type { Task } from "@/types/task";

interface StatsOverviewProps {
  tasks: Task[];
}

export function StatsOverview({ tasks }: StatsOverviewProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      title: "Total Tasks",
      value: total,
      icon: ListTodo,
      gradient: "from-slate-600 to-zinc-800",
      lightBg: "bg-slate-50 border-slate-200/60",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50/50 border-blue-100",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50/50 border-emerald-100",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      gradient: "from-indigo-500 to-purple-600",
      lightBg: "bg-purple-50/50 border-purple-100",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Metric Cards Grid with Micro-Animations */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.lightBg} border`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle top gradient highlight on hover */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {item.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight transition-transform duration-200 group-hover:scale-105 origin-left">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md shadow-zinc-300/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dynamic Animated Progress Bar */}
      {total > 0 && (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Sparkles className="h-3 w-3" />
              </div>
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Overall Productivity Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">
                {completed} of {total} tasks completed
              </span>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {completionRate}%
              </span>
            </div>
          </div>

          <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden p-0.5 border border-zinc-200/60 relative">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${completionRate}%` }}
            >
              <div className="absolute inset-0 shimmer-effect opacity-60 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
