"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Clock,
  GraduationCap,
  Timer,
  Columns,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
} from "lucide-react";

export interface ShowcaseFeature {
  id: string;
  badge: string;
  tagline: string;
  title: string;
  category: string;
  actionText: string;
  accentColor: string;
  glowColor: string;
  theme: "emerald" | "blue" | "magenta" | "purple" | "indigo" | "amber" | "rose";
  meta: {
    stat: string;
    subtext: string;
  };
  details: {
    chip1: string;
    chip2: string;
    chip3: string;
  };
}

const showcaseItems: ShowcaseFeature[] = [
  {
    id: "timetable",
    badge: "Auto-Sync",
    category: "Real-Time Schedule",
    title: "AI-Powered Timetable & Routine",
    tagline:
      "Automatically synchronizes semester weeks, filtering today's active lectures, labs, and room venues.",
    actionText: "Live Routine",
    accentColor: "from-cyan-400 to-blue-500",
    glowColor: "rgba(49,91,255,0.4)",
    theme: "blue",
    meta: {
      stat: "09:30 AM",
      subtext: "Room A/502 • CN Lecture",
    },
    details: {
      chip1: "Live Routine",
      chip2: "Venue Sync",
      chip3: "Week 5 / 17",
    },
  },
  {
    id: "kanban",
    badge: "Visual Flow",
    category: "Task Orchestration",
    title: "Immersive 3D Kanban Pipeline",
    tagline:
      "Transition coursework seamlessly across Pending, In Progress, and Completed with zero cognitive friction.",
    actionText: "Drag & Drop",
    accentColor: "from-purple-400 via-pink-500 to-rose-500",
    glowColor: "rgba(168,85,247,0.4)",
    theme: "magenta",
    meta: {
      stat: "100%",
      subtext: "Task Pipeline Clarity",
    },
    details: {
      chip1: "Backlog",
      chip2: "Active Sprint",
      chip3: "Completed",
    },
  },
  {
    id: "pomodoro",
    badge: "Deep Focus",
    category: "Peak Flow State",
    title: "Audio-Chime Pomodoro Timer",
    tagline:
      "Integrated 25-minute focus intervals and 5-minute restorative breaks with ambient synthesized soundscapes.",
    actionText: "25m Interval",
    accentColor: "from-emerald-400 to-teal-500",
    glowColor: "rgba(16,185,129,0.4)",
    theme: "emerald",
    meta: {
      stat: "25:00",
      subtext: "Deep Study Block",
    },
    details: {
      chip1: "Synthesizer Chimes",
      chip2: "Flow Meter",
      chip3: "Target Goals",
    },
  },
  {
    id: "tagging",
    badge: "Course Coding",
    category: "Academic Tags",
    title: "Smart Course & Exam Badging",
    tagline:
      "Color-code tasks by courses with dedicated badges for Assignments, Term Exams, and Lab Reports.",
    actionText: "Course Filter",
    accentColor: "from-indigo-400 to-violet-600",
    glowColor: "rgba(99,102,241,0.4)",
    theme: "indigo",
    meta: {
      stat: "06 Courses",
      subtext: "CSE315 • MAT101 • PHY",
    },
    details: {
      chip1: "CSE315",
      chip2: "Assignments",
      chip3: "Term Exams",
    },
  },
  {
    id: "deadlines",
    badge: "Urgent Alerts",
    category: "Submission Radar",
    title: "Glowing Deadline Indicators",
    tagline:
      "Urgency radar with glowing warning indicators for submissions due within 48 hours and calendar alignment.",
    actionText: "< 48h Warning",
    accentColor: "from-rose-400 to-amber-500",
    glowColor: "rgba(244,63,94,0.4)",
    theme: "rose",
    meta: {
      stat: "2 Pending",
      subtext: "Due within 48 Hours",
    },
    details: {
      chip1: "Priority Radar",
      chip2: "Auto Alert",
      chip3: "On-Time Sync",
    },
  },
  {
    id: "cloud-sync",
    badge: "Private & Safe",
    category: "Encrypted Storage",
    title: "Auth.js Encrypted Workspace",
    tagline:
      "End-to-end encrypted session authentication ensuring notes, timetable sync, and study records remain private.",
    actionText: "24/7 Secure",
    accentColor: "from-blue-400 to-indigo-500",
    glowColor: "rgba(49,91,255,0.4)",
    theme: "blue",
    meta: {
      stat: "256-Bit",
      subtext: "Auth.js Private Session",
    },
    details: {
      chip1: "Cloud Backed",
      chip2: "Strict Privacy",
      chip3: "Session Safe",
    },
  },
];

export function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = showcaseItems.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay rotation every 5s with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // 3-Window indices: Left, Center, Right
  const leftIndex = (activeIndex - 1 + total) % total;
  const centerIndex = activeIndex;
  const rightIndex = (activeIndex + 1) % total;

  return (
    <section
      id="features"
      className="relative pt-2 pb-16 sm:pt-4 sm:pb-20 lg:pt-4 lg:pb-24 bg-[#F8FAFC] text-[#172033] border-t border-[#E5EAF2] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Ambient Pastel Mesh Glows on Dashboard Canvas */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-[130px] animate-pulse-glow" />
      <div className="pointer-events-none absolute top-10 right-0 h-[650px] w-[650px] rounded-full bg-purple-400/10 blur-[140px] animate-pulse-glow [animation-delay:2s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[130px] animate-pulse-glow [animation-delay:4s]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] w-[1100px] bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.06),rgba(99,102,241,0.03),transparent_70%)] blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2. Bold 2025 Trend Headline in Dashboard Theme */}
        <div className="mx-auto max-w-4xl text-center space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D0DFFF] text-xs font-bold text-[#315BFF] shadow-2xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#315BFF]" />
            <span>Interactive 3D Workspace Experience</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#172033] leading-[1.08]">
            Engineered for Academic Focus &{" "}
            <span className="bg-gradient-to-r from-[#315BFF] via-[#4361EE] to-[#7209B7] bg-clip-text text-transparent">
              High-Grade Results
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto font-normal">
            Immersive 3D layout engineered for university students: automatic
            lecture routines, course codes, and frictionless execution.
          </p>
        </div>

        {/* 3. The 3D Curved Cylindrical Horizon Stage */}
        <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] flex items-center justify-center [perspective:1400px]">
          {/* Curved Holographic Horizon Screen Ribbon in Light Mode */}
          <div className="absolute inset-x-2 sm:inset-x-8 top-1/2 -translate-y-1/2 h-[380px] sm:h-[440px] rounded-[36px] sm:rounded-[48px] border border-[#E2E8F0]/70 bg-gradient-to-b from-white/80 via-white/30 to-transparent backdrop-blur-md pointer-events-none shadow-[0_20px_50px_rgba(15,23,42,0.03)] overflow-hidden">
            {/* Subtle smooth radial glow with no harsh line cuts */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.05),transparent_70%)]" />
          </div>

          {/* Soft Diffused Ambient Ground Shadow (Clean & smooth, no sharp circle stroke lines) */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center -z-0">
            {/* Soft ground diffusion */}
            <div className="w-[320px] sm:w-[480px] h-16 rounded-[100%] bg-gradient-to-r from-blue-400/15 via-[#315BFF]/20 to-indigo-500/15 blur-2xl" />
            <div className="w-[220px] sm:w-[340px] h-8 rounded-[100%] bg-blue-500/15 blur-xl -mt-4" />
          </div>

          {/* 4. Three 3D Curved Floating Tablet Windows */}
          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {/* Tablet 1: LEFT WINDOW (Angled inward in 3D) */}
            <div
              onClick={prevSlide}
              className="absolute z-20 cursor-pointer will-change-transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:brightness-105"
              style={{
                transform:
                  "translateX(clamp(-380px, -28vw, -230px)) translateZ(-70px) rotateY(26deg) rotateX(1deg) scale(0.91)",
                opacity: 0.9,
              }}
            >
              <TabletWindow item={showcaseItems[leftIndex]} isCenter={false} />
            </div>

            {/* Tablet 2: CENTER WINDOW (Front and Center, Prominent & Elevated) */}
            <div
              className="absolute z-30 will-change-transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: "translateX(0px) translateZ(60px) rotateY(0deg) scale(1.04)",
                opacity: 1,
              }}
            >
              <TabletWindow item={showcaseItems[centerIndex]} isCenter={true} />
            </div>

            {/* Tablet 3: RIGHT WINDOW (Angled inward in 3D) */}
            <div
              onClick={nextSlide}
              className="absolute z-20 cursor-pointer will-change-transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:brightness-105"
              style={{
                transform:
                  "translateX(clamp(230px, 28vw, 380px)) translateZ(-70px) rotateY(-26deg) rotateX(1deg) scale(0.91)",
                opacity: 0.9,
              }}
            >
              <TabletWindow item={showcaseItems[rightIndex]} isCenter={false} />
            </div>
          </div>

          {/* 5. Floating Glassmorphic Action Buttons in Light Theme */}
          {/* Bottom Left: "↗ Visit site" Glass Pill Button */}
          <div className="absolute left-4 sm:left-10 bottom-6 sm:bottom-10 z-40">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 backdrop-blur-xl text-[#172033] font-bold text-sm shadow-md hover:shadow-lg hover:border-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowUpRight className="h-4 w-4 text-[#315BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Visit Workspace</span>
            </Link>
          </div>

          {/* Bottom Right: "⤢ Expand / Next" Glass Button */}
          <div className="absolute right-4 sm:right-10 bottom-6 sm:bottom-10 z-40 flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Showcase"
              className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 backdrop-blur-xl text-slate-700 shadow-md hover:shadow-lg hover:border-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#172033]" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Showcase"
              className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 backdrop-blur-xl text-slate-700 shadow-md hover:shadow-lg hover:border-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Maximize2 className="h-4 w-4 text-[#315BFF] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* 6. Carousel Pagination Dots & Title Navigation */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {showcaseItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Show ${item.title}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "w-8 bg-[#315BFF] shadow-2xs"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-mono font-bold text-slate-500">
            {showcaseItems[activeIndex].category} • {activeIndex + 1} of {total}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Tablet Window Component in Dashboard Theme
 */
function TabletWindow({
  item,
  isCenter,
}: {
  item: ShowcaseFeature;
  isCenter: boolean;
}) {
  return (
    <div
      className={`w-[290px] sm:w-[350px] lg:w-[370px] h-[400px] sm:h-[450px] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col justify-between border transition-all duration-500 ${
        isCenter
          ? "bg-white text-[#172033] border-2 border-[#315BFF]/60 shadow-[0_25px_65px_-15px_rgba(49,91,255,0.22),0_10px_30px_rgba(15,23,42,0.06)] ring-4 ring-[#315BFF]/10"
          : "bg-white/95 text-[#172033] border border-[#E5EAF2] shadow-[0_15px_40px_-10px_rgba(15,23,42,0.07)] backdrop-blur-md"
      }`}
    >
      {/* Sleek Browser / Tablet Top Window Bar */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>

          {/* Mini pill address badge */}
          <div className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#315BFF] animate-pulse" />
            <span>fasttask.app</span>
          </div>

          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#315BFF] border border-blue-100">
            {item.badge}
          </span>
        </div>

        {/* 3D Visual Artwork Screen / Graphic Header inside tablet */}
        <div className="mt-4 relative h-36 sm:h-40 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4 flex flex-col justify-between overflow-hidden shadow-inner text-white border border-slate-800">
          {/* Ambient inner device backlight */}
          <div
            className="pointer-events-none absolute -inset-2 opacity-60 blur-xl"
            style={{
              background: `radial-gradient(circle at center, ${item.glowColor}, transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-cyan-300">
              <Sparkles className="h-3 w-3" />
              <span>2025 UX</span>
            </div>
          </div>

          {/* Core Graphic Visual Highlight */}
          <div className="relative z-10 space-y-1">
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {item.meta.stat}
            </p>
            <p className="text-[11px] font-medium text-slate-300 truncate">
              {item.meta.subtext}
            </p>
          </div>

          {/* Floating Pill Tag Chips */}
          <div className="relative z-10 flex flex-wrap gap-1.5">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20">
              {item.details.chip1}
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 backdrop-blur-md border border-cyan-400/30">
              {item.details.chip2}
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 hidden sm:inline-block">
              {item.details.chip3}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="pt-3">
        <h3 className="text-base sm:text-lg font-black text-[#172033] tracking-tight leading-snug">
          {item.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {item.tagline}
        </p>

        {/* Dual 2025 Action Pills (matching reference image) */}
        <div className="mt-3.5 flex items-center gap-2">
          <button className="flex-1 py-2 px-3 rounded-xl bg-[#172033] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs">
            {item.actionText}
          </button>
          <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            ✓
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
