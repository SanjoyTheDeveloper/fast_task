"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, ArrowUpRight, Heart, Clock, Binary } from "lucide-react";

export function KpiShowcase() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const courseTargetUrl = isLoggedIn ? "/lms" : "/login?from=/lms";

  const [frontLiked, setFrontLiked] = useState(false);
  const [backLiked, setBackLiked] = useState(false);

  return (
    <section
      id="kpi-showcase"
      className="relative py-16 sm:py-24 lg:py-28 bg-[#F8FAFC] text-[#172033] overflow-hidden select-none"
    >
      {/* Soft ambient background daylight glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Typography + CTA Buttons + Squiggle Doodle + KPI Counter */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-7 sm:space-y-8 relative z-10">
            {/* Main Headline with Dashboard Brand Styling */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#172033] leading-[1.08]">
                Master{" "}
                <span className="text-[#315BFF] inline-block">
                  CS 102, 201
                </span>
                <br />
                CS 202 &amp; 301 with
                <br />
                <span className="bg-gradient-to-r from-[#315BFF] via-[#6366F1] to-[#315BFF] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow inline-block">
                  Deep Study Flow
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed font-normal">
                Dedicated academic study workspace for Computer Science &amp; Engineering coursework.
                Organize weekly routines for Data Structures, Digital Logic, Computer Architecture, and Operating Systems.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3.5 pt-1">
              <Link
                href={courseTargetUrl}
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white text-sm font-semibold tracking-wide shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Course Notes</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* KPI Metrics Row with Unified Dashboard Colors */}
            <div className="pt-2 flex items-center gap-8 sm:gap-12">
              {/* Stat 1 */}
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#315BFF] tracking-tight">
                  10K+
                </span>
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">
                  CS Problems Solved
                </span>
              </div>

              {/* Stat 2 */}
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#315BFF] tracking-tight">
                  70K+
                </span>
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">
                  Study Hours
                </span>
              </div>

              {/* Stat 3 */}
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#315BFF] tracking-tight">
                  05K+
                </span>
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">
                  CS Scholars
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Overlapping 3D Study Cards + Orbit + Rotating Stamp + Dashboard Palette */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] pt-8 lg:pt-0">
            
            {/* 1. Orbiting Dashed Ellipse Wireframe */}
            <div
              aria-hidden
              className="pointer-events-none absolute w-[380px] sm:w-[480px] lg:w-[540px] h-[220px] sm:h-[280px] lg:h-[310px] rounded-[100%] border border-dashed border-slate-300 -rotate-12 -z-0"
            />

            {/* 2. Circular Rotating Stamp Badge */}
            <div className="absolute -top-3 left-14 sm:left-24 z-30 group cursor-pointer">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                {/* Rotating SVG with Circular Text featuring requested courses */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite] group-hover:animate-[spin_6s_linear_infinite] transition-all"
                >
                  <defs>
                    <path
                      id="csCourseCirclePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    />
                  </defs>
                  <text className="text-[8.5px] font-black tracking-[0.19em] uppercase fill-slate-800">
                    <textPath href="#csCourseCirclePath" startOffset="0%">
                      • CS 102 • CS 201 • CS 202 • CSE 211 • CS 301
                    </textPath>
                  </text>
                </svg>

                {/* Inner Blue Circular Medallion with Arrow */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#315BFF] text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 group-hover:bg-[#254BE3] transition-all duration-300">
                  <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* 3. Overlapping 3D Tilted Cards Container (Dashboard Light Card Aesthetic) */}
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] h-[400px] sm:h-[460px] flex items-center justify-center [perspective:1000px]">
              
              {/* BACK CARD (CS 301 Operating Systems & CS 202 Computer Organization) */}
              <div className="absolute right-0 sm:right-4 top-2 sm:top-4 z-10 w-[210px] sm:w-[250px] rounded-[24px] bg-white border border-[#E5EAF2] shadow-[-8px_18px_36px_-6px_rgba(15,23,42,0.16),0_24px_50px_-8px_rgba(15,23,42,0.18)] hover:shadow-[-12px_26px_50px_-8px_rgba(15,23,42,0.24),0_34px_65px_-10px_rgba(15,23,42,0.26)] overflow-hidden rotate-[10deg] sm:rotate-[13deg] hover:rotate-[7deg] hover:scale-105 hover:z-25 transition-all duration-500 ease-out cursor-pointer group">
                {/* Artwork Image */}
                <div className="relative w-full h-[220px] sm:h-[260px] bg-slate-50 overflow-hidden border-b border-[#E5EAF2]">
                  <Image
                    src="/images/cs-study-light-timer.jpg"
                    alt="CS 301 Operating Systems and CS 202 Computer Organization Study Desk"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 210px, 250px"
                  />
                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md border border-[#E5EAF2] text-[9px] font-mono font-bold text-[#172033] shadow-xs flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-amber-500" />
                    <span>CS 301 • CS 202</span>
                  </div>
                </div>

                {/* Card Meta Content (Dashboard White Surface & Typography) */}
                <div className="p-3.5 sm:p-4 bg-white text-[#172033] space-y-2.5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight text-[#172033] line-clamp-1">
                      OS &amp; Computer Organization
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-[8px] font-bold shrink-0">
                        ⚡
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        @systems_lab
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#E5EAF2]">
                    <div>
                      <span className="block text-xs sm:text-sm font-mono font-extrabold text-amber-600">
                        CPU Scheduling
                      </span>
                      <span className="block text-[9px] text-slate-500 font-medium">
                        CS 301 &amp; CS 202 Revision
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBackLiked(!backLiked);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                        backLiked
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#172033] border-[#E5EAF2]"
                      }`}
                      aria-label="Like study deck"
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          backLiked
                            ? "fill-rose-500 text-rose-500"
                            : "text-slate-400"
                        }`}
                      />
                      <span>{backLiked ? "1,451" : "1,450"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* FRONT CARD (CS 201 Data Structures, CS 102 Discrete Math, CSE 211) */}
              <div className="absolute left-1 sm:left-4 top-8 sm:top-10 z-20 w-[230px] sm:w-[275px] rounded-[26px] bg-white border border-[#E5EAF2] shadow-[-12px_24px_48px_-8px_rgba(15,23,42,0.22),0_32px_64px_-12px_rgba(15,23,42,0.22),0_12px_24px_-6px_rgba(49,91,255,0.12)] hover:shadow-[-16px_32px_64px_-10px_rgba(15,23,42,0.28),0_40px_80px_-14px_rgba(15,23,42,0.28)] overflow-hidden -rotate-[7deg] sm:-rotate-[9deg] hover:-rotate-[3deg] hover:scale-105 hover:z-30 transition-all duration-500 ease-out cursor-pointer group">
                {/* Artwork Image */}
                <div className="relative w-full h-[240px] sm:h-[285px] bg-slate-50 overflow-hidden border-b border-[#E5EAF2]">
                  <Image
                    src="/images/cs-study-light-notes.jpg"
                    alt="CS 201 Data Structures and CS 102 Discrete Math Study Desk in Daylight"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 230px, 275px"
                    priority
                  />
                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md border border-[#E5EAF2] text-[9px] font-mono font-bold text-[#172033] shadow-xs flex items-center gap-1">
                    <Binary className="w-2.5 h-2.5 text-[#315BFF]" />
                    <span>CS 201 • CS 102 • CSE 211</span>
                  </div>
                </div>

                {/* Card Meta Content (Dashboard White Surface & Typography) */}
                <div className="p-3.5 sm:p-4 bg-white text-[#172033] space-y-2.5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight text-[#172033] line-clamp-1">
                      Data Structures &amp; Logic Notes
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#EEF3FF] border border-[#D0DFFF] text-[#315BFF] flex items-center justify-center text-[8px] font-bold shrink-0">
                        &lt;/&gt;
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        @algo_routine
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#E5EAF2]">
                    <div>
                      <span className="block text-xs sm:text-sm font-mono font-extrabold text-[#315BFF]">
                        BST &amp; Discrete Math
                      </span>
                      <span className="block text-[9px] text-slate-500 font-medium">
                        CS 201, 102, CSE 211 Deck
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFrontLiked(!frontLiked);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                        frontLiked
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#172033] border-[#E5EAF2]"
                      }`}
                      aria-label="Like study notes"
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          frontLiked
                            ? "fill-rose-500 text-rose-500"
                            : "text-slate-400"
                        }`}
                      />
                      <span>{frontLiked ? "1,280" : "1,279"}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default KpiShowcase;


