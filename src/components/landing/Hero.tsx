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
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[650px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.18),rgba(37,99,235,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute -left-48 top-1/4 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 top-1/3 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Header Typography & Eyebrow */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>— Next-Gen Student & Task Workspace —</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Professional Student &{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Academic Workspace
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            Modern unified layout for university students, automatic lecture routines, course tags, and high-impact task execution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
            <Link
              href={registerHref}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-[0_0_25px_rgba(37,99,235,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] hover:scale-102 active:scale-98 transition-all border border-cyan-400/40"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={loginHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] transition-all backdrop-blur-md"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>

        {/* 2. Central Showcase / Realistic 3D Laptop Mockup */}
        <div id="portfolio" className="relative mt-14 sm:mt-20 max-w-5xl mx-auto scroll-mt-28">
          {/* Ambient device backlight */}
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-b from-cyan-500/20 via-blue-600/20 to-transparent blur-3xl opacity-75" />

          {/* Laptop Frame */}
          <div className="relative rounded-t-2xl sm:rounded-t-3xl border-[6px] sm:border-[10px] border-[#1C212D] bg-[#0B0F17] shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Top Webcam Notch */}
            <div className="h-4 sm:h-5 bg-[#1C212D] flex items-center justify-center border-b border-black/40">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700/80" />
              </div>
            </div>

            {/* Screen Content: Active Dashboard Preview */}
            <div className="bg-[#0B0F17] p-3 sm:p-6 text-white space-y-4">
              {/* Inner Dashboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      <GraduationCap className="h-3 w-3 text-blue-400" />
                      Week 6 • Fall Semester 2026
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Saturday, Sep 26
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Welcome back, <span className="text-cyan-400">Scholar</span> 📚
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    • 3 Lectures Today
                  </span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    JD
                  </div>
                </div>
              </div>

              {/* Routine Strip Inside Mockup */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-white/[0.06] pb-2">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    Today&apos;s Lecture & Lab Schedule
                  </span>
                  <span className="text-[10px] text-slate-500">Auto-Synced</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Class 1 */}
                  <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        CSE231
                      </span>
                      <span className="text-[10px] text-slate-400">Lecture</span>
                    </div>
                    <p className="font-semibold text-slate-200 text-[11px] truncate">
                      Virtual Memory & Page Tables
                    </p>
                    <p className="text-[10px] text-cyan-300 mt-1">09:30 AM • Rm 402</p>
                  </div>

                  {/* Class 2 */}
                  <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        EEPP
                      </span>
                      <span className="text-[10px] text-slate-400">Lecture</span>
                    </div>
                    <p className="font-semibold text-slate-200 text-[11px] truncate">
                      Ethics & Practice • Case 4
                    </p>
                    <p className="text-[10px] text-cyan-300 mt-1">11:15 AM • Aud B</p>
                  </div>

                  {/* Class 3 */}
                  <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        CSE231L
                      </span>
                      <span className="text-[10px] text-slate-400">Lab</span>
                    </div>
                    <p className="font-semibold text-slate-200 text-[11px] truncate">
                      Concurrency & Lock Systems
                    </p>
                    <p className="text-[10px] text-cyan-300 mt-1">02:00 PM • Lab 4B</p>
                  </div>
                </div>
              </div>

              {/* 3 Metric Cards Inside Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Pending Tasks
                    </span>
                    <p className="text-xl font-bold text-white mt-0.5">8 Tasks</p>
                    <span className="text-[10px] text-amber-400">3 due soon</span>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Exam Deadlines
                    </span>
                    <p className="text-xl font-bold text-white mt-0.5">2 Exams</p>
                    <span className="text-[10px] text-rose-400">Midterm in 5d</span>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Study Target
                    </span>
                    <p className="text-xl font-bold text-white mt-0.5">80% Done</p>
                    <span className="text-[10px] text-emerald-400">4 of 5 sessions</span>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop 3D Base Stand */}
          <div className="relative mx-auto w-[92%] sm:w-[86%] h-3.5 sm:h-4.5 bg-gradient-to-b from-[#2E3646] via-[#1E232E] to-[#12161F] rounded-b-xl sm:rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-center">
            <div className="w-16 sm:w-24 h-1 bg-[#10141D] rounded-full" />
          </div>

          {/* Surface Reflection Light */}
          <div className="mx-auto w-[75%] h-6 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-xl" />
        </div>

        {/* 3. Floating Feature Quick-Cards (Foreground Overlay) */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Routine & Lectures */}
          <div id="routine" className="group relative p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer scroll-mt-28">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Routine & Lectures
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Auto-filtered daily lectures and labs based on real-time client day and semester range.
            </p>
          </div>

          {/* Card 2: Active Glow State: Assignments & Growth */}
          <div className="group relative p-5 rounded-2xl bg-gradient-to-b from-blue-600/20 via-indigo-900/15 to-transparent backdrop-blur-xl border border-blue-500/40 shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500 text-white shadow-xs">
              Active Focus
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              Assignments & Growth
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Prioritized due-date tracking with glowing warning dots for immediate submissions.
            </p>
          </div>

          {/* Card 3: Semester Planning */}
          <div className="group relative p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-violet-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-400/30 text-violet-400 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
              Semester Planning
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Auto-calculate academic weeks, term start/end durations, and off-day notifications.
            </p>
          </div>

          {/* Card 4: Pomodoro & Study Focus */}
          <div className="group relative p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Timer className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Pomodoro & Focus
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Integrated 25m study blocks, synthesizer audio chimes, and session goal metrics.
            </p>
          </div>
        </div>

        {/* 4. Social Proof & Metric Bar */}
        <div className="mt-14 sm:mt-18 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-white/[0.05] via-white/[0.03] to-white/[0.05] backdrop-blur-2xl border border-white/[0.08] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 text-center sm:text-left w-full lg:w-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                500+
              </p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Tasks Handled
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                98%
              </p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                On-Time Submissions
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                24/7
              </p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Timetable Sync
              </p>
            </div>
          </div>

          {/* Action CTA & Feature Tags */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase hidden xl:inline">
              Modern • Fast • Smart • Responsive
            </span>

            <Link
              href={registerHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-600/30 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
