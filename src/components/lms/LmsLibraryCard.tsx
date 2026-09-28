"use client";

import * as React from "react";
import { Eye, Download, Bookmark } from "lucide-react";
import { PdfDocumentIcon } from "./PdfDocumentIcon";

export interface LmsPdfDocument {
  id: string;
  title: string;
  courseCode: string;
  courseName?: string;
  size: string;
  category: "Data Structures" | "Operating Systems" | "Math" | "Physics" | "etc.";
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
}

export function LmsLibraryCard({
  doc,
  onPreview,
  onDownload,
  onToggleBookmark,
}: LmsLibraryCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-[#EFF1F6] p-4 flex items-center gap-4 hover:shadow-md hover:border-indigo-200/80 transition-all duration-200">
      {/* Bookmark quick toggle pill */}
      {onToggleBookmark && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(doc.id);
          }}
          className={`absolute top-2.5 right-2.5 h-6 w-6 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
            doc.isBookmarked
              ? "!opacity-100 text-amber-500 bg-amber-50"
              : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          title={doc.isBookmarked ? "Remove Bookmark" : "Bookmark this PDF"}
        >
          <Bookmark
            className={`h-3.5 w-3.5 ${doc.isBookmarked ? "fill-amber-400 text-amber-500" : ""}`}
          />
        </button>
      )}

      {/* Left: Soft Lavender PDF Icon Box */}
      <div
        onClick={() => onPreview(doc)}
        className="w-20 h-24 sm:w-24 sm:h-26 rounded-2xl bg-[#EEF0FA] flex items-center justify-center shrink-0 cursor-pointer group-hover:scale-102 transition-transform"
      >
        <PdfDocumentIcon className="w-10 h-12 text-[#181829] group-hover:text-[#4F46E5] transition-colors" />
      </div>

      {/* Right: Info & Actions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3
            onClick={() => onPreview(doc)}
            className="text-sm font-bold text-[#181829] group-hover:text-[#4F46E5] transition-colors line-clamp-2 leading-tight cursor-pointer"
            title={doc.title}
          >
            {doc.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {doc.courseCode} • {doc.size}
          </p>
        </div>

        {/* Action Buttons: View (Eye) + Download */}
        <div className="flex items-center gap-2 mt-3">
          {/* Preview / Eye button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(doc);
            }}
            className="h-7 w-7 rounded-lg bg-[#EEF0FA] hover:bg-[#E0E4F7] text-slate-600 hover:text-[#4F46E5] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Preview PDF"
            aria-label={`Preview ${doc.title}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          {/* Download button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(doc);
            }}
            className="h-7 w-7 rounded-lg bg-[#EEF0FA] hover:bg-[#E0E4F7] text-slate-600 hover:text-[#4F46E5] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Download PDF"
            aria-label={`Download ${doc.title}`}
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
