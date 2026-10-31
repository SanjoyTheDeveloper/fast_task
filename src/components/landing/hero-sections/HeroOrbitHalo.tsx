"use client";

import * as React from "react";
import Image from "next/image";
import {
  Calendar,
  Timer,
  BookOpen,
  Volume2,
  Layers,
} from "lucide-react";

export function HeroOrbitHalo() {
  // Interactive Mouse Parallax & 3D Tilt State
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  // Mouse Move Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Touch handlers for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleTouchEnd = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const clampedX = Math.max(-1, Math.min(1, mousePos.x));
  const clampedY = Math.max(-1, Math.min(1, mousePos.y));

  return (
    <div className="w-full">
      {/* 3D Cylindrical Orbital Workspace */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative mt-2 sm:mt-6 w-full max-w-5xl mx-auto flex items-end justify-center min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] px-2 sm:px-4 select-none cursor-default overflow-hidden lg:overflow-visible"
        style={{
          perspective: "1200px",
        }}
      >
        {/* Soft Ambient Radial Royal Blue Glows */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 lg:w-[480px] h-80 sm:h-96 lg:h-[480px] bg-blue-500/10 blur-3xl rounded-full transition-opacity duration-500 -z-10"
          style={{
            opacity: isHovered ? 0.95 : 0.7,
            transform: `translate(-50%, -50%) translate3d(${clampedX * 14}px, ${clampedY * 14}px, 0)`,
          }}
        />

        {/* Delicate Connecting SVG Bezier Lines (Curves from outer cards into orbital halo) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1000 620"
          fill="none"
        >
          {/* Left Connection: From "Study Smarter" into left side of 3D orbital halo */}
          <path
            d={`M 205 240 C ${255 + clampedX * 10} ${250 + clampedY * 10}, ${
              305 + clampedX * 12
            } ${280 + clampedY * 10}, ${355 + clampedX * 8} 295`}
            stroke="#CBD5E1"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="transition-all duration-300 opacity-80"
          />

          {/* Right Connection: From "All Notes in One Place" into right side of 3D orbital halo */}
          <path
            d={`M 795 240 C ${745 + clampedX * 10} ${250 + clampedY * 10}, ${
              695 + clampedX * 12
            } ${280 + clampedY * 10}, ${645 + clampedX * 8} 295`}
            stroke="#CBD5E1"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="transition-all duration-300 opacity-80"
          />
        </svg>

        {/* ---------------- 1. OUTER ANCHOR CARDS (Far Left & Far Right - ZERO COLLISION) ---------------- */}

        {/* Left Floating Feature Card: "SMART SYNC - Study Smarter" */}
        <div
          className="hidden md:block absolute left-0 lg:left-2 xl:left-4 top-[24%] lg:top-[26%] z-20 w-[195px] lg:w-[215px]"
          style={{
            animation: "float 6s ease-in-out infinite",
            animationDelay: "0s",
          }}
        >
          <div
            className="rounded-[22px] p-4 bg-white/95 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.06),0_2px_8px_rgba(15,23,42,0.03)] pointer-events-auto transition-transform duration-200 hover:scale-105 will-change-transform"
            style={{
              transform: `translate3d(${clampedX * -6}px, ${clampedY * 4}px, 0) rotate(${
                -1.5 + clampedX * 1
              }deg)`,
            }}
          >
            <div className="flex flex-col gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                  SMART SYNC
                </span>
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                  Study Smarter
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Sync routines, coursework &amp; exams with one click.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Floating Feature Card: "LECTURE NOTES - All Notes in One Place" */}
        <div
          className="hidden md:block absolute right-0 lg:right-2 xl:right-4 top-[24%] lg:top-[26%] z-20 w-[195px] lg:w-[215px]"
          style={{
            animation: "float 6s ease-in-out infinite",
            animationDelay: "2s",
          }}
        >
          <div
            className="rounded-[22px] p-4 bg-white/95 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.06),0_2px_8px_rgba(15,23,42,0.03)] pointer-events-auto transition-transform duration-200 hover:scale-105 will-change-transform"
            style={{
              transform: `translate3d(${clampedX * 6}px, ${clampedY * 4}px, 0) rotate(${
                1.5 + clampedX * 1
              }deg)`,
            }}
          >
            <div className="flex flex-col gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                  LECTURE NOTES
                </span>
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                  All Notes in One Place
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Instant access to department PDFs and lecture slides.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- 2. CENTERPIECE PORTRAIT IN THE BACKGROUND ---------------- */}
        <div
          className="relative z-10 w-[330px] sm:w-[420px] lg:w-[480px] flex items-end justify-center pointer-events-none transition-transform duration-200 ease-out will-change-transform"
          style={{
            transform: `translateX(${-clampedX * 10}px) translateY(${-clampedY * 5}px) scale(1.03)`,
          }}
        >
          <div className="relative w-full aspect-[4/5] [mask-image:linear-gradient(to_bottom,black_82%,transparent_98%)]">
            <Image
              src="/images/mindly-hero-student-transparent.png"
              alt="Student in Academic Focus"
              fill
              sizes="(max-width: 640px) 330px, (max-width: 1024px) 420px, 480px"
              priority
              className="object-cover object-top contrast-[1.03]"
            />
          </div>
        </div>

        {/* ---------------- 3. 3D CYLINDRICAL HALO RING ROTATING AROUND HER HEAD ---------------- */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none [transform-style:preserve-3d] will-change-transform"
          style={{
            transform: `rotateY(${clampedX * 8}deg) rotateX(${-clampedY * 5}deg)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center [perspective:1200px]">
            
            {/* Back Left Orbital Panel: Mountain Landscape (Tucked behind hair - completely clear of outer card) */}
            <div
              className="hidden sm:block absolute left-[12%] lg:left-[16%] top-24 w-24 sm:w-28 h-16 sm:h-18 rounded-xl overflow-hidden border border-white/90 shadow-md pointer-events-auto transition-transform hover:scale-105 duration-300 -z-0 will-change-transform"
              style={{
                transform: `rotateY(${32 + clampedX * 6}deg) translateZ(-45px) translateX(${
                  clampedX * 10
                }px) translateY(${clampedY * 5}px) scale(0.88)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=220&h=160&fit=crop&q=80"
                alt="Scenic Peak"
                loading="lazy"
                decoding="async"
                width={220}
                height={160}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>

            {/* Back Right Orbital Panel: Celestial Moon (Tucked behind jaw - completely clear of outer card) */}
            <div
              className="hidden sm:block absolute right-[12%] lg:right-[16%] bottom-20 w-24 sm:w-28 h-16 sm:h-18 rounded-xl overflow-hidden border border-white/90 shadow-md pointer-events-auto transition-transform hover:scale-105 duration-300 -z-0 will-change-transform"
              style={{
                transform: `rotateY(${-32 + clampedX * 6}deg) translateZ(-45px) translateX(${
                  clampedX * 10
                }px) translateY(${clampedY * 5}px) scale(0.88)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=220&h=160&fit=crop&q=80"
                alt="Celestial Moon"
                loading="lazy"
                decoding="async"
                width={220}
                height={160}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>

            {/* Back Translucent Glass Ribbon (Completes the 360-degree cylinder behind the head) */}
            <div
              className="hidden sm:block absolute right-[14%] top-4 w-20 h-24 rounded-2xl bg-white/45 border border-white/70 shadow-xs pointer-events-none -z-10"
              style={{
                transform: `rotateY(${-45 + clampedX * 8}deg) translateZ(-65px) scale(0.82)`,
              }}
            />

            {/* Front Top-Left Orbital Card: "Schedule Tracker" (Wrapping across left temple/hair) */}
            <div
              className="absolute left-[8%] sm:left-[14%] lg:left-[18%] top-10 sm:top-14 z-40 w-[180px] sm:w-[205px] pointer-events-auto will-change-transform"
              style={{
                transform: `rotateY(${18 + clampedX * 6}deg) rotateX(${-clampedY * 5}deg) translateZ(${
                  35 + clampedX * 10
                }px) translateX(${clampedX * 12}px) translateY(${-4 + clampedY * 6}px) scale(0.96)`,
                transition: "transform 200ms ease-out",
              }}
            >
              <div className="flex items-center gap-2.5 rounded-2xl p-3 bg-white/95 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.06),0_2px_8px_rgba(15,23,42,0.03)] hover:scale-105 transition-transform duration-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/25 shrink-0">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 pr-0.5">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">
                    Schedule Tracker
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
                    09:30 AM • Operating Systems
                  </p>
                </div>
              </div>
            </div>

            {/* Front Center Orbital Card: "Kanban & Ideas" (Wrapping across chin / lower neck) */}
            <div
              className="absolute left-1/2 -translate-x-[48%] bottom-10 sm:bottom-14 z-50 w-[195px] sm:w-[225px] pointer-events-auto will-change-transform"
              style={{
                transform: `rotateY(${-4 + clampedX * 8}deg) rotateX(${-clampedY * 6}deg) translateZ(${
                  65 + Math.abs(clampedX) * 8
                }px) translateX(${clampedX * 18}px) translateY(${clampedY * 10}px) scale(1)`,
                transition: "transform 200ms ease-out",
              }}
            >
              <div className="flex items-center gap-2.5 rounded-2xl p-3 sm:p-3.5 bg-white/95 border border-slate-200/80 shadow-[0_20px_45px_rgba(79,70,229,0.12),0_4px_12px_rgba(15,23,42,0.04)] hover:scale-105 transition-transform duration-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shadow-indigo-500/25 shrink-0">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 pr-0.5">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">
                    Kanban &amp; Ideas
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
                    3 Active • Due Tomorrow
                  </p>
                </div>
              </div>
            </div>

            {/* Front Top-Right Orbital Card: "Pomodoro Focus" (Wrapping across right cheek/jaw) */}
            <div
              className="absolute right-[8%] sm:right-[14%] lg:right-[18%] top-12 sm:top-16 z-40 w-[180px] sm:w-[205px] pointer-events-auto will-change-transform"
              style={{
                transform: `rotateY(${-18 + clampedX * 6}deg) rotateX(${-clampedY * 5}deg) translateZ(${
                  35 - clampedX * 10
                }px) translateX(${clampedX * 12}px) translateY(${-4 + clampedY * 6}px) scale(0.96)`,
                transition: "transform 200ms ease-out",
              }}
            >
              <div className="flex items-center gap-2.5 rounded-2xl p-3 bg-white/95 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.06),0_2px_8px_rgba(15,23,42,0.03)] hover:scale-105 transition-transform duration-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shadow-emerald-500/25 shrink-0">
                  <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 pr-0.5">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">
                    Pomodoro Focus
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
                    24:18 • Deep Work
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ---------------- MOBILE FALLBACK: STACKED CARDS BELOW MD SCREEN ---------------- */}
        <div className="md:hidden w-full max-w-sm mt-6 flex flex-col gap-2.5 z-40">
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-900">Schedule Tracker</h5>
                <p className="text-[10px] text-slate-500">09:30 AM • Operating Systems</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-blue-600 tracking-wider">SMART SYNC</span>
                <h5 className="text-xs font-bold text-slate-900">Study Smarter</h5>
                <p className="text-[10px] text-slate-500">Sync routines, coursework &amp; exams</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-indigo-600 tracking-wider">LECTURE NOTES</span>
                <h5 className="text-xs font-bold text-slate-900">All Notes in One Place</h5>
                <p className="text-[10px] text-slate-500">Instant access to department PDFs &amp; slides</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
