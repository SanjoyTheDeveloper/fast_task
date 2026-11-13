"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Pause,
  Clock,
  Heart,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface Stage {
  id: "intro" | "problem" | "use_case" | "cta";
  label: string;
  sublabel: string;
  startTime: number;
  endTime: number;
  stageNumber: string;
  badge: string;
  tagline: string;
}

const STAGES: Stage[] = [
  {
    id: "intro",
    label: "01 Intro",
    sublabel: "Routine Sync",
    startTime: 0.0,
    endTime: 3.0,
    stageNumber: "01",
    badge: "Step 01 • Routine Synchronization",
    tagline: "Define Semester & Weekly Routine",
  },
  {
    id: "problem",
    label: "02 Problem",
    sublabel: "Deadline Radar",
    startTime: 3.0,
    endTime: 14.0,
    stageNumber: "02",
    badge: "Step 02 • Deadline Velocity Radar",
    tagline: "Tag Coursework & Exam Deadlines",
  },
  {
    id: "use_case",
    label: "03 Use Case",
    sublabel: "Focus Flow",
    startTime: 14.0,
    endTime: 38.5,
    stageNumber: "03",
    badge: "Step 03 • Study Target & Flow State",
    tagline: "Execute with Pomodoro Focus",
  },
  {
    id: "cta",
    label: "04 Mastery",
    sublabel: "Peak Output",
    startTime: 38.5,
    endTime: 44.4,
    stageNumber: "04",
    badge: "Step 04 • Continuous Academic Mastery",
    tagline: "Organize Your Semester & Master Every Deadline",
  },
];

const TOTAL_DURATION = 44.4;
const TOTAL_TICKS = 48;

export function KpiShowcase() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const courseTargetUrl = isLoggedIn ? "/lms" : "/login?from=/lms";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rulerRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<Stage["id"]>("intro");
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Sync active tab and progress with video playback
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    const dur = videoRef.current.duration || TOTAL_DURATION;
    const pct = (time / dur) * 100;
    setProgress(pct);

    if (time < 3.0) {
      setActiveTab("intro");
    } else if (time < 14.0) {
      setActiveTab("problem");
    } else if (time < 38.5) {
      setActiveTab("use_case");
    } else {
      setActiveTab("cta");
    }
  }, []);

  // Jump to specific stage
  const handleTabClick = (stageId: Stage["id"]) => {
    const stage = STAGES.find((s) => s.id === stageId);
    if (!stage || !videoRef.current) return;

    setActiveTab(stageId);
    videoRef.current.currentTime = stage.startTime;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Timeline Ruler Scrubbing
  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current || !videoRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(clickX, rect.width));
    const ratio = clampedX / rect.width;
    const targetTime = ratio * (videoRef.current.duration || TOTAL_DURATION);

    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    setProgress(ratio * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentStage = STAGES.find((s) => s.id === activeTab) || STAGES[0];

  return (
    <section
      id="kpi-showcase"
      className="relative py-12 sm:py-18 lg:py-20 select-none overflow-hidden bg-[#F8FAFC]"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Daylight Canvas Card matching user's design reference */}
        <div className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] bg-white border border-[#E5EAF2] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.06)] p-6 sm:p-10 lg:p-14 overflow-hidden">

          {/* ============================================================ */}
          {/* 1. TOP HERO SHOWCASE: EXACT REPLICA OF USER REFERENCE IMAGE */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: Clean Typography, Description, CTA, and 3 Metric Counters */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-7">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#315BFF] text-[11px] font-bold w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#315BFF]" />
                <span className="uppercase tracking-wider">ACADEMIC WORKSPACE • CSE CURRICULUM</span>
              </div>

              {/* Headline matching user's design reference */}
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#0F172A] leading-[1.12]">
                Master <span className="text-[#315BFF]">CS 102, 201</span>
                <br />
                CS 202 &amp; 301 with
                <br />
                <span className="text-[#315BFF]">Deep Study Flow</span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-lg">
                Dedicated academic study workspace for Computer Science &amp; Engineering coursework.
                Organize weekly routines for Data Structures, Digital Logic, Computer Architecture, and
                Operating Systems.
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href={courseTargetUrl}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <span>Explore Course Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowTour(!showTour)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200/90 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-700" />
                  <span>{showTour ? "Hide Tour" : "Watch Walkthrough"}</span>
                </button>
              </div>

              {/* 3 Metric Counters in Clean Bold Typography */}
              <div className="grid grid-cols-3 gap-6 pt-6 sm:pt-8 border-t border-slate-100">
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#315BFF] tracking-tight">
                    10K+
                  </span>
                  <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mt-1">
                    CS Problems Solved
                  </span>
                </div>

                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#315BFF] tracking-tight">
                    70K+
                  </span>
                  <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mt-1">
                    Study Hours
                  </span>
                </div>

                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#315BFF] tracking-tight">
                    05K+
                  </span>
                  <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mt-1">
                    CS Scholars
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Rotating Circular Badge + 2 Tilted Daylight Photo Cards */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
              
              {/* Circular Rotating Badge with Arrow Button */}
              <div className="absolute -top-3 right-8 sm:right-16 z-30 w-24 h-24 flex items-center justify-center">
                {/* Rotating SVG Circular Text */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full animate-[spin_18s_linear_infinite] pointer-events-none"
                >
                  <defs>
                    <path
                      id="csOrbitPath"
                      d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    />
                  </defs>
                  <text className="text-[8.5px] font-bold uppercase tracking-[0.22em] fill-slate-700">
                    <textPath href="#csOrbitPath" startOffset="0%">
                      • CS 201 • CS 102 • CSE 211 • CS 201 • CS 102 • CSE 211
                    </textPath>
                  </text>
                </svg>

                {/* Center Royal Blue Circle with Arrow */}
                <Link
                  href={courseTargetUrl}
                  className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white flex items-center justify-center shadow-md shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Explore Courses"
                >
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </Link>
              </div>

              {/* Tilted Cards Stack */}
              <div className="relative w-full max-w-[480px] h-[380px] sm:h-[420px] flex items-center justify-center">
                
                {/* Back Card (Tilted Right ~+6deg) */}
                <div
                  className="absolute right-2 sm:right-6 top-6 z-10 w-[240px] sm:w-[275px] rounded-[24px] bg-white border border-slate-200/90 shadow-[0_15px_40px_rgba(15,23,42,0.08)] p-3 pb-4 transition-transform hover:scale-105 duration-300 pointer-events-auto"
                  style={{
                    transform: "rotate(6deg)",
                  }}
                >
                  {/* Top Mini Pill */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[10px] font-mono font-bold text-slate-700 w-fit mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>CS 301 • CS 202</span>
                  </div>

                  {/* Photo: Study Desk */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    <Image
                      src="/images/cs-study-light-timer.jpg"
                      alt="Computer Organization Workspace"
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                  </div>

                  {/* Title & Likes */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-1">
                        Computer Organization
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        MIPS &amp; Logic Design
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 shrink-0">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>1,450</span>
                    </div>
                  </div>
                </div>

                {/* Front Card (Tilted Left ~-5deg) */}
                <div
                  className="absolute left-2 sm:left-4 top-2 z-20 w-[255px] sm:w-[290px] rounded-[24px] bg-white border border-slate-200/90 shadow-[0_25px_50px_rgba(15,23,42,0.14)] p-3.5 pb-4 transition-transform hover:scale-105 duration-300 pointer-events-auto"
                  style={{
                    transform: "rotate(-5deg)",
                  }}
                >
                  {/* Top Mini Pill */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[10px] font-mono font-bold text-[#315BFF] w-fit mb-2.5">
                    <BookOpen className="w-3 h-3 text-[#315BFF]" />
                    <span>CS 201 • CS 102 • CSE 211</span>
                  </div>

                  {/* Photo: Desk with Open Notebook & Coffee */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    <Image
                      src="/images/cs-study-light-notes.jpg"
                      alt="Data Structures & Logic Notes Desk"
                      fill
                      priority
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>

                  {/* Title & Handle */}
                  <div className="mt-3 space-y-1">
                    <h4 className="text-xs sm:text-[14px] font-bold text-slate-900 leading-tight">
                      Data Structures &amp; Logic Notes
                    </h4>
                    <span className="text-[11px] text-[#315BFF] font-mono font-medium block">
                      @algo_routine
                    </span>
                  </div>

                  {/* Tag & Likes Footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#315BFF] bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                        BST &amp; Discrete Math
                      </span>
                      <span className="block text-[9.5px] text-slate-400 mt-0.5 font-medium">
                        CS 201, 102, CSE 211 Deck
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>1,279</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* 2. OPTIONAL EXPANDABLE INTERACTIVE PLATFORM TOUR */}
          {/* ============================================================ */}
          {showTour && (
            <div className="mt-12 pt-10 border-t border-slate-100 space-y-6 animate-in fade-in duration-300">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#315BFF]">
                  INTERACTIVE PLATFORM TOUR
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentStage.tagline}
                </h3>
              </div>

              {/* Video Player in Clean Daylight Frame */}
              <div className="max-w-4xl mx-auto">
                <div
                  className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 shadow-xl aspect-[16/9] flex items-center justify-center cursor-pointer"
                  onMouseEnter={() => setIsHoveringVideo(true)}
                  onMouseLeave={() => setIsHoveringVideo(false)}
                  onClick={togglePlayPause}
                >
                  <video
                    ref={videoRef}
                    src="/videos/stage_card_inner.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-cover"
                  />

                  {/* Stage Badge Overlay */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-900 shadow-md pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>{currentStage.badge}</span>
                  </div>

                  {/* Timestamp Overlay */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-mono font-bold text-slate-800 pointer-events-none shadow-md">
                    <Clock className="w-3.5 h-3.5 text-[#315BFF]" />
                    <span>{formatTime(currentTime)} / 00:44</span>
                  </div>

                  {/* Play / Pause Overlay on Hover or Pause */}
                  <div
                    className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
                      !isPlaying
                        ? "opacity-100 bg-black/40 backdrop-blur-[2px]"
                        : isHoveringVideo
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-slate-900" />
                      ) : (
                        <Play className="w-6 h-6 fill-slate-900 ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Stage Buttons */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto">
                  {STAGES.map((stage) => {
                    const isActive = activeTab === stage.id;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => handleTabClick(stage.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-center ${
                          isActive
                            ? "bg-[#315BFF] text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20"
                            : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span>{stage.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Timeline Ruler */}
                <div
                  ref={rulerRef}
                  onClick={handleRulerClick}
                  className="relative mt-4 py-2 px-1 cursor-pointer group flex items-center justify-between max-w-2xl mx-auto"
                  title="Click to scrub playback"
                >
                  {Array.from({ length: TOTAL_TICKS }).map((_, idx) => {
                    const tickProgress = (idx / (TOTAL_TICKS - 1)) * 100;
                    const isPassed = progress >= tickProgress;

                    return (
                      <div
                        key={idx}
                        className={`transition-colors duration-150 rounded-full ${
                          isPassed
                            ? "w-[2px] h-3 bg-[#315BFF]"
                            : "w-[1px] h-2 bg-slate-300 group-hover:bg-slate-400"
                        }`}
                      />
                    );
                  })}

                  {/* Scrubber Needle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-[left] duration-75 ease-linear flex flex-col items-center"
                    style={{ left: `${Math.min(100, Math.max(0, progress))}%` }}
                  >
                    <div className="w-[3px] h-6 rounded-full bg-[#315BFF] shadow-sm shadow-blue-500/50" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default KpiShowcase;
