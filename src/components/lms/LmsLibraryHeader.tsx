"use client";

import * as React from "react";
import { Search, Menu, X } from "lucide-react";

export interface LmsLibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userName?: string;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export function LmsLibraryHeader({
  searchQuery,
  onSearchChange,
  userName = "Irham Muhammad",
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}: LmsLibraryHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Mobile Drawer Toggle & Logo on Small Screens */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#4F46E5] shadow-2xs"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="text-base font-bold text-[#181829]">SkillSet</span>
      </div>

      {/* Pill-Shaped Search Input Bar */}
      <div className="relative flex-1 max-w-md sm:max-w-lg lg:max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes, PDFs, topics..."
          className="w-full h-10 pl-11 pr-4 rounded-full bg-[#F4F4F8] hover:bg-[#EEF0F6] focus:bg-white border border-transparent focus:border-indigo-300 text-xs sm:text-sm text-[#181829] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
        />
      </div>

      {/* Right User Profile (Peach Circle + Name) */}
      <div className="flex items-center gap-2.5 shrink-0 pl-2">
        <div className="h-9 w-9 rounded-full bg-[#FCD8C1] text-[#B85D3B] flex items-center justify-center font-bold text-xs select-none shadow-2xs">
          IR
        </div>
        <span className="text-xs sm:text-sm font-semibold text-[#181829] hidden sm:inline-block">
          {userName}
        </span>
      </div>
    </header>
  );
}
