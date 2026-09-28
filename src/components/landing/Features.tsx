import React from "react";
import {
  Calendar,
  CheckSquare,
  Clock,
  GraduationCap,
  Columns,
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
    accent: "text-[#315BFF] bg-blue-50 border-blue-100",
    borderAccent: "hover:border-[#315BFF]/50",
  },
  {
    icon: GraduationCap,
    title: "Course Tagging & Subject Coding",
    description:
      "Color-code tasks by courses (CSE231, EEPP, MAT101) with distinct badges for Assignments, Exams, and Lab Reports.",
    badge: "Academic Tags",
    accent: "text-purple-600 bg-purple-50 border-purple-100",
    borderAccent: "hover:border-purple-400",
  },
  {
    icon: Timer,
    title: "Integrated Pomodoro Study Timer",
    description:
      "Built-in 25-minute focus intervals and 5-minute restorative breaks with ambient web audio chimes to maintain peak flow.",
    badge: "Focus Mode",
    accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
    borderAccent: "hover:border-emerald-400",
  },
  {
    icon: Columns,
    title: "Visual Kanban Academic Backlog",
    description:
      "Seamlessly transition coursework across Pending, In Progress, and Completed columns without cognitive overload.",
    badge: "Visual Flow",
    accent: "text-indigo-600 bg-indigo-50 border-indigo-100",
    borderAccent: "hover:border-indigo-400",
  },
  {
    icon: Calendar,
    title: "Due Dates & Exam Deadlines",
    description:
      "Urgency indicators, glowing warning indicators for submissions due within 48 hours, and calendar schedule alignment.",
    badge: "Deadlines",
    accent: "text-rose-600 bg-rose-50 border-rose-100",
    borderAccent: "hover:border-rose-400",
  },
  {
    icon: ShieldCheck,
    title: "Private & Cloud-Backed Storage",
    description:
      "Encrypted authentication via Auth.js, ensuring your academic schedule, notes, and task progress remain strictly private.",
    badge: "Secure",
    accent: "text-amber-600 bg-amber-50 border-amber-100",
    borderAccent: "hover:border-amber-400",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative border-t border-[#E5EAF2] py-16 sm:py-24 lg:py-32 bg-[#F8FAFC]"
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.06),transparent_65%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D0DFFF] text-xs font-bold text-[#315BFF] shadow-2xs backdrop-blur-md">
            <span>Engineering & Student Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#172033] leading-tight">
            Engineered for Academic Focus &{" "}
            <span className="bg-gradient-to-r from-[#315BFF] via-[#4361EE] to-[#7209B7] bg-clip-text text-transparent">
              High-Grade Results
            </span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto font-normal">
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
                className={`group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E5EAF2] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${feature.borderAccent}`}
              >
                {/* Subtle top hover accent line */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#315BFF] via-[#5B63E6] to-[#8B5CF6] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-t-2xl" />

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-2xs transition-transform duration-300 group-hover:scale-105 ${feature.accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    {feature.badge && (
                      <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="pt-5 text-lg font-bold text-[#172033] group-hover:text-[#315BFF] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
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
