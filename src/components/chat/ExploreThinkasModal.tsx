"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import { EXPLORE_THINKAS } from "@/lib/chatStorage";
import { ExploreAssistant } from "@/types/chat";

export interface ExploreThinkasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAssistant: (assistant: ExploreAssistant) => void;
}

export function ExploreThinkasModal({
  isOpen,
  onClose,
  onSelectAssistant,
}: ExploreThinkasModalProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Academic", "Productivity", "Coding", "Writing", "Creativity"];

  const filtered = selectedCategory === "All"
    ? EXPLORE_THINKAS
    : EXPLORE_THINKAS.filter((a) => a.category === selectedCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-blue-50 text-[#315BFF] flex items-center justify-center border border-blue-100">
              <GIcon name="grid_view" size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Explore Thinkas</h3>
              <p className="text-xs text-slate-500">
                Specialized AI assistants designed for your university workflow
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
          >
            <GIcon name="close" size={18} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#315BFF] text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Assistant Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectAssistant(item);
                onClose();
              }}
              className="group p-4 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center border ${item.accentColor}`}
                  >
                    <GIcon name={item.iconName} size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.badgeText}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Use Assistant</span>
                <GIcon name="arrow_forward" size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
