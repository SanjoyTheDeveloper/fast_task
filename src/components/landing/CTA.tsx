import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CTAProps {
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  registerHref?: string;
  loginHref?: string;
}

export function CTA({
  headline = (
    <>
      Organize Your Semester &amp;
      <br />
      Master Every Deadline
    </>
  ),
  subheadline = (
    <>
      Plan your weekly class routines, track assignments, and maintain peak focus
      <br className="hidden sm:inline" />
      {" "}with FastTask.
    </>
  ),
  registerHref = "/register",
  loginHref = "/login",
}: CTAProps) {
  return (
    <section id="contact" className="relative py-14 sm:py-20 lg:py-24 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Outer Card Container aligned to global 7xl grid */}
        <div className="relative mx-auto w-full overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#F2F5FE] border border-[#DCE6F8] shadow-[0_20px_50px_-15px_rgba(37,99,235,0.06),0_10px_25px_-5px_rgba(15,23,42,0.03)] min-h-[380px] sm:min-h-[447px] flex items-center justify-center">
        
        {/* Full High-Resolution Illustrated Academic Artwork Background */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <Image
            src="/images/cta/cta_illustrated_bg.png"
            alt="FastTask Academic Planner & Calendar Illustration"
            fill
            priority
            className="object-cover object-center select-none"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>

        {/* Soft Mobile Readability Shield (Only active on ultra-narrow mobile viewports) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 bg-[#F2F5FE]/80 sm:hidden"
        />

        {/* Foreground Content: Title, Subtitle, and Pill Buttons */}
        <div className="relative z-10 w-full px-6 py-12 sm:px-12 sm:py-16 text-center max-w-2xl mx-auto">
          
          {/* Display Heading matching reference line-for-line */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-black tracking-tight text-[#0F172A] leading-[1.14] drop-shadow-2xs">
            {headline}
          </h2>

          {/* Subheading matching reference line-for-line */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-[#475569] max-w-xl mx-auto font-normal">
            {subheadline}
          </p>

          {/* CTA Action Buttons matching reference side-by-side pill design */}
          <div className="mt-8 sm:mt-10 flex flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href={registerHref}
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white text-sm sm:text-base font-semibold shadow-[0_4px_16px_rgba(49,91,255,0.32)] hover:shadow-[0_6px_22px_rgba(49,91,255,0.42)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href={loginHref}
              className="inline-flex items-center justify-center px-7 sm:px-9 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-[#0F172A] text-sm sm:text-base font-semibold shadow-xs hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Log In</span>
            </Link>
          </div>

        </div>

      </div>
      </div>
    </section>
  );
}

export default CTA;
