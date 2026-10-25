"use client";

import * as React from "react";
import { Search, Menu, X, ChevronDown, Sparkles, Upload } from "@/components/ui/GoogleIcon";
import { useStudentProfile } from "@/lib/studentProfile";
import Link from "next/link";

export interface LmsLibraryHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  userName?: string;
  userEmail?: string;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onOpenUpload?: () => void;
}

export function LmsLibraryHeader({
  userName: propUserName,
  userEmail,
  onOpenUpload,
}: LmsLibraryHeaderProps) {
  const { profile, palette } = useStudentProfile();

  const activeName = propUserName || profile.name || "Student";
  const userInitial = activeName.trim()
    ? activeName.trim().charAt(0).toUpperCase()
    : "S";

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xs py-3 px-4 sm:px-6 flex items-center justify-between gap-4 transition-all">
      {/* Left: Breadcrumbs back to Dashboard */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80"
          title="Return to FastTask Dashboard"
        >
          <span>← Dashboard</span>
        </Link>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <span className="text-xs font-bold text-slate-700 hidden sm:inline">
          Course Notes &amp; Library
        </span>
      </div>

      {/* Right: Upload Shortcut & User Profile Pill */}
      <div className="flex items-center gap-3 shrink-0">
        {onOpenUpload && (
          <button
            type="button"
            onClick={onOpenUpload}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/60 transition-all cursor-pointer"
            title="Upload Course PDF"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload</span>
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
          <span className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors max-w-[180px] truncate leading-none">
            {activeName}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
        </Link>
      </div>
    </header>
  );
}
