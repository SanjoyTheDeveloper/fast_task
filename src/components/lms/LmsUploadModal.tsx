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
  const [title, setTitle] = React.useState("");
  const [courseCode, setCourseCode] = React.useState("CSE101");
  const [category, setCategory] = React.useState<LmsPdfDocument["category"]>("Data Structures");
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
      courseCode: courseCode.trim().toUpperCase() || "CSE101",
      size: `${(Math.random() * 3 + 1.5).toFixed(1)} MB`,
      category,
      pages: Math.floor(Math.random() * 20 + 10),
      uploadedAt: "Just now",
      isBookmarked: false,
    };

    onUpload(newDoc);
    toast.success(`"${normalizedTitle}" uploaded successfully to SkillSet Library! 🎉`);
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
              <h2 className="text-base font-bold text-slate-900">Upload PDF Note</h2>
              <p className="text-xs text-slate-500">Add course materials to SkillSet Library</p>
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
              placeholder="e.g. Chapter 7 - Graph Algorithms.pdf"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#4F46E5] text-xs sm:text-sm text-slate-900 focus:outline-none transition-all"
            />
          </div>

          {/* Course & Category Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Course Code</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="CSE101"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#4F46E5] text-xs sm:text-sm text-slate-900 uppercase focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LmsPdfDocument["category"])}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#4F46E5] text-xs sm:text-sm text-slate-900 focus:outline-none transition-all"
              >
                <option value="Data Structures">Data Structures</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Math">Math</option>
                <option value="Physics">Physics</option>
                <option value="etc.">etc.</option>
              </select>
            </div>
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
