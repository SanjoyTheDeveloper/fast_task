"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import { toast } from "sonner";

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  const features = [
    { title: "Unlimited Thinka 2.0 Flash & Gemini 2.5 Pro", desc: "No daily rate limits or token caps on problem-solving." },
    { title: "Deep Research Mode", desc: "Multi-phase reasoning engine synthesized with academic literature." },
    { title: "Full Routine & Syllabus Synchronization", desc: "Direct grounding with your enrolled semester courses & timetable." },
    { title: "Zero-Latency Priority Processing", desc: "Instant response streaming with high-throughput cloud endpoints." },
  ];

  const handleUpgrade = () => {
    toast.success("FastTask PRO unlocked! All advanced AI models & Deep Research active.");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-[#315BFF] flex items-center justify-center border border-blue-100">
              <GIcon name="workspace_premium" size={22} className="text-[#315BFF]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900">FastTask PRO</h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-[#315BFF] text-white">
                  Upgrade
                </span>
              </div>
              <p className="text-xs text-slate-500">More access to the best mode</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
          >
            <GIcon name="close" size={18} />
          </button>
        </div>

        {/* Feature List */}
        <div className="space-y-3 py-2 border-y border-slate-100">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                <GIcon name="check" size={13} weight={600} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">{f.title}</p>
                <p className="text-slate-500 text-[11px]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing / Plan Card */}
        <div className="rounded-2xl bg-blue-50/60 border border-blue-200/80 p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900">Student Semester Pass</p>
            <p className="text-[11px] text-slate-500">Billed per semester • Cancel anytime</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-[#315BFF]">$4.99</span>
            <span className="text-[10px] text-slate-400">/mo</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleUpgrade}
          className="w-full py-3 px-4 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <GIcon name="workspace_premium" size={18} />
          <span>Upgrade to PRO Now</span>
        </button>
      </div>
    </div>
  );
}
