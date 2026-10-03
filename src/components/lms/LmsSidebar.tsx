"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
  Video,
  CalendarCheck,
  CreditCard,
  Bookmark,
  BarChart3,
  Sparkles,
  ArrowRight,
  Library,
  BookMarked,
  Layers,
} from "@/components/ui/GoogleIcon";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Layers, href: "/lms" },
  { id: "students", label: "Students", icon: Users, href: "#" },
  { id: "teachers", label: "Teachers", icon: UserCheck, href: "#" },
  { id: "courses", label: "Courses", icon: BookOpen, href: "#" },
  { id: "live", label: "Live Class", icon: Video, href: "#", badge: "Live" },
  { id: "attendance", label: "Attendance", icon: CalendarCheck, href: "#" },
  { id: "payments", label: "Payments", icon: CreditCard, href: "#" },
  { id: "library", label: "Library", icon: BookMarked, href: "/lms" },
  { id: "reports", label: "Reports", icon: BarChart3, href: "#" },
];

export interface LmsSidebarProps {
  activeItem?: string;
  onSelectItem?: (id: string) => void;
  onUpgradeClick?: () => void;
}

export function LmsSidebar({
  activeItem = "library",
  onSelectItem,
  onUpgradeClick,
}: LmsSidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col justify-between py-6 px-5 border-r border-purple-100/70 bg-[#FAFAFC]/90 lg:min-h-[820px]">
      <div className="space-y-7">
        {/* Brand Logo: SkillSet with stacked clay books */}
        <Link
          href="/lms"
          className="flex items-center gap-3 px-2 group transition-transform hover:scale-102"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-indigo-500/25">
            <div className="flex flex-col items-center justify-center -space-y-1">
              <span className="h-1.5 w-5 rounded-full bg-white/95" />
              <span className="h-1.5 w-6 rounded-full bg-indigo-200" />
              <span className="h-1.5 w-5 rounded-full bg-purple-200" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#1E1B4B]">
              Skill<span className="text-[#6366F1]">Set</span>
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5" aria-label="LMS Sidebar Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem?.(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer relative group ${
                  isActive
                    ? "bg-[#EEECFC] text-[#6366F1] font-bold shadow-xs"
                    : "text-slate-600 hover:text-[#1E1B4B] hover:bg-purple-50/60"
                }`}
              >
                {/* Active left indicator pill */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#6366F1]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? "text-[#6366F1]"
                        : "text-slate-400 group-hover:text-[#6366F1]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-500 border border-rose-200/60">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Upgrade Card */}
      <div className="pt-6">
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#F7F5FE] to-[#EFEBFB] border border-purple-100/80 shadow-xs space-y-3 relative overflow-hidden text-center">
          {/* Subtle top ambient glow */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-purple-400/20 blur-xl" />

          <div className="space-y-1">
            <p className="text-xs font-bold text-[#1E1B4B]">
              Upgrade to Pro for
            </p>
            <p className="text-xs text-purple-900/60 font-medium">
              more facilities
            </p>
          </div>

          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#4F46E5] via-[#5B5CE6] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] shadow-md shadow-indigo-500/30 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Upgrade</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
