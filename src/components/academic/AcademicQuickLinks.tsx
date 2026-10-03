"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  FolderGit2,
  GraduationCap,
  FileText,
  Library,
  Bookmark,
  Plus,
  Compass,
} from "@/components/ui/GoogleIcon";

interface QuickLinkItem {
  id: string;
  title: string;
  category: string;
  url: string;
  iconName: "portal" | "drive" | "syllabus" | "library";
  colorClass: string;
  bgClass: string;
}

const DEFAULT_LINKS: QuickLinkItem[] = [
  {
    id: "lms",
    title: "University Portal / LMS",
    category: "Course Dashboard & Grades",
    url: "https://canvas.instructure.com",
    iconName: "portal",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/40",
  },
  {
    id: "drive",
    title: "Shared Class Drive",
    category: "Lecture Slides & Lab Handouts",
    url: "https://drive.google.com",
    iconName: "drive",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40",
  },
  {
    id: "syllabus",
    title: "Course Syllabi & Policies",
    category: "Fall 2026 Curriculum Guide",
    url: "https://notion.so",
    iconName: "syllabus",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-900/40",
  },
  {
    id: "library",
    title: "Digital Research Library",
    category: "IEEE Xplore, ACM & Papers",
    url: "https://ieeexplore.ieee.org",
    iconName: "library",
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40",
  },
];

export function AcademicQuickLinks() {
  const [links] = useState<QuickLinkItem[]>(DEFAULT_LINKS);

  const renderIcon = (type: QuickLinkItem["iconName"]) => {
    switch (type) {
      case "portal":
        return <GraduationCap className="h-4 w-4" />;
      case "drive":
        return <FolderGit2 className="h-4 w-4" />;
      case "syllabus":
        return <FileText className="h-4 w-4" />;
      case "library":
        return <Library className="h-4 w-4" />;
      default:
        return <Bookmark className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden relative">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-400/20 flex items-center justify-center">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Academic Resources
            </h3>
            <p className="text-xs text-slate-500">
              Drive, Portals & Syllabi
            </p>
          </div>
        </div>

        <span className="text-[11px] font-medium text-slate-500 bg-slate-100/90 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
          {links.length} Repos
        </span>
      </div>

      {/* Link list */}
      <div className="p-3.5 space-y-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100/90 hover:border-slate-300 bg-white/60 hover:bg-slate-50/80 transition-all shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${link.bgClass} ${link.colorClass}`}
              >
                {renderIcon(link.iconName)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                  {link.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {link.category}
                </p>
              </div>
            </div>

            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </a>
        ))}
      </div>
    </div>
  );
}
