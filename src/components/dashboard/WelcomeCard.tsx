"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, GraduationCap, Calendar, Sliders } from "lucide-react";

export interface WelcomeCardProps {
  userName?: string;
  semesterText?: string;
  onOpenCreateModal?: () => void;
  onOpenSemesterSetup?: () => void;
}

export function WelcomeCard({
  userName = "sanjoy chandro Bhowmick",
  semesterText = "Week 5 of 17 • Summer Semester 2026 | Batch: 82A",
  onOpenCreateModal,
  onOpenSemesterSetup,
}: WelcomeCardProps) {
  // Determine dynamic greeting based on time of day
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#EEF4FF] via-[#F4F7FF] to-[#E9F0FE] border border-[#DCE7FC] p-6 sm:p-7 shadow-[0_4px_20px_rgba(49,91,255,0.04)] overflow-hidden">
      {/* Decorative ambient subtle background glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-blue-400/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 right-1/4 h-52 w-52 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Column: Greeting, Subtitle & Action */}
        <div className="space-y-3 max-w-xl">
          {/* Top Badge: Semester & Academic Week */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#D0DFFF] shadow-2xs text-[11px] font-semibold text-[#315BFF]">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{semesterText}</span>
            {onOpenSemesterSetup && (
              <button
                type="button"
                onClick={onOpenSemesterSetup}
                className="ml-1 hover:text-blue-800 transition-colors cursor-pointer"
                title="Configure semester duration"
                aria-label="Configure semester"
              >
                <Sliders className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#172033] leading-tight">
            {greeting},{" "}
            <span className="text-[#315BFF] font-black">{userName}</span> 👋
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Stay on top of lectures, assignment deadlines, exam prep, and personal study targets.
          </p>

          {/* Action button: + Add Assignment */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#315BFF] hover:bg-[#254BE3] text-white text-xs font-bold shadow-md shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>+ Add Assignment</span>
            </button>
          </div>
        </div>

        {/* Right Column: Academic Desk 3D/Illustration */}
        <div className="hidden md:flex relative w-48 lg:w-64 h-36 lg:h-40 shrink-0 rounded-2xl overflow-hidden shadow-xs border border-white/80 bg-white/60">
          <Image
            src="/images/academic-hero.jpg"
            alt="Academic Workspace & Study Routine"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </div>
  );
}
