"use client";

import * as React from "react";
import { Search, Menu, X, ChevronDown, Sparkles, Upload } from "lucide-react";
import { useStudentProfile } from "@/lib/studentProfile";
import Link from "next/link";

export interface LmsLibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userName?: string;
  userEmail?: string;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onOpenUpload?: () => void;
}

export function LmsLibraryHeader({
  searchQuery,
  onSearchChange,
  userName: propUserName,
  userEmail,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
  onOpenUpload,
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
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 sm:py-3.5 px-3.5 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 transition-all">
      {/* Top Bar on Mobile / Left Section on Desktop */}
      <div className="flex items-center justify-between w-full md:w-auto gap-3">
        {/* Mobile Toggle & Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="h-9 w-9 flex lg:hidden items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 shadow-2xs cursor-pointer active:scale-95"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-[-0.02em] leading-tight">
              Course Notes &amp; Library
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-normal hidden sm:block mt-0.5 tracking-normal">
              Department of CSE • {profile.batch || "Batch 82A"}
            </p>
          </div>
        </div>

        {/* Mobile-only right controls: Upload & Profile Avatar */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          {onOpenUpload && (
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer shrink-0"
              title="Upload Course PDF"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload</span>
            </button>
          )}

          <Link
            href="/settings"
            className="h-8 w-8 rounded-full bg-gradient-to-tr text-white flex items-center justify-center font-bold text-xs shadow-2xs ring-2 ring-white overflow-hidden shrink-0"
            title="Profile Settings"
          >
            <div className={`h-full w-full bg-gradient-to-tr ${palette.gradient} flex items-center justify-center`}>
              {userInitial}
            </div>
          </Link>
        </div>
      </div>

      {/* Center: Search Bar with Full Width on Mobile, Max Width on Desktop */}
      <div className="w-full md:flex-1 md:max-w-md lg:max-w-xl md:mx-auto">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes, course codes, topics..."
            className="w-full h-10.5 sm:h-10 pl-9.5 sm:pl-10 pr-10 sm:pr-12 rounded-xl bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
            aria-label="Search course notes"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none hidden sm:inline-block">
              /
            </span>
          )}
        </div>
      </div>

      {/* Desktop-only Right Controls: Upload Button & User Profile Pill */}
      <div className="hidden md:flex items-center gap-2.5 shrink-0">
        {onOpenUpload && (
          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer shrink-0 active:scale-95"
            title="Upload Course PDF"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Upload PDF</span>
            <span className="lg:hidden">Upload</span>
          </button>
        )}

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
      </div>
    </header>
  );
}
