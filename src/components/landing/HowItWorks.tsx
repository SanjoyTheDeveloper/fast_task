"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  GraduationCap,
  LayoutDashboard,
  ArrowDownRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  Timer,
  Check,
} from "lucide-react";

export interface StepItem {
  number: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  videoPosition: string; // "0%", "-100%", "-200%"
  posterImage: string;
  chips: string[];
  gradientBg: string;
  borderGlow: string;
  badgeStyle: string;
  statusText: string;
  hasYellowButton?: boolean;
}

const steps: StepItem[] = [
  {
    number: "01",
    badge: "ROUTINE SYNCHRONIZATION",
    title: "Define Semester & Weekly Routine",
    description:
      "Configure your term start and end dates and upload your weekly course schedule. Today's sessions automatically illuminate with zero manual friction.",
    icon: Clock,
    videoPosition: "0%",
    posterImage: "/images/how-it-works/step_01_phone_3d.png",
    chips: ["Spring 2026 Term", "4 Core CS Routine Slots", "Smart Lab 402 Highlights"],
    gradientBg: "from-[#160733] via-[#100326] to-[#0A0218]",
    borderGlow: "hover:border-purple-500/60 hover:shadow-[0_25px_60px_-15px_rgba(139,92,246,0.35)]",
    badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    statusText: "Automated Routine Sync • Active",
  },
  {
    number: "02",
    badge: "DEADLINE VELOCITY RADAR",
    title: "Tag Coursework & Exam Deadlines",
    description:
      "Log assignments, lab reports, and exam dates with color-coded course codes. Priority flags and velocity radar keep critical milestones front and center.",
    icon: GraduationCap,
    videoPosition: "-100%",
    posterImage: "/images/how-it-works/step_02_plane_3d.png",
    chips: ["Priority Radar Flags", "0611CSE321 & 0613CSE333", "Live Due Countdowns"],
    gradientBg: "from-[#200A4A] via-[#150533] to-[#0B021D]",
    borderGlow: "hover:border-fuchsia-500/60 hover:shadow-[0_25px_60px_-15px_rgba(168,85,247,0.35)]",
    badgeStyle: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30",
    statusText: "Velocity Radar • 11 Active Tasks",
  },
  {
    number: "03",
    badge: "STUDY TARGET & FLOW STATE",
    title: "Execute with Pomodoro Focus",
    description:
      "Power through deep study blocks with the built-in 25-minute timer and drag finished tasks to Completed on your Kanban board.",
    icon: LayoutDashboard,
    videoPosition: "-200%",
    posterImage: "/images/how-it-works/step_03_globe_avatars.png",
    chips: ["25m Pomodoro Cycles", "Drag & Drop Kanban", "Flow State Analytics"],
    gradientBg: "from-[#270D56] via-[#180738] to-[#0D0221]",
    borderGlow: "hover:border-violet-400/70 hover:shadow-[0_25px_60px_-15px_rgba(192,132,252,0.4)]",
    badgeStyle: "bg-violet-500/20 text-violet-200 border-violet-400/30",
    statusText: "Peak Flow State • 100% Focused",
    hasYellowButton: true,
  },
];

export function HowItWorks() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Ensure all 3 synchronized video viewports play seamlessly
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {
          // Handled via muted autoplay
        });
      }
    });
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F8FAFC] scroll-mt-20 sm:scroll-mt-24 overflow-hidden select-none"
    >
      {/* Ambient background volumetric violet & indigo glows matching the 3D video mood */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[900px] w-full max-w-7xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,rgba(99,102,241,0.06)_40%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 right-10 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-10 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Clean Balanced Typography & Pill Badge */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-purple-700 uppercase">
              Step-by-Step Platform Execution
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
        </div>

        {/* ========================================================================= */}
        {/* VERTICALLY STACKED CARDS (ONE ABOVE THE OTHER AS REQUESTED)               */}
        {/* ========================================================================= */}
        <div className="relative flex flex-col gap-7 sm:gap-9 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={`group relative rounded-[32px] bg-gradient-to-b ${step.gradientBg} border border-white/10 shadow-[0_18px_45px_-12px_rgba(15,23,42,0.2),0_0_0_1px_rgba(255,255,255,0.06)_inset] p-5 sm:p-7 lg:p-8 text-white transition-all duration-500 hover:-translate-y-1.5 ${step.borderGlow} overflow-hidden`}
              >
                {/* Subtle top specular highlight reflection */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Main 2-Column Layout: 3D Video on Left, Rich Details on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  
                  {/* --- 1. LEFT COLUMN: THE 3D VIDEO CLIP (ONE ABOVE THE OTHER IN SEQUENCE) --- */}
                  <div className="lg:col-span-7">
                    <div className="relative w-full aspect-[2.25/1.22] rounded-2xl overflow-hidden bg-black/70 border border-white/12 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
                      {/* Fallback 3D Poster Image */}
                      <Image
                        src={step.posterImage}
                        alt={step.title}
                        fill
                        className="object-cover object-center pointer-events-none -z-10"
                        sizes="(max-width: 1024px) 100vw, 600px"
                        priority={index === 0}
                      />

                      {/* Synchronized Looping 3D Motion Video */}
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src="/videos/alchemy_showcase.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute left-0 w-full h-[300%] max-w-none pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{
                          top: step.videoPosition,
                        }}
                      />

                      {/* Subtle gradient vignette mask at bottom */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Floating Step Number Pill on Video */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-xs font-mono font-black tracking-wider text-white shadow-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                        <span>STEP {step.number}</span>
                      </div>

                      {/* Floating Themed Icon Pill on Video */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* --- 2. RIGHT COLUMN: STEP COPY, CHIPS & STATUS --- */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    
                    {/* Badge & Step indicator */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${step.badgeStyle}`}
                      >
                        {step.badge}
                      </span>
                      <span className="text-xs font-mono font-semibold text-purple-300/80">
                        Phase {index + 1} of 3
                      </span>
                    </div>

                    {/* Bold Title */}
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug group-hover:text-purple-200 transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-purple-100/80 font-normal">
                      {step.description}
                    </p>

                    {/* Micro-feature chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {step.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-[11px] font-medium text-purple-200/90 backdrop-blur-sm"
                        >
                          <Check className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>{chip}</span>
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action / Status Bar */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-200 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>{step.statusText}</span>
                      </div>

                      {step.hasYellowButton ? (
                        /* The Signature Yellow Arrow Action Pill from the video */
                        <div className="w-9 h-9 rounded-full bg-[#FACC15] text-slate-900 flex items-center justify-center font-black shadow-md shadow-amber-400/25 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 cursor-pointer">
                          <ArrowDownRight className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white/90">
                          Step {index + 1} of 3
                        </div>
                      )}
                    </div>

                  </div>

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
