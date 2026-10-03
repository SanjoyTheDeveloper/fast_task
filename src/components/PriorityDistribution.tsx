"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Zap, Target } from "@/components/ui/GoogleIcon";
import type { Task } from "@/types/task";

interface PriorityDistributionProps {
  tasks: Task[];
}

export function PriorityDistribution({ tasks }: PriorityDistributionProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Task Status Breakdown Card */}
      <Card className="md:col-span-2 border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-xs hover:shadow-md transition-shadow p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 leading-none">Task Completion Breakdown</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Real-time status ratio of active vs completed work</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
            {total} Total Tasks
          </span>
        </div>

        {/* Multi-segment Colored Bar */}
        <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-zinc-200/70 mb-3.5">
          {pending > 0 && (
            <div
              className="h-full bg-indigo-500 rounded-l-full transition-all duration-500 relative group"
              style={{ width: `${pendingPct}%` }}
              title={`Pending: ${pending} tasks (${pendingPct}%)`}
            />
          )}
          {completed > 0 && (
            <div
              className="h-full bg-emerald-500 rounded-r-full transition-all duration-500 relative group"
              style={{ width: `${completedPct}%` }}
              title={`Completed: ${completed} tasks (${completedPct}%)`}
            />
          )}
          {total === 0 && <div className="h-full w-full bg-zinc-200 rounded-full" />}
        </div>

        {/* Status Breakdown Pills */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
            <div>
              <span className="block font-bold text-zinc-800">{pending} Pending</span>
              <span className="text-[11px] text-indigo-600 font-medium">{pendingPct}% of total</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="block font-bold text-zinc-800">{completed} Completed</span>
              <span className="text-[11px] text-emerald-600 font-medium">{completedPct}% of total</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Focus / Momentum Card */}
      <Card className="border-zinc-200/80 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md p-5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold backdrop-blur-xs">
              <Clock className="h-3.5 w-3.5 text-blue-200" />
              Focus Momentum
            </span>
            <Zap className="h-4 w-4 text-amber-300 animate-bounce" />
          </div>
          <h4 className="text-xl font-bold tracking-tight pt-2">
            {pending > 0 ? `${pending} Tasks to Complete` : "All Tasks Completed! 🎉"}
          </h4>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            {pending > 0
              ? "Keep up the momentum to finish your remaining work items."
              : "Great job! All your tasks are completed. Take a break or plan ahead!"}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/15 text-xs text-blue-100 relative z-10">
          <span>Target Progress</span>
          <span className="font-bold text-white flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-emerald-300" />
            {completedPct}% Completed
          </span>
        </div>
      </Card>
    </div>
  );
}
