"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  GraduationCap,
  Timer,
  Play,
  Layers,
  BookOpen,
  CheckSquare,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Laptop,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroProps {
  registerHref?: string;
  loginHref?: string;
}

export function Hero({
  registerHref = "/register",
  loginHref = "/login",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-36">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[650px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(49,91,255,0.08),rgba(99,102,241,0.04),transparent_70%)]" />
      <div className="pointer-events-none absolute -left-48 top-1/4 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 top-1/3 -z-10 h-96 w-96 rounded-full bg-indigo-300/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Header Typography & Eyebrow */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D0DFFF] text-xs font-bold text-[#315BFF] shadow-2xs backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#315BFF] animate-pulse" />
            <span>— Next-Gen Student & Task Workspace —</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#172033] leading-[1.1]">
            Professional Student &{" "}
            <span className="bg-gradient-to-r from-[#315BFF] via-[#4361EE] to-[#7209B7] bg-clip-text text-transparent">
              Academic Workspace
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Modern unified layout for university students, automatic lecture routines, course tags, and high-impact task execution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
            <Button asChild size="pillLg" className="w-full sm:w-auto">
              <Link href={registerHref}>
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="pillLg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                <span>Explore Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 2. Central Showcase / Realistic 3D Laptop Mockup */}
        <div id="portfolio" className="relative mt-14 sm:mt-20 max-w-5xl mx-auto scroll-mt-28">
          {/* Ambient device backlight */}
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl opacity-75" />

          {/* Laptop Frame */}
          <div className="relative rounded-t-2xl sm:rounded-t-3xl border-[6px] sm:border-[10px] border-[#E2E8F0] bg-[#F8FAFC] shadow-[0_25px_80px_rgba(49,91,255,0.14)] overflow-hidden">
            {/* Top Webcam Notch */}
            <div className="h-4 sm:h-5 bg-[#EDF2F7] flex items-center justify-center border-b border-[#CBD5E1]">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span className="h-2 w-2 rounded-full bg-slate-700 border border-slate-400" />
              </div>
            </div>

            {/* Screen Content: Active Dashboard Preview */}
            <div className="bg-[#F8FAFC] p-3 sm:p-5 text-[#172033] space-y-3.5">
              {/* Inner Dashboard Header: Welcome Card Banner */}
              <div className="relative rounded-2xl bg-gradient-to-r from-[#EEF4FF] via-[#F4F7FF] to-[#E9F0FE] border border-[#DCE7FC] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-[#D0DFFF] text-[10px] font-bold text-[#315BFF] shadow-2xs">
                    <GraduationCap className="h-3 w-3" />
                    <span>Week 5 of 17 • Summer Semester 2026 | Batch: 82A</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#172033]">
                    Good evening, <span className="text-[#315BFF] font-black">sanjoy chandro Bhowmick</span> 👋
                  </h3>
                  <p className="text-[11px] text-slate-500 max-w-md hidden sm:block">
                    Stay on top of lectures, assignment deadlines, exam prep, and personal study targets.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" className="rounded-xl gap-1.5">
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Add Assignment</span>
                  </Button>
                </div>
              </div>

              {/* Today's Schedule Strip */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#315BFF]" />
                    <span className="text-xs font-bold text-[#172033]">
                      Today&apos;s Schedule
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (Monday, Sep 28)
                    </span>
                  </div>

                  {/* Day Pills */}
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-full text-slate-500 bg-slate-50">Sun</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1E3A8A] text-white shadow-2xs">Mon 2</span>
                    <span className="px-2 py-0.5 rounded-full text-slate-500 bg-slate-50 hidden sm:inline-block">Tue</span>
                    <span className="px-2 py-0.5 rounded-full text-slate-500 bg-slate-50 hidden sm:inline-block">Wed</span>
                    <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      • 2 active sessions
                    </span>
                  </div>
                </div>

                {/* 2 Classes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Class 1 */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF]">
                          0612CSE315
                        </span>
                        <span className="text-[10px] font-bold text-[#315BFF]">Lecture</span>
                      </div>
                      <p className="font-extrabold text-[#172033] text-xs">
                        CN • Computer Networks
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>09:30 AM - 11:00 AM</span>
                      <span>Room A/502</span>
                    </div>
                  </div>

                  {/* Class 2 */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
                          0612CSE320
                        </span>
                        <span className="text-[10px] font-bold text-purple-600">Lecture</span>
                      </div>
                      <p className="font-extrabold text-[#172033] text-xs truncate">
                        TWRM • Technical Writing & Research
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>11:00 AM - 12:30 PM</span>
                      <span>Room A/MCL A</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Metric Cards Inside Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Pending Assignments
                    </span>
                    <p className="text-xl font-black text-[#172033] mt-0.5">0</p>
                    <span className="text-[10px] text-slate-400">all on track</span>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 text-[#315BFF] flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Exams & Deadlines
                    </span>
                    <p className="text-xl font-black text-[#172033] mt-0.5">0</p>
                    <span className="text-[10px] text-rose-500 font-semibold">• Prioritize</span>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Study Target Progress
                    </span>
                    <p className="text-xl font-black text-[#172033] mt-0.5">0 / 5</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">• 0% done</span>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop 3D Base Stand */}
          <div className="relative mx-auto w-[92%] sm:w-[86%] h-3.5 sm:h-4.5 bg-gradient-to-b from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8] rounded-b-xl sm:rounded-b-2xl shadow-[0_20px_50px_rgba(49,91,255,0.12)] flex items-center justify-center">
            <div className="w-16 sm:w-24 h-1 bg-[#64748B] rounded-full" />
          </div>

          {/* Surface Reflection Light */}
          <div className="mx-auto w-[75%] h-6 bg-gradient-to-r from-transparent via-[#315BFF]/10 to-transparent blur-xl" />
        </div>

        {/* 3. Floating Feature Quick-Cards (Foreground Overlay) */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Routine & Lectures */}
          <div id="routine" className="group relative p-5 rounded-2xl bg-white border border-[#E5EAF2] hover:border-[#315BFF] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer scroll-mt-28">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 text-[#315BFF] flex items-center justify-center mb-3 shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#315BFF] transition-colors">
              Routine & Lectures
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Auto-filtered daily lectures and labs based on real-time client day and semester range.
            </p>
          </div>

          {/* Card 2: Active Glow State: Assignments & Growth */}
          <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#EEF4FF] via-white to-[#F4F7FF] border border-[#D0DFFF] shadow-xs hover:border-[#315BFF] hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#315BFF] text-white shadow-2xs">
              Active Focus
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#EEF3FF] border border-[#D0DFFF] text-[#315BFF] flex items-center justify-center mb-3 shadow-2xs">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#315BFF] transition-colors">
              Assignments & Growth
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Prioritized due-date tracking with glowing warning dots for immediate submissions.
            </p>
          </div>

          {/* Card 3: Semester Planning */}
          <div className="group relative p-5 rounded-2xl bg-white border border-[#E5EAF2] hover:border-purple-400 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-3 shadow-2xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-purple-600 transition-colors">
              Semester Planning
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Auto-calculate academic weeks, term start/end durations, and off-day notifications.
            </p>
          </div>

          {/* Card 4: Pomodoro & Study Focus */}
          <div className="group relative p-5 rounded-2xl bg-white border border-[#E5EAF2] hover:border-emerald-400 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-2xs">
              <Timer className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-emerald-600 transition-colors">
              Pomodoro & Focus
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Integrated 25m study blocks, synthesizer audio chimes, and session goal metrics.
            </p>
          </div>
        </div>

        {/* 4. Social Proof & Metric Bar */}
        <div className="mt-14 sm:mt-18 p-6 sm:p-7 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 text-center sm:text-left w-full lg:w-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
                500+
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Tasks Handled
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#315BFF] tracking-tight">
                98%
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                On-Time Submissions
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
                24/7
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Timetable Sync
              </p>
            </div>
          </div>

          {/* Action CTA & Feature Tags */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase hidden xl:inline">
              Modern • Fast • Smart • Responsive
            </span>

            <Button asChild size="pill" className="w-full sm:w-auto">
              <Link href={registerHref}>
                <span>Get Started Free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
