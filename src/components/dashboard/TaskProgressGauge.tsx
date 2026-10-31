"use client";

import * as React from "react";
import type { Task } from "@/types/task";

export interface TaskProgressGaugeProps {
  tasks?: Task[];
  totalCount?: number;
}

export function TaskProgressGauge({ tasks = [], totalCount }: TaskProgressGaugeProps) {
  // Compute proportions from actual task records
  const metrics = React.useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        total: totalCount || 0,
        notStartedPercent: 0,
        onProgressPercent: 0,
        onReviewPercent: 0,
        completedPercent: 0,
      };
    }

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const highPriorityActive = tasks.filter((t) => !t.completed && t.priority === "HIGH").length;
    const medPriorityActive = tasks.filter((t) => !t.completed && t.priority === "MEDIUM").length;
    const otherActive = Math.max(0, total - completed - highPriorityActive - medPriorityActive);

    const completedPercent = Math.max(0, Math.round((completed / total) * 100));
    const onReviewPercent = Math.max(0, Math.round((highPriorityActive / total) * 100));
    const onProgressPercent = Math.max(0, Math.round((medPriorityActive / total) * 100));
    const notStartedPercent = Math.max(0, 100 - completedPercent - onReviewPercent - onProgressPercent);

    return {
      total: totalCount !== undefined && totalCount > 0 ? totalCount : total,
      notStartedPercent,
      onProgressPercent,
      onReviewPercent,
      completedPercent,
    };
  }, [tasks, totalCount]);

  // Semi-circle gauge geometry
  // Arc angle spans 180 degrees (from 180° to 0°)
  // SVG coordinates: Center at (110, 110), Radius = 80
  const radius = 80;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius; // approx 251.327

  // Convert percentages into arc stroke lengths
  const notStartedLength = (metrics.notStartedPercent / 100) * arcLength;
  const onProgressLength = (metrics.onProgressPercent / 100) * arcLength;
  const onReviewLength = (metrics.onReviewPercent / 100) * arcLength;
  const completedLength = (metrics.completedPercent / 100) * arcLength;

  // Compute dash offsets (stacked sequentially from left to right)
  const offset0 = 0;
  const offset1 = notStartedLength;
  const offset2 = offset1 + onProgressLength;
  const offset3 = offset2 + onReviewLength;

  const legendItems = [
    {
      id: "not-started",
      label: "Not started",
      percent: metrics.notStartedPercent,
      color: "bg-sky-400",
      glow: "shadow-[0_0_8px_rgba(56,189,248,0.7)]",
      badge: "bg-sky-50 text-sky-700 border-sky-200/80",
    },
    {
      id: "on-progress",
      label: "On progress",
      percent: metrics.onProgressPercent,
      color: "bg-purple-500",
      glow: "shadow-[0_0_8px_rgba(168,85,247,0.7)]",
      badge: "bg-purple-50 text-purple-700 border-purple-200/80",
    },
    {
      id: "on-review",
      label: "On review",
      percent: metrics.onReviewPercent,
      color: "bg-amber-500",
      glow: "shadow-[0_0_8px_rgba(245,158,11,0.7)]",
      badge: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
    {
      id: "completed",
      label: "Completed",
      percent: metrics.completedPercent,
      color: "bg-emerald-500",
      glow: "shadow-[0_0_8px_rgba(16,185,129,0.7)]",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
      {/* Card Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Tasks progress
        </h3>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
          Live Status
        </span>
      </div>

      {/* SVG Semi-Circle Donut Gauge */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-2">
        <svg
          viewBox="0 0 220 125"
          className="w-full max-w-[210px] h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="notStartedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id="onProgressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="onReviewGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="completedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Segment 1: Cyan (Not started) */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="url(#notStartedGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${notStartedLength} ${arcLength}`}
            strokeDashoffset={-offset0}
            strokeLinecap="butt"
          />

          {/* Segment 2: Purple (On progress) */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="url(#onProgressGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${onProgressLength} ${arcLength}`}
            strokeDashoffset={-offset1}
            strokeLinecap="butt"
          />

          {/* Segment 3: Amber (On review) */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="url(#onReviewGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${onReviewLength} ${arcLength}`}
            strokeDashoffset={-offset2}
            strokeLinecap="butt"
          />

          {/* Segment 4: Emerald Green (Completed) */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="url(#completedGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${completedLength} ${arcLength}`}
            strokeDashoffset={-offset3}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Labels inside the semi-circle */}
        <div className="absolute top-[52px] flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] font-medium text-slate-400">
            Total task
          </span>
          <span className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent leading-tight">
            {metrics.total}
          </span>
        </div>
      </div>

      {/* Legend Breakdown List with luminous colorful dots */}
      <div className="space-y-2 pt-3">
        {legendItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color} ${item.glow} shrink-0`} />
              <span className="font-semibold text-slate-700">{item.label}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${item.badge}`}>
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
