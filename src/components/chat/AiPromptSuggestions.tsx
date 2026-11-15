"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";

export interface AiPromptSuggestionsProps {
  onSelectPrompt: (promptText: string) => void;
  className?: string;
}

export function AiPromptSuggestions({
  onSelectPrompt,
  className = "",
}: AiPromptSuggestionsProps) {
  const suggestions = [
    {
      id: "write-copy",
      label: "Write copy",
      iconName: "edit_note",
      iconColor: "text-rose-500",
      prompt: "Write a high-converting announcement copy and executive summary for our FastTask academic release.",
    },
    {
      id: "create-avatar",
      label: "Create avatar",
      iconName: "face",
      iconColor: "text-sky-500",
      prompt: "Generate a stylized 3D daylight student avatar specification with royal blue highlights.",
    },
    {
      id: "image-gen",
      label: "Image generation",
      iconName: "auto_awesome",
      iconColor: "text-amber-500",
      prompt: "Generate an isometric 3D composition prompt for an organized student workstation in high-contrast daylight colors.",
    },
    {
      id: "write-code",
      label: "Write code",
      iconName: "code",
      iconColor: "text-teal-600",
      prompt: "Write a clean TypeScript React component that visualizes weekly lecture attendance without gradients.",
    },
  ];

  return (
    <div
      className={`w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12 select-none ${className}`}
    >
      {/* Centered Large Greeting matching screenshot */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-6 sm:mb-8">
        How can I assist you today?
      </h1>

      {/* 4 Quick Action Prompt Pills matching screenshot */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {suggestions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <GIcon
              name={item.iconName}
              size={18}
              className={`${item.iconColor} transition-transform group-hover:scale-110`}
            />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
