"use client";

import * as React from "react";
import { Search, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useStudentProfile } from "@/lib/studentProfile";
import Link from "next/link";

export interface LmsLibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userName?: string;
  userEmail?: string;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export function LmsLibraryHeader({
  searchQuery,
  onSearchChange,
  userName: propUserName,
  userEmail,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}: LmsLibraryHeaderProps) {
  const { profile, palette } = useStudentProfile();
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for '/'
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeName = propUserName || profile.name || "Student";
  const userInitial = activeName.trim()
    ? activeName.trim().charAt(0).toUpperCase()
    : "S";

  return (
    <header className="w-full flex items-center justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-xs border-b border-slate-100">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="h-9 w-9 flex lg:hidden items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 shadow-2xs cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-[-0.02em] leading-tight">
            Course Notes &amp; Library
          </h1>
          <p className="text-xs text-slate-500 font-normal hidden sm:block mt-0.5 tracking-normal">
            Department of CSE • {profile.batch || "Batch 82A"}
          </p>
        </div>
      </div>

      {/* Center: Search Bar with Keyboard Hint */}
      <div className="flex-1 flex justify-center max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-2">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes, topics, course codes, labs..."
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none hidden sm:inline-block">
              /
            </span>
          )}
        </div>
      </div>

      {/* Right User Profile Pill */}
      <Link
        href="/settings"
        className="group flex items-center gap-2.5 shrink-0 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer select-none"
        title="View Profile Settings"
      >
        <div className="relative shrink-0">
          <div
            className={`h-8 w-8 rounded-full bg-gradient-to-tr ${palette.gradient} text-white flex items-center justify-center font-black text-xs tracking-wider shadow-2xs ring-2 ring-white`}
          >
            {userInitial}
          </div>
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <span className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors max-w-[180px] truncate hidden sm:inline-block leading-none">
          {activeName}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors hidden sm:block shrink-0" />
      </Link>
    </header>
  );
}
