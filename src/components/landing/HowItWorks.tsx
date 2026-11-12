"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowDownRight,
  Clock,
  GraduationCap,
  LayoutDashboard,
  Check,
  Play,
  X,
  Calendar,
  AlertCircle,
  Timer,
} from "lucide-react";

export function HowItWorks() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F8FAFC] scroll-mt-20 sm:scroll-mt-24 overflow-hidden select-none"
    >
      {/* Volumetric ambient background lighting matching the reference design */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[1000px] w-full max-w-7xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,rgba(99,102,241,0.05)_45%,transparent_70%)] blur-3xl"
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
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-14 sm:mb-20">
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

          {/* Reference Motion Showcase Trigger */}
          <div className="pt-2">
            <button
              onClick={() => setShowVideoModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-purple-300 hover:text-purple-700 cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
              </div>
              <span>Watch 3D Motion Showcase</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3-TIER MASTER SHOWCASE (PLACED DIRECTLY ONE ABOVE THE OTHER AS IN VIDEO)  */}
        {/* ========================================================================= */}
        <div className="relative mx-auto max-w-5xl rounded-[32px] sm:rounded-[40px] overflow-hidden border border-purple-500/25 shadow-[0_30px_90px_-20px_rgba(20,5,45,0.45)] divide-y divide-white/10 sm:divide-y-2">
          
          {/* ----------------------------------------------------------------------- */}
          {/* TIER 01: ROUTINE SYNCHRONIZATION (DARK COSMIC MIDNIGHT PURPLE)         */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative bg-gradient-to-r from-[#120427] via-[#1B083E] to-[#0A0218] p-6 sm:p-10 lg:p-14 overflow-hidden transition-all duration-500 hover:brightness-105">
            {/* Ambient specular highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition-all"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: FastTask Step 01 Copy & Actions */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5 text-white z-10">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                    <span>STEP 01 • ROUTINE SYNCHRONIZATION</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-400/80">
                    Phase 01
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-purple-200 transition-colors">
                  Define Semester &amp; Weekly Routine
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-purple-100/80 font-normal max-w-xl">
                  Configure your term start and end dates and upload your weekly course schedule. Today&apos;s sessions automatically illuminate with zero manual friction.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-purple-200 backdrop-blur-sm">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Spring 2026 Term</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-purple-200 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Smart Timetable Sync</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-purple-200 backdrop-blur-sm">
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Lab 402 Active Highlights</span>
                  </span>
                </div>

                {/* Link Action */}
                <div className="pt-2">
                  <Link
                    href="/schedule"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all group-hover:border-purple-400 cursor-pointer"
                  >
                    <span>Explore Routine Schedule</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: 3D Floating Phone Mockup from Video */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[380px] aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/how-it-works/tier1_clean.png"
                    alt="FastTask 3D Mobile Semester Routine"
                    width={400}
                    height={300}
                    className="object-contain w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] animate-float transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* TIER 02: DEADLINE VELOCITY RADAR (VIVID ELECTRIC ROYAL PURPLE)          */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative bg-gradient-to-r from-[#380E8C] via-[#4F17D1] to-[#2B0875] p-6 sm:p-10 lg:p-14 overflow-hidden transition-all duration-500 hover:brightness-105">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl group-hover:bg-fuchsia-500/30 transition-all"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: 3D Airplane Velocity Artwork from Video */}
              <div className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1">
                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/how-it-works/tier2_clean.png"
                    alt="FastTask Deadline Velocity Radar"
                    width={420}
                    height={315}
                    className="object-contain w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-float transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Column: FastTask Step 02 Copy & Actions */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5 text-white order-1 lg:order-2 z-10">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-400/20 border border-fuchsia-300/30 text-fuchsia-200 text-xs font-mono font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                    <span>STEP 02 • DEADLINE VELOCITY RADAR</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-fuchsia-300/80">
                    Phase 02
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-fuchsia-200 transition-colors">
                  Tag Coursework &amp; Exam Deadlines
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-purple-100/85 font-normal max-w-xl">
                  Log assignments, lab reports, and exam dates with color-coded course codes. Priority flags and velocity radar keep critical milestones front and center.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-fuchsia-200 backdrop-blur-sm">
                    <AlertCircle className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    <span>Priority Radar Flags</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-fuchsia-200 backdrop-blur-sm">
                    <GraduationCap className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    <span>0611CSE321 &amp; 0613CSE333</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-fuchsia-200 backdrop-blur-sm">
                    <Timer className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    <span>Live Due Countdowns</span>
                  </span>
                </div>

                {/* Link Action */}
                <div className="pt-2">
                  <Link
                    href="/kanban"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all group-hover:border-fuchsia-300 cursor-pointer"
                  >
                    <span>View Kanban Deadlines</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* TIER 03: STUDY TARGET & FLOW STATE (FROSTED LILAC & PEARL WHITE)        */}
          {/* ----------------------------------------------------------------------- */}
          <div className="group relative bg-gradient-to-r from-[#ECE5FA] via-[#F6F3FD] to-[#FFFFFF] p-6 sm:p-10 lg:p-14 overflow-hidden transition-all duration-500 hover:brightness-105">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl group-hover:bg-purple-300/40 transition-all"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: FastTask Step 03 Copy & Yellow Action Button */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5 text-slate-900 z-10">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200/90 text-purple-700 text-xs font-mono font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                    <span>STEP 03 • STUDY TARGET &amp; FLOW STATE</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    Phase 03
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight group-hover:text-purple-900 transition-colors">
                  Execute with Pomodoro Focus
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal max-w-xl">
                  Power through deep study blocks with the built-in 25-minute timer and drag finished tasks to Completed on your Kanban board.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
                    <Timer className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>25m Deep Work Cycles</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
                    <LayoutDashboard className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Kanban Board Sync</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Daily Streak Analytics</span>
                  </span>
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

              {/* Right Column: 3D Rotating Globe with Student Avatars from Video */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/how-it-works/tier3_clean.png"
                    alt="FastTask Global Student Study Target"
                    width={420}
                    height={315}
                    className="object-contain w-full h-full drop-shadow-[0_15px_30px_rgba(100,50,150,0.18)] animate-float transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL REFERENCE VIDEO MODAL (ACCESSIBLE ANYTIME FOR VERIFICATION)          */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in-up"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold">Alchemy Markets 3D Reference Motion</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative w-full aspect-[3/4] bg-black">
              <video
                src="/videos/alchemy_showcase.mp4"
                autoPlay
                controls
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default HowItWorks;
