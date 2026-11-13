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
      {/* Outer Container with Ambient Royal Blue Glow aligned to global 7xl grid */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Large Rounded Canvas in Crisp Solid White */}
        <div className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[42px] bg-white border border-[#E5EAF2] shadow-xl shadow-blue-500/5 overflow-hidden pb-8 sm:pb-12">

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
