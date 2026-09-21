"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Flame, CalendarClock, Target, Zap } from "lucide-react";
import type { TaskItem } from "./tasks/taskform/task-form";

interface PriorityDistributionProps {
  tasks: TaskItem[];
}

export function PriorityDistribution({ tasks }: PriorityDistributionProps) {
  const total = tasks.length;
  const high = tasks.filter((t) => t.priority === "HIGH").length;
  const medium = tasks.filter((t) => t.priority === "MEDIUM").length;
  const low = tasks.filter((t) => t.priority === "LOW").length;

  const highPct = total > 0 ? Math.round((high / total) * 100) : 0;
  const mediumPct = total > 0 ? Math.round((medium / total) * 100) : 0;
  const lowPct = total > 0 ? Math.round((low / total) * 100) : 0;

  // Due within 48 hours
  const now = Date.now();
  const dueSoonCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === "COMPLETED") return false;
    const dueTime = new Date(t.dueDate).getTime();
    const diffHours = (dueTime - now) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 48;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Priority Breakdown Card */}
      <Card className="md:col-span-2 border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-xs hover:shadow-md transition-shadow p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 leading-none">Task Priority Distribution</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Real-time workload balance by urgency</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
            {total} Active Work Items
          </span>
        </div>

        {/* Multi-segment Colored Bar */}
        <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-zinc-200/70 mb-3.5">
          {high > 0 && (
            <div
              className="h-full bg-rose-500 rounded-l-full transition-all duration-500 relative group"
              style={{ width: `${highPct}%` }}
              title={`High: ${high} tasks (${highPct}%)`}
            />
          )}
          {medium > 0 && (
            <div
              className="h-full bg-amber-500 transition-all duration-500 relative group"
              style={{ width: `${mediumPct}%` }}
              title={`Medium: ${medium} tasks (${mediumPct}%)`}
            />
          )}
          {low > 0 && (
            <div
              className="h-full bg-emerald-500 rounded-r-full transition-all duration-500 relative group"
              style={{ width: `${lowPct}%` }}
              title={`Low: ${low} tasks (${lowPct}%)`}
            />
          )}
          {total === 0 && <div className="h-full w-full bg-zinc-200 rounded-full" />}
        </div>

        {/* Priority Labels Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50/50 border border-rose-100">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
            <div>
              <span className="block font-bold text-zinc-800">{high} High</span>
              <span className="text-[11px] text-rose-600 font-medium">{highPct}% of total</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/50 border border-amber-100">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <span className="block font-bold text-zinc-800">{medium} Medium</span>
              <span className="text-[11px] text-amber-600 font-medium">{mediumPct}% of total</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="block font-bold text-zinc-800">{low} Low</span>
              <span className="text-[11px] text-emerald-600 font-medium">{lowPct}% of total</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Due Soon / Focus Card */}
      <Card className="border-zinc-200/80 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md p-5 flex flex-col justify-between relative overflow-hidden group">
        {/* Ambient glow inside card */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold backdrop-blur-xs">
              <CalendarClock className="h-3.5 w-3.5 text-blue-200" />
              Next 48 Hours
            </span>
            <Zap className="h-4 w-4 text-amber-300 animate-bounce" />
          </div>
          <h4 className="text-xl font-bold tracking-tight pt-2">
            {dueSoonCount > 0 ? `${dueSoonCount} Tasks Due Soon` : "All Clear for Today"}
          </h4>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            {dueSoonCount > 0
              ? "Prioritize these tasks to keep your project deadline on track."
              : "No immediate deadlines in the next 48 hours. Great momentum!"}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/15 text-xs text-blue-100 relative z-10">
          <span>Target Velocity</span>
          <span className="font-bold text-white flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-emerald-300" /> On Schedule
          </span>
        </div>
      </Card>
    </div>
  );
}
