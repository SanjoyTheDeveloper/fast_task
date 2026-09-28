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
} from "lucide-react";
import { LmsPdfDocument } from "./LmsLibraryCard";
import { PdfDocumentIcon } from "./PdfDocumentIcon";
import { toast } from "sonner";

export interface LmsPdfViewerModalProps {
  doc: LmsPdfDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: LmsPdfDocument) => void;
}

export function LmsPdfViewerModal({
  doc,
  isOpen,
  onClose,
  onDownload,
}: LmsPdfViewerModalProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = doc?.pages || 24;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [doc]);

  if (!isOpen || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#FAF9FD]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EEF0FA] flex items-center justify-center shrink-0">
              <PdfDocumentIcon className="w-6 h-7 text-[#181829]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[#181829] truncate">
                {doc.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="font-semibold text-[#4F46E5]">{doc.courseCode}</span>
                <span>•</span>
                <span>{doc.category}</span>
                <span>•</span>
                <span>{doc.size}</span>
                <span>•</span>
                <span>{totalPages} Pages</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onDownload(doc)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
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

        {/* Modal Body / PDF Simulated Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col items-center">
          {/* Paper Sheet Preview */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-slate-200/80 p-8 sm:p-12 space-y-6 min-h-[500px]">
            {/* Document Header within sheet */}
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>FastTask LMS Academic Library</span>
                <span>Course {doc.courseCode}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {doc.title.replace(".pdf", "")}
              </h1>
              <p className="text-sm text-slate-500">
                Department of Computer Science & Engineering • Academic Term Fall 2026
              </p>
            </div>

            {/* Simulated Section Content */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-[#EEF0FA]/60 border border-indigo-100 text-xs text-indigo-950 font-medium flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-[#4F46E5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Official Lecture Handout</p>
                  <p className="text-indigo-800/80 mt-0.5">
                    This document covers foundational principles, core theorems, and practical implementation examples for {doc.courseCode} ({doc.category}).
                  </p>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 pt-2">
                1. Overview & Core Objectives
              </h3>
              <p>
                In this chapter, students explore fundamental algorithmic paradigms, structure representations, and mathematical proofs. Thoroughly review each code example and associated time complexity analyses prior to the upcoming mid-semester assessments.
              </p>

              <h3 className="text-base font-bold text-slate-900 pt-2">
                2. Key Takeaways & Review Points
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Formal definitions of abstract data types and spatial complexity invariants.</li>
                <li>Comparative performance evaluation: Big-O asymptotic notation and worst-case bounds.</li>
                <li>Worked illustrative examples with step-by-step trace tables.</li>
                <li>Practice problem sets and lab assignment guidance.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-600 font-semibold">
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
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
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
