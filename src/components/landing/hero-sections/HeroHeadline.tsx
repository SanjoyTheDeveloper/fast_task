"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroHeadlineProps {
  registerHref: string;
  onOpenVideo: () => void;
}

interface LetterProps {
  char: string;
  isBlue?: boolean;
  isItalic?: boolean;
}

// Tactical 3D Letter component with elastic spring pop and glowing elevation
function Interactive3DLetter({ char, isBlue, isItalic }: LetterProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Slight pseudo-random natural tilt based on character code
  const tiltDeg = (char.charCodeAt(0) % 5) - 2;

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block select-none cursor-pointer will-change-transform transition-all ${
        isItalic ? "font-serif italic font-normal" : "font-bold"
      } ${isBlue ? "text-blue-600" : "text-slate-900"}`}
      style={{
        transform: isHovered
          ? `translate3d(0, -10px, 36px) scale(1.22) rotateX(10deg) rotateY(${tiltDeg * 3}deg)`
          : "translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg)",
        transition:
          "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease",
        transformStyle: "preserve-3d",
        color: isHovered ? (isBlue ? "#1D4ED8" : "#2563EB") : undefined,
        textShadow: isHovered
          ? isBlue
            ? "0 12px 28px rgba(37,99,235,0.45)"
            : "0 10px 22px rgba(37,99,235,0.35)"
          : undefined,
        filter: isHovered ? "drop-shadow(0 8px 16px rgba(37,99,235,0.25))" : undefined,
      }}
    >
      {char}
    </span>
  );
}

// 3D Word Wrapper ensuring proper whitespace and word grouping
function Word3D({
  word,
  isBlue,
  isItalic,
}: {
  word: string;
  isBlue?: boolean;
  isItalic?: boolean;
}) {
  return (
    <span className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0 [transform-style:preserve-3d]">
      {word.split("").map((char, i) => (
        <Interactive3DLetter
          key={`${word}-${char}-${i}`}
          char={char}
          isBlue={isBlue}
          isItalic={isItalic}
        />
      ))}
    </span>
  );
}

export function HeroHeadline({ registerHref, onOpenVideo }: HeroHeadlineProps) {
  // Interactive 3D Perspective Tilt on Mouse Movement
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setTilt({ x: x * 7, y: -y * 7 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-20 pt-8 sm:pt-12 px-4 sm:px-8 text-center max-w-4xl mx-auto flex flex-col items-center space-y-4 sm:space-y-5"
      style={{
        perspective: "1200px",
      }}
    >
      {/* 3D Kinetic Headline Canvas */}
      <h1
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.08] transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        }}
      >
        {/* Line 1: "Engineered for" */}
        <span className="block [transform-style:preserve-3d]">
          <Word3D word="Engineered" />
          <Word3D word="for" />
        </span>

        {/* Line 2: "Academic Focus &" */}
        <span className="block mt-1 sm:mt-1.5 [transform-style:preserve-3d]">
          <Word3D word="Academic" />
          <Word3D word="Focus" />
          <Word3D word="&" />
        </span>

        {/* Line 3: "High-Grade Results." */}
        <span className="block mt-1 sm:mt-2 [transform-style:preserve-3d]">
          <Word3D word="High-Grade" isBlue isItalic />
          <Word3D word="Results." isBlue isItalic />
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-500 max-w-2xl font-normal leading-relaxed">
        FastTask helps university students master class routines, track coursework
        pipelines, and maintain deep study momentum — all in one unified workspace.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3.5 pt-2">
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-7 py-3.5 h-auto rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all group cursor-pointer"
        >
          <Link href={registerHref} className="flex items-center gap-2">
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>

        <button
          type="button"
          onClick={onOpenVideo}
          className="flex items-center gap-2.5 bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 hover:border-blue-200 text-sm font-medium px-6 py-3.5 rounded-full shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Play className="w-2.5 h-2.5 fill-white translate-x-0.5" />
          </div>
          <span>Watch Demo</span>
        </button>
      </div>
    </div>
  );
}
