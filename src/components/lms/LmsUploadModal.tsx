"use client";

import * as React from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  BookOpen,
  FileCheck,
  AlertCircle,
} from "@/components/ui/GoogleIcon";
import { LmsPdfDocument } from "./LmsLibraryCard";
import { toast } from "sonner";

export interface LmsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newDoc: LmsPdfDocument, autoOpenViewer?: boolean, rawFile?: File | null) => void;
  activeCategory?: string;
  userName?: string;
}

export const COURSE_OPTIONS = [
  {
    code: "0611CSE321",
    name: "AIES",
    category: "AIES",
    title: "0611CSE321 • AIES (Artificial Intelligence)",
  },
  {
    code: "0613CSE333",
    name: "AP",
    category: "AP",
    title: "0613CSE333 • AP (Advanced Programming)",
  },
  {
    code: "0612CSE315",
    name: "CN",
    category: "CN",
    title: "0612CSE315 • CN (Computer Networks)",
  },
  {
    code: "0541MAT337",
    name: "MACS",
    category: "MACS",
    title: "0541MAT337 • MACS (Complex Systems)",
  },
  {
    code: "0031CSE320",
    name: "TWRM",
    category: "TWRM",
    title: "0031CSE320 • TWRM (Research Writing)",
  },
  {
    code: "0612CSE316",
    name: "CN Sess.",
    category: "Labs & Sessionals",
    title: "0612CSE316 • CN Sessional (Lab)",
  },
  {
    code: "0611CSE322",
    name: "AIES Sess.",
    category: "Labs & Sessionals",
    title: "0611CSE322 • AIES Sessional (Lab)",
  },
  {
    code: "0613CSE334",
    name: "AP Sess.",
    category: "Labs & Sessionals",
    title: "0613CSE334 • AP Sessional (Lab)",
  },
  {
    code: "CUSTOM",
    name: "Custom Course",
    category: "Custom",
    title: "+ Other / Enter Custom Course...",
  },
];

const MATERIAL_TYPES = [
  "Lecture Handout",
  "Chapter Notes",
  "Lab Manual",
  "Assignment Guide",
  "Exam Review Sheet",
];

export function LmsUploadModal({
  isOpen,
  onClose,
  onUpload,
  activeCategory = "All",
}: LmsUploadModalProps) {
  // Course & Document Metadata
  const [selectedCourseIdx, setSelectedCourseIdx] = React.useState(0);
  const [customCourseName, setCustomCourseName] = React.useState("");
  const [customCourseCode, setCustomCourseCode] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [materialType, setMaterialType] = React.useState(MATERIAL_TYPES[0]);

  // PDF File state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync course selection with current page category tab
  React.useEffect(() => {
    if (activeCategory && activeCategory !== "All") {
      const idx = COURSE_OPTIONS.findIndex(
        (c) =>
          c.name.toLowerCase() === activeCategory.toLowerCase() ||
          c.category.toLowerCase() === activeCategory.toLowerCase()
      );
      if (idx !== -1) {
        setSelectedCourseIdx(idx);
      }
    }
  }, [activeCategory, isOpen]);

  if (!isOpen) return null;

  const selectedCourse = COURSE_OPTIONS[selectedCourseIdx] || COURSE_OPTIONS[0];

  const handleProcessFile = (file: File) => {
    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document (.pdf)");
      toast.error("Only PDF files are supported");
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);

    if (!title.trim()) {
      const baseName = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }
  };

  const handleClear = () => {
    setTitle("");
    setSelectedFile(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (autoOpen: boolean = false) => {
    if (!selectedFile && !title.trim()) {
      setErrorMsg("Please choose a course PDF file or specify a title.");
      return;
    }

    const rawTitle =
      title.trim() ||
      selectedFile?.name?.replace(/\.pdf$/i, "") ||
      "New Course Study Handout";
    const cleanTitle = rawTitle.endsWith(".pdf") ? rawTitle : `${rawTitle}.pdf`;

    let fileBlobUrl = "";
    if (selectedFile) {
      fileBlobUrl = URL.createObjectURL(selectedFile);
    }

    const formattedSize = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : "2.8 MB";

    const isCustom = selectedCourse.code === "CUSTOM";
    const finalCourseName = isCustom
      ? customCourseName.trim() || "General Course"
      : selectedCourse.name;
    const finalCourseCode = isCustom
      ? customCourseCode.trim() || "COURSE"
      : selectedCourse.code;
    const finalCategory = isCustom
      ? customCourseName.trim() || "General"
      : selectedCourse.category;

    const description = `${materialType} for ${finalCourseName} (${finalCourseCode})`;

    const newDoc: LmsPdfDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: cleanTitle,
      courseCode: finalCourseCode,
      courseName: finalCourseName,
      size: formattedSize,
      category: finalCategory,
      pages: 18,
      uploadedAt: "Just now",
      isBookmarked: false,
      isCustomUpload: true,
      fileUrl: fileBlobUrl || undefined,
      description: description,
      materialType: materialType,
    };

    onUpload(newDoc, autoOpen, selectedFile);
    handleClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-white to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#315BFF] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Upload Course PDF
              </h2>
              <p className="text-xs text-slate-500">
                Department of CSE • Batch 82A
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          {/* Drag & Drop Zone with Dashboard Gradient Border */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleProcessFile(f);
            }}
            onClick={() => {
              if (!selectedFile) fileInputRef.current?.click();
            }}
            className={`relative rounded-3xl p-6 text-center transition-all overflow-hidden ${
              isDragging
                ? "bg-blue-50/80 scale-[0.99] shadow-md shadow-blue-500/10"
                : selectedFile
                ? "bg-emerald-50/40"
                : "bg-gradient-to-br from-[#EEF4FF]/60 via-white to-[#F4F7FF]/80 hover:from-[#EEF4FF] hover:to-[#F4F7FF] cursor-pointer shadow-xs"
            }`}
          >
            {/* SVG Dashed Gradient Border matching Dashboard Theme */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="dashboardBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#315BFF" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <rect
                x="1.5"
                y="1.5"
                width="calc(100% - 3px)"
                height="calc(100% - 3px)"
                rx="22"
                ry="22"
                fill="none"
                stroke={selectedFile ? "#10B981" : "url(#dashboardBorderGradient)"}
                strokeWidth={isDragging ? "2.5" : "2"}
                strokeDasharray="8 6"
              />
            </svg>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleProcessFile(f);
              }}
            />

            {selectedFile ? (
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        PDF File Ready
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate mt-0.5 max-w-sm">
                      {selectedFile.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                  >
                    Change PDF
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 space-y-2 py-1">
                <div className="mx-auto h-13 w-13 rounded-2xl bg-gradient-to-tr from-[#315BFF]/10 via-[#6366F1]/10 to-[#8B5CF6]/15 border border-[#315BFF]/25 text-[#315BFF] flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-105">
                  <span
                    className="material-symbols-outlined select-none text-[#315BFF]"
                    style={{ fontSize: "30px" }}
                  >
                    drive_folder_upload
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Drop course{" "}
                    <span className="bg-gradient-to-r from-[#315BFF] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent underline underline-offset-2 font-black">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Size: 50MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Select Course
              </label>
              <select
                value={selectedCourseIdx}
                onChange={(e) => setSelectedCourseIdx(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer shadow-2xs"
              >
                {COURSE_OPTIONS.map((c, idx) => (
                  <option key={c.code} value={idx}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Classification
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 text-xs font-medium text-slate-800 outline-none transition-all shadow-2xs cursor-pointer"
              >
                {MATERIAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Course Name & Code inputs if "+ Other" is selected */}
          {selectedCourse.code === "CUSTOM" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 animate-in fade-in-50 duration-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Course Name</label>
                <input
                  type="text"
                  value={customCourseName}
                  onChange={(e) => setCustomCourseName(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Course Code</label>
                <input
                  type="text"
                  value={customCourseCode}
                  onChange={(e) => setCustomCourseCode(e.target.value)}
                  placeholder="e.g. CSE 325"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* Document Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Document / Chapter Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is your chapter name"
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#FAF9FD]/90 flex items-center">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full h-11 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
