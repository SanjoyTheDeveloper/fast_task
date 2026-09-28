import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#172033] antialiased selection:bg-[#315BFF] selection:text-white overflow-x-hidden">
      {/* Background ambient radial glow effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(49,91,255,0.08),rgba(99,102,241,0.05),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[600px] left-1/2 -z-10 h-[600px] w-full max-w-6xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.04),transparent_65%)]"
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
