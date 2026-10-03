"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Timer,
} from "@/components/ui/GoogleIcon";

interface NavTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  targetId: string;
}

const TABS: NavTab[] = [
  {
    id: "dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    targetId: "top",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: CalendarDays,
    targetId: "schedule",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    targetId: "tasks",
  },
  {
    id: "pomodoro",
    label: "Focus",
    icon: Timer,
    targetId: "pomodoro",
  },
];

export function MobileNavBar() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const scrollToSection = (targetId: string, tabId: string) => {
    setActiveTab(tabId);
    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(targetId);
    if (elem) {
      const yOffset = -70; // offset for fixed header
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scroll spy to highlight active section on mobile
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;

      const pomodoroElem = document.getElementById("pomodoro");
      const tasksElem = document.getElementById("tasks");
      const scheduleElem = document.getElementById("schedule");

      if (pomodoroElem && scrollPos >= pomodoroElem.offsetTop) {
        setActiveTab("pomodoro");
      } else if (tasksElem && scrollPos >= tasksElem.offsetTop) {
        setActiveTab("tasks");
      } else if (scheduleElem && scrollPos >= scheduleElem.offsetTop) {
        setActiveTab("schedule");
      } else {
        setActiveTab("dashboard");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 justify-around items-center z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => scrollToSection(tab.targetId, tab.id)}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? "text-indigo-600 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-transform ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 scale-110 shadow-2xs"
                  : ""
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
