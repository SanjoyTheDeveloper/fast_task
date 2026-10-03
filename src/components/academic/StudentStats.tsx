"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import type { Task } from "@/types/task";

export interface StudentStatsProps {
  tasks?: Task[];
  totalCount?: number;
  className?: string;
}

export function StudentStats({
  tasks = [],
  totalCount = 0,
  className = "",
}: StudentStatsProps) {
  // 1. Pending Assignments
  const pendingAssignments = React.useMemo(() => {
    return tasks.filter((t) => {
      if (t.completed) return false;
      return t.category === "Assignment" || t.category === "Lab Report" || !t.category;
    });
  }, [tasks]);

  const assignmentsDueSoon = React.useMemo(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(Date.now() + 3 * 86400000);
    return pendingAssignments.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due >= now && due <= threeDaysFromNow;
    }).length;
  }, [pendingAssignments]);

  // 2. Upcoming Exams / Deadlines
  const upcomingExams = React.useMemo(() => {
    return tasks.filter((t) => {
      if (t.completed) return false;
      return t.category === "Exam" || (t.dueDate && new Date(t.dueDate) >= new Date());
    });
  }, [tasks]);

  // 3. Today's Study Target & Completed
  const completedTasks = React.useMemo(() => {
    return tasks.filter((t) => t.completed);
  }, [tasks]);

  const studyTargetTotal = Math.max(5, tasks.length);
  const targetPercent = Math.min(
    100,
    Math.round((completedTasks.length / studyTargetTotal) * 100)
  );

  return (
    <div
      role="region"
      aria-label="Academic statistics"
      className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full ${className}`}
    >
      {/* Card 1: Pending Assignments (Amber Accent) */}
      <div className="relative overflow-hidden flex items-center justify-between p-4 sm:p-5 lg:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2.5px] before:bg-gradient-to-r before:from-amber-400 before:to-orange-400">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Assignments
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {pendingAssignments.length}
            </p>
            {assignmentsDueSoon > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                {assignmentsDueSoon} due soon
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-medium">all on track</span>
            )}
          </div>
          <p className="text-xs text-slate-400">Course homework & lab write-ups</p>
        </div>
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-600 border border-amber-200/60 shadow-sm">
          <GIcon name="menu_book" size={24} />
        </div>
      </div>

      {/* Card 2: Upcoming Exams & Deadlines (Rose Accent) */}
      <div className="relative overflow-hidden flex items-center justify-between p-4 sm:p-5 lg:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2.5px] before:bg-gradient-to-r before:from-rose-500 before:to-red-500">
        <div className="space-y-1.5 min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Exams & Major Deadlines
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {upcomingExams.length}
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              Prioritize
            </span>
          </div>
          <p className="text-xs text-slate-400">Midterms, quizzes & project submissions</p>
        </div>
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600 border border-rose-200/60 shadow-sm">
          <GIcon name="event" size={24} />
        </div>
      </div>

      {/* Card 3: Today's Study Target / Completed (Emerald Accent) */}
      <div className="relative overflow-hidden flex items-center justify-between p-4 sm:p-5 lg:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2.5px] before:bg-gradient-to-r before:from-emerald-400 before:to-teal-500">
        <div className="space-y-1.5 min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Study Target Progress
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {completedTasks.length}
              <span className="text-lg font-bold text-slate-400 ml-1">
                / {studyTargetTotal}
              </span>
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              {targetPercent}% done
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{ width: `${targetPercent}%` }}
            />
          </div>
        </div>
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-sm ml-3">
          <GIcon name="task_alt" size={24} filled />
        </div>
      </div>
    </div>
  );
}
