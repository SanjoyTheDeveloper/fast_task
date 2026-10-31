"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CheckSquare } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useStudentProfile } from "@/lib/studentProfile";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function AppShell({ children, user }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key to close drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const { profile, palette } = useStudentProfile(
    user?.name ? { name: user.name } : undefined
  );
  const displayName = profile?.name || user?.name || "Sanjoy Chandro Bhowmick";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SB";

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. Desktop Persistent Sidebar (md/lg+)                       */}
      {/* ============================================================ */}
      <div className="hidden md:flex sticky top-0 h-screen shrink-0 z-30">
        <Sidebar user={user} />
      </div>

      {/* ============================================================ */}
      {/* 2. Mobile/Tablet Collapsible Drawer Navigation               */}
      {/* ============================================================ */}
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 transition-opacity md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sliding Sidebar Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Sidebar
          user={user}
          className="w-full h-full border-r-0"
          onNavigate={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* ============================================================ */}
      {/* 3. Main Content Container & Mobile Minimal Top Bar          */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Minimal Mobile Header (md:hidden) */}
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-white/98 border-b border-slate-200/80 shadow-2xs">
          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            aria-label="FastTask"
          >
            <div className="h-7 w-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
              <CheckSquare className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-black tracking-tight text-[#0F172A]">
              FastTask
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200 uppercase">
              PRO
            </span>
          </Link>

          {/* Avatar shortcut */}
          <Link
            href="/settings"
            className="h-8 w-8 rounded-full bg-gradient-to-tr text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100 shadow-2xs overflow-hidden"
            title="Profile"
          >
            <div
              className={cn(
                "w-full h-full flex items-center justify-center bg-gradient-to-tr",
                palette?.gradient || "from-blue-600 to-indigo-600"
              )}
            >
              {initials}
            </div>
          </Link>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
