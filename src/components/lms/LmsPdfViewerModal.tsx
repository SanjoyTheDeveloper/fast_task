"use client";

import * as React from "react";
import {
  X,
  Download,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle,
  FileSearch,
  Bookmark,
} from "lucide-react";
import { LmsPdfDocument } from "./LmsLibraryCard";
import { PdfDocumentIcon } from "./PdfDocumentIcon";
import { toast } from "sonner";

export interface LmsPdfViewerModalProps {
  doc: LmsPdfDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: LmsPdfDocument) => void;
  onToggleBookmark?: (id: string) => void;
}

export function LmsPdfViewerModal({
  doc,
  isOpen,
  onClose,
  onDownload,
  onToggleBookmark,
}: LmsPdfViewerModalProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [viewerMode, setViewerMode] = React.useState<"pdf" | "reader">("pdf");
  const totalPages = doc?.pages || 24;

  React.useEffect(() => {
    setCurrentPage(1);
    // If the document has a real fileUrl (e.g. uploaded PDF), default to native PDF viewer
    if (doc?.fileUrl) {
      setViewerMode("pdf");
    } else {
      setViewerMode("reader");
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const handleOpenInNewTab = () => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    } else {
      toast.info("Generating external PDF view...");
      onDownload(doc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl h-[92vh] max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-[#FAF9FD]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EEF0FA] flex items-center justify-center shrink-0">
              <PdfDocumentIcon className="w-6 h-7 text-[#181829]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[#181829] truncate">
                  {doc.title}
                </h2>
                {doc.isCustomUpload && (
                  <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Uploaded PDF
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="font-semibold text-[#4F46E5]">{doc.courseCode}</span>
                <span>•</span>
                <span>{doc.courseName || doc.category}</span>
                <span>•</span>
                <span>{doc.size}</span>
                <span>•</span>
                <span>{totalPages} Pages</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle if fileUrl is available */}
            {doc.fileUrl && (
              <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 mr-1">
                <button
                  type="button"
                  onClick={() => setViewerMode("pdf")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewerMode === "pdf"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Native PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewerMode("reader")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewerMode === "reader"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Reader View
                </button>
              </div>
            )}

            {doc.fileUrl && (
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer"
                title="Open in new browser tab"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span>Full Tab</span>
              </button>
            )}

            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(doc.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                  doc.isBookmarked
                    ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-600"
                }`}
                title={doc.isBookmarked ? "Remove Bookmark" : "Bookmark Document"}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 ${
                    doc.isBookmarked ? "fill-amber-500 text-amber-600" : ""
                  }`}
                />
                <span className="hidden sm:inline">
                  {doc.isBookmarked ? "Bookmarked" : "Bookmark"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onDownload(doc)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Either Native Embedded PDF or Formatted Paper Sheet */}
        <div className="flex-1 overflow-y-auto bg-slate-100/70 p-2 sm:p-5 flex flex-col items-center">
          {viewerMode === "pdf" && doc.fileUrl ? (
            /* Native embedded PDF viewer */
            <div className="w-full h-full min-h-[580px] flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <iframe
                src={`${doc.fileUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full flex-1 min-h-[580px] border-0"
                title={doc.title}
              />
            </div>
          ) : (
            /* Structured Paper Sheet Reader Preview */
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 sm:p-12 space-y-6 my-auto">
              {/* Document Header within sheet */}
              <div className="border-b border-slate-100 pb-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span>FastTask Course Vault</span>
                  <span>{doc.courseCode}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {doc.title.replace(/\.pdf$/i, "")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Course: {doc.courseName || doc.category} ({doc.courseCode}) • Batch 82A
                </p>
              </div>

              {/* Section Content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-[#EEF0FA]/70 border border-indigo-100 text-xs text-indigo-950 font-medium flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Official Course Document</p>
                    <p className="text-indigo-800/80 mt-0.5">
                      This PDF contains lecture material, practice topics, and reference guides for {doc.courseCode} ({doc.category}).
                    </p>
                  </div>
                </div>

                {doc.description && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-800 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-900">Lecture Notes &amp; Highlights</span>
                      <span>Department of CSE • Batch 82A</span>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed text-slate-700">
                      {doc.description}
                    </div>
                  </div>
                )}

                <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-2">
                  1. Overview &amp; Learning Objectives
                </h3>
                <p>
                  In this module, students review key definitions, analytical models, and practical implementations.
                  Review all theorem proofs and code patterns to prepare for term examinations and lab assessments.
                </p>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-2">
                  2. Syllabus Key Points &amp; Review Topics
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                  <li>Theoretical foundations and mathematical representations.</li>
                  <li>Algorithmic flowcharts, trace tables, and step-by-step executions.</li>
                  <li>Asymptotic bounds and efficiency analyses for mid-term preparations.</li>
                  <li>Lab project milestones and code repository guidelines.</li>
                </ul>

                {doc.fileUrl && (
                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setViewerMode("pdf")}
                      className="px-4 py-2 rounded-xl bg-[#315BFF] text-white text-xs font-bold shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <FileSearch className="h-4 w-4" />
                      <span>Switch to Full PDF File View</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-600 font-semibold tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
