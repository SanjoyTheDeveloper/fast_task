"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Timer,
  Columns,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    badge: "Live Routine",
    category: "Class Routine",
    title: "Today's Lecture Routine",
    tagline:
      "Automatically updates active lectures, venue rooms, and lab timings according to your semester schedule.",
    actionText: "View Schedule",
    accentColor: "from-cyan-400 to-blue-500",
    glowColor: "rgba(49,91,255,0.3)",
    theme: "blue",
    meta: {
      stat: "09:30 AM",
      subtext: "Room A/502 • Operating Systems",
    },
    details: {
      chip1: "CSE315",
      chip2: "Room A/502",
      chip3: "Week 5",
    },
  },
  {
    id: "kanban",
    badge: "Task Flow",
    category: "Kanban Board",
    title: "Coursework Kanban Pipeline",
    tagline:
      "Track coursework seamlessly across Pending, In Progress, and Completed with clear priority flags.",
    actionText: "Open Kanban",
    accentColor: "from-purple-400 via-pink-500 to-rose-500",
    glowColor: "rgba(168,85,247,0.3)",
    theme: "magenta",
    meta: {
      stat: "3 Active",
      subtext: "2 Submissions this week",
    },
    details: {
      chip1: "In Progress",
      chip2: "Priority Flags",
      chip3: "Due Tomorrow",
    },
  },
  {
    id: "pomodoro",
    badge: "Deep Focus",
    category: "Study Timer",
    title: "Pomodoro Study Timer",
    tagline:
      "Build study momentum with structured 25-minute Pomodoro study intervals and 5-minute break cues.",
    actionText: "Start Session",
    accentColor: "from-emerald-400 to-teal-500",
    glowColor: "rgba(16,185,129,0.3)",
    theme: "emerald",
    meta: {
      stat: "24:18",
      subtext: "Distributed Systems • Session 2/4",
    },
    details: {
      chip1: "25m Interval",
      chip2: "5m Break",
      chip3: "Audio Chimes",
    },
  },
  {
    id: "deadlines",
    badge: "Deadlines",
    category: "Submission Radar",
    title: "Assignments & Exam Radar",
    tagline:
      "Urgency radar with clear alerts for assignments, lab reports, and midterm exams due within 48 hours.",
    actionText: "View Deadlines",
    accentColor: "from-rose-400 to-amber-500",
    glowColor: "rgba(244,63,94,0.3)",
    theme: "rose",
    meta: {
      stat: "2 Urgent",
      subtext: "Due within 48 hours",
    },
    details: {
      chip1: "Due in 18h",
      chip2: "CSE421",
      chip3: "20% Grade",
    },
  },
];

export interface HeroProps {
  registerHref?: string;
  loginHref?: string;
}

export function Hero({
  registerHref = "/register",
  loginHref = "/login",
}: HeroProps) {
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

  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Touch and drag swipe handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX.current === null) return;
    const clientX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - touchStartX.current;
    if (diff > 45) {
      prevSlide();
    } else if (diff < -45) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  // Continuous 3D cylindrical transform calculations for all persistent card nodes
  const getCardStyle = (index: number) => {
    let offset = ((index - activeIndex) % total + total) % total;
    if (offset > total / 2) offset -= total;

    const isCenter = offset === 0;
    const isLeft = offset === -1;
    const isRight = offset === 1;

    const xSpacing = isMobile ? 220 : 340;

    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 0;
    let zIndex = 5;
    let pointerEvents: "auto" | "none" = "none";

    if (isCenter) {
      translateX = 0;
      translateZ = 60;
      rotateY = 0;
      scale = 1.04;
      opacity = 1;
      zIndex = 30;
      pointerEvents = "auto";
    } else if (isLeft) {
      translateX = -xSpacing;
      translateZ = -70;
      rotateY = 26;
      scale = 0.91;
      opacity = 0.9;
      zIndex = 20;
      pointerEvents = "auto";
    } else if (isRight) {
      translateX = xSpacing;
      translateZ = -70;
      rotateY = -26;
      scale = 0.91;
      opacity = 0.9;
      zIndex = 20;
      pointerEvents = "auto";
    } else if (offset === -2) {
      translateX = -xSpacing * 1.55;
      translateZ = -180;
      rotateY = 40;
      scale = 0.78;
      opacity = 0;
      zIndex = 10;
      pointerEvents = "none";
    } else if (offset === 2) {
      translateX = xSpacing * 1.55;
      translateZ = -180;
      rotateY = -40;
      scale = 0.78;
      opacity = 0;
      zIndex = 10;
      pointerEvents = "none";
    } else {
      translateX = offset > 0 ? xSpacing * 2 : -xSpacing * 2;
      translateZ = -240;
      rotateY = offset > 0 ? -50 : 50;
      scale = 0.65;
      opacity = 0;
      zIndex = 5;
      pointerEvents = "none";
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents,
      transition:
        "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), z-index 700ms step-end",
    };
  };

  return (
    <section
      id="hero"
      className="relative pt-8 sm:pt-12 lg:pt-14 pb-16 sm:pb-20 lg:pb-24 bg-transparent text-[#172033] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glows matching dashboard palette */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[650px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(49,91,255,0.08),rgba(99,102,241,0.04),transparent_70%)] animate-pulse-glow" />
      <div className="pointer-events-none absolute -left-48 top-1/4 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-48 top-1/3 -z-10 h-96 w-96 rounded-full bg-purple-400/10 blur-[140px] animate-pulse-glow [animation-delay:2s]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Header Typography */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-5">
          {/* Main Headline with entrance and animated gradient text */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#172033] leading-[1.12] sm:leading-[1.08] animate-fade-in-up break-words">
            Engineered for Academic Focus &{" "}
            <span className="text-[#315BFF] inline-block">
              High-Grade Results
            </span>
          </h1>

          {/* CTA Buttons with hover lift, shadow bloom, arrow slide, and active feedback */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto animate-fade-in-up [animation-delay:150ms]">
            <Button
              asChild
              size="pillLg"
              className="w-full sm:w-auto bg-[#315BFF] hover:bg-[#254BE3] text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 group cursor-pointer"
            >
              <Link
                href={registerHref}
                className="flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 2. The 3D Curved Cylindrical Horizon Stage (Right Below Navbar & Header) */}
        <div
          id="portfolio"
          className="relative mt-12 sm:mt-16 w-full h-[520px] sm:h-[580px] lg:h-[620px] flex items-center justify-center [perspective:1400px] scroll-mt-28"
        >
          {/* Curved Holographic Screen Horizon Ribbon behind windows */}
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

          {/* 3. Three 3D Curved Floating Tablet Windows with Continuous Fluid 3D Travel */}
          <div
            className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
          >
            {showcaseItems.map((item, index) => {
              const cardStyle = getCardStyle(index);
              const isCenter = index === activeIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(index);
                  }}
                  className={`absolute will-change-transform ${
                    isCenter
                      ? "cursor-default"
                      : "cursor-pointer hover:brightness-105"
                  }`}
                  style={cardStyle}
                >
                  <TabletWindow item={item} isCenter={isCenter} />
                </div>
              );
            })}
          </div>

          {/* 4. Floating Glassmorphic Navigation Buttons */}
          <div className="absolute right-4 sm:right-10 bottom-6 sm:bottom-10 z-40 flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Showcase"
              className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 backdrop-blur-xl text-slate-700 shadow-md hover:shadow-lg hover:border-slate-300 hover:scale-105 active:scale-95 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315BFF]/30 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5 text-[#315BFF] group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Showcase"
              className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 backdrop-blur-xl text-slate-700 shadow-md hover:shadow-lg hover:border-slate-300 hover:scale-105 active:scale-95 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315BFF]/30 transition-all cursor-pointer"
            >
              <ChevronRight className="h-5 w-5 text-[#315BFF] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* 5. Carousel Pagination Dots & Category Indicator */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-3">
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
 * Realistic Student UI Component Preview
 */
function ShowcasePreview({ item }: { item: ShowcaseFeature }) {
  if (item.id === "timetable") {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-3 space-y-2 text-left">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-0.5">
          <span>Wednesday • Today</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Routine
          </span>
        </div>
        <div className="rounded-xl bg-white border border-blue-200/90 p-2.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#315BFF] border border-blue-100">
              09:30 - 11:00 AM
            </span>
            <span className="text-[10px] font-bold text-slate-700">Room A/502</span>
          </div>
          <p className="text-xs font-bold text-slate-900 leading-tight">Operating Systems Lecture</p>
          <p className="text-[10px] text-slate-500">Prof. A. Rahman • CSE 315</p>
        </div>
        <div className="rounded-xl bg-white/90 border border-slate-200/80 p-2 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-slate-800">11:30 AM • Linear Algebra</p>
            <p className="text-[10px] text-slate-400">Auditorium 2 • MAT 201</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Next
          </span>
        </div>
      </div>
    );
  }

  if (item.id === "pomodoro") {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-800 p-3.5 text-white flex flex-col justify-between h-[152px]">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium text-slate-300">Deep Study Session</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Focus Mode
          </span>
        </div>
        <div className="text-center my-auto">
          <p className="text-3xl font-black tracking-tight text-white font-mono">24:18</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Distributed Systems • Session 2 of 4</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
          </div>
          <span className="text-emerald-400 font-semibold">Break in 24m</span>
        </div>
      </div>
    );
  }

  if (item.id === "deadlines") {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-3 space-y-2 text-left">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-0.5">
          <span>Course Deadlines</span>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
            2 Urgent
          </span>
        </div>
        <div className="rounded-xl bg-white border border-rose-200 p-2.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
              Due in 18 hrs
            </span>
            <span className="text-[10px] font-bold text-slate-600">CSE 421</span>
          </div>
          <p className="text-xs font-bold text-slate-900 leading-tight">Database Final Project Report</p>
          <p className="text-[10px] text-slate-500">Weight: 20% of term grade</p>
        </div>
        <div className="rounded-xl bg-white/90 border border-slate-200/80 p-2 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-slate-800">Physics Lab 4 Report</p>
            <p className="text-[10px] text-slate-400">Friday, 11:59 PM • PHY 102</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            Upcoming
          </span>
        </div>
      </div>
    );
  }

  // Default: Kanban
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-3 space-y-2 text-left">
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-0.5">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#315BFF]" />
          In Progress (2)
        </span>
        <span className="text-[10px] text-slate-400">Semester Week 5</span>
      </div>
      <div className="rounded-xl bg-white border border-slate-200 p-2.5 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#315BFF] border border-blue-100">
            CSE 315
          </span>
          <span className="text-[10px] font-semibold text-rose-600">Due Tomorrow</span>
        </div>
        <p className="text-xs font-bold text-slate-900 leading-tight">Operating Systems Lab Report #3</p>
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
          <span>3 subtasks</span>
          <span className="text-emerald-600 font-semibold">2/3 Done</span>
        </div>
      </div>
      <div className="rounded-xl bg-white/90 border border-slate-200/80 p-2 flex items-center justify-between shadow-2xs">
        <span className="text-[11px] font-medium text-slate-700 truncate">Algorithm Quiz 2 Study</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">
          MAT 201
        </span>
      </div>
    </div>
  );
}

/**
 * Tablet Window Component in Clean Human Theme
 */
function TabletWindow({
  item,
  isCenter,
}: {
  item: ShowcaseFeature;
  isCenter: boolean;
}) {
  return (
    <div className="relative">
      {/* 4-sided ambient aura glow & smooth breathing animation for the center active card */}
      {isCenter && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 sm:-inset-4.5 rounded-[34px] sm:rounded-[38px] bg-gradient-to-r from-blue-500/35 via-indigo-500/25 to-blue-400/35 blur-2xl opacity-75 animate-pulse -z-10"
          style={{ animationDuration: "3.5s" }}
        />
      )}

      <div
        className={`w-[275px] sm:w-[350px] lg:w-[370px] max-w-[calc(100vw-36px)] h-[415px] sm:h-[445px] rounded-[24px] sm:rounded-[28px] p-4.5 sm:p-6 flex flex-col justify-between border transition-all duration-500 ${
          isCenter
            ? "bg-white text-[#172033] border-2 border-[#315BFF]/60 shadow-[0_0_50px_rgba(49,91,255,0.25),0_0_25px_rgba(49,91,255,0.15),0_20px_45px_-10px_rgba(15,23,42,0.12)] ring-4 ring-[#315BFF]/15 scale-[1.01]"
            : "bg-white/95 text-[#172033] border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(15,23,42,0.08),0_0_15px_rgba(49,91,255,0.06)] backdrop-blur-md"
        }`}
      >
      <div>
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#315BFF]" />
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              {item.category}
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
            {item.badge}
          </span>
        </div>

        {/* Realistic Human UI Preview */}
        <div className="mt-3">
          <ShowcasePreview item={item} />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="pt-2">
        <h3 className="text-base sm:text-lg font-bold text-[#172033] tracking-tight leading-snug">
          {item.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {item.tagline}
        </p>

        {/* Clean Human Button */}
        <Link
          href="/dashboard"
          className="mt-3 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#315BFF] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <span>Explore Feature</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
    </div>
  );
}

export default Hero;
