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
  Trash2,
  Sparkles,
  Bookmark,
} from "@/components/ui/GoogleIcon";
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
  fileUrl?: string;
  isCustomUpload?: boolean;
  materialType?: string;
}

export interface LmsLibraryCardProps {
  doc: LmsPdfDocument;
  onPreview: (doc: LmsPdfDocument) => void;
  onDownload: (doc: LmsPdfDocument) => void;
  onToggleBookmark?: (id: string) => void;
  onDelete?: (id: string) => void;
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
  onToggleBookmark,
  onDelete,
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
            <div className="flex items-center gap-2 mb-1 flex-wrap">
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
              {doc.isCustomUpload && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  Uploaded
                </span>
              )}
            </div>

            <h3 className="text-sm font-semibold tracking-[-0.015em] text-slate-900 group-hover:text-slate-950 transition-colors truncate">
              {cleanTitle}
            </h3>
          </div>
        </div>

        {/* Right Actions: Bookmark + Functional Read & PDF + Optional Delete */}
        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(doc.id)}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                doc.isBookmarked
                  ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 shadow-2xs"
                  : "bg-white text-slate-400 hover:text-amber-500 hover:bg-amber-50/50 border-slate-200 shadow-2xs"
              }`}
              title={doc.isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
              aria-label={doc.isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  doc.isBookmarked ? "fill-amber-500 text-amber-600" : ""
                }`}
              />
            </button>
          )}

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

          {doc.isCustomUpload && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(doc.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              title="Delete uploaded note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid View - Clean, focused box with functional controls & Bookmark
  return (
    <div
      onClick={() => onPreview(doc)}
      className={`group relative ${theme.cardBg} rounded-2xl border ${theme.cardBorder} p-5 flex flex-col justify-between ${theme.cardShadow} ${theme.cardHoverShadow} hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
    >
      {/* Top Header Row: Course Icon + Badges + Bookmark & Delete */}
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

            {/* Course Code Badge */}
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg border tabular-nums ${theme.codeBadge}`}
            >
              {doc.courseCode}
            </span>

            {doc.isCustomUpload && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                <Sparkles className="h-2.5 w-2.5" />
                Uploaded
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(doc.id)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                doc.isBookmarked
                  ? "bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs"
                  : "text-slate-300 hover:text-amber-500 hover:bg-amber-50/60"
              }`}
              title={doc.isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
              aria-label={doc.isBookmarked ? "Remove bookmark" : "Add to bookmarks"}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  doc.isBookmarked ? "fill-amber-500 text-amber-600" : ""
                }`}
              />
            </button>
          )}

          {doc.isCustomUpload && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(doc.id)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete uploaded note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
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

      {/* Action Buttons Row: Read & PDF */}
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
