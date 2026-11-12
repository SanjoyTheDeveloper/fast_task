"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Clock,
  GraduationCap,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";

export function HowItWorks() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Autoplay all 3 live 1080p video loops smoothly and silently
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.defaultMuted = true;
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F8FAFC] scroll-mt-20 sm:scroll-mt-24 overflow-hidden select-none"
    >
      {/* Volumetric ambient background lighting matching FastTask Royal Blue website palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[1000px] w-full max-w-7xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.14)_0%,rgba(99,102,241,0.07)_45%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 right-12 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-12 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Clean Balanced Typography */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
              3-Step Academic Workflow
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#172033] leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#315BFF] bg-clip-text text-transparent inline-block">
              FastTask
            </span>{" "}
            Works
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal max-w-xl mx-auto">
            From chaotic semester syllabus to a calm, organized daily study flow.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3-TIER MASTER SHOWCASE: PLACED DIRECTLY ONE ABOVE THE OTHER               */}
        {/* ========================================================================= */}
        <div className="relative mx-auto max-w-5xl rounded-[32px] sm:rounded-[40px] overflow-hidden border border-blue-500/25 shadow-[0_30px_90px_-20px_rgba(2,13,35,0.45)] divide-y divide-white/10 sm:divide-y-2">
          
          {/* ----------------------------------------------------------------------- */}
          {/* TIER 01: ROUTINE SYNCHRONIZATION (1080p PHONE MOTION LOOP - MIDNIGHT NAVY) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative w-full aspect-auto sm:aspect-[2.25/1] min-h-[320px] sm:min-h-[380px] overflow-hidden bg-[#020d23]">
            {/* Dedicated 1080p 50fps Tier Video */}
            <video
              ref={(el) => {
                videoRefs.current[0] = el;
              }}
              src="/videos/tier_01_phone_1080p.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* High-Res 1080p Poster Fallback Image */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/images/how-it-works/tier1_clean_1080p.png"
                alt="Define Semester & Weekly Routine (1080p)"
                fill
                className="object-cover object-right"
                priority
              />
            </div>

            {/* Ambient Dark Navy Gradient Shield on the Left (Opaque to prevent any background bleed) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020d23] via-[#020d23] via-50% sm:via-55% to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020d23]/90 via-transparent to-transparent sm:hidden" />

            {/* Specular Top Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Tier 01 Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-2xl text-white">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between w-full max-w-lg">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#60A5FA]">
                  01
                </span>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Clock className="w-5 h-5 text-[#60A5FA]" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4 my-auto py-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-blue-100 transition-colors drop-shadow-md">
                  Define Semester &amp; Weekly Routine
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-blue-100/90 font-normal max-w-lg drop-shadow-sm">
                  Configure your term start and end dates and upload your weekly course schedule. Today&apos;s sessions automatically illuminate.
                </p>
              </div>

              {/* Clean Footer Status Indicator matching reference */}
              <div className="flex items-center justify-between max-w-lg pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#60A5FA]" />
                  <span>Step 1 of 3</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-slate-200">
                  Routine Sync
                </span>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* TIER 02: DEADLINE VELOCITY RADAR (1080p AIRPLANE MOTION LOOP - COBALT BLUE) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative w-full aspect-auto sm:aspect-[2.25/1] min-h-[320px] sm:min-h-[380px] overflow-hidden bg-[#002d7e]">
            {/* Dedicated 1080p 50fps Tier Video */}
            <video
              ref={(el) => {
                videoRefs.current[1] = el;
              }}
              src="/videos/tier_02_velocity_1080p.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* High-Res 1080p Poster Fallback */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/images/how-it-works/tier2_clean_1080p.png"
                alt="Tag Coursework & Exam Deadlines (1080p)"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Ambient Cobalt Blue Gradient Shield on the Left (Opaque to prevent any background bleed) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#002d7e] via-[#002d7e] via-50% sm:via-55% to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#002d7e]/90 via-transparent to-transparent sm:hidden" />

            {/* Specular Divider */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* Tier 02 Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-2xl text-white">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between w-full max-w-lg">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#FB923C]">
                  02
                </span>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <GraduationCap className="w-5 h-5 text-[#FB923C]" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4 my-auto py-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-amber-100 transition-colors drop-shadow-md">
                  Tag Coursework &amp; Exam Deadlines
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-blue-100/90 font-normal max-w-lg drop-shadow-sm">
                  Log assignments, lab reports, and exam dates with color-coded course codes. Priority flags keep critical milestones front and center.
                </p>
              </div>

              {/* Clean Footer Status Indicator matching reference */}
              <div className="flex items-center justify-between max-w-lg pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FB923C]" />
                  <span>Step 2 of 3</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-slate-200">
                  Deadline Radar
                </span>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* TIER 03: STUDY TARGET & FLOW STATE (1080p GLOBE MOTION LOOP - ICE BLUE) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative w-full aspect-auto sm:aspect-[2.25/1] min-h-[320px] sm:min-h-[380px] overflow-hidden bg-[#e2eaf5]">
            {/* Dedicated 1080p 50fps Tier Video */}
            <video
              ref={(el) => {
                videoRefs.current[2] = el;
              }}
              src="/videos/tier_03_globe_1080p.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* High-Res 1080p Poster Fallback */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/images/how-it-works/tier3_clean_1080p.png"
                alt="Execute with Pomodoro Focus (1080p)"
                fill
                className="object-cover object-right"
              />
            </div>

            {/* Soft Frosted Ice Blue Gradient Shield on the Left (Opaque to prevent any background bleed) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#e2eaf5] via-[#e2eaf5] via-50% sm:via-55% to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#e2eaf5]/95 via-transparent to-transparent sm:hidden" />

            {/* Specular Divider */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

            {/* Tier 03 Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-2xl text-slate-900">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between w-full max-w-lg">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#0D9488]">
                  03
                </span>
                <div className="w-10 h-10 rounded-full bg-blue-100/90 backdrop-blur-md border border-blue-200 flex items-center justify-center shadow-inner">
                  <LayoutDashboard className="w-5 h-5 text-[#0D9488]" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4 my-auto py-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight group-hover:text-blue-900 transition-colors drop-shadow-xs">
                  Execute with Pomodoro Focus
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal max-w-lg">
                  Power through deep study blocks with the built-in 25-minute timer and drag finished tasks to Completed on your Kanban board.
                </p>
              </div>

              {/* Clean Footer Status Indicator matching reference */}
              <div className="flex items-center justify-between max-w-lg pt-3 border-t border-blue-200/80">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                  <span>Step 3 of 3</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200 text-[11px] font-semibold text-slate-700">
                  Study Target
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
