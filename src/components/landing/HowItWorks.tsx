import React from "react";
import { CheckCircle2, Clock, GraduationCap, LayoutDashboard } from "lucide-react";

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Define Semester & Weekly Routine",
    description:
      "Configure your term start and end dates and upload your weekly course schedule. Today's sessions automatically illuminate.",
    icon: Clock,
  },
  {
    number: "02",
    title: "Tag Coursework & Exam Deadlines",
    description:
      "Log assignments, lab reports, and exam dates with color-coded course codes. Priority flags keep critical milestones front and center.",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Execute with Pomodoro Focus",
    description:
      "Power through deep study blocks with the built-in 25-minute timer and drag finished tasks to Completed on your Kanban board.",
    icon: LayoutDashboard,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-white/[0.08] py-16 sm:py-24 lg:py-32">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 -z-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs font-semibold text-blue-300 backdrop-blur-md">
            <span>Simple 3-Step Flow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How FastTask Works
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-400">
            From chaotic semester syllabus to a calm, organized daily study flow.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="relative mt-12 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar: Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </div>

                {/* Progress indicator hint */}
                <div className="mt-8 flex items-center gap-1.5 pt-4 border-t border-white/[0.08] text-xs font-semibold text-cyan-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Step {index + 1} of 3</span>
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
