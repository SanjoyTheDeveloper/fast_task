"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowDownRight,
  Clock,
  GraduationCap,
  Calendar,
  AlertCircle,
  Timer,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

export function HowItWorks() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Synchronize and autoplay all 3 live video tiers seamlessly
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.defaultMuted = true;
        video.muted = true;
        video.play().catch(() => {
          // Autoplay policy handled gracefully
          setIsPlaying(false);
        });
      }
    });
  }, []);

  const toggleAllPlay = () => {
    const nextState = !isPlaying;
    videoRefs.current.forEach((video) => {
      if (video) {
        if (nextState) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
    setIsPlaying(nextState);
  };

  const toggleAllMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMute = !isMuted;
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = nextMute;
      }
    });
    setIsMuted(nextMute);
  };

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F8FAFC] scroll-mt-20 sm:scroll-mt-24 overflow-hidden select-none"
    >
      {/* Volumetric ambient background lighting matching the reference design */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[1000px] w-full max-w-7xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.14)_0%,rgba(99,102,241,0.06)_45%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 right-12 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-12 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Clean Balanced Typography */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 border border-purple-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-purple-700 uppercase">
              3-Step Academic Workflow
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#172033] leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#315BFF] bg-clip-text text-transparent inline-block">
              FastTask
            </span>{" "}
            Works
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal max-w-xl mx-auto">
            From chaotic semester syllabus to a calm, organized daily study flow.
          </p>

          {/* Sync Video Controls Pill */}
          <div className="pt-1 flex items-center justify-center gap-3">
            <button
              onClick={toggleAllPlay}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-purple-300 hover:text-purple-700 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                  <span>Pause Motion Loops</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                  <span>Play 50fps Motion</span>
                </>
              )}
            </button>

            <button
              onClick={toggleAllMute}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs transition-all hover:border-purple-300 hover:text-purple-700 cursor-pointer"
              title={isMuted ? "Audio Muted" : "Audio Active"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-purple-600" />}
              <span>{isMuted ? "Muted" : "Sound"}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3-TIER MASTER SHOWCASE: PLACED DIRECTLY ONE ABOVE THE OTHER IN SYNC       */}
        {/* MATCHES THE EXACT 3 HORIZONTAL TIERS OF THE REFERENCE VIDEO               */}
        {/* ========================================================================= */}
        <div className="relative mx-auto max-w-5xl rounded-[32px] sm:rounded-[40px] overflow-hidden border border-purple-500/25 shadow-[0_30px_90px_-20px_rgba(20,5,45,0.45)] divide-y divide-white/10 sm:divide-y-2">
          
          {/* ----------------------------------------------------------------------- */}
          {/* TIER 01: ROUTINE SYNCHRONIZATION (TOP TIER • 3D PHONE MOTION LOOP)     */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative w-full aspect-auto sm:aspect-[2.25/1] min-h-[360px] sm:min-h-[400px] overflow-hidden bg-[#120427]">
            {/* Live 50fps 3D Video Layer (Top 33.33% of Video) */}
            <video
              ref={(el) => {
                videoRefs.current[0] = el;
              }}
              src="/videos/alchemy_showcase.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute left-0 w-full h-[300%] max-w-none object-cover pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ top: "0%" }}
            />

            {/* Poster fallback image for instant zero-latency paint */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/images/how-it-works/tier1_clean.png"
                alt="Define Semester & Weekly Routine"
                fill
                className="object-cover object-right"
                priority
              />
            </div>

            {/* Ambient Dark Gradient Shield on the Left (Masks foreign text & hosts FastTask copy) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#120427] via-[#120427]/95 via-45% sm:via-50% to-transparent sm:to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120427]/90 via-transparent to-transparent sm:hidden" />

            {/* Specular Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Tier 01 Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-2xl text-white">
              
              {/* Header Badges */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/25 border border-purple-400/40 text-purple-200 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  <span>STEP 01 • ROUTINE SYNCHRONIZATION</span>
                </div>
                <span className="font-mono text-xs font-bold text-purple-400/80">
                  Phase 01
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4 my-auto py-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-purple-200 transition-colors drop-shadow-md">
                  Define Semester &amp; Weekly Routine
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-purple-100/90 font-normal max-w-lg drop-shadow-sm">
                  Configure your term start and end dates and upload your weekly course schedule. Today&apos;s sessions automatically illuminate with zero manual friction.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/15 text-xs font-medium text-purple-200 backdrop-blur-md">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Spring 2026 Term</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/15 text-xs font-medium text-purple-200 backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Smart Timetable Sync</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/15 text-xs font-medium text-purple-200 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Lab 402 Active Highlights</span>
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2">
                <Link
                  href="/schedule"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all group-hover:border-purple-400 backdrop-blur-md cursor-pointer"
                >
                  <span>Explore Routine Schedule</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* TIER 02: DEADLINE VELOCITY RADAR (MIDDLE TIER • 3D AIRPLANE MOTION LOOP)*/}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative w-full aspect-auto sm:aspect-[2.25/1] min-h-[360px] sm:min-h-[400px] overflow-hidden bg-[#380E8C]">
            {/* Live 50fps 3D Video Layer (Middle 33.33% of Video) */}
            <video
              ref={(el) => {
                videoRefs.current[1] = el;
              }}
              src="/videos/alchemy_showcase.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute left-0 w-full h-[300%] max-w-none object-cover pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ top: "-100%" }}
            />

            {/* Poster fallback image */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/images/how-it-works/tier2_clean.png"
                alt="Tag Coursework & Exam Deadlines"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Ambient Electric Violet Gradient Shield on the Left */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2F0B7A] via-[#380E8C]/95 via-45% sm:via-52% to-transparent sm:to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2F0B7A]/90 via-transparent to-transparent sm:hidden" />

            {/* Specular Divider */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* Tier 02 Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-2xl text-white">
              
              {/* Header Badges */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-400/25 border border-fuchsia-300/40 text-fuchsia-100 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                  <span>STEP 02 • DEADLINE VELOCITY RADAR</span>
                </div>
                <span className="font-mono text-xs font-bold text-fuchsia-300/80">
                  Phase 02
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4 my-auto py-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-fuchsia-200 transition-colors drop-shadow-md">
                  Tag Coursework &amp; Exam Deadlines
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-purple-100/90 font-normal max-w-lg drop-shadow-sm">
                  Log assignments, lab reports, and exam dates with color-coded course codes. Priority flags and velocity radar keep critical milestones front and center.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/15 text-xs font-medium text-fuchsia-200 backdrop-blur-md">
                    <AlertCircle className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    <span>Priority Radar Flags</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/15 text-xs font-medium text-fuchsia-200 backdrop-blur-md">
                    <GraduationCap className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    <span>0611CSE321 &amp; 0613CSE333</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/15 text-xs font-medium text-fuchsia-200 backdrop-blur-md">
                    <Timer className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    <span>Live Due Countdowns</span>
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2">
                <Link
                  href="/kanban"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all group-hover:border-fuchsia-300 backdrop-blur-md cursor-pointer"
                >
                  <span>View Kanban Deadlines</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* TIER 03: STUDY TARGET & FLOW STATE (BOTTOM TIER • 3D GLOBE MOTION LOOP) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative w-full aspect-auto sm:aspect-[2.25/1] min-h-[360px] sm:min-h-[400px] overflow-hidden bg-[#ECE5FA]">
            {/* Live 50fps 3D Video Layer (Bottom 33.33% of Video) */}
            <video
              ref={(el) => {
                videoRefs.current[2] = el;
              }}
              src="/videos/alchemy_showcase.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute left-0 w-full h-[300%] max-w-none object-cover pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ top: "-200%" }}
            />

            {/* Poster fallback image */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/images/how-it-works/tier3_clean.png"
                alt="Execute with Pomodoro Focus"
                fill
                className="object-cover object-right"
              />
            </div>

            {/* Soft Frosted Lavender Gradient Shield on the Left */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#ECE5FA] via-[#ECE5FA]/95 via-45% sm:via-52% to-transparent sm:to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#ECE5FA]/95 via-transparent to-transparent sm:hidden" />

            {/* Specular Divider */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />

            {/* Tier 03 Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-2xl text-slate-900">
              
              {/* Header Badges */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-200/80 border border-purple-300 text-purple-800 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                  <span>STEP 03 • STUDY TARGET &amp; FLOW STATE</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600">
                  Phase 03
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4 my-auto py-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight group-hover:text-purple-900 transition-colors drop-shadow-xs">
                  Execute with Pomodoro Focus
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal max-w-lg">
                  Power through deep study blocks with the built-in 25-minute timer and drag finished tasks to Completed on your Kanban board.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/70 border border-purple-200 text-xs font-medium text-purple-900 shadow-2xs backdrop-blur-sm">
                    <Timer className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>25m Deep Work Cycles</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/70 border border-purple-200 text-xs font-medium text-purple-900 shadow-2xs backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Kanban Board Sync</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/70 border border-purple-200 text-xs font-medium text-purple-900 shadow-2xs backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Daily Streak Analytics</span>
                  </span>
                </div>
              </div>

              {/* The Signature Yellow Arrow Action Pill from the Video */}
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group/cta inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-purple-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Launch Study Dashboard</span>
                  {/* The signature yellow circle with arrow from the video */}
                  <div className="w-7 h-7 rounded-full bg-[#FACC15] text-slate-900 flex items-center justify-center font-black shadow-sm transition-transform duration-300 group-hover/cta:rotate-45 group-hover/cta:scale-110">
                    <ArrowDownRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
