"use client";

import * as React from "react";
import { Play, X } from "lucide-react";

export interface HeroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeroVideoModal({ isOpen, onClose }: HeroVideoModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0F172A] rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-semibold text-slate-300">
              FastTask Academic Workspace Walkthrough
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video bg-slate-950 flex items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-full bg-[#315BFF] flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/30">
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Academic Focus &amp; High-Grade Results
            </h3>
            <p className="text-sm text-slate-400 max-w-md">
              Experience how FastTask coordinates semester class routines, Kanban coursework, and Pomodoro study sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
