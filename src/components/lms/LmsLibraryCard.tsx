"use client";

import * as React from "react";
import {
  Eye,
  Download,
  FileText,
  Brain,
  Code2,
  Network,
  Binary,
  PenTool,
  FlaskConical,
} from "lucide-react";
import {
  getCourseTheme,
  cleanDocumentTitle,
} from "@/lib/courseThemes";

export interface LmsPdfDocument {
  id: string;
  title: string;
  courseCode: string;
  courseName?: string;
  size: string;
  category: string;
  pages?: number;
  uploadedAt?: string;
  description?: string;
  isBookmarked?: boolean;
}

export interface LmsLibraryCardProps {
  doc: LmsPdfDocument;
  onPreview: (doc: LmsPdfDocument) => void;
  onDownload: (doc: LmsPdfDocument) => void;
  onToggleBookmark?: (id: string) => void;
  viewMode?: "grid" | "list";
}

function CourseIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "brain":
      return <Brain className={className} />;
    case "code":
      return <Code2 className={className} />;
    case "network":
      return <Network className={className} />;
    case "math":
      return <Binary className={className} />;
    case "writing":
      return <PenTool className={className} />;
    case "lab":
      return <FlaskConical className={className} />;
    default:
      return <FileText className={className} />;
  }
}

export function LmsLibraryCard({
  doc,
  onPreview,
  onDownload,
  viewMode = "grid",
}: LmsLibraryCardProps) {
  const theme = getCourseTheme(doc.courseName || doc.category || doc.courseCode);
  const cleanTitle = cleanDocumentTitle(doc.title);

  // If List View is requested
  if (viewMode === "list") {
    return (
      <div
        onClick={() => onPreview(doc)}
        className={`group relative ${theme.cardBg} hover:bg-white rounded-2xl border ${theme.cardBorder} p-4 sm:px-5 flex items-center justify-between gap-4 transition-all duration-200 ${theme.cardShadow} ${theme.cardHoverShadow} hover:-translate-y-0.5 cursor-pointer`}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Course Icon Badge */}
          <div
            className={`h-10 w-10 rounded-xl ${theme.iconBg} ${theme.iconColor} border ${theme.badgeBorder} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
          >
            <CourseIcon type={theme.iconType} className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-semibold tracking-[-0.01em] px-2 py-0.5 rounded-md ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
              >
                {doc.courseName || theme.name}
              </span>
              <span
                className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border tabular-nums ${theme.codeBadge}`}
              >
                {doc.courseCode}
              </span>
            </div>

            <h3 className="text-sm font-semibold tracking-[-0.015em] text-slate-900 group-hover:text-slate-950 transition-colors truncate">
              {cleanTitle}
            </h3>
          </div>
        </div>

        {/* Right Actions: Only Functional Read & PDF */}
        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onPreview(doc)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl ${theme.primaryButton} text-xs font-semibold tracking-[-0.01em] transition-all cursor-pointer`}
            title="Read Document"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Read</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(doc)}
            className="h-8 w-8 sm:h-auto sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium tracking-[-0.01em] transition-all border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            title="Download PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid View - Clean, focused box with only functional controls (Read & PDF)
  return (
    <div
      onClick={() => onPreview(doc)}
      className={`group relative ${theme.cardBg} rounded-2xl border ${theme.cardBorder} p-5 flex flex-col justify-between ${theme.cardShadow} ${theme.cardHoverShadow} hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
    >
      {/* Top Header Row: Course Icon + Badges */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Refined Rounded Icon Tile */}
          <div
            className={`h-10 w-10 rounded-xl ${theme.iconBg} ${theme.iconColor} border ${theme.badgeBorder} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
          >
            <CourseIcon type={theme.iconType} className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {/* Course Name Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-[-0.01em] ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
            >
              {doc.courseName || theme.name}
            </span>

            {/* Course Code Badge (Same Matching Color) */}
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg border tabular-nums ${theme.codeBadge}`}
            >
              {doc.courseCode}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content: Document Title */}
      <div className="flex-1 min-h-[46px] mb-4">
        <h3
          className="text-[14.5px] font-semibold tracking-[-0.015em] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-950 transition-colors"
          title={cleanTitle}
        >
          {cleanTitle}
        </h3>
      </div>

      {/* Action Buttons Row: Only Functional Read & PDF */}
      <div
        className="flex items-center justify-between gap-2 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onPreview(doc)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl ${theme.primaryButton} text-xs font-semibold tracking-[-0.01em] transition-all cursor-pointer`}
          title="Read Document"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Read</span>
        </button>

        <button
          type="button"
          onClick={() => onDownload(doc)}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold tracking-[-0.01em] transition-all border border-slate-200 shadow-2xs cursor-pointer"
          title="Download PDF"
        >
          <Download className="h-3.5 w-3.5" />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
}
