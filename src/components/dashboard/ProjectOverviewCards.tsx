"use client";

import * as React from "react";
import Image from "next/image";
import { GIcon } from "@/components/ui/GIcon";
import type { Task } from "@/types";

export interface ProjectCardItem {
  id: string;
  name: string;
  courseCode?: string;
  color: "green" | "purple" | "blue";
  deadline: string;
  tasksCount: number;
  progressPercent: number;
  avatars?: { name: string; src: string }[];
}

export interface ProjectOverviewCardsProps {
  projects?: ProjectCardItem[];
  tasks?: Task[];
  onSelectProject?: (project: ProjectCardItem) => void;
}

const PEER_AVATARS = [
  { name: "Sanjoy Bhowmick", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" },
  { name: "Liam Brown", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces" },
  { name: "Ethan Garcia", src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&h=64&fit=crop&crop=faces" },
  { name: "Sophia Davis", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces" },
];

export function ProjectOverviewCards({
  projects,
  tasks,
  onSelectProject,
}: ProjectOverviewCardsProps) {
  // If projects not passed directly, derive them dynamically from database tasks
  const displayProjects: ProjectCardItem[] = React.useMemo(() => {
    if (projects && projects.length > 0) {
      return projects.slice(0, 3);
    }

    if (!tasks || tasks.length === 0) {
      return [];
    }

    // Group tasks by course
    const courseMap = new Map<
      string,
      {
        total: number;
        completed: number;
        earliestDueDate: string | null;
      }
    >();

    tasks.forEach((t) => {
      const courseKey = t.course || "General Assignment";
      const existing = courseMap.get(courseKey) || {
        total: 0,
        completed: 0,
        earliestDueDate: null,
      };

      existing.total += 1;
      if (t.completed) {
        existing.completed += 1;
      }

      if (t.dueDate && !t.completed) {
        if (
          !existing.earliestDueDate ||
          new Date(t.dueDate).getTime() < new Date(existing.earliestDueDate).getTime()
        ) {
          existing.earliestDueDate = t.dueDate;
        }
      }

      courseMap.set(courseKey, existing);
    });

    const colors: Array<"green" | "purple" | "blue"> = ["green", "purple", "blue"];
    let colorIdx = 0;

    const derived: ProjectCardItem[] = [];
    courseMap.forEach((stats, courseName) => {
      const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      let deadline = "Flexible";
      if (stats.earliestDueDate) {
        deadline = new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(stats.earliestDueDate));
      }

      derived.push({
        id: `course-${courseName}`,
        name: courseName,
        courseCode: courseName,
        color: colors[colorIdx % colors.length],
        deadline,
        tasksCount: stats.total,
        progressPercent: progress,
        avatars: PEER_AVATARS.slice(colorIdx % 2, (colorIdx % 2) + 3),
      });
      colorIdx++;
    });

    return derived.slice(0, 3);
  }, [projects, tasks]);

  return (
    <div className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Project overview
        </h3>
      </div>

      {/* When no course projects exist in database */}
      {displayProjects.length === 0 ? (
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-8 text-center shadow-2xs">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
            <GIcon name="layers" size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Course Projects Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Tasks assigned to your courses will automatically generate project cards and progress trackers here.
          </p>
        </div>
      ) : (
        /* 3 Folder Cards Grid matching reference image */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayProjects.map((item, index) => {
            const isGreen = item.color === "green";
            const isPurple = item.color === "purple";

            const folderFillColor = isGreen
              ? "text-emerald-500"
              : isPurple
              ? "text-purple-500"
              : "text-blue-500";

            const barColor = isGreen
              ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_6px_rgba(16,185,129,0.35)]"
              : isPurple
              ? "bg-gradient-to-r from-purple-400 to-indigo-600 shadow-[0_0_6px_rgba(139,92,246,0.35)]"
              : "bg-gradient-to-r from-blue-400 to-cyan-600 shadow-[0_0_6px_rgba(59,130,246,0.35)]";

            const cardTheme = isGreen
              ? "bg-gradient-to-br from-white via-white to-emerald-50/50 border-emerald-100/80 hover:border-emerald-300"
              : isPurple
              ? "bg-gradient-to-br from-white via-white to-purple-50/50 border-purple-100/80 hover:border-purple-300"
              : "bg-gradient-to-br from-white via-white to-blue-50/50 border-blue-100/80 hover:border-blue-300";

            // The first card title in the screenshot has a distinctive blue styling
            const titleColor = index === 0
              ? "text-blue-600 font-bold"
              : "text-slate-900 font-bold";

            const cardAvatars =
              item.avatars && item.avatars.length > 0
                ? item.avatars
                : PEER_AVATARS.slice(index % 2, (index % 2) + 3);

            return (
              <div
                key={item.id}
                onClick={() => onSelectProject?.(item)}
                className={`group relative ${cardTheme} border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  {/* Folder Icon Tab at top left */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <GIcon name="folder" filled size={24} className={folderFillColor} />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className={`text-[15px] ${titleColor} group-hover:text-blue-600 transition-colors line-clamp-1`}>
                    {item.name}
                  </h4>

                  {/* Team Avatars Overlap Stack matching screenshot */}
                  <div className="flex items-center -space-x-2 pt-3 pb-4">
                    {cardAvatars.map((avatar, idx) => (
                      <div
                        key={idx}
                        className="relative h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-slate-200 shrink-0"
                        title={avatar.name}
                      >
                        <Image
                          src={avatar.src}
                          alt={avatar.name}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Metadata Row: Deadline & Tasks Count */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pb-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 pt-2.5">
                      <GIcon name="calendar_month" size={14} className="shrink-0 text-slate-400" />
                      <span>Deadline: {item.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2.5">
                      <GIcon name="check_box" size={14} className="shrink-0 text-slate-400" />
                      <span>{item.tasksCount} tasks</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Progress Row: Bar + Number (without % sign matching screenshot) */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 min-w-[20px] text-right">
                    {item.progressPercent}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
