"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  HeroTopNav,
  HeroHeadline,
  HeroOrbitHalo,
} from "./hero-sections";

const HeroVideoModal = dynamic(
  () =>
    import("./hero-sections/HeroVideoModal").then((m) => m.HeroVideoModal),
  { ssr: false }
);

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);
  const [registerHref, setRegisterHref] = React.useState("/register");
  const [activeNav, setActiveNav] = React.useState("Home");

  React.useEffect(() => {
    try {
      const isAuth =
        document.cookie.includes("authjs.session-token") ||
        document.cookie.includes("__Secure-authjs.session-token");
      if (isAuth) {
        setRegisterHref("/dashboard");
      }
    } catch {
      // Fallback in case of environment constraint
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full pt-2 sm:pt-4 pb-12 sm:pb-16 select-none overflow-hidden"
    >
      {/* Outer Container with Ambient Royal Blue Glow */}
      <div className="relative mx-auto max-w-[1360px] px-2.5 sm:px-4 lg:px-6">
        {/* Large Rounded Canvas Without Outer Stroke Lines */}
        <div className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[42px] bg-white shadow-xl shadow-blue-500/5 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/60 via-white to-white pb-8 sm:pb-12">
          {/* Hardware-Accelerated Ambient Background Gradients (Zero blur lag) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-full max-w-4xl bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-1/4 h-64 w-64 bg-[radial-gradient(circle,rgba(59,130,246,0.08),transparent_70%)]"
          />

          {/* 1. Top Navigation Bar (Inside Canvas) */}
          <HeroTopNav
            registerHref={registerHref}
            activeNav={activeNav}
            onSelectNav={setActiveNav}
          />

          {/* 2. Hero Typography & Action Buttons with Interactive 3D Mouse Parallax */}
          <HeroHeadline
            registerHref={registerHref}
            onOpenVideo={() => setIsVideoOpen(true)}
          />

          {/* 3. Central Visual & Floating Dynamic Cards with Live Mouse Move & Drag Interaction */}
          <HeroOrbitHalo />
        </div>
      </div>

      {/* Video Walkthrough Modal */}
      <HeroVideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </section>
  );
}

export default Hero;
