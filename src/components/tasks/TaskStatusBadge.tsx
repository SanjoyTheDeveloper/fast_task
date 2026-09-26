"use client";

import * as React from "react";

interface TaskStatusBadgeProps {
  completed: boolean;
  dueSoon?: boolean;
  className?: string;
}

export function TaskStatusBadge({
  completed,
  dueSoon = false,
  className = "",
}: TaskStatusBadgeProps) {
  if (completed) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 backdrop-blur-xs ${className}`}
        aria-label="Status: Completed"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
        <span>Completed</span>
      </span>
    );
  }

  if (dueSoon) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-300/60 shadow-2xs backdrop-blur-xs ${className}`}
        aria-label="Status: Due Soon"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        </span>
        <span>Due Soon</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-300/50 shadow-2xs backdrop-blur-xs ${className}`}
      aria-label="Status: Active"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </span>
      <span>Active</span>
    </span>
  );
}
