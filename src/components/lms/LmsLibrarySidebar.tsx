"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Folder,
  Bookmark,
  Layers,
  GraduationCap,
  HardDrive,
  CheckCircle2,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { COURSE_THEMES } from "@/lib/courseThemes";

export type LmsNavSection = "all" | "courses" | "bookmarks" | "uploads";

export interface LmsLibrarySidebarProps {
  activeSection: LmsNavSection;
  onSelectSection: (section: LmsNavSection) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenUpload?: () => void;
  counts?: {
    all: number;
    courses: number;
    bookmarks: number;
    uploads?: number;
  };
  enrolledCourses?: Array<{ key: string; label: string; code: string; count: number }>;
}

export function LmsLibrarySidebar({
  activeSection,
  onSelectSection,
  selectedCategory = "All",
  onSelectCategory,
  onOpenUpload,
  counts,
  enrolledCourses,
}: LmsLibrarySidebarProps) {
  const primaryNav = [
    {
      id: "all" as LmsNavSection,
      label: "All Notes & PDFs",
      icon: FileText,
      count: counts?.all,
    },
    {
      id: "uploads" as LmsNavSection,
      label: "My Uploads",
      icon: UploadCloud,
      count: counts?.uploads,
    },
    {
      id: "bookmarks" as LmsNavSection,
      label: "My Bookmarks",
      icon: Bookmark,
      count: counts?.bookmarks,
    },
    {
      id: "courses" as LmsNavSection,
      label: "By Course Folders",
      icon: Folder,
      count: counts?.courses,
    },
  ];

  const courseList = enrolledCourses ?? [];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between p-5 bg-white lg:bg-[#FAF9FD]/80 h-full min-h-[720px] select-none">
      <div className="space-y-6">
        {/* Brand Header with Academic Context */}
        <div className="px-1.5 pt-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#315BFF] to-[#607AFB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                Course Materials
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Summer 2026 Vault
              </p>
            </div>
          </div>
        </div>

        {/* Primary View Filters */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3">
            Library Views
          </span>
          <nav className="space-y-1 pt-1" aria-label="Library Navigation">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onSelectCategory && item.id !== "bookmarks") {
                      onSelectCategory("All");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-[-0.01em] transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#315BFF] text-white shadow-sm shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? "text-white"
                          : item.id === "bookmarks"
                          ? "text-amber-500"
                          : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      suppressHydrationWarning
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Enrolled Courses Shortcuts */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Enrolled Courses
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              Batch 82A
            </span>
          </div>

          <div className="space-y-0.5 pt-1">
            {courseList.length === 0 ? (
              <div className="px-3 py-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                <p className="text-[11px] text-slate-400 font-medium">No courses uploaded yet</p>
              </div>
            ) : (
              courseList.map((course) => {
              const theme = COURSE_THEMES[course.key];
              const isSelected =
                activeSection === "all" && selectedCategory === course.key;

              return (
                <button
                  key={course.key}
                  type="button"
                  onClick={() => {
                    onSelectSection("all");
                    if (onSelectCategory) {
                      onSelectCategory(course.key);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? (theme?.activePill || "bg-slate-900 text-white font-semibold shadow-xs")
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        isSelected ? "bg-white" : (theme?.colorDot || "bg-slate-400")
                      }`}
                    />
                    <span className="truncate">{course.label}</span>
                  </div>

                  <span
                    suppressHydrationWarning
                    className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold tabular-nums ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "text-slate-400 bg-slate-100"
                    }`}
                  >
                    {course.count}
                  </span>
                </button>
              );
            }))}
          </div>
        </div>
      </div>

      {/* Offline Storage Status Card at Bottom */}
      <div className="pt-4 border-t border-slate-100">
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/70 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <HardDrive className="h-3.5 w-3.5 text-blue-600" />
              <span>Offline Study Vault</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            All 22 course files are indexed for fast search and offline viewing.
          </p>
        </div>
      </div>
    </aside>
  );
}
