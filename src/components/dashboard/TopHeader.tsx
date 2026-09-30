"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Columns,
  LogOut,
  User as UserIcon,
  Menu,
  Sparkles,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudentProfile } from "@/lib/studentProfile";

export interface TopHeaderProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenMobileMenu?: () => void;
  onOpenZenMode?: () => void;
}

export function TopHeader({
  user,
  searchQuery = "",
  onSearchChange,
  onOpenMobileMenu,
  onOpenZenMode,
}: TopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasNotification, setHasNotification] = React.useState(true);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const { profile, palette } = useStudentProfile(
    user?.name ? { name: user.name } : undefined
  );
  const userName = profile?.name || user?.name || (user?.email ? user.email.split("@")[0] : "Student");
  const userEmail = user?.email || "";

  // Logout handler redirecting to landing page /
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

  const isDashboard = pathname === "/dashboard" || pathname === "/";
  const isKanban = pathname === "/kanban";
  const isCalendar = pathname === "/calendar";

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/95 backdrop-blur-md border-b border-[#E5EAF2] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Button + Navigation Tabs */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Tabs: Dashboard, Kanban & Calendar */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDashboard
                ? "bg-white text-[#315BFF] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/kanban"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isKanban
                ? "bg-white text-[#315BFF] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Kanban</span>
          </Link>
          <Link
            href="/calendar"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCalendar
                ? "bg-white text-[#315BFF] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Calendar</span>
          </Link>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="flex-1 max-w-md mx-2 relative hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search tasks, notes, or course codes..."
          className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:border-slate-300 focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 text-xs text-[#172033] placeholder:text-slate-400 outline-none transition-all shadow-2xs"
        />
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Zen Flow Quick Trigger */}
        {onOpenZenMode && (
          <button
            type="button"
            onClick={onOpenZenMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 border border-indigo-200/60 text-indigo-700 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
            title="Enter Zen Flow Mode"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Zen Flow</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setHasNotification(false)}
          className="relative h-9 w-9 rounded-xl border border-[#E5EAF2] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {hasNotification && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all outline-none cursor-pointer">
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${palette.gradient} text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100 shadow-2xs overflow-hidden transition-all`}>
              {userName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>

            {/* Name & Email info */}
            <div className="text-left hidden lg:block max-w-[170px]">
              <p className="text-xs font-bold text-[#172033] truncate leading-tight">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">
                {userEmail}
              </p>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-[#E5EAF2]">
            <DropdownMenuLabel className="font-semibold text-xs text-slate-500 px-2 py-1.5">
              Signed in as
              <p className="font-bold text-sm text-[#172033] truncate mt-0.5">{userName}</p>
              <p className="text-[11px] text-slate-400 font-normal truncate">{userEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                <LayoutDashboard className="h-4 w-4 text-slate-400" />
                <span>Dashboard Overview</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/kanban" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                <Columns className="h-4 w-4 text-slate-400" />
                <span>Kanban Board</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/lms" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>LMS Education Portal</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
