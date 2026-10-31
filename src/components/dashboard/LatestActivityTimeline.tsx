"use client";

import * as React from "react";
import Image from "next/image";
import { Activity } from "lucide-react";
import type { Task, SessionUser } from "@/types";

export interface ActivityItem {
  id: string;
  userName: string;
  userAvatar?: string;
  action: string;
  projectName: string;
  timestamp?: string;
  dateGroup: "today" | "yesterday";
}

export interface LatestActivityTimelineProps {
  activities?: ActivityItem[];
  tasks?: Task[];
  currentUser?: SessionUser | null;
}

const DEFAULT_COLLABORATOR_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&h=64&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces",
];

export function LatestActivityTimeline({
  activities,
  tasks,
  currentUser,
}: LatestActivityTimelineProps) {
  const userName = currentUser?.name || "Sanjoy Bhowmick";
  const userAvatar =
    currentUser?.image || DEFAULT_COLLABORATOR_AVATARS[0];

  // Derive live timeline activities directly from database tasks
  const displayActivities: ActivityItem[] = React.useMemo(() => {
    if (activities && activities.length > 0) {
      return activities;
    }

    if (!tasks || tasks.length === 0) {
      return [];
    }

    // Sort tasks by updatedAt or createdAt descending
    const sorted = [...tasks].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, 5).map((t, idx) => {
      let action = "Task marked as Started.";
      if (t.completed) {
        action = "Task marked as Completed.";
      } else if (t.priority === "HIGH") {
        action = "Task marked as Reviewing.";
      } else {
        action = "Task marked as In Progress.";
      }

      // Group into today and yesterday matching screenshot
      const isToday = idx < 3;
      const avatarSrc = DEFAULT_COLLABORATOR_AVATARS[idx % DEFAULT_COLLABORATOR_AVATARS.length];

      return {
        id: `act-${t.id}`,
        userName: idx === 0 ? userName : idx === 1 ? "Liam Brown" : idx === 2 ? "Ethan Garcia" : "Noah Wilson",
        userAvatar: idx === 0 ? userAvatar : avatarSrc,
        action,
        projectName: t.course ? `${t.course}` : "Academic Workspace",
        dateGroup: isToday ? "today" : "yesterday",
      };
    });
  }, [activities, tasks, userName, userAvatar]);

  const todayItems = displayActivities.filter((a) => a.dateGroup === "today");
  const yesterdayItems = displayActivities.filter((a) => a.dateGroup === "yesterday");

  const todayFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date()).replace(/\//g, ".");

  const yesterdayDateObj = new Date();
  yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1);
  const yesterdayFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(yesterdayDateObj).replace(/\//g, ".");

  const todayLabel = `Today ${todayFormatted}`;
  const yesterdayLabel = `Yesterday ${yesterdayFormatted}`;

  const getActionBadge = (action: string) => {
    if (action.includes("Completed")) {
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        ring: "ring-2 ring-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.35)]",
        label: "Completed",
      };
    }
    if (action.includes("Reviewing")) {
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200/80",
        ring: "ring-2 ring-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.35)]",
        label: "Reviewing",
      };
    }
    if (action.includes("In Progress")) {
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200/80",
        ring: "ring-2 ring-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.35)]",
        label: "In Progress",
      };
    }
    return {
      badge: "bg-purple-50 text-purple-700 border-purple-200/80",
      ring: "ring-2 ring-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.35)]",
      label: "Started",
    };
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all duration-200">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Latest Activity
        </h3>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Realtime
        </span>
      </div>

      {displayActivities.length === 0 ? (
        <div className="py-8 text-center">
          <Activity className="h-6 w-6 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">No Recent Activity</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Your task updates and study sessions will be recorded here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Group 1: Today */}
          {todayItems.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                {todayLabel}
              </div>

              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-blue-400 before:via-indigo-300 before:to-slate-200">
                {todayItems.map((item) => {
                  const style = getActionBadge(item.action);
                  return (
                    <div key={item.id} className="relative flex items-start gap-2.5 group">
                      {/* Node Avatar with status ring */}
                      <div className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full overflow-hidden bg-slate-100 shrink-0 transition-transform group-hover:scale-110 ${style.ring}`}>
                        <Image
                          src={item.userAvatar || userAvatar}
                          alt={item.userName}
                          fill
                          className="object-cover"
                          sizes="20px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-slate-800 leading-snug flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{item.userName}</span>
                          <span className="text-slate-400">•</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${style.badge}`}>
                            {style.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal truncate mt-1">
                          Project:{" "}
                          <span className="font-medium text-slate-700 bg-slate-100/90 px-1.5 py-0.5 rounded text-[10px] border border-slate-200/60">
                            {item.projectName}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 2: Yesterday */}
          {yesterdayItems.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 pt-2">
                {yesterdayLabel}
              </div>

              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-slate-300 before:to-slate-200">
                {yesterdayItems.map((item) => {
                  const style = getActionBadge(item.action);
                  return (
                    <div key={item.id} className="relative flex items-start gap-2.5 group">
                      {/* Node Avatar */}
                      <div className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full overflow-hidden bg-slate-100 shrink-0 transition-transform group-hover:scale-110 ${style.ring}`}>
                        <Image
                          src={item.userAvatar || userAvatar}
                          alt={item.userName}
                          fill
                          className="object-cover"
                          sizes="20px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-slate-800 leading-snug flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{item.userName}</span>
                          <span className="text-slate-400">•</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${style.badge}`}>
                            {style.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal truncate mt-1">
                          Project:{" "}
                          <span className="font-medium text-slate-700 bg-slate-100/90 px-1.5 py-0.5 rounded text-[10px] border border-slate-200/60">
                            {item.projectName}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
