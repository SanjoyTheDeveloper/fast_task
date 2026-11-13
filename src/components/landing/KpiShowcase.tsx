"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clock,
  Compass,
  CheckCircle2,
  BookOpen,
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
    label: "Intro",
    sublabel: "Academic OS",
    startTime: 0.0,
    endTime: 3.0,
    stageNumber: "01",
    badge: "Step 01 • Routine Synchronization",
    tagline: "Define Semester & Weekly Routine",
  },
  {
    id: "problem",
    label: "Problem",
    sublabel: "Deadline Radar",
    startTime: 3.0,
    endTime: 14.0,
    stageNumber: "02",
    badge: "Step 02 • Deadline Velocity Radar",
    tagline: "Tag Coursework & Exam Deadlines",
  },
  {
    id: "use_case",
    label: "Use Case",
    sublabel: "Study Flow",
    startTime: 14.0,
    endTime: 38.5,
    stageNumber: "03",
    badge: "Step 03 • Study Target & Flow State",
    tagline: "Execute with Pomodoro Focus",
  },
  {
    id: "cta",
    label: "Call to Action",
    sublabel: "Peak Mastery",
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

  // Sync active tab and progress with video playback
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    const dur = videoRef.current.duration || TOTAL_DURATION;
    const pct = (time / dur) * 100;
    setProgress(pct);

    // Determine active tab based on timestamps
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

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentStage = STAGES.find((s) => s.id === activeTab) || STAGES[0];

  return (
    <section
      id="kpi-showcase"
      className="relative py-12 sm:py-20 lg:py-24 select-none overflow-hidden bg-[#F8FAFC]"
    >
      {/* Outer Alignment Grid */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Stage Canvas Card - FastTask Dashboard Palette with Rich Vibrant Colors */}
        <div className="relative rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-gradient-to-b from-[#EDF3FF] via-[#F8FAFC] to-white border-2 border-[#D0E0FD] shadow-[0_25px_80px_-15px_rgba(49,91,255,0.18),0_10px_30px_-5px_rgba(15,23,42,0.06)] overflow-hidden pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-8 lg:px-12 text-[#172033]">
          
          {/* Volumetric Multi-Color Ambient Glows (Royal Blue, Cyan, Indigo) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.22),rgba(59,130,246,0.10),transparent_70%)] blur-[90px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.18),transparent_70%)] blur-[70px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_70%)] blur-[70px]"
          />

          {/* TOP HEADER: Sleek Brand Mark & Typography (FastTask Dashboard Vibrant Styling) */}
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
            {/* Top Brand Pill with Multi-Color Gradient */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-cyan-500/15 border border-blue-400/40 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#315BFF] animate-ping" />
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0284C7] bg-clip-text text-transparent">
                INTERACTIVE PLATFORM TOUR • ACADEMIC WORKSPACE
              </span>
            </div>

            {/* Headline with Rich Color Gradients */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#172033] leading-[1.12]">
              Master{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] via-[#315BFF] to-[#06B6D4]">
                CS 102, 201
              </span>
              <br />
              CS 202 &amp; 301 with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]">
                Deep Study Flow
              </span>
            </h2>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
              Explore the 4-stage academic OS: configure routines, radar deadlines,
              power through Pomodoro focus blocks, and lock in continuous semester mastery.
            </p>
          </div>

          {/* CENTER DISPLAY SCREEN: Large Rounded Card with Inner Stage Video */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Stage Display Frame with Vibrant Royal Blue Rim & Elevation */}
            <div
              className="group relative rounded-[22px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden border-2 border-[#BFDBFE] bg-white shadow-[0_25px_60px_-15px_rgba(49,91,255,0.25),0_10px_25px_-5px_rgba(37,99,235,0.1)] aspect-[16/9] sm:aspect-[470/266] flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
              onClick={togglePlayPause}
            >
              {/* Shimmering Top Rim Light */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#315BFF] to-transparent z-20"
              />

              {/* Live Video Element */}
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

              {/* Video Overlay: Top Left Stage Badge */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-200 text-[10px] sm:text-xs font-semibold text-[#172033] shadow-md pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />
                <span>{currentStage.badge}</span>
              </div>

              {/* Video Overlay: Top Right Timestamp */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF3FF] backdrop-blur-md border border-blue-200 text-[10px] sm:text-xs font-mono font-bold text-[#2563EB] shadow-sm pointer-events-none">
                <Clock className="w-3.5 h-3.5 text-[#315BFF]" />
                <span>{formatTime(currentTime)} / 00:44</span>
              </div>

              {/* Floating Play / Pause Overlay on Hover or Pause */}
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                  !isPlaying ? "opacity-100 bg-slate-900/30 backdrop-blur-[2px]" : isHoveringVideo ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-[#172033] flex items-center justify-center shadow-xl shadow-slate-900/20 backdrop-blur-md transition-transform duration-200 group-hover:scale-105">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-[#172033]" />
                  ) : (
                    <Play className="w-6 h-6 fill-[#172033] ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM INTERACTIVE TAB BAR: 4 Capsule Buttons with Color Accents */}
            <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                {STAGES.map((stage) => {
                  const isActive = activeTab === stage.id;

                  // Custom stage pill colors
                  const badgeColor =
                    stage.id === "intro"
                      ? "bg-blue-100 text-blue-700"
                      : stage.id === "problem"
                      ? "bg-rose-100 text-rose-700"
                      : stage.id === "use_case"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-indigo-100 text-indigo-700";

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleTabClick(stage.id)}
                      className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer overflow-hidden text-center active:scale-95 ${
                        isActive
                          ? "bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-xl ring-2 ring-[#315BFF] shadow-[0_4px_25px_rgba(49,91,255,0.35)]"
                          : "bg-white hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 text-[#172033] hover:text-[#2563EB] shadow-xs border border-[#D5E1F8] hover:border-blue-300"
                      }`}
                    >
                      {/* Active State Glowing Vertical Light Beam (Royal Blue & Cyan Gradient) */}
                      {isActive && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute right-2.5 sm:right-4 top-0 bottom-0 w-6 flex items-center justify-center overflow-visible"
                        >
                          {/* Diffused Outer Royal Blue Neon Bloom */}
                          <div className="absolute inset-y-0 w-5 bg-gradient-to-t from-blue-600/0 via-blue-500/90 to-cyan-500/0 blur-[4px] animate-pulse" />
                          {/* Mid Glow Column */}
                          <div className="absolute inset-y-0 w-2.5 bg-gradient-to-t from-transparent via-blue-300 to-transparent blur-[1.5px]" />
                          {/* Sharp Center Light Beam */}
                          <div className="absolute inset-y-0 w-[2px] bg-gradient-to-t from-transparent via-white to-transparent shadow-[0_0_8px_#38BDF8]" />
                          {/* Top & Bottom Flare Sparks */}
                          <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-white blur-[0.5px] shadow-[0_0_8px_#60A5FA]" />
                          <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-blue-400 blur-[1px]" />
                        </div>
                      )}

                      {/* Tab Content with Number Badge */}
                      <div className="relative z-10 flex items-center justify-center gap-1.5 truncate">
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            isActive ? "bg-[#315BFF] text-white" : badgeColor
                          }`}
                        >
                          {stage.stageNumber}
                        </span>
                        <span className="truncate">{stage.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* TIMELINE RULER TRACK BELOW TABS (Vibrant Gradient Progress & Scrubber) */}
              <div
                ref={rulerRef}
                onClick={handleRulerClick}
                className="relative mt-4 sm:mt-5 py-2 px-1 cursor-pointer group flex items-center justify-between"
                title="Click anywhere to scrub playback"
              >
                {/* 48 Evenly Spaced Vertical Tick Marks */}
                {Array.from({ length: TOTAL_TICKS }).map((_, idx) => {
                  const tickProgress = (idx / (TOTAL_TICKS - 1)) * 100;
                  const isPassed = progress >= tickProgress;

                  const isStageBreak =
                    idx === 0 ||
                    idx === Math.round(TOTAL_TICKS * 0.068) ||
                    idx === Math.round(TOTAL_TICKS * 0.315) ||
                    idx === Math.round(TOTAL_TICKS * 0.867);

                  return (
                    <div
                      key={idx}
                      className={`transition-colors duration-150 rounded-full ${
                        isStageBreak
                          ? isPassed
                            ? "w-[2px] h-3.5 sm:h-4 bg-[#315BFF] shadow-[0_0_8px_#315BFF]"
                            : "w-[2px] h-3.5 sm:h-4 bg-slate-400"
                          : isPassed
                          ? "w-[1px] h-2 sm:h-2.5 bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_4px_rgba(56,189,248,0.7)]"
                          : "w-[1px] h-2 sm:h-2.5 bg-slate-300 group-hover:bg-slate-400"
                      }`}
                    />
                  );
                })}

                {/* Animated Luminous Scrubber Needle Indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-[left] duration-75 ease-linear flex flex-col items-center"
                  style={{ left: `${Math.min(100, Math.max(0, progress))}%` }}
                >
                  <div className="w-[3px] h-5 sm:h-6 rounded-full bg-gradient-to-b from-cyan-300 to-[#315BFF] shadow-[0_0_12px_#38BDF8]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#315BFF] mt-0.5 blur-[0.5px]" />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM KPI STATS & ACTION CONVERSION BAR (Colorful Dashboard Stat Cards) */}
          <div className="relative z-10 max-w-4xl mx-auto mt-12 sm:mt-16 pt-8 border-t border-[#D5E1F8] flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* 3 Metric Stat Cards with Distinct Accent Colors */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
              {/* Metric 1: Royal Blue */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-blue-200/80 shadow-xs hover:shadow-md transition-all">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#1D4ED8] to-[#315BFF] bg-clip-text text-transparent tracking-tight">
                  10K+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-blue-700/80 mt-1">
                  CS Problems
                </span>
              </div>

              {/* Metric 2: Indigo / Violet */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-indigo-200/80 shadow-xs hover:shadow-md transition-all">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent tracking-tight">
                  70K+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-indigo-700/80 mt-1">
                  Study Hours
                </span>
              </div>

              {/* Metric 3: Emerald */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs hover:shadow-md transition-all">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#059669] to-[#10B981] bg-clip-text text-transparent tracking-tight">
                  05K+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-700/80 mt-1">
                  CS Scholars
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <Link
                href={courseTargetUrl}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#315BFF] hover:from-[#1E40AF] hover:to-[#2563EB] text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-blue-500/35 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Course Notes</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default KpiShowcase;
