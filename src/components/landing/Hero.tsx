"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroProps {
  registerHref?: string;
  loginHref?: string;
}

interface StatCard {
  id: string;
  title: string;
  value: string;
  badge: string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const stats: StatCard[] = [
  {
    id: "active-routine",
    title: "Weekly Routine",
    value: "22.39 hrs",
    badge: "Synced",
    trend: "+3.4h vs last week",
    icon: Clock,
    accentColor: "text-[#315BFF]",
  },
  {
    id: "tasks-completed",
    title: "Tasks Solved",
    value: "20,283",
    badge: "98.4%",
    trend: "14 due this week",
    icon: CheckCircle2,
    accentColor: "text-emerald-600",
  },
  {
    id: "study-focus",
    title: "Focus Pomodoro",
    value: "10,380 m",
    badge: "Level 4",
    trend: "25 min intervals",
    icon: TrendingUp,
    accentColor: "text-violet-600",
  },
  {
    id: "performance-score",
    title: "Academic Score",
    value: "38,799 pts",
    badge: "Top 2%",
    trend: "Dean's list pace",
    icon: Sparkles,
    accentColor: "text-amber-500",
  },
];

export function Hero({
  registerHref = "/register",
  loginHref = "/login",
}: HeroProps) {
  const [activeStat, setActiveStat] = useState<string>("active-routine");

  return (
    <section className="relative pt-6 sm:pt-10 lg:pt-12 pb-16 sm:pb-24 overflow-hidden select-none">
      {/* 1. Ambient Background Atmosphere matching dashboard + reference image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-20 -z-10 h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(199,210,254,0.35),rgba(224,231,255,0.2),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -left-32 -z-10 h-96 w-96 rounded-full bg-blue-300/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-300/20 blur-[130px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Floating Plus Action Accent (from reference design) */}
        <div className="flex justify-end mb-2 sm:mb-4">
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#315BFF] text-white shadow-md shadow-blue-500/30 hover:bg-[#254BE3] hover:scale-108 active:scale-95 transition-all duration-200"
            title="Open Quick Task"
          >
            <Plus className="h-4.5 w-4.5 transition-transform duration-200 group-hover:rotate-90" />
          </Link>
        </div>

        {/* 2. Main 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Description & Pill CTA Buttons */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            {/* Micro Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-2xs backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#315BFF] animate-pulse" />
              <span className="text-[12px] font-semibold text-slate-700 tracking-wide uppercase">
                Academic Command Center
              </span>
            </div>

            {/* Main Headline (Style matched to reference image) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-[#172033] leading-[1.12]">
              Grow your academic focus with smart digital solutions
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              FastTask organizes lecture routines, tracks high-stakes assignment
              deadlines, and powers deep study flow with structured Pomodoro blocks
              in one modern interface.
            </p>

            {/* Action Buttons: Pill-shaped CTA + Outline Search button */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Button
                asChild
                className="h-12 px-7 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 group cursor-pointer"
              >
                <Link href={registerHref} className="flex items-center gap-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 px-6 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 group cursor-pointer backdrop-blur-md"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400 group-hover:text-[#315BFF] transition-colors" />
                  <span>Explore Dashboard</span>
                </Link>
              </Button>
            </div>

            {/* Feature Mini Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#315BFF]" />
                <span>Routine Auto-Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#315BFF]" />
                <span>Kanban Coursework</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#315BFF]" />
                <span>Study Timer</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Glass Composition Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[560px] lg:max-w-none group">
              {/* Outer soft ambient backlight glow */}
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-purple-400/20 blur-2xl transform group-hover:scale-103 transition-transform duration-500" />

              {/* 3D Glass Artwork Container */}
              <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(49,91,255,0.1),0_8px_20px_rgba(15,23,42,0.06)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(49,91,255,0.16)]">
                {/* Visual Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/glass-hero-3d.jpg"
                  alt="FastTask 3D Glassmorphic Student Workspace"
                  className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="eager"
                />

                {/* Interactive Overlay Float Chip: Top-Left */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-sm flex items-center gap-2.5 transition-all hover:scale-105">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 leading-tight">
                      Semester Progress
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Week 6 • 88% On Track
                    </p>
                  </div>
                </div>

                {/* Interactive Overlay Float Chip: Bottom-Left */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3.5 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2.5 transition-all hover:scale-105">
                  <div className="h-6 w-6 rounded-lg bg-[#315BFF] flex items-center justify-center text-white text-[10px] font-bold">
                    FT
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-white leading-tight">
                      CSE315: OS Lab
                    </p>
                    <p className="text-[10px] text-blue-300 font-medium">
                      Next at 09:30 AM • Room A/502
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: 4 Metric Cards (Matching the reference design) */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((stat) => {
              const isSelected = activeStat === stat.id;
              const Icon = stat.icon;

              return (
                <div
                  key={stat.id}
                  onClick={() => setActiveStat(stat.id)}
                  className={`cursor-pointer relative rounded-2xl p-5 border transition-all duration-300 backdrop-blur-md ${
                    isSelected
                      ? "bg-white/90 border-[#315BFF]/40 shadow-[0_12px_30px_rgba(49,91,255,0.12)] -translate-y-1"
                      : "bg-white/70 hover:bg-white/85 border-slate-200/80 hover:border-slate-300 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-0.5"
                  }`}
                >
                  {/* Card Header: Label + Pill Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-slate-100 ${stat.accentColor}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 tracking-tight">
                        {stat.title}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF]">
                      {stat.badge}
                    </span>
                  </div>

                  {/* Main Metric Value */}
                  <div className="text-2xl sm:text-[26px] font-extrabold text-[#172033] tracking-tight mb-1">
                    {stat.value}
                  </div>

                  {/* Trend / Subtext */}
                  <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                    <span>{stat.trend}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
