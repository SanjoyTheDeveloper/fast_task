import React from "react";
import type { Metadata } from "next";
import { HomeNavbar } from "@/components/HomeNavbar";
import { SubNavbar } from "@/components/SubNavbar";
import { HeroShowcaseSection } from "@/components/HeroShowcaseSection";

export const metadata: Metadata = {
  title: "HealthBridge 3D Showcase & Quick-Access SubNavbar",
  description:
    "HealthBridge connects OPD queue triage, digital doctor consoles, centralized patient UHID records, and automated diagnostic reports.",
};

export default function HealthBridgeShowcasePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Main Sticky Header */}
      <HomeNavbar showSubNavbar={false} />

      {/* 2. Secondary Sub-Navbar positioned directly underneath */}
      <SubNavbar />

      <main>
        {/* 3. 3D Isometric Showcase Hero */}
        <HeroShowcaseSection />
      </main>
    </div>
  );
}
