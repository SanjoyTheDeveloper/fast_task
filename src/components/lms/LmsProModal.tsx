"use client";

import * as React from "react";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export interface LmsProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LmsProModal({ isOpen, onClose }: LmsProModalProps) {
  if (!isOpen) return null;

  const handleActivate = () => {
    toast.success("SkillSet Pro activated! Unlimited storage and AI study notes unlocked 🚀");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 space-y-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-100 text-[#4F46E5] flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">SkillSet Pro Plan</h2>
              <p className="text-xs text-slate-500">More facilities for accelerated learning</p>
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

        <div className="space-y-3">
          {[
            "Unlimited PDF & document uploads with OCR text search",
            "AI Study Buddy: Summarize chapters and generate flashcards",
            "Offline reading mode with automatic sync",
            "Course routine integration with FastTask Calendar",
            "Priority download speeds & ad-free experience",
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
              <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-semibold">Student Special</p>
            <p className="text-lg font-black text-[#1E1B4B]">
              $4.99 <span className="text-xs font-normal text-slate-500">/ month</span>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-200 text-purple-800 text-[10px] font-extrabold uppercase">
            Save 40%
          </span>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
          <button
            type="button"
            onClick={handleActivate}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:opacity-95 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
