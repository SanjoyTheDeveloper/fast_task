"use client";

import * as React from "react";
import { X, Upload, FileText, CheckCircle2 } from "lucide-react";
import { LmsPdfDocument } from "./LmsLibraryCard";
import { toast } from "sonner";

export interface LmsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newDoc: LmsPdfDocument) => void;
}

export function LmsUploadModal({ isOpen, onClose, onUpload }: LmsUploadModalProps) {
  const COURSE_OPTIONS = [
    { code: "0611CSE321", name: "AIES", category: "AIES", title: "0611CSE321 • AIES (Artificial Intelligence)" },
    { code: "0613CSE333", name: "AP", category: "AP", title: "0613CSE333 • AP (Advanced Programming)" },
    { code: "0612CSE315", name: "CN", category: "CN", title: "0612CSE315 • CN (Computer Networks)" },
    { code: "0541MAT337", name: "MACS", category: "MACS", title: "0541MAT337 • MACS (Complex Systems)" },
    { code: "0031CSE320", name: "TWRM", category: "TWRM", title: "0031CSE320 • TWRM (Research Writing)" },
    { code: "0612CSE316", name: "CN Sess.", category: "Labs & Sessionals", title: "0612CSE316 • CN Sessional" },
    { code: "0611CSE322", name: "AIES Sess.", category: "Labs & Sessionals", title: "0611CSE322 • AIES Sessional" },
    { code: "0613CSE334", name: "AP Sess.", category: "Labs & Sessionals", title: "0613CSE334 • AP Sessional" },
  ];

  const [selectedCourseIdx, setSelectedCourseIdx] = React.useState(0);
  const selectedCourse = COURSE_OPTIONS[selectedCourseIdx] || COURSE_OPTIONS[0];
  const [title, setTitle] = React.useState("");
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (!title) {
        setTitle(file.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || selectedFileName || "New Lecture Note.pdf";
    const normalizedTitle = finalTitle.endsWith(".pdf") ? finalTitle : `${finalTitle}.pdf`;

    const newDoc: LmsPdfDocument = {
      id: `doc-${Date.now()}`,
      title: normalizedTitle,
      courseCode: selectedCourse.code,
      courseName: selectedCourse.name,
      size: `${(Math.random() * 3 + 1.5).toFixed(1)} MB`,
      category: selectedCourse.category,
      pages: Math.floor(Math.random() * 20 + 10),
      uploadedAt: "Just now",
      isBookmarked: false,
    };

    onUpload(newDoc);
    toast.success(`"${normalizedTitle}" uploaded successfully to Library! 🎉`);
    setTitle("");
    setSelectedFileName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Course Material</h2>
              <p className="text-xs text-slate-500">Add course materials to Library</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop simulated box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-[#4F46E5] bg-[#EEF0FA]/40 hover:bg-[#EEF0FA]/70 rounded-2xl p-6 text-center transition-colors cursor-pointer space-y-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="mx-auto h-12 w-12 rounded-xl bg-white shadow-2xs border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">
              {selectedFileName ? selectedFileName : "Click or drag & drop PDF here"}
            </p>
            <p className="text-[11px] text-slate-400">PDF up to 25 MB supported</p>
          </div>

          {/* Document Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 - Network Security & Firewalls.pdf"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#4F46E5] text-xs sm:text-sm text-slate-900 focus:outline-none transition-all"
            />
          </div>

          {/* Course Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Select Enrolled Course</label>
            <select
              value={selectedCourseIdx}
              onChange={(e) => setSelectedCourseIdx(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#4F46E5] text-xs sm:text-sm text-slate-900 focus:outline-none transition-all"
            >
              {COURSE_OPTIONS.map((opt, idx) => (
                <option key={opt.code} value={idx}>
                  {opt.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-md shadow-indigo-500/25 cursor-pointer"
            >
              Upload Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
