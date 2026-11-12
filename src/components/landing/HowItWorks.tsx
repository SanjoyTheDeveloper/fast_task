"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, Clock, GraduationCap, LayoutDashboard, ArrowDownRight, Sparkles } from "lucide-react";

export interface StepItem {
  number: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  videoPosition: string; // "0%", "-100%", "-200%"
  posterImage: string;
  accentColor: string;
  gradientBg: string;
  borderGlow: string;
  badgeStyle: string;
  pillText: string;
  hasYellowButton?: boolean;
}

const steps: StepItem[] = [
  {
    number: "01",
    badge: "ROUTINE SYNC",
    title: "Define Semester & Weekly Routine",
    description:
      "Configure your term start and end dates and upload your weekly course schedule. Today's sessions automatically illuminate.",
    icon: Clock,
    videoPosition: "0%",
    posterImage: "/images/how-it-works/step_01_phone_3d.png",
    accentColor: "#8B5CF6",
    gradientBg: "from-[#180838] via-[#12042B] to-[#0A021B]",
    borderGlow: "group-hover:border-purple-500/60 group-hover:shadow-[0_20px_50px_-10px_rgba(139,92,246,0.35)]",
    badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    pillText: "Automated Routine Sync",
  },
  {
    number: "02",
    badge: "DEADLINE RADAR",
    title: "Tag Coursework & Exam Deadlines",
    description:
      "Log assignments, lab reports, and exam dates with color-coded course codes. Priority flags keep critical milestones front and center.",
    icon: GraduationCap,
    videoPosition: "-100%",
    posterImage: "/images/how-it-works/step_02_plane_3d.png",
    accentColor: "#A855F7",
    gradientBg: "from-[#220B4E] via-[#170638] to-[#0C0220]",
    borderGlow: "group-hover:border-fuchsia-500/60 group-hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.35)]",
    badgeStyle: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30",
    pillText: "Priority Velocity Radar",
  },
  {
    number: "03",
    badge: "STUDY TARGET",
    title: "Execute with Pomodoro Focus",
    description:
      "Power through deep study blocks with the built-in 25-minute timer and drag finished tasks to Completed on your Kanban board.",
    icon: LayoutDashboard,
    videoPosition: "-200%",
    posterImage: "/images/how-it-works/step_03_globe_avatars.png",
    accentColor: "#C084FC",
    gradientBg: "from-[#2A0E5C] via-[#1A073F] to-[#0D0224]",
    borderGlow: "group-hover:border-violet-400/70 group-hover:shadow-[0_20px_50px_-10px_rgba(192,132,252,0.4)]",
    badgeStyle: "bg-violet-500/20 text-violet-200 border-violet-400/30",
    pillText: "Peak Flow State Active",
    hasYellowButton: true,
  },
];

export function HowItWorks() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Synchronize play state across all 3 viewports
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {
          // Auto-play policy handled by muted
        });
      }
    });
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F8FAFC] scroll-mt-20 sm:scroll-mt-24 overflow-hidden select-none"
    >
      {/* Ambient background volumetric violet & indigo glow matching the 3D video mood */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[700px] w-full max-w-7xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,rgba(99,102,241,0.06)_40%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-10 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-10 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Clean Balanced Typography & Pill Badge */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-purple-700 uppercase">
              Streamlined 3-Step Execution
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

        {/* 3D Motion Cards Grid (Recreating the Exact 3D Visual Language from the Video) */}
        <div className="relative mt-14 sm:mt-18 grid grid-cols-1 gap-7 lg:gap-8 md:grid-cols-3 items-stretch">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={`group relative flex flex-col justify-between rounded-[32px] bg-gradient-to-b ${step.gradientBg} border border-white/10 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.05)_inset] p-5 sm:p-6 text-white transition-all duration-500 hover:-translate-y-2 ${step.borderGlow} overflow-hidden`}
              >
                {/* Subtle top specular reflection line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                {/* --- 1. UPPER VIEWPORT: THE 3D VIDEO CLIP FROM THE ALCHEMY SHOWCASE --- */}
                <div className="relative w-full aspect-[2.25/1.25] sm:aspect-[2.25/1.2] rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                  {/* Fallback 3D Poster Image (loaded instantly behind the video) */}
                  <Image
                    src={step.posterImage}
                    alt={step.title}
                    fill
                    className="object-cover object-center pointer-events-none -z-10"
                    sizes="(max-width: 768px) 100vw, 33vw"
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

                  {/* Gradient mask at bottom of viewport for soft blend */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Floating Step Number Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-xs font-mono font-black tracking-wider text-white shadow-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                    <span>STEP {step.number}</span>
                  </div>

                  {/* Themed Icon Badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* --- 2. MIDDLE CONTENT: TITLE & HIGH-IMPACT TYPOGRAPHY --- */}
                <div className="pt-6 pb-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${step.badgeStyle}`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-[22px] font-extrabold tracking-tight text-white leading-snug group-hover:text-purple-200 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-purple-100/75 font-normal">
                    {step.description}
                  </p>
                </div>

                {/* --- 3. BOTTOM FOOTER: STATUS & SIGNATURE YELLOW ARROW PILL --- */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-purple-200 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{step.pillText}</span>
                  </div>

                  {step.hasYellowButton ? (
                    /* The Signature Yellow Arrow Pill from the video */
                    <div className="w-8 h-8 rounded-full bg-[#FACC15] text-slate-900 flex items-center justify-center font-black shadow-md shadow-amber-400/25 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
                      <ArrowDownRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-white/90">
                      Step {index + 1} of 3
                    </div>
                  )}
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
