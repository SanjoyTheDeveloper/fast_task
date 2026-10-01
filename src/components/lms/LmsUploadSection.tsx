"use client";

import * as React from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { LmsPdfDocument } from "./LmsLibraryCard";
import { toast } from "sonner";

export interface LmsUploadSectionProps {
  onUploadDocument: (newDoc: LmsPdfDocument, autoOpenViewer?: boolean) => void;
  activeCategory?: string;
  isCollapsedDefault?: boolean;
}

export const COURSE_OPTIONS = [
  {
    code: "0611CSE321",
    name: "AIES",
    category: "AIES",
    title: "0611CSE321 • AIES (Artificial Intelligence & Expert Systems)",
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
    title: "0541MAT337 • MACS (Math & Complex Systems)",
  },
  {
    code: "0031CSE320",
    name: "TWRM",
    category: "TWRM",
    title: "0031CSE320 • TWRM (Technical Writing & Research)",
  },
  {
    code: "0612CSE316",
    name: "CN Sess.",
    category: "Labs & Sessionals",
    title: "0612CSE316 • CN Sessional (Networking Lab)",
  },
  {
    code: "0611CSE322",
    name: "AIES Sess.",
    category: "Labs & Sessionals",
    title: "0611CSE322 • AIES Sessional (AI Lab)",
  },
  {
    code: "0613CSE334",
    name: "AP Sess.",
    category: "Labs & Sessionals",
    title: "0613CSE334 • AP Sessional (Advanced Prog Lab)",
  },
];

const MATERIAL_TYPES = [
  "Lecture Handout",
  "Chapter Notes",
  "Lab Manual",
  "Assignment Guide",
  "Exam Review Sheet",
];

export function LmsUploadSection({
  onUploadDocument,
  activeCategory = "All",
  isCollapsedDefault = false,
}: LmsUploadSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(isCollapsedDefault);
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [selectedCourseIdx, setSelectedCourseIdx] = React.useState(0);
  const [materialType, setMaterialType] = React.useState(MATERIAL_TYPES[0]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync course dropdown if active category changes and matches a course
  React.useEffect(() => {
    if (activeCategory && activeCategory !== "All") {
      const idx = COURSE_OPTIONS.findIndex(
        (c) => c.name.toLowerCase() === activeCategory.toLowerCase() || c.category.toLowerCase() === activeCategory.toLowerCase()
      );
      if (idx !== -1) {
        setSelectedCourseIdx(idx);
      }
    }
  }, [activeCategory]);

  const handleProcessFile = (file: File) => {
    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document (.pdf)");
      toast.error("Only PDF files are supported");
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);

    // Auto-populate title if empty or default
    if (!title || title.trim() === "") {
      const baseName = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
      // Capitalize nicely
      const cleanTitle = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      setTitle(cleanTitle);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setTitle("");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (autoOpen: boolean = false) => {
    if (!selectedFile && !title.trim()) {
      setErrorMsg("Please select a PDF file to upload");
      return;
    }

    const course = COURSE_OPTIONS[selectedCourseIdx] || COURSE_OPTIONS[0];
    const rawTitle = title.trim() || selectedFile?.name?.replace(/\.pdf$/i, "") || "Course Lecture Handout";
    const cleanTitle = rawTitle.endsWith(".pdf") ? rawTitle : `${rawTitle}.pdf`;

    // Create real browser blob URL for instant previewing & reading
    let fileBlobUrl = "";
    if (selectedFile) {
      fileBlobUrl = URL.createObjectURL(selectedFile);
    }

    const formattedSize = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : "2.8 MB";

    const newDoc: LmsPdfDocument = {
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: cleanTitle,
      courseCode: course.code,
      courseName: course.name,
      size: formattedSize,
      category: course.category,
      pages: Math.max(8, Math.floor(Math.random() * 24) + 12),
      uploadedAt: "Just now",
      isBookmarked: false,
      isCustomUpload: true,
      fileUrl: fileBlobUrl,
      description: `${materialType} for ${course.name} (${course.code})`,
    };

    onUploadDocument(newDoc, autoOpen);
    handleClearFile();
  };

  return (
    <div
      id="upload-course-section"
      className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-blue-50/30 p-4 sm:p-6 shadow-sm shadow-indigo-100/50 transition-all duration-200"
    >
      {/* Top Header / Collapse Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#315BFF] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Upload Course PDF
              </h2>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                Course Vault
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Upload course PDFs, lecture slides, assignments or lab guides to view instantly.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
        >
          <span>{isCollapsed ? "Expand Upload" : "Hide"}</span>
          {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Upload Body Area */}
      {!isCollapsed && (
        <div className="mt-5 space-y-4 pt-4 border-t border-indigo-100/60 animate-in fade-in-50 duration-200">
          {/* Drag & Drop File Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (!selectedFile) {
                fileInputRef.current?.click();
              }
            }}
            className={`relative rounded-3xl p-5 text-center transition-all overflow-hidden ${
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
                <linearGradient id="dashboardBorderGradientSection" x1="0%" y1="0%" x2="100%" y2="100%">
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
                stroke={selectedFile ? "#10B981" : "url(#dashboardBorderGradientSection)"}
                strokeWidth={isDragging ? "2.5" : "2"}
                strokeDasharray="8 6"
              />
            </svg>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        PDF Ready
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate mt-0.5 max-w-md">
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
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearFile();
                    }}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove File"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#315BFF] flex items-center justify-center shadow-xs">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Drag and drop your course PDF here, or{" "}
                    <span className="text-[#315BFF] underline underline-offset-2">browse files</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Size: 50MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Meta Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 pt-1">
            {/* Target Course Selector */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Select Course</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Assigns color &amp; folder)
                </span>
              </label>
              <select
                value={selectedCourseIdx}
                onChange={(e) => setSelectedCourseIdx(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs font-semibold text-slate-800 outline-none transition-all shadow-2xs cursor-pointer"
              >
                {COURSE_OPTIONS.map((c, idx) => (
                  <option key={c.code} value={idx}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Title Input */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Document / Chapter Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is your chapter name"
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Material Type */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Material Type
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs font-medium text-slate-800 outline-none transition-all shadow-2xs cursor-pointer"
              >
                {MATERIAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Uploaded PDFs are rendered with native page navigation and zooming.</span>
            </p>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Upload to Library</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-5 py-2.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Upload &amp; Show PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
