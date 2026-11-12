"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Sparkles, Volume2, VolumeX, CheckCircle2, ArrowDownRight, Clock, GraduationCap, LayoutDashboard } from "lucide-react";

export function HowItWorks() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTier, setActiveTier] = useState<number | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const stepDetails = [
    {
      number: "01",
      tier: "TOP TIER",
      title: "Define Semester & Weekly Routine",
      description: "Upload your weekly course timetable. Today's lectures illuminate automatically.",
      badge: "Routine Sync",
      icon: Clock,
      color: "#8B5CF6",
    },
    {
      number: "02",
      tier: "MIDDLE TIER",
      title: "Tag Coursework & Exam Deadlines",
      description: "Color-coded course codes and priority velocity radar keep milestones front and center.",
      badge: "Deadline Radar",
      icon: GraduationCap,
      color: "#A855F7",
    },
    {
      number: "03",
      tier: "BOTTOM TIER",
      title: "Execute with Pomodoro Focus",
      description: "Power through 25-minute deep work intervals and drag finished tasks to Completed.",
      badge: "Study Target",
      icon: LayoutDashboard,
      color: "#C084FC",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F8FAFC] scroll-mt-20 sm:scroll-mt-24 overflow-hidden select-none"
    >
      {/* Volumetric ambient glow matching the rich 3D video lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[950px] w-full max-w-6xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.14)_0%,rgba(99,102,241,0.06)_45%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/4 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 right-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Clean Balanced Typography */}
        <div className="mx-auto max-w-2xl text-center space-y-3.5 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 border border-purple-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-purple-700 uppercase">
              Platform Workflow Engine
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#172033] leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#315BFF] bg-clip-text text-transparent inline-block">
              FastTask
            </span>{" "}
            Works
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal max-w-lg mx-auto">
            From chaotic semester syllabus to a calm, organized daily study flow.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* THE 3-TIER MASTER SHOWCASE (STACKED ONE ABOVE THE OTHER EXACTLY AS IN VIDEO) */}
        {/* ========================================================================= */}
        <div className="relative mx-auto w-full max-w-[620px] sm:max-w-[680px] lg:max-w-[720px]">
          
          {/* Outer Ambient Glow Ring */}
          <div className="absolute -inset-1.5 rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-purple-500/30 via-indigo-500/20 to-purple-600/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

          {/* Master 3-Tier Frame matching the 720x960 Aspect Ratio from the Video */}
          <div
            onClick={togglePlay}
            className="group relative w-full aspect-[720/960] rounded-[32px] sm:rounded-[40px] bg-[#0A0218] border-2 border-purple-500/30 shadow-[0_25px_80px_-15px_rgba(109,40,217,0.5),0_0_0_1px_rgba(255,255,255,0.08)_inset] overflow-hidden cursor-pointer"
          >
            {/* 1. High-Resolution Fallback Poster */}
            <Image
              src="/images/how-it-works/showcase_full_poster.jpg"
              alt="FastTask 3-Tier Workflow Architecture"
              fill
              className="object-cover object-center pointer-events-none -z-10"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />

            {/* 2. Full 3-Tier 3D Motion Video Loop */}
            <video
              ref={videoRef}
              src="/videos/alchemy_showcase.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            />

            {/* Subtle Specular Top Reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* ---------------- INTERACTIVE OVERLAY LABELS ON EACH TIER ---------------- */}

            {/* TIER 1: TOP (0% to 33.3%) - Phone & Extranet */}
            <div
              onMouseEnter={() => setActiveTier(1)}
              onMouseLeave={() => setActiveTier(null)}
              className="absolute top-0 inset-x-0 h-[33.33%] pointer-events-auto flex items-start justify-between p-4 sm:p-6 transition-all duration-300 hover:bg-purple-950/20"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs font-mono font-black text-white shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>01 • ROUTINE SYNC</span>
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white shadow-sm">
                Define Semester
              </div>
            </div>

            {/* TIER 2: MIDDLE (33.3% to 66.6%) - Transport & Skewed Cards */}
            <div
              onMouseEnter={() => setActiveTier(2)}
              onMouseLeave={() => setActiveTier(null)}
              className="absolute top-[33.33%] inset-x-0 h-[33.33%] pointer-events-auto flex items-start justify-between p-4 sm:p-6 transition-all duration-300 hover:bg-fuchsia-950/20"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs font-mono font-black text-white shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
                  <span>02 • DEADLINE RADAR</span>
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white shadow-sm">
                Tag Milestones
              </div>
            </div>

            {/* TIER 3: BOTTOM (66.6% to 100%) - Globe, Avatars & Metrics */}
            <div
              onMouseEnter={() => setActiveTier(3)}
              onMouseLeave={() => setActiveTier(null)}
              className="absolute bottom-0 inset-x-0 h-[33.33%] pointer-events-auto flex items-end justify-between p-4 sm:p-6 transition-all duration-300 hover:bg-violet-950/20"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs font-mono font-black text-white shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                  <span>03 • STUDY TARGET</span>
                </span>
              </div>

              {/* The Signature Yellow Arrow Action Pill from the video */}
              <div className="w-10 h-10 rounded-full bg-[#FACC15] text-slate-900 flex items-center justify-center font-black shadow-lg shadow-amber-400/35 transition-transform duration-300 group-hover:scale-110">
                <ArrowDownRight className="w-5 h-5 stroke-[3]" />
              </div>
            </div>

            {/* ---------------- CENTER PLAY/PAUSE OVERLAY BUTTON (MATCHING THE SCREENSHOT) ---------------- */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/30 backdrop-blur-md border-2 border-white/60 shadow-2xl flex items-center justify-center text-white transition-all duration-300 transform group-hover:scale-110 ${
                  !isPlaying ? "scale-100 opacity-100" : "opacity-0 group-hover:opacity-90"
                }`}
              >
                {!isPlaying ? (
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                ) : (
                  <Pause className="w-8 h-8 fill-white" />
                )}
              </div>
            </div>

            {/* Audio Toggle in bottom corner */}
            <button
              type="button"
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white flex items-center justify-center shadow-md transition-all hover:scale-110"
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3 ACADEMIC STEP CARDS BELOW SHOWCASE (CLEAR & BALANCED)                   */}
        {/* ========================================================================= */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {stepDetails.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeTier === idx + 1;

            return (
              <div
                key={step.number}
                onMouseEnter={() => setActiveTier(idx + 1)}
                onMouseLeave={() => setActiveTier(null)}
                className={`group rounded-2xl p-5 sm:p-6 transition-all duration-300 border ${
                  isHovered
                    ? "bg-white border-purple-400 shadow-xl shadow-purple-500/10 -translate-y-1"
                    : "bg-white/95 border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-black text-slate-900 tracking-tight">
                      {step.number}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {step.tier}
                    </span>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-2xs">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.description}
                </p>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5 text-purple-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{step.badge}</span>
                  </div>
                  <span className="text-slate-400">Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
