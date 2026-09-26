"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sidebar,
  TopHeader,
} from "@/components/dashboard";
import {
  LayoutDashboard,
  Columns,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Bell,
  Palette,
  Check,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Load authenticated user
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    }
    loadUser();
  }, [router]);

  // Auth.js logout handler with redirect to landing page
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userName = currentUser?.name || "sanjoy chandro Bhowmick";
  const userEmail = currentUser?.email || "sanjoy1vhowmick1@gmail.com";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Wrapper with Left Margin for Desktop Sidebar */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={currentUser}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Settings Page Content */}
        <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#172033] tracking-tight">
              Settings &amp; Account
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your FastTask student profile, workspace shortcuts, and preferences.
            </p>
          </div>

          {/* Top section - Profile Card */}
          <div className="rounded-2xl bg-white border border-[#E5EAF2] p-6 sm:p-8 shadow-2xs relative overflow-hidden transition-all">
            {/* Subtle top-right ambient background accent */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-400/10 blur-xl" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Large circular avatar with letter “S” in purple background */}
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 ring-4 ring-purple-100 shadow-md shadow-purple-500/25">
                  <span>S</span>
                </div>

                {/* User info */}
                <div className="space-y-0.5 min-w-0">
                  {/* Small text “Signed in as” above the name */}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Signed in as
                  </span>

                  {/* User name in bold */}
                  <h2 className="text-lg sm:text-xl font-bold text-[#172033] tracking-tight truncate">
                    {userName}
                  </h2>

                  {/* Email below in gray */}
                  <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
                    {userEmail}
                  </p>
                </div>
              </div>

              {/* Status & Plan Badge */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF] text-xs font-bold shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#315BFF]" />
                  <span>PRO Plan</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200/80">
                  Batch 82A
                </span>
              </div>
            </div>
          </div>

          {/* Menu section below the profile */}
          <div className="rounded-2xl bg-white border border-[#E5EAF2] p-2 shadow-2xs divide-y divide-slate-100">
            {/* 1. Dashboard Overview */}
            <Link
              href="/dashboard"
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#315BFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#315BFF] transition-colors">
                    Dashboard Overview
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    View schedule, academic routines, stats and active tasks
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#315BFF] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* 2. Kanban Board */}
            <Link
              href="/kanban"
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <Columns className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033] group-hover:text-indigo-600 transition-colors">
                    Kanban Board
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Organize assignments across Todo, In-Progress, and Completed columns
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* 3. LMS Education Portal */}
            <Link
              href="/lms"
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033] group-hover:text-purple-600 transition-colors">
                    LMS Education Portal
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Access course library, study streaks, and 3D clay learning materials
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* 4. Log out option with red-tinted logout icon and subtle red text */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-rose-50/60 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <LogOut className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-600 group-hover:text-rose-700 transition-colors">
                    {isLoggingOut ? "Signing out..." : "Log out"}
                  </h3>
                  <p className="text-[11px] text-rose-400">
                    Securely sign out of your account on this device
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-rose-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* Quick Info & Version Footer */}
          <div className="text-center pt-4 text-xs text-slate-400 space-y-1">
            <p>FastTask PRO • Version 2.4.0 (Build 2026.09)</p>
            <p className="text-[11px] text-slate-400">
              Department of Computer Science &amp; Engineering • Batch 82A
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
