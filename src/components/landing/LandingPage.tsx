import { Hero } from "@/components/landing/Hero";
import { KpiShowcase } from "@/components/landing/KpiShowcase";
import { GlitchReality } from "@/components/landing/GlitchReality";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#172033] antialiased selection:bg-[#315BFF] selection:text-white overflow-x-hidden">
      <main>
        {/* Hero Canvas Showcase Section (Contains integrated top navigation inside canvas) */}
        <Hero />

        {/* 3. KPI Showcase Section Matching Reference Design */}
        <KpiShowcase />

        {/* 4. Academic Focus Showcase Section */}
        <GlitchReality />

        {/* 5. How It Works Section */}
        <HowItWorks />

        {/* 5. Final Call To Action Section */}
        <CTA />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
