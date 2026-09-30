import React from "react";
import { CheckCircle2, Clock, GraduationCap, LayoutDashboard } from "lucide-react";

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  numberGradient: string;
  iconBg: string;
  cardGradient: string;
  cardBorder: string;
  cardShadow: string;
  hoverBorder: string;
  badgeText: string;
  badgeBg: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Define Semester & Weekly Routine",
    description:
      "Configure your term start and end dates and upload your weekly course schedule. Today's sessions automatically illuminate.",
    icon: Clock,
    accentColor: "text-[#315BFF]",
    numberGradient: "from-[#315BFF] to-[#6366F1]",
    iconBg: "bg-white text-[#315BFF] border-[#D0DFFF]",
    cardGradient: "from-[#EEF4FF] via-[#F4F7FF] to-[#E9F0FE]",
    cardBorder: "border-[#DCE7FC]",
    cardShadow:
      "shadow-[-8px_14px_30px_-6px_rgba(49,91,255,0.14),8px_14px_30px_-6px_rgba(49,91,255,0.14),0_20px_40px_-10px_rgba(15,23,42,0.08)] hover:shadow-[-12px_22px_45px_-8px_rgba(49,91,255,0.22),12px_22px_45px_-8px_rgba(49,91,255,0.22),0_28px_55px_-12px_rgba(15,23,42,0.12)]",
    hoverBorder: "hover:border-[#315BFF]/60",
    badgeText: "Routine Sync",
    badgeBg: "bg-white/90 text-[#315BFF] border-[#D0DFFF]",
  },
  {
    number: "02",
    title: "Tag Coursework & Exam Deadlines",
    description:
      "Log assignments, lab reports, and exam dates with color-coded course codes. Priority flags keep critical milestones front and center.",
    icon: GraduationCap,
    accentColor: "text-[#EF4444]",
    numberGradient: "from-[#EF4444] to-[#F59E0B]",
    iconBg: "bg-white text-[#EF4444] border-[#FECACA]",
    cardGradient: "from-[#FFF1F2] via-[#FFF5F5] to-[#FEF2F2]",
    cardBorder: "border-[#FECDD3]",
    cardShadow:
      "shadow-[-8px_14px_30px_-6px_rgba(239,68,68,0.14),8px_14px_30px_-6px_rgba(239,68,68,0.14),0_20px_40px_-10px_rgba(15,23,42,0.08)] hover:shadow-[-12px_22px_45px_-8px_rgba(239,68,68,0.22),12px_22px_45px_-8px_rgba(239,68,68,0.22),0_28px_55px_-12px_rgba(15,23,42,0.12)]",
    hoverBorder: "hover:border-rose-400/60",
    badgeText: "Deadline Radar",
    badgeBg: "bg-white/90 text-[#EF4444] border-[#FECACA]",
  },
  {
    number: "03",
    title: "Execute with Pomodoro Focus",
    description:
      "Power through deep study blocks with the built-in 25-minute timer and drag finished tasks to Completed on your Kanban board.",
    icon: LayoutDashboard,
    accentColor: "text-[#10B981]",
    numberGradient: "from-[#10B981] to-[#06B6D4]",
    iconBg: "bg-white text-[#10B981] border-[#A7F3D0]",
    cardGradient: "from-[#ECFDF5] via-[#F0FDF4] to-[#E6FFFA]",
    cardBorder: "border-[#A7F3D0]",
    cardShadow:
      "shadow-[-8px_14px_30px_-6px_rgba(16,185,129,0.14),8px_14px_30px_-6px_rgba(16,185,129,0.14),0_20px_40px_-10px_rgba(15,23,42,0.08)] hover:shadow-[-12px_22px_45px_-8px_rgba(16,185,129,0.22),12px_22px_45px_-8px_rgba(16,185,129,0.22),0_28px_55px_-12px_rgba(15,23,42,0.12)]",
    hoverBorder: "hover:border-emerald-400/60",
    badgeText: "Study Target",
    badgeBg: "bg-white/90 text-[#10B981] border-[#A7F3D0]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 bg-transparent">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Clean Balanced Typography */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#172033] leading-snug">
            How{" "}
            <span className="bg-gradient-to-r from-[#315BFF] via-[#6366F1] to-[#315BFF] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow inline-block">
              FastTask
            </span>{" "}
            Works
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal max-w-xl mx-auto">
            From chaotic semester syllabus to a calm, organized daily study flow.
          </p>
        </div>

        {/* Step Cards Grid with Left-to-Right Outer Shadows */}
        <div className="relative mt-12 sm:mt-16 grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`group relative flex flex-col justify-between rounded-3xl bg-gradient-to-br ${step.cardGradient} border ${step.cardBorder} ${step.hoverBorder} ${step.cardShadow} p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5`}
              >
                <div>
                  {/* Top Bar: Gradient Step Number & Themed Dashboard Icon */}
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-3xl font-black tracking-tight bg-gradient-to-r ${step.numberGradient} bg-clip-text text-transparent`}>
                      {step.number}
                    </span>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${step.iconBg} shadow-2xs transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-[#172033]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Progress indicator with matching dashboard accent */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-900/5 text-xs">
                  <div className={`flex items-center gap-1.5 font-bold ${step.accentColor}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Step {index + 1} of 3</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm ${step.badgeBg}`}>
                    {step.badgeText}
                  </span>
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
