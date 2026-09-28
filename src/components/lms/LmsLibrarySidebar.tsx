"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Folder, Bookmark, Layers } from "lucide-react";

export type LmsNavSection = "all" | "courses" | "bookmarks";

export interface LmsLibrarySidebarProps {
  activeSection: LmsNavSection;
  onSelectSection: (section: LmsNavSection) => void;
  onUpgradeClick?: () => void;
  counts?: {
    all: number;
    courses: number;
    bookmarks: number;
  };
}

export function LmsLibrarySidebar({
  activeSection,
  onSelectSection,
  counts,
}: LmsLibrarySidebarProps) {
  const navItems: {
    id: LmsNavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    {
      id: "all",
      label: "All Notes & PDFs",
      icon: FileText,
      count: counts?.all,
    },
    {
      id: "courses",
      label: "By Courses",
      icon: Folder,
      count: counts?.courses,
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
      count: counts?.bookmarks,
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between p-6 bg-transparent h-full min-h-[640px]">
      <div className="space-y-8">
        {/* Brand Header */}
        <Link href="/lms" className="flex items-center gap-3 px-1 group">
          <div className="h-10 w-10 rounded-2xl bg-[#545BE8] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#181829]">
            SkillSet
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Library Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#EDE9FE] text-[#4F46E5] shadow-2xs"
                    : "text-[#5F6377] hover:text-[#181829] hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-[#4F46E5]" : "text-[#71758A]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-[#4F46E5] text-white"
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
    </aside>
  );
}
