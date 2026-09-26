import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0D14] text-white antialiased selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background ambient radial glow effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),rgba(37,99,235,0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[600px] left-1/2 -z-10 h-[600px] w-full max-w-6xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_65%)]"
      />

      {/* 1. Navbar */}
      <Navbar />

      <main>
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Features Section */}
        <Features />

        {/* 4. How It Works Section */}
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
