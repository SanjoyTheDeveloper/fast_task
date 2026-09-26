"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  LayoutDashboard,
  CheckCircle2,
  Calendar as CalendarIcon,
  Columns,
  FileText,
  Settings,
  Rocket,
  X,
  BookOpen,
} from "lucide-react";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export function Sidebar({ isOpen, onClose, onNavigateTab }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      id: "tasks",
      label: "My Tasks",
      icon: CheckCircle2,
      href: "/tasks",
      isActive: pathname === "/tasks",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarIcon,
      href: "/calendar",
      isActive: pathname === "/calendar",
    },
    {
      id: "kanban",
      label: "Kanban",
      icon: Columns,
      href: "/kanban",
      isActive: pathname === "/kanban",
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
      href: "/notes",
      isActive: pathname === "/notes",
    },
    {
      id: "lms",
      label: "Courses",
      icon: BookOpen,
      href: "/lms",
      isActive: pathname === "/lms",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      isActive: pathname === "/settings",
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-white border-r border-[#E5EAF2] flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="space-y-6">
        {/* Top: Logo & Pro Badge */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 transition-transform hover:scale-102"
            aria-label="FastTask Dashboard"
          >
            <div className="h-9 w-9 rounded-xl bg-[#315BFF] flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <CheckSquare className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#172033]">
                FastTask
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF] uppercase tracking-wide">
                PRO
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Sidebar navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  onNavigateTab?.(item.id);
                  if (onClose) onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  item.isActive
                    ? "bg-[#EEF3FF] text-[#315BFF] shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-[#172033] hover:bg-[#F8FAFC]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    item.isActive ? "text-[#315BFF]" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Motivational Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#EEF4FF] via-[#F4F7FF] to-[#E9F0FE] border border-[#DCE7FC] p-4 text-center overflow-hidden">
        {/* Subtle decorative wave lines */}
        <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-blue-300/20 blur-xl" />
        <div className="pointer-events-none absolute -top-6 -left-6 h-16 w-16 rounded-full bg-indigo-300/15 blur-lg" />

        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="h-9 w-9 rounded-full bg-[#315BFF] flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Rocket className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#172033] leading-snug">
              Stay consistent,
            </p>
            <p className="text-[11px] font-medium text-slate-500 leading-snug">
              get better every day!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
