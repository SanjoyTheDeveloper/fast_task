"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { useStudentProfile } from "@/lib/studentProfile";

export function GlitchReality() {
  const { profile } = useStudentProfile();
  const rawLinkedin = profile?.linkedin?.trim();
  const linkedinUrl = rawLinkedin
    ? (rawLinkedin.startsWith("http") ? rawLinkedin : `https://${rawLinkedin}`)
    : "https://www.linkedin.com";

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const targetUrl = isLoggedIn ? "/tasks" : "/login?from=/tasks";

  const [progressWidth, setProgressWidth] = useState(38);
  const [isGlitching, setIsGlitching] = useState(false);

  // Gentle animated progress bar pulsation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressWidth((prev) => (prev >= 94 ? 38 : prev + 14));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const triggerGlitchEffect = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    setProgressWidth((prev) => (prev > 80 ? 44 : prev + 16));
    setTimeout(() => setIsGlitching(false), 850);
  };

  return (
    <section
      id="glitch-reality"
      className="relative py-16 sm:py-24 lg:py-28 bg-[#F8FAFC] text-[#172033] overflow-hidden select-none"
    >
      {/* Soft ambient daylight glows consistent with dashboard & KPI showcase */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-indigo-300/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Professional Dashboard Styling */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">


          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#172033] leading-tight">
            Transcend Routine Distraction.{" "}
            <span className="text-[#315BFF] inline-block">
              Redefine Your Reality.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Step into a high-clarity academic workspace engineered for Computer Science scholars.
            Eliminate mental drag, synchronize coursework, and dissolve complex problem barriers.
          </p>
        </div>

        {/* ============================================================ */}
        {/* RECREATED POSTER DESIGN USING DASHBOARD PALETTE */}
        {/* ============================================================ */}
        <div className="relative mx-auto max-w-5xl rounded-3xl bg-white border border-[#E5EAF2] shadow-[-10px_20px_50px_-10px_rgba(15,23,42,0.1),0_25px_60px_-15px_rgba(49,91,255,0.08)] p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-300 hover:shadow-[-12px_24px_60px_-10px_rgba(15,23,42,0.14),0_30px_70px_-15px_rgba(49,91,255,0.12)]">
          
          {/* Subtle architectural grid pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_80%,transparent_100%)] opacity-70"
          />



          {/* Main 2-Column Content Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* LEFT COLUMN: The AI Prompt & Neural Studio Composition */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-7">
              
              {/* Big AI Futuristic Headline: GLITCH REALITY (Solid Colors) */}
              <div className="space-y-1.5">
                <div className="relative inline-block">
                  <h3
                    className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#172033] leading-none transition-all duration-300 ${
                      isGlitching ? "translate-x-1 text-[#315BFF]" : ""
                    }`}
                  >
                    GLITCH
                  </h3>
                </div>

                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.22em] text-[#315BFF] uppercase">
                  REALITY
                </div>
              </div>

              {/* AI Prompt Synthesizer Box (Solid White / Slate Background) */}
              <div className="rounded-2xl border border-[#E5EAF2] bg-white p-4 sm:p-4.5 shadow-2xs relative overflow-hidden group hover:border-[#315BFF]/50 transition-all duration-200">
                {/* Prompt Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#315BFF] text-white flex items-center justify-center shadow-xs">
                      <Terminal className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                      Prompt Synthesizer
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#315BFF] bg-[#EEF3FF] px-2.5 py-0.5 rounded-full border border-[#D0DFFF] font-bold">
                    DeepMatrix Focus
                  </span>
                </div>

                {/* Prompt Text with syntax styling */}
                <div className="font-mono text-xs sm:text-sm text-slate-800 leading-relaxed">
                  <span className="text-[#315BFF] font-bold">&gt; /generate_focus: </span>
                  <span className="text-slate-900 font-medium">
                    &ldquo;Not everything you see is real &bull; dissolve academic friction, amplify deep synthesis.&rdquo;
                  </span>
                  <span className="inline-block w-2 h-4 ml-1 bg-[#315BFF] animate-pulse align-middle" />
                </div>

                {/* Micro-tags Footer */}
                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-[#315BFF] font-semibold">
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                    <span>Prompt Ready</span>
                  </span>
                  <span>&bull;</span>
                  <span>Latency: 18ms</span>
                  <span>&bull;</span>
                  <span className="text-emerald-600 font-semibold">Zero Distraction</span>
                </div>
              </div>

              {/* Neural Loading Stream Progress (Solid Blue Bar) */}
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#315BFF] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#315BFF]" />
                    </span>
                    <span className="font-bold text-slate-700 uppercase">
                      Neural Focus Stream
                    </span>
                  </div>
                  <span className="text-[#315BFF] font-bold font-mono">
                    {progressWidth}% Synchronized
                  </span>
                </div>

                {/* Solid blue progress bar */}
                <div className="relative h-2.5 w-full rounded-full bg-slate-100 border border-slate-200/80 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-[#315BFF] transition-all duration-700 ease-out"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              {/* Interactive CTA buttons: Visit LinkedIn Profile */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white text-sm font-bold tracking-wide shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>Visit LinkedIn Profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: The Artwork in a Clean Professional Dashboard Viewport */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              {/* Frame Container for Artwork */}
              <div
                onClick={triggerGlitchEffect}
                className="group relative w-full max-w-[460px] aspect-[16/11] rounded-2xl bg-slate-900 border border-[#CBD5E1] shadow-[-8px_16px_36px_-6px_rgba(15,23,42,0.18),0_20px_45px_-8px_rgba(49,91,255,0.12)] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.015]"
              >
                {/* Artwork Image */}
                <Image
                  src="/images/glitch-reality.jpg"
                  alt="Glitch Reality Artwork"
                  fill
                  className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                    isGlitching ? "filter contrast-150 brightness-110" : ""
                  }`}
                  sizes="(max-width: 640px) 100vw, 460px"
                  priority
                />

                {/* Subtle dark vignette to blend edges cleanly */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
                />

                {/* Live session pill on top left */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E5EAF2] text-[10px] font-mono font-bold text-[#172033] shadow-xs flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#315BFF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#315BFF]" />
                  </span>
                  <span>DEEP MATRIX // LIVE</span>
                </div>

                {/* Bottom interactive floating label */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5 shadow-md">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>SYNC: 100% FOCUS</span>
                </div>
              </div>

              {/* Floating Dashboard Quick Badge: Study Streak */}
              <div className="absolute -bottom-4 -left-2 sm:left-4 z-20 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#D0DFFF] shadow-md shadow-blue-500/10 flex items-center gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-lg bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <div className="font-bold text-[#172033] text-[11px] leading-tight">
                    Flow State Active
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Zero distractions
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* 3 PROFESSIONAL DASHBOARD CARDS BELOW THE POSTER */}
        {/* ============================================================ */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Feature 1 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs hover:border-[#315BFF]/50 hover:shadow-md transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] border border-[#D0DFFF] text-[#315BFF] flex items-center justify-center mb-3.5">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#172033] mb-1.5">
              Deep Cognitive Immersion
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Structured 25-minute Pomodoro study intervals with clear rest cues for hard CS problem-solving.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs hover:border-[#315BFF]/50 hover:shadow-md transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-3.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#172033] mb-1.5">
              Zero Noise Architecture
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Eliminates mental clutter by surfacing active syllabus topics, venue rooms, and lab deadlines first.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAF2] shadow-xs hover:border-[#315BFF]/50 hover:shadow-md transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#172033] mb-1.5">
              Verified Course Notes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Direct access to curated semester materials for CS 102, 201, 202, and 301 revision decks.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default GlitchReality;
