"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Timer,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Play,
  RotateCcw,
  GraduationCap,
  Columns,
  Search,
} from "lucide-react";

export interface RoutineClassItem {
  id: string;
  code: string;
  title: string;
  time: string;
  venue: string;
  instructor: string;
  status: "In Progress" | "Up Next" | "Scheduled" | "Completed";
  statusColor: "blue" | "indigo" | "emerald" | "slate";
  urgency: string;
  notes: string;
  taskCount: number;
}

const mockSchedule: RoutineClassItem[] = [
  {
    id: "c1",
    code: "CSE315",
    title: "Operating Systems",
    time: "09:30 AM – 10:50 AM",
    venue: "Room A/502",
    instructor: "Dr. A. Vance",
    status: "In Progress",
    statusColor: "blue",
    urgency: "Live Lecture",
    notes: "Virtual memory paging algorithms & kernel space demo.",
    taskCount: 2,
  },
  {
    id: "c2",
    code: "CSE202",
    title: "Digital Logic Design",
    time: "11:15 AM – 12:45 PM",
    venue: "Room B/204",
    instructor: "Prof. Sarah Jenkins",
    status: "Up Next",
    statusColor: "indigo",
    urgency: "Starts in 25m",
    notes: "Sequential circuit flip-flops and Karnaugh maps review.",
    taskCount: 1,
  },
  {
    id: "c3",
    code: "CSE201",
    title: "Data Structures Lab",
    time: "02:00 PM – 04:30 PM",
    venue: "Lab 3 (Software Wing)",
    instructor: "TA Mark Miller",
    status: "Scheduled",
    statusColor: "emerald",
    urgency: "Today afternoon",
    notes: "Red-Black Tree insertion lab assignment submission due.",
    taskCount: 3,
  },
  {
    id: "c4",
    code: "MAT215",
    title: "Discrete Mathematics",
    time: "05:00 PM – 06:20 PM",
    venue: "Room C/102",
    instructor: "Dr. Tariq Ahmed",
    status: "Scheduled",
    statusColor: "slate",
    urgency: "Evening session",
    notes: "Graph theory connectivity and Euler path problem sets.",
    taskCount: 1,
  },
];

export interface HeroShowcaseSectionProps {
  registerHref?: string;
  loginHref?: string;
}

export function HeroShowcaseSection({
  registerHref = "/register",
  loginHref = "/login",
}: HeroShowcaseSectionProps) {
  const [selectedClass, setSelectedClass] = useState<RoutineClassItem>(mockSchedule[0]);
  const [activeFilter, setActiveFilter] = useState<"All" | "Live" | "Labs">("All");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(24 * 60 + 18); // 24:18
  const [isTaskDone, setIsTaskDone] = useState(false);

  // Dynamic 3D tilt tracking for desktop
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y, isHovered: true });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0, isHovered: false });
  };

  // Calculate dynamic rotation angles
  // Default isometric: rotateX(25deg) rotateY(-12deg) rotateZ(6deg)
  const rotX = mousePos.isHovered ? 25 - mousePos.y * 12 : 25;
  const rotY = mousePos.isHovered ? -12 + mousePos.x * 14 : -12;
  const rotZ = mousePos.isHovered ? 6 - mousePos.x * 3 : 6;

  const toggleTimer = () => {
    setTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleMarkDone = () => {
    setIsTaskDone(true);
    setTimeout(() => setIsTaskDone(false), 2400);
  };

  const handleNextClass = () => {
    const currentIndex = mockSchedule.findIndex((c) => c.id === selectedClass.id);
    const nextIndex = (currentIndex + 1) % mockSchedule.length;
    setSelectedClass(mockSchedule[nextIndex]);
  };

  return (
    <section
      aria-label="FastTask 3D Workspace Showcase"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#172033] pt-6 pb-20 md:py-20 px-4 sm:px-6 lg:px-8 mt-0 selection:bg-[#315BFF] selection:text-white"
    >
      {/* 1. Subtle Background Typography Watermark matching website style */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 select-none text-center tracking-tighter whitespace-nowrap z-0"
      >
        <span className="block font-black text-6xl sm:text-7xl md:text-8xl lg:text-[140px] xl:text-[160px] text-slate-200/50 leading-none">
          FastTask Studio
        </span>
      </div>

      {/* Ambient background light gradients matching website color theme (#315BFF, #6366F1) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 -z-10 h-[520px] w-full max-w-5xl rounded-full bg-[radial-gradient(ellipse_at_top,rgba(49,91,255,0.14),rgba(99,102,241,0.09),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-44 right-[-10%] -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-[-10%] -z-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl z-10">
        {/* Top Hero Heading & Value Proposition in Website Brand Colors */}
        <div className="mx-auto max-w-3xl text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-[#315BFF] shadow-xs backdrop-blur-sm mb-5 transition-transform hover:scale-105">
            <span className="flex h-2 w-2 rounded-full bg-[#315BFF] animate-ping" />
            <span className="flex h-2 w-2 -ml-3 rounded-full bg-[#315BFF]" />
            <span>FastTask 2.0 • Academic &amp; Student Task Workspace</span>
            <Sparkles className="h-3.5 w-3.5 text-[#315BFF]" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#172033] leading-[1.12]">
            Organize Routines &amp;{" "}
            <span className="bg-gradient-to-r from-[#315BFF] via-[#6366F1] to-[#315BFF] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow inline-block">
              Coursework Flow
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Stay ahead of every semester lecture, track coursework with priority Kanban pipelines, and lock into deep study sessions with built-in Pomodoro telemetry.
          </p>

          {/* Quick CTA Actions using Website Brand Colors */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href={registerHref}
              className="inline-flex items-center gap-2 rounded-xl bg-[#315BFF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#315BFF]/25 transition-all hover:bg-[#2547db] hover:shadow-xl hover:shadow-[#315BFF]/30 active:scale-98"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={loginHref}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-5 py-3 text-sm font-semibold text-[#172033] backdrop-blur-sm transition-all hover:bg-slate-50 active:scale-98 shadow-xs"
            >
              <span>Open Student Workspace</span>
              <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-[#315BFF]">
                Live
              </span>
            </Link>
          </div>
        </div>

        {/* 2 & 3: 3D Isometric Screen / Device Mockup with Surrounding Floating Cards */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mt-4 sm:mt-8 pb-6 lg:pb-12"
        >
          {/* Spatial 3D Perspective Stage */}
          <div
            className="w-full mx-auto max-w-5xl transition-transform duration-700 ease-out"
            style={{ perspective: "1200px" }}
          >
            {/* Desktop Surrounding Floating Glassmorphism Cards (Flanked Left & Right) */}

            {/* --- CARD 1 (Top Left): Live Lecture Routine --- */}
            <div className="hidden lg:block absolute -top-8 -left-8 xl:-left-16 z-30 animate-float pointer-events-auto">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-[#315BFF]/25 blur-xl -z-10 scale-95"
              />
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-200/60 hover:scale-105 transition-all duration-300 flex items-center gap-3.5 w-72">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#315BFF] flex items-center justify-center shrink-0 shadow-inner ring-1 ring-[#315BFF]/20 font-bold">
                  <Calendar className="w-5 h-5 text-[#315BFF]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#172033] truncate">
                      Live Lecture Routine
                    </span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#315BFF]" />
                  </div>
                  <span className="text-xs text-slate-500 leading-tight mt-0.5">
                    Dynamic classroom, venue &amp; lab schedule
                  </span>
                </div>
              </div>
            </div>

            {/* --- CARD 2 (Bottom Left): Coursework Kanban --- */}
            <div
              className="hidden lg:block absolute bottom-16 -left-6 xl:-left-14 z-30 pointer-events-auto"
              style={{
                animation: "float 6s ease-in-out infinite",
                animationDelay: "1.8s",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-[#6366F1]/20 blur-xl -z-10 scale-95"
              />
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-200/60 hover:scale-105 transition-all duration-300 flex items-center gap-3.5 w-72">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center shrink-0 shadow-inner ring-1 ring-[#6366F1]/20 font-bold">
                  <Columns className="w-5 h-5 text-[#6366F1]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#172033] truncate">
                      Coursework Kanban
                    </span>
                    <span className="rounded bg-indigo-100 px-1 py-0.2 text-[9px] font-bold text-[#6366F1]">
                      Flow
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 leading-tight mt-0.5">
                    Drag-and-drop semester study pipeline
                  </span>
                </div>
              </div>
            </div>

            {/* --- CARD 3 (Top Right): Pomodoro Study Timer --- */}
            <div
              className="hidden lg:block absolute -top-4 -right-8 xl:-right-16 z-30 pointer-events-auto"
              style={{
                animation: "float 6s ease-in-out infinite",
                animationDelay: "0.9s",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-emerald-500/25 blur-xl -z-10 scale-95"
              />
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-200/60 hover:scale-105 transition-all duration-300 flex items-center gap-3.5 w-72">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner ring-1 ring-emerald-500/20 font-bold">
                  <Timer className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#172033] truncate">
                      Pomodoro Study Timer
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-xs text-slate-500 leading-tight mt-0.5">
                    25m focus blocks &amp; interval audio cues
                  </span>
                </div>
              </div>
            </div>

            {/* --- CARD 4 (Bottom Right): Exam & Deadline Radar --- */}
            <div
              className="hidden lg:block absolute bottom-12 -right-6 xl:-right-14 z-30 pointer-events-auto"
              style={{
                animation: "float 6s ease-in-out infinite",
                animationDelay: "2.6s",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-xl -z-10 scale-95"
              />
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-200/60 hover:scale-105 transition-all duration-300 flex items-center gap-3.5 w-72">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-inner ring-1 ring-amber-500/20 font-bold">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#172033] truncate">
                      Submission Radar
                    </span>
                    <span className="rounded bg-rose-100 px-1 py-0.2 text-[9px] font-bold text-rose-700">
                      Alert
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 leading-tight mt-0.5">
                    Urgent countdown for midterm deadlines
                  </span>
                </div>
              </div>
            </div>

            {/* --- 3D Tilted Device Container --- */}
            <div
              className="relative mx-auto transition-transform duration-300 ease-out transform-gpu will-change-transform"
              style={{
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Device Laptop Bezel & Screen Outer Chassis */}
              <div className="relative rounded-2xl sm:rounded-3xl border-4 border-slate-800/95 bg-slate-900 shadow-[0_30px_70px_-15px_rgba(23,32,51,0.35)] ring-1 ring-[#315BFF]/30 overflow-hidden">
                {/* Glossy Screen Glare Line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-y-12 -inset-x-20 -rotate-12 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent z-40"
                />

                {/* Laptop Top Bezel Notch / Webcam Bar */}
                <div className="relative flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800/80 z-20">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-800 ring-1 ring-slate-700 flex items-center justify-center">
                      <span className="h-0.5 w-0.5 rounded-full bg-blue-400" />
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-mono font-medium text-slate-400">
                      fasttask.app/dashboard/routine?semester=fall-2026
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-emerald-400 font-mono">
                      SYNCED
                    </span>
                  </div>
                </div>

                {/* --- Live FastTask Student Workspace UI (Screen Inner Canvas) --- */}
                <div className="bg-[#F8FAFC] text-[#172033] p-3 sm:p-5 select-none font-sans min-h-[380px] sm:min-h-[460px] md:min-h-[500px]">
                  {/* Inner Console Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200/90">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#315BFF] text-white flex items-center justify-center font-black shadow-xs">
                        <CheckSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-[#172033] tracking-tight">
                            FastTask Student Workspace
                          </h2>
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-[#315BFF]">
                            CSE • Fall 2026
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Student: <strong className="text-slate-700">Alex Morgan</strong> • Semester Week 5 • Cumulative GPA: <strong className="text-emerald-600">3.84</strong>
                        </p>
                      </div>
                    </div>

                    {/* Search & Quick Controls */}
                    <div className="flex items-center gap-2">
                      <div className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          readOnly
                          value="CSE315 Virtual Memory Lab"
                          className="h-7 w-52 rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-xs text-slate-700 font-medium focus:outline-none"
                        />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#315BFF] border border-blue-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#315BFF]" />
                        Routine Active
                      </span>
                    </div>
                  </div>

                  {/* Quick Telemetry KPI Cards Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Today&apos;s Lectures
                        </span>
                        <Calendar className="h-3.5 w-3.5 text-[#315BFF]" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[#172033]">3 Classes</span>
                        <span className="text-[10px] font-semibold text-[#315BFF]">
                          Next: 09:30 AM
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Active Kanban
                        </span>
                        <Columns className="h-3.5 w-3.5 text-[#6366F1]" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[#172033]">5 Tasks</span>
                        <span className="text-[10px] font-semibold text-[#6366F1]">
                          2 In Progress
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Focus Streak
                        </span>
                        <Timer className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[#172033]">4 Days</span>
                        <span className="text-[10px] font-semibold text-emerald-600">
                          14 Pomodoros
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Urgent Due
                        </span>
                        <Clock className="h-3.5 w-3.5 text-rose-500" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[#172033]">1 Lab Report</span>
                        <span className="text-[10px] font-semibold text-rose-500">
                          In 18h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Split Console Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
                    {/* Left Column: Lecture Routine & Timetable List (7 cols) */}
                    <div className="md:col-span-7 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                            Today&apos;s Class Routine
                          </h3>
                          <span className="h-4 px-1.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center">
                            {mockSchedule.length}
                          </span>
                        </div>
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                          {(["All", "Live", "Labs"] as const).map((tab) => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setActiveFilter(tab)}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                                activeFilter === tab
                                  ? "bg-white text-[#315BFF] shadow-2xs"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Class Row List */}
                      <div className="space-y-1.5">
                        {mockSchedule.map((cls) => {
                          const isSelected = selectedClass.id === cls.id;
                          return (
                            <div
                              key={cls.id}
                              onClick={() => setSelectedClass(cls)}
                              className={`group cursor-pointer rounded-xl p-2 sm:p-2.5 transition-all duration-150 border flex items-center justify-between ${
                                isSelected
                                  ? "border-[#315BFF] bg-blue-50/70 shadow-2xs"
                                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/80"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`font-mono text-xs font-black px-2 py-1 rounded-lg ${
                                    isSelected
                                      ? "bg-[#315BFF] text-white"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {cls.code}
                                </span>
                                <div className="truncate">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#172033] truncate">
                                      {cls.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      ({cls.venue})
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 block truncate">
                                    {cls.time} • {cls.instructor}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    cls.statusColor === "blue"
                                      ? "bg-blue-100 text-[#315BFF]"
                                      : cls.statusColor === "indigo"
                                      ? "bg-indigo-100 text-[#6366F1]"
                                      : cls.statusColor === "emerald"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {cls.status}
                                </span>
                                <ChevronRight
                                  className={`h-3.5 w-3.5 transition-transform ${
                                    isSelected
                                      ? "text-[#315BFF] translate-x-0.5"
                                      : "text-slate-300"
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Active Coursework & Pomodoro Study Session (5 cols) */}
                    <div className="md:col-span-5 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs flex flex-col justify-between">
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#315BFF]">
                              Active Coursework Card
                            </span>
                            <h4 className="text-sm font-extrabold text-[#172033] mt-0.5">
                              {selectedClass.title}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-500">
                              {selectedClass.code} • {selectedClass.venue}
                            </span>
                          </div>
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-mono font-bold text-[#315BFF]">
                            {selectedClass.urgency}
                          </span>
                        </div>

                        {/* Pomodoro Timer Mini-Display */}
                        <div className="my-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                              <Timer className="h-3 w-3 text-[#315BFF]" />
                              Pomodoro Focus Interval
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Session 2/4
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-black font-mono tracking-tight text-[#172033]">
                              {formatTimer(timerSeconds)}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={toggleTimer}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors ${
                                  timerRunning
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-[#315BFF] text-white hover:bg-[#2547db]"
                                }`}
                              >
                                <Play className="h-3 w-3 fill-current" />
                                {timerRunning ? "Pause" : "Focus"}
                              </button>
                              <button
                                type="button"
                                onClick={resetTimer}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                                title="Reset Timer"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Lecture Brief & Assignment note */}
                        <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-2 text-[11px] text-slate-700">
                          <span className="font-bold text-[#315BFF] block text-[10px] uppercase tracking-wider mb-0.5">
                            Lecture Scope &amp; Lab Notes:
                          </span>
                          {selectedClass.notes}
                        </div>
                      </div>

                      {/* Interactive Action Buttons */}
                      <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={handleMarkDone}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#315BFF] py-1.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#2547db] transition-colors active:scale-98"
                        >
                          {isTaskDone ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                              <span>Coursework Checked &amp; Saved!</span>
                            </>
                          ) : (
                            <>
                              <CheckSquare className="h-3.5 w-3.5" />
                              <span>Mark Today&apos;s Reading Completed</span>
                            </>
                          )}
                        </button>

                        <div className="grid grid-cols-2 gap-1.5">
                          <Link
                            href="/kanban"
                            className="rounded-lg border border-slate-200 bg-white py-1.5 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center"
                          >
                            Open Kanban
                          </Link>
                          <button
                            type="button"
                            onClick={handleNextClass}
                            className="rounded-lg border border-blue-200 bg-blue-50 py-1.5 px-2 text-[11px] font-bold text-[#315BFF] hover:bg-blue-100 transition-colors text-center flex items-center justify-center gap-1"
                          >
                            <span>Next Lecture</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Realistic Laptop Base / Keyboard Chassis Deck */}
              <div
                aria-hidden="true"
                className="relative mx-auto -mt-1 h-5 w-[96%] rounded-b-2xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-x border-b border-slate-700/80 shadow-[0_25px_40px_rgba(23,32,51,0.35)]"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-b-md bg-slate-950/70" />
                <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />
              </div>

              {/* Ground Ambient Reflection Shadow with Brand Accent Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none mx-auto mt-2 h-8 w-[92%] rounded-full bg-gradient-to-r from-[#315BFF]/25 via-slate-900/40 to-[#6366F1]/25 blur-xl"
              />
            </div>
          </div>

          {/* 4. Responsive Mobile / Tablet Badge Stack (stacked cleanly below mockup) */}
          <div className="lg:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto px-1">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#315BFF] flex items-center justify-center shrink-0 font-bold">
                <Calendar className="w-5 h-5 text-[#315BFF]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172033]">Live Lecture Routine</h4>
                <p className="text-xs text-slate-500">Dynamic classroom, venue &amp; lab schedule</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center shrink-0 font-bold">
                <Columns className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172033]">Coursework Kanban</h4>
                <p className="text-xs text-slate-500">Drag-and-drop semester study pipeline</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <Timer className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172033]">Pomodoro Study Timer</h4>
                <p className="text-xs text-slate-500">25m focus blocks &amp; interval audio cues</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172033]">Submission Radar</h4>
                <p className="text-xs text-slate-500">Urgent countdown for midterm deadlines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges & Trust Footer Bar with FastTask Features */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-600 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#315BFF]" />
            <span>Semester Syllabus &amp; Coursework Aligned</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#6366F1]" />
            <span>Real-time Timetable &amp; Venue Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Focused Pomodoro Productivity Flow</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroShowcaseSection;
