"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import { AI_MODELS } from "@/lib/chatStorage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface AiChatHeaderProps {
  currentModelId: string;
  onSelectModel: (modelId: string) => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onShareChat: () => void;
  onToggleSidebar?: () => void;
  userName?: string;
  userImage?: string | null;
  className?: string;
}

export function AiChatHeader({
  currentModelId,
  onSelectModel,
  onClearChat,
  onExportChat,
  onShareChat,
  onToggleSidebar,
  userName = "Sanjoy Chandro Bhowmick",
  userImage,
  className,
}: AiChatHeaderProps) {
  const currentModel =
    AI_MODELS.find((m) => m.id === currentModelId) || AI_MODELS[0];

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SB";

  return (
    <header
      className={cn(
        "h-14 border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none",
        className
      )}
    >
      {/* Left: Mobile Toggle, Thinka Brand & Model Selector */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
            aria-label="Toggle chat history"
          >
            <GIcon name="menu" size={18} />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
            Thinka
          </span>

          {/* Model Selector Dropdown matching 'Thinka 2.0 Flashs v' */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer outline-none"
              >
                <span>{currentModel.shortLabel}</span>
                <GIcon name="expand_more" size={14} className="text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-72 rounded-2xl p-1.5 shadow-xl border border-slate-200 bg-white"
            >
              <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Model
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-slate-100" />

              {AI_MODELS.map((model) => {
                const isSelected = model.id === currentModel.id;
                return (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onSelectModel(model.id)}
                    className={cn(
                      "flex flex-col items-start gap-1 p-2.5 rounded-xl cursor-pointer transition-colors",
                      isSelected
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {model.name}
                        </span>
                        {model.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-100 text-[#315BFF]">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <GIcon name="check" size={16} className="text-[#315BFF]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal line-clamp-1">
                      {model.description}
                    </p>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right: Actions, Share Button, and Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-8 w-8 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="More options"
              aria-label="More options"
            >
              <GIcon name="more_horiz" size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl p-1.5 shadow-xl border border-slate-200 bg-white"
          >
            <DropdownMenuItem
              onClick={onExportChat}
              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl cursor-pointer"
            >
              <GIcon name="download" size={16} className="text-slate-400" />
              <span>Export Transcript</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onClearChat}
              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
            >
              <GIcon name="delete_sweep" size={16} className="text-red-500" />
              <span>Clear Conversation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Share Button with Tray Icon matching screenshot */}
        <button
          type="button"
          onClick={onShareChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <GIcon name="ios_share" size={15} className="text-slate-500" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* User Avatar with Profile Portrait matching screenshot */}
        <div className="relative shrink-0">
          <div
            className="h-8 w-8 rounded-full bg-[#E06D53] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-xs overflow-hidden"
            title={userName}
          >
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userImage}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
