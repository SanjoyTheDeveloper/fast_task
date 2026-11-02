"use client";

import * as React from "react";
import {
  Eye,
  Download,
  Trash2,
  Bookmark,
  Sparkles,
} from "@/components/ui/GoogleIcon";
import {
  getCourseTheme,
  cleanDocumentTitle,
} from "@/lib/courseThemes";

import type { LmsPdfDocument } from "@/types";
export type { LmsPdfDocument };

export interface LmsLibraryCardProps {
  doc: LmsPdfDocument;
  onPreview: (doc: LmsPdfDocument) => void;
  onDownload: (doc: LmsPdfDocument) => void;
  onToggleBookmark?: (id: string) => void;
  onDelete?: (id: string) => void;
  viewMode?: "grid" | "list";
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
        className={`group relative ${theme.cardBg || "bg-white"} border ${theme.cardBorder || "border-slate-200/80"} rounded-2xl p-4 sm:px-5 flex items-center justify-between gap-4 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden`}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                {doc.courseName || theme.name}
              </span>
              <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg border tabular-nums ${theme.codeBadge || "border-slate-200/80 bg-slate-50 text-slate-600"}`}>
                {doc.courseCode}
              </span>
              {doc.isCustomUpload && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="h-2.5 w-2.5" />
                  Uploaded
                </span>
              )}
            </div>

            <h3 className="text-slate-900 font-bold text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
              {cleanTitle}
            </h3>
            {doc.schedule && (
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                📅 {doc.schedule}
              </span>
            )}
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Read Document"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Read</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(doc)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Download PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PDF</span>
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

  // Grid View - Unified Clean Card matching FastTask Dashboard Specifications
  return (
    <div
      onClick={() => onPreview(doc)}
      className={`group relative ${theme.cardBg || "bg-white"} border ${theme.cardBorder || "border-slate-200/80"} rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full cursor-pointer`}
    >
      <div>
        {/* Header area: Course tag pill along with course code and status badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
            <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
              {doc.courseName || theme.name}
            </span>

            <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg border tabular-nums ${theme.codeBadge || "border-slate-200/80 bg-slate-50 text-slate-600"}`}>
              {doc.courseCode}
            </span>

            {doc.isCustomUpload && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-2xs">
                <Sparkles className="h-2.5 w-2.5" />
                Uploaded
              </span>
            )}
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

        {/* Title: text-slate-900 font-bold text-base mt-3 line-clamp-2 */}
        <h3
          className="text-slate-900 font-bold text-base mt-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
          title={cleanTitle}
        >
          {cleanTitle}
        </h3>

        {doc.schedule && (
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-2">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${theme.colorDot || "bg-blue-500"} shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.5)]`} />
            <span>{doc.schedule}</span>
          </p>
        )}
      </div>

      {/* Action buttons at bottom: Read & PDF */}
      <div
        className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onPreview(doc)}
          className={`font-semibold text-xs py-2 px-4 rounded-xl flex-1 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${theme.primaryButton || "bg-blue-600 hover:bg-blue-700 text-white"}`}
          title="Read Document"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Read</span>
        </button>

        <button
          type="button"
          onClick={() => onDownload(doc)}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
          title="Download PDF"
        >
          <Download className="h-3.5 w-3.5" />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
}
