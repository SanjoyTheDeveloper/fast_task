"use client";

import * as React from "react";
import { Search, Bell, Moon, Sun, Radio, Menu, X } from "lucide-react";
import Image from "next/image";

export interface LmsHeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  userName?: string;
}

export function LmsHeader({
  searchQuery = "",
  onSearchChange,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  userName = "Irham Muhammad Shidiq",
}: LmsHeaderProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(true);

  return (
    <header className="w-full flex items-center justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-purple-100 shadow-xs text-slate-700 hover:text-purple-600 focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="text-lg font-black tracking-tight text-[#1E1B4B]">
          Skill<span className="text-[#6366F1]">Set</span>
        </span>
      </div>

      {/* Center Search Pill */}
      <div className="relative flex-1 max-w-sm sm:max-w-md hidden sm:block">
        <Search className="absolute left-4 top-3 h-4 w-4 text-purple-300" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search courses, teachers, or books..."
          className="w-full h-10 pl-11 pr-4 rounded-full bg-[#F4F2FA] hover:bg-[#EFEBF8] focus:bg-white border border-purple-100/60 text-xs sm:text-sm text-[#1E1B4B] placeholder:text-purple-300 focus:outline-none focus:ring-3 focus:ring-purple-400/20 focus:border-purple-300 transition-all shadow-inner"
        />
      </div>

      {/* Right Controls: Live Badge, Theme Moon, Bell, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F2] border border-rose-200/60 shadow-2xs text-rose-500 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span>Live</span>
        </div>

        {/* Moon / Night Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="h-9 w-9 rounded-full bg-white border border-purple-100/80 shadow-xs hover:shadow-sm flex items-center justify-center text-purple-700 hover:text-indigo-600 transition-all cursor-pointer"
          title="Toggle display mode"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setHasUnread(false)}
          className="relative h-9 w-9 rounded-full bg-white border border-purple-100/80 shadow-xs hover:shadow-sm flex items-center justify-center text-purple-700 hover:text-indigo-600 transition-all cursor-pointer"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border border-white" />
          )}
        </button>

        {/* Profile Avatar with cute stylized illustration */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="relative h-9 w-9 rounded-full ring-2 ring-purple-200/80 p-0.5 overflow-hidden shadow-xs bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500">
            <div className="h-full w-full rounded-full bg-[#FED7AA] flex items-center justify-center text-xs font-bold text-amber-900 overflow-hidden">
              {/* Fallback avatar icon or initial */}
              <span>IS</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#1E1B4B] hidden xl:inline-block max-w-[120px] truncate">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
