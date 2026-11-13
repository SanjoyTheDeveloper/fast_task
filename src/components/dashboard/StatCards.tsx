"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import type { Task } from "@/types/task";

export interface StatCardsProps {
  tasks?: Task[];
  totalCount?: number;
}

export function StatCards({ tasks = [], totalCount }: StatCardsProps) {
  // Compute metrics from actual database task records
  const completedCount = React.useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const onProgressCount = React.useMemo(() => {
    return tasks.filter((t) => !t.completed).length;
  }, [tasks]);

  const overdueCount = React.useMemo(() => {
    const now = new Date().getTime();
    return tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const due = new Date(t.dueDate).getTime();
      return due < now;
    }).length;
  }, [tasks]);

  const displayTotal = totalCount !== undefined && totalCount > 0 ? totalCount : tasks.length;
  const displayProgress = onProgressCount;
  const displayCompleted = completedCount;
  const displayOverdue = overdueCount;

  const cards = [
    {
      id: "total",
      label: "Total task",
      value: displayTotal,
      iconName: "assignment",
      trend: "+7%",
      trendDirection: "up" as const,
      trendText: "from last month",
      cardBg: "bg-white",
      borderHover: "hover:border-[#315BFF]",
      iconBox: "bg-[#EEF3FF] text-[#315BFF] border-[#BFDBFE] group-hover:bg-[#315BFF] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/25",
      trendBadge: "bg-[#EEF3FF] text-[#315BFF] border-[#BFDBFE]",
    },
    {
      id: "progress",
      label: "On progress",
      value: displayProgress,
      iconName: "hourglass_top",
      trend: "+3%",
      trendDirection: "up" as const,
      trendText: "from last month",
      cardBg: "bg-white",
      borderHover: "hover:border-[#7C3AED]",
      iconBox: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE] group-hover:bg-[#7C3AED] group-hover:text-white group-hover:shadow-md group-hover:shadow-purple-500/25",
      trendBadge: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]",
    },
    {
      id: "completed",
      label: "Completed",
      value: displayCompleted,
      iconName: "check_circle",
      trend: "+9%",
      trendDirection: "up" as const,
      trendText: "from last month",
      cardBg: "bg-white",
      borderHover: "hover:border-[#10B981]",
      iconBox: "bg-[#D1FAE5] text-[#10B981] border-[#A7F3D0] group-hover:bg-[#10B981] group-hover:text-white group-hover:shadow-md group-hover:shadow-emerald-500/25",
      trendBadge: "bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]",
    },
    {
      id: "overdue",
      label: "Overdue",
      value: displayOverdue,
      iconName: "warning",
      trend: "-2%",
      trendDirection: "down" as const,
      trendText: "from last month",
      cardBg: "bg-white",
      borderHover: "hover:border-[#EF4444]",
      iconBox: "bg-[#FEE2E2] text-[#EF4444] border-[#FECACA] group-hover:bg-[#EF4444] group-hover:text-white group-hover:shadow-md group-hover:shadow-rose-500/25",
      trendBadge: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => {
        const isUp = card.trendDirection === "up";

        return (
          <div
            key={card.id}
            className={`group relative rounded-2xl ${card.cardBg} border border-[#E5EAF2] ${card.borderHover} p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
          >
            {/* Top Row: Label on left, colorful icon container on right */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">
                {card.label}
              </span>
              <div
                className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0 ${card.iconBox}`}
              >
                <GIcon name={card.iconName} size={18} />
              </div>
            </div>

            {/* Middle: Big bold count matching reference */}
            <div className="pt-2 pb-4">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Minimalist arrow + percentage pill + 'from last month' */}
            <div className="flex items-center gap-2 text-xs">
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${card.trendBadge}`}
              >
                <GIcon
                  name={isUp ? "trending_up" : "trending_down"}
                  size={14}
                  weight={600}
                />
                <span>{card.trend}</span>
              </div>
              <span className="text-slate-400 font-normal">
                {card.trendText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
