"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export interface LmsHeroBannerProps {
  userName?: string;
  onLearnMore?: () => void;
}

export function LmsHeroBanner({
  userName = "Student",
  onLearnMore,
}: LmsHeroBannerProps) {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#7E8AF5] via-[#756CE8] to-[#5F52DF] text-white p-6 sm:p-8 lg:p-10 shadow-[0_15px_35px_rgba(99,102,241,0.25)] overflow-hidden">
      {/* Decorative ambient background circular flares */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-indigo-300/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-purple-300/10 blur-xl" />

      {/* Floating 3D Pastel Clay Book Art on Left */}
      <div className="hidden md:block absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-28 lg:w-40 h-28 lg:h-40 pointer-events-none transition-transform hover:scale-105 duration-300">
        <div className="relative w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]">
          <Image
            src="/images/lms/clay-notebook.png"
            alt="3D Clay Study Notebook & Glasses"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Floating 3D Pastel Clay Bookshelf Art on Right */}
      <div className="hidden lg:block absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-36 lg:w-52 h-36 lg:h-52 pointer-events-none transition-transform hover:scale-105 duration-300">
        <div className="relative w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.22)]">
          <Image
            src="/images/lms/clay-bookshelf.png"
            alt="3D Pastel Clay Bookshelf on Wooden Rack"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Center Welcome Content */}
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-3.5 px-2">
        {/* Personalized Welcome Text */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Hi, {userName}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-normal">
          The library serves as a welcoming home for knowledge seekers and avid readers alike
        </p>

        {/* "Learn more" Pill Action Button */}
        <div className="pt-1.5 flex justify-center">
          <button
            type="button"
            onClick={onLearnMore}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white text-xs font-semibold shadow-sm hover:shadow transition-all active:scale-98 cursor-pointer"
          >
            <span>Learn more</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
