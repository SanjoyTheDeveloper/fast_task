"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { GIcon } from "@/components/ui/GIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudentProfile } from "@/lib/studentProfile";
import { cn } from "@/lib/utils";

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: string | number;
  aliases?: string[];
}

export interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    iconName: "grid_view",
  },
  {
    id: "tasks",
    label: "My Tasks",
    href: "/tasks",
    iconName: "task_alt",
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/calendar",
    iconName: "calendar_month",
  },
  {
    id: "routine",
    label: "Routine",
    href: "/routine",
    iconName: "schedule",
    aliases: ["/schedule"],
  },
  {
    id: "kanban",
    label: "Kanban",
    href: "/kanban",
    iconName: "view_kanban",
  },
  {
    id: "notes",
    label: "Notes",
    href: "/notes",
    iconName: "description",
  },
  {
    id: "courses",
    label: "Courses",
    href: "/courses",
    iconName: "school",
    aliases: ["/lms"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    iconName: "settings",
  },
];

export const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: "",
    items: NAV_ITEMS,
  },
];

export interface SidebarProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ user, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const { profile, palette } = useStudentProfile(
    user?.name ? { name: user.name } : undefined
  );

  // Default to requested user name if not provided
  const displayName =
    profile?.name || user?.name || "Sanjoy Chandro Bhowmick";
  const displayEmail =
    user?.email || "sanjoy@fasttask.app";

  const userInitials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SB";

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

  const isItemActive = (item: NavItemConfig) => {
    if (pathname === item.href) return true;
    if (pathname.startsWith(`${item.href}/`)) return true;
    if (
      item.aliases &&
      item.aliases.some(
        (alias) => pathname === alias || pathname.startsWith(`${alias}/`)
      )
    ) {
      return true;
    }
    return false;
  };

  return (
    <aside
      className={cn(
        "w-64 border-r border-slate-200/80 bg-white h-screen flex flex-col justify-between p-4 shrink-0 select-none",
        className
      )}
      aria-label="Application Sidebar Navigation"
    >
      {/* 1. Top Section: FastTask Logo & PRO Badge */}
      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex items-center justify-between px-2 pt-1 pb-4">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
            aria-label="FastTask Home"
          >
            <div className="h-9 w-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-600/25 shrink-0">
              <GIcon name="task_alt" size={20} filled className="text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#0F172A]">
                FastTask
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs uppercase tracking-wider">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* 2. Middle Section: All 8 Original Navigation Links in Exact Order */}
        <nav
          className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-1.5"
          aria-label="Sidebar navigation links"
        >
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item);

            const colorConfig: Record<
              string,
              { activeText: string; activeBg: string; activeBorder: string; dot: string; iconActive: string; iconHover: string }
            > = {
              dashboard: { activeText: "text-blue-600", activeBg: "bg-blue-50/90", activeBorder: "border-blue-200/80", dot: "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]", iconActive: "text-blue-600", iconHover: "group-hover:text-blue-600" },
              tasks: { activeText: "text-emerald-700", activeBg: "bg-emerald-50/90", activeBorder: "border-emerald-200/80", dot: "bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.6)]", iconActive: "text-emerald-600", iconHover: "group-hover:text-emerald-600" },
              calendar: { activeText: "text-amber-800", activeBg: "bg-amber-50/90", activeBorder: "border-amber-200/80", dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]", iconActive: "text-amber-500", iconHover: "group-hover:text-amber-500" },
              routine: { activeText: "text-indigo-700", activeBg: "bg-indigo-50/90", activeBorder: "border-indigo-200/80", dot: "bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.6)]", iconActive: "text-indigo-600", iconHover: "group-hover:text-indigo-600" },
              kanban: { activeText: "text-purple-700", activeBg: "bg-purple-50/90", activeBorder: "border-purple-200/80", dot: "bg-purple-600 shadow-[0_0_8px_rgba(168,85,247,0.6)]", iconActive: "text-purple-600", iconHover: "group-hover:text-purple-600" },
              notes: { activeText: "text-rose-700", activeBg: "bg-rose-50/90", activeBorder: "border-rose-200/80", dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]", iconActive: "text-rose-500", iconHover: "group-hover:text-rose-500" },
              courses: { activeText: "text-cyan-700", activeBg: "bg-cyan-50/90", activeBorder: "border-cyan-200/80", dot: "bg-cyan-600 shadow-[0_0_8px_rgba(6,182,212,0.6)]", iconActive: "text-cyan-600", iconHover: "group-hover:text-cyan-600" },
              settings: { activeText: "text-slate-800", activeBg: "bg-slate-100", activeBorder: "border-slate-300/80", dot: "bg-slate-700", iconActive: "text-slate-700", iconHover: "group-hover:text-slate-800" },
            };

            const cfg = colorConfig[item.id] || colorConfig.dashboard;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center justify-between px-3.5 py-2.5 text-sm rounded-2xl transition-all duration-200 relative select-none",
                  active
                    ? `${cfg.activeBg} ${cfg.activeText} font-bold border ${cfg.activeBorder} shadow-2xs`
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent font-medium"
                )}
              >
                <div className="flex items-center min-w-0">
                  <GIcon
                    name={item.iconName}
                    size={20}
                    className={cn(
                      "mr-3 shrink-0 transition-colors duration-200",
                      active
                        ? cfg.iconActive
                        : `text-slate-400 ${cfg.iconHover}`
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {/* Glowing active indicator dot */}
                {active && (
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0 mr-1 animate-in fade-in zoom-in-75 duration-200",
                      cfg.dot
                    )}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom Section: Student Profile Card with Menu */}
      <div className="pt-3 border-t border-slate-200/80 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all text-left outline-none cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="User account settings and menu"
          >
            {/* Avatar Pill */}
            <div className="relative shrink-0">
              <div
                suppressHydrationWarning
                className={cn(
                  "h-9 w-9 rounded-xl bg-gradient-to-tr text-white flex items-center justify-center text-xs font-black tracking-wider shadow-xs ring-2 ring-white overflow-hidden",
                  palette?.gradient || "from-blue-600 to-indigo-600"
                )}
              >
                {userInitials}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                aria-hidden="true"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {displayName}
              </p>
              <p className="text-[11px] font-medium text-slate-400 truncate">
                {displayEmail}
              </p>
            </div>

            {/* Icon */}
            <GIcon name="more_vert" size={18} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            className="w-56 rounded-2xl p-1.5 shadow-xl border border-slate-200 bg-white"
          >
            <DropdownMenuLabel className="px-2.5 py-1.5">
              <p className="text-xs font-bold text-slate-800">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-400 font-normal truncate">
                {displayEmail}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />

            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                onClick={onNavigate}
                className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl cursor-pointer"
              >
                <GIcon name="person" size={16} className="text-slate-400" />
                <span>Account Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/settings#appearance"
                onClick={onNavigate}
                className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl cursor-pointer"
              >
                <GIcon name="tune" size={16} className="text-slate-400" />
                <span>Preferences &amp; Theme</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100" />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl cursor-pointer"
            >
              <GIcon name="logout" size={16} className="text-red-500" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
