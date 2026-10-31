"use client";

import * as React from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroTopNavProps {
  registerHref: string;
  activeNav?: string;
  onSelectNav?: (nav: string) => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/lms" },
  { label: "Schedule", href: "/schedule" },
  { label: "Kanban", href: "/kanban" },
  { label: "Notes", href: "/notes" },
];

export function HeroTopNav({
  registerHref,
  activeNav = "Home",
  onSelectNav,
}: HeroTopNavProps) {
  return (
    <>
      {/* 1. Top Navigation Bar (Inside Canvas) */}
      <header className="relative z-30 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-5 sm:py-6">
        {/* Left: Brand Logo & PRO Badge */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-102 duration-200 group"
        >
          <div className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 transition-colors">
            <CheckSquare className="h-4.5 w-4.5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              FastTask
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wide">
              PRO
            </span>
          </div>
        </Link>

        {/* Center: Floating Segmented Nav Pill */}
        <nav className="hidden md:flex items-center rounded-full bg-slate-100/80 p-1 border border-slate-200/70 backdrop-blur-md shadow-2xs">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => onSelectNav?.(item.label)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs shadow-slate-900/5 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Royal Blue CTA Button */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4.5 py-2.5 h-auto rounded-full shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Link href={registerHref} className="flex items-center gap-1.5">
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </header>
    </>
  );
}
