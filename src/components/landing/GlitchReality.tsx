"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  ShieldCheck,
  Terminal,
  Timer,
  BookOpen,
  Calendar,
} from "lucide-react";

export function GlitchReality() {
  const [isGlitching, setIsGlitching] = React.useState(false);
  const progressWidth = 72;

  const triggerGlitchEffect = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
  };

  return (
    <section
      id="academic-focus"
      className="relative py-16 sm:py-24 lg:py-28 bg-[#F8FAFC] text-[#172033] overflow-hidden select-none"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Professional Dashboard Styling */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#172033] leading-tight">
            Deep Academic Focus.{" "}
            <span className="text-[#315BFF] inline-block">
              Zero Mental Friction.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A dedicated academic workspace engineered for Computer Science scholars to organize
            weekly routines, track coursework submissions, and maintain uninterrupted study momentum.
          </p>
        </div>

        {/* ============================================================ */}
        {/* RECREATED POSTER DESIGN USING DASHBOARD PALETTE */}
        {/* ============================================================ */}
        <div className="relative mx-auto w-full rounded-3xl bg-white border border-[#E5EAF2] shadow-[-10px_20px_50px_-10px_rgba(15,23,42,0.1),0_25px_60px_-15px_rgba(49,91,255,0.08)] p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-300 hover:shadow-[-12px_24px_60px_-10px_rgba(15,23,42,0.14),0_30px_70px_-15px_rgba(49,91,255,0.12)]">
          
          {/* Main 2-Column Content Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* LEFT COLUMN: Academic Focus Composition */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-7">
              
              {/* Bold Section Title (Solid Colors) */}
              <div className="space-y-1.5">
                <div className="relative inline-block">
                  <h3
                    className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#172033] leading-none transition-all duration-300 ${
                      isGlitching ? "translate-x-1 text-[#315BFF]" : ""
                    }`}
                  >
                    ACADEMIC
                  </h3>
                </div>

                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.22em] text-[#315BFF] uppercase">
                  FOCUS
                </div>
              </div>

              {/* Current Study Sprint Card */}
              <div className="rounded-2xl border border-[#E5EAF2] bg-white p-4 sm:p-5 shadow-2xs relative overflow-hidden group hover:border-[#315BFF]/50 transition-all duration-200">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#315BFF] text-white flex items-center justify-center shadow-xs">
                      <Terminal className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">
                      Active Coursework Sprint
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                    0612CSE315
                  </span>
                </div>

                {/* Content */}
                <div className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                  <span className="text-[#315BFF] font-semibold">&gt; Focus Target: </span>
                  <span className="text-slate-900 font-medium">
                    Computer Networks • Socket Programming &amp; Concurrency Lab
                  </span>
                  <span className="inline-block w-1.5 h-4 ml-1 bg-[#315BFF] animate-pulse align-middle rounded-xs" />
                </div>
              </div>

              {/* Study Sprint Progress (Solid Blue Bar) */}
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#315BFF] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#315BFF]" />
                    </span>
                    <span className="font-semibold text-slate-700">
                      Sprint Progress
                    </span>
                  </div>
                  <span className="text-[#315BFF] font-semibold">
                    {progressWidth}% Completed
                  </span>
                </div>

                {/* Solid blue progress bar */}
                <div className="relative h-2.5 w-full rounded-full bg-slate-100 border border-slate-200/80 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-[#315BFF] transition-all duration-700 ease-out"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              {/* Interactive Navigation Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/schedule"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white text-sm font-bold tracking-wide shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>View Class Routine</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/notes"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-sm font-semibold border border-slate-200 shadow-2xs transition-all duration-200"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>Browse Notes</span>
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN: The Artwork in a Clean Professional Dashboard Viewport */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              {/* Frame Container for Artwork (Dashboard Daylight Palette) */}
              <div
                onClick={triggerGlitchEffect}
                className="group relative w-full max-w-[500px] aspect-[16/11] rounded-2xl bg-[#F8FAFC] border-2 border-[#E5EAF2] shadow-[-8px_16px_36px_-6px_rgba(15,23,42,0.08),0_20px_45px_-8px_rgba(49,91,255,0.06)] overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#315BFF]/40 hover:scale-[1.015]"
              >
                {/* Artwork Image in Dashboard Color Palette */}
                <Image
                  src="/images/glitch-reality-daylight.jpg"
                  alt="Academic Study Focus Artwork"
                  fill
                  className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                    isGlitching ? "filter contrast-125 brightness-105" : ""
                  }`}
                  sizes="(max-width: 640px) 100vw, 500px"
                  loading="lazy"
                />

                {/* Live session pill on top left */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 border border-[#E5EAF2] text-[11px] font-semibold text-[#172033] shadow-xs flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#315BFF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#315BFF]" />
                  </span>
                  <span>Study Session &bull; Active</span>
                </div>

                {/* Bottom interactive floating label in dashboard styling */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-[#D0DFFF] text-[11px] text-[#172033] flex items-center gap-1.5 shadow-xs">
                  <Activity className="w-3.5 h-3.5 text-[#315BFF]" />
                  <span className="font-semibold">Pomodoro: 25m Focus</span>
                </div>
              </div>

              {/* Floating Dashboard Quick Badge: Study Streak */}
              <div className="absolute -bottom-4 -left-2 sm:left-4 z-20 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#D0DFFF] shadow-md shadow-blue-500/10 flex items-center gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-lg bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <div className="font-bold text-[#172033] text-[11px] leading-tight">
                    Flow State Active
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Zero distractions
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* 3 CLEAN PROFESSIONAL ACADEMIC CARDS */}
        {/* ============================================================ */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full mx-auto">
          
          {/* Card 1: Structured Study Intervals */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#315BFF] flex items-center justify-center mb-4">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Structured Study Intervals
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                Stay in deep flow with built-in 25-minute Pomodoro study cycles and automatic rest cues tailored for heavy CS problem-solving.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Study Session</span>
              <span className="font-semibold text-slate-800">25m focus · 5m rest</span>
            </div>
          </div>

          {/* Card 2: Smart Deadline Radar */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Clear Priority Radar
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                Filter out everyday noise and surface imminent assignment deadlines, lab submissions, and lecture venues first.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Priority Filter</span>
              <span className="font-semibold text-slate-800">Auto syllabus & routine sync</span>
            </div>
          </div>

          {/* Card 3: Verified Course Notes */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Verified Course Notes
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                Direct access to curated revision decks, lecture notes, and sample solutions organized by course code for exam prep.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Curated Decks</span>
              <span className="font-semibold text-slate-800">CSE315 · CSE321 · CSE333 · MAT337</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default GlitchReality;
