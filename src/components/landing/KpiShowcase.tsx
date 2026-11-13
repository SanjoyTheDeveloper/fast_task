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
        {/* Main Stage Canvas Card - Replicating Video Design with FastTask Royal Blue & Midnight Ocean */}
        <div className="relative rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-[#020B1C] border border-blue-500/30 shadow-[0_30px_90px_-20px_rgba(2,13,35,0.6),0_0_60px_rgba(49,91,255,0.25)] overflow-hidden pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-8 lg:px-12 text-white">
          
          {/* Top Subtle Royal Blue Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.30),rgba(59,130,246,0.12),transparent_70%)] blur-[90px]"
          />

          {/* THE SIGNATURE VIBRANT COLOR OCEAN AT BOTTOM (Exact replication of video design with FastTask Royal Blue & Electric Cyan) */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-[#1D4ED8] via-[#315BFF]/80 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[1100px] h-[420px] bg-[radial-gradient(ellipse_at_center,#00D2FF_0%,#315BFF_45%,transparent_75%)] opacity-90 blur-[75px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-12 w-80 h-80 bg-[#00D2FF]/40 blur-[60px] rounded-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 right-12 w-80 h-80 bg-[#6366F1]/45 blur-[60px] rounded-full"
          />

          {/* TOP HEADER: Sleek Brand Mark & Typography */}
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/35 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping" />
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase text-blue-200">
                INTERACTIVE PLATFORM TOUR • ACADEMIC WORKSPACE
              </span>
            </div>

            {/* Headline with High-Impact Cyan & Royal Blue Accents */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Master{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#00D2FF] to-[#38BDF8]">
                CS 102, 201
              </span>
              <br />
              CS 202 &amp; 301 with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] via-[#60A5FA] to-[#00D2FF]">
                Deep Study Flow
              </span>
            </h2>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-blue-100/80 max-w-xl mx-auto leading-relaxed font-normal">
              Explore the 4-stage academic OS: configure routines, radar deadlines,
              power through Pomodoro focus blocks, and lock in continuous semester mastery.
            </p>
          </div>

          {/* CENTER DISPLAY SCREEN: Large Rounded Card with Inner Stage Video */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Stage Display Frame with Neon Rim & Elevation */}
            <div
              className="group relative rounded-[22px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden border border-blue-400/40 bg-[#020A18] shadow-[0_25px_80px_rgba(49,91,255,0.4),0_0_40px_rgba(0,210,255,0.25)] aspect-[16/9] sm:aspect-[470/266] flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
              onClick={togglePlayPause}
            >
              {/* Shimmering Top Rim Light */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent z-20"
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
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#020A18]/85 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-semibold text-white shadow-md pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
                <span>{currentStage.badge}</span>
              </div>

              {/* Video Overlay: Top Right Timestamp */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#020A18]/85 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono font-bold text-cyan-200 pointer-events-none shadow-md">
                <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>{formatTime(currentTime)} / 00:44</span>
              </div>

              {/* Floating Play / Pause Overlay on Hover or Pause */}
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                  !isPlaying ? "opacity-100 bg-black/40 backdrop-blur-[2px]" : isHoveringVideo ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-[#0F172A] flex items-center justify-center shadow-2xl shadow-black/60 backdrop-blur-md transition-transform duration-200 group-hover:scale-105">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-[#0F172A]" />
                  ) : (
                    <Play className="w-6 h-6 fill-[#0F172A] ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM INTERACTIVE TAB BAR: Matching Reference Video Design (Solid White Inactive + Jet Black Active with Neon Beam) */}
            <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                {STAGES.map((stage) => {
                  const isActive = activeTab === stage.id;

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleTabClick(stage.id)}
                      className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer overflow-hidden text-center active:scale-95 ${
                        isActive
                          ? "bg-[#000000] text-white shadow-2xl ring-1 ring-white/25"
                          : "bg-white hover:bg-slate-50 text-[#0F172A] shadow-xl shadow-black/25 hover:scale-[1.02]"
                      }`}
                    >
                      {/* Active State Glowing Vertical Light Beam (Electric Cyan & Royal Blue) */}
                      {isActive && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute right-3 sm:right-4 top-0 bottom-0 w-6 flex items-center justify-center overflow-visible"
                        >
                          {/* Diffused Outer Neon Bloom */}
                          <div className="absolute inset-y-0 w-6 bg-gradient-to-t from-blue-600/0 via-[#00D2FF]/95 to-cyan-400/0 blur-[5px] animate-pulse" />
                          {/* Mid Glow Column */}
                          <div className="absolute inset-y-0 w-3 bg-gradient-to-t from-transparent via-cyan-200 to-transparent blur-[1.5px]" />
                          {/* Sharp Center Light Beam */}
                          <div className="absolute inset-y-0 w-[2px] bg-gradient-to-t from-transparent via-white to-transparent shadow-[0_0_10px_#00D2FF]" />
                          {/* Top & Bottom Flare Sparks */}
                          <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-white blur-[0.5px] shadow-[0_0_10px_#00D2FF]" />
                          <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-[#315BFF] blur-[1px]" />
                        </div>
                      )}

                      {/* Tab Title */}
                      <span className="relative z-10 block truncate">
                        {stage.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* TIMELINE RULER TRACK BELOW TABS (Clean High-Contrast Luminous Ruler) */}
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
                            ? "w-[2px] h-3.5 sm:h-4.5 bg-white shadow-[0_0_10px_#00D2FF]"
                            : "w-[2px] h-3.5 sm:h-4.5 bg-white/60"
                          : isPassed
                          ? "w-[1.5px] h-2 sm:h-2.5 bg-white shadow-[0_0_6px_#00D2FF]"
                          : "w-[1px] h-2 sm:h-2.5 bg-white/40 group-hover:bg-white/60"
                      }`}
                    />
                  );
                })}

                {/* Animated Luminous Scrubber Needle Indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-[left] duration-75 ease-linear flex flex-col items-center"
                  style={{ left: `${Math.min(100, Math.max(0, progress))}%` }}
                >
                  <div className="w-[3px] h-6 sm:h-7 rounded-full bg-white shadow-[0_0_12px_#00D2FF,0_0_6px_#38BDF8]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] mt-0.5 blur-[0.5px]" />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM KPI STATS & ACTION CONVERSION BAR */}
          <div className="relative z-10 max-w-4xl mx-auto mt-12 sm:mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* 3 Metric Counters in Luminous White & Cyan */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center sm:text-left w-full sm:w-auto">
              <div>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                  10K+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-200/90 mt-1">
                  CS Problems Solved
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                  70K+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-200/90 mt-1">
                  Study Hours
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                  05K+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-200/90 mt-1">
                  CS Scholars
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <Link
                href={courseTargetUrl}
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white border-2 border-white/20 text-xs sm:text-sm font-bold tracking-wide shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
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
