import React from "react";
import {
  Calendar,
  CheckSquare,
  Clock,
  GraduationCap,
  Kanban,
  Search,
  ShieldCheck,
  Timer,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
  accent: string;
  borderAccent: string;
}

const features: FeatureItem[] = [
  {
    icon: Clock,
    title: "Semester Timetable & Daily Routine",
    description:
      "Automatically synchronizes with your semester dates, filtering today's lectures, labs, and classroom venues in real time.",
    badge: "Auto-Sync",
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-400/30",
    borderAccent: "group-hover:border-cyan-500/50",
  },
  {
    icon: GraduationCap,
    title: "Course Tagging & Subject Coding",
    description:
      "Color-code tasks by courses (CSE231, EEPP, MAT101) with distinct badges for Assignments, Exams, and Lab Reports.",
    badge: "Academic Tags",
    accent: "text-violet-400 bg-violet-500/10 border-violet-400/30",
    borderAccent: "group-hover:border-violet-500/50",
  },
  {
    icon: Timer,
    title: "Integrated Pomodoro Study Timer",
    description:
      "Built-in 25-minute focus intervals and 5-minute restorative breaks with ambient web audio chimes to maintain peak flow.",
    badge: "Focus Mode",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-400/30",
    borderAccent: "group-hover:border-emerald-500/50",
  },
  {
    icon: Kanban,
    title: "Visual Kanban Academic Backlog",
    description:
      "Seamlessly transition coursework across Pending, In Progress, and Completed columns without cognitive overload.",
    badge: "Visual Flow",
    accent: "text-blue-400 bg-blue-500/10 border-blue-400/30",
    borderAccent: "group-hover:border-blue-500/50",
  },
  {
    icon: Calendar,
    title: "Due Dates & Exam Deadlines",
    description:
      "Urgency indicators, glowing warning indicators for submissions due within 48 hours, and calendar schedule alignment.",
    badge: "Deadlines",
    accent: "text-rose-400 bg-rose-500/10 border-rose-400/30",
    borderAccent: "group-hover:border-rose-500/50",
  },
  {
    icon: ShieldCheck,
    title: "Private & Cloud-Backed Storage",
    description:
      "Encrypted authentication via Auth.js, ensuring your academic schedule, notes, and task progress remain strictly private.",
    badge: "Secure",
    accent: "text-amber-400 bg-amber-500/10 border-amber-400/30",
    borderAccent: "group-hover:border-amber-500/50",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative border-t border-white/[0.08] py-16 sm:py-24 lg:py-32"
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_65%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            <span>Engineering & Student Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Engineered for Academic Focus &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              High-Grade Results
            </span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto">
            Everything university students and ambitious self-learners need to orchestrate semester schedules, assignments, and exam deadlines.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${feature.borderAccent}`}
              >
                {/* Subtle top hover accent line */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-t-2xl" />

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-transform duration-300 group-hover:scale-105 ${feature.accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    {feature.badge && (
                      <span className="rounded-full bg-white/[0.06] border border-white/[0.1] px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="pt-5 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
