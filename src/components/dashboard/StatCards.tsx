"use client";

import * as React from "react";
import {
  FileText,
  Calendar,
  Target,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import type { Task } from "@/types/task";

export interface StatCardsProps {
  tasks?: Task[];
  totalCount?: number;
}

export function StatCards({ tasks = [], totalCount = 0 }: StatCardsProps) {
  // Dynamic stats calculation with fallbacks
  const pendingCount = React.useMemo(() => {
    return tasks.filter((t) => !t.completed).length;
  }, [tasks]);

  const completedCount = React.useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const targetDenominator = Math.max(5, totalCount || 5);
  const completionPercentage = Math.round(
    (completedCount / targetDenominator) * 100
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Pending Assignments */}
      <div className="group relative rounded-2xl bg-white border border-[#E5EAF2] p-5 shadow-2xs hover:shadow-md hover:border-[#315BFF]/30 transition-all duration-200 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Top Row: Icon + Title + Arrow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#172033]">
                Pending Assignments
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#315BFF] group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Value + Status indicator */}
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
              {pendingCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              all on track
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-400 font-normal pt-3 border-t border-slate-100 mt-3">
          Course homework &amp; lab write-ups
        </p>
      </div>

      {/* Card 2: Exams & Major Deadlines */}
      <div className="group relative rounded-2xl bg-white border border-[#E5EAF2] p-5 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all duration-200 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Top Row: Icon + Title + Arrow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#172033]">
                Exams &amp; Major Deadlines
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#EF4444] group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Value + Prioritize Pill */}
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
              0
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 text-[10px] font-bold">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              <span>Prioritize</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-400 font-normal pt-3 border-t border-slate-100 mt-3">
          Midterms, quizzes &amp; project submissions
        </p>
      </div>

      {/* Card 3: Study Target Progress */}
      <div className="group relative rounded-2xl bg-white border border-[#E5EAF2] p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Top Row: Icon + Title + Arrow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#172033]">
                Study Target Progress
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Value + Progress Done Pill */}
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
              {completedCount} <span className="text-base text-slate-400 font-semibold">/ {targetDenominator}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]/60 text-[10px] font-bold">
              <span className="h-1 w-1 rounded-full bg-[#10B981]" />
              <span>{completionPercentage}% done</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-400 font-normal pt-3 border-t border-slate-100 mt-3">
          Keep going! You&apos;re almost there.
        </p>
      </div>
    </div>
  );
}
