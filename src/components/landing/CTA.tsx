import * as React from "react";
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
    <section id="contact" className="relative px-4 pb-20 sm:px-6 sm:pb-28 lg:pb-36 lg:px-8 select-none">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#F2F6FE] via-[#FFFFFF] to-[#EFF4FE] border border-[#DCE6F8] px-6 py-14 text-center shadow-[0_20px_50px_-15px_rgba(37,99,235,0.06),0_10px_25px_-5px_rgba(15,23,42,0.03)] sm:px-12 sm:py-20 lg:py-24">
        {/* Soft atmospheric ambient daylight glows matching the reference */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.18)_0%,transparent_70%)] blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(165,180,252,0.18)_0%,transparent_70%)] blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-full max-w-2xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(49,91,255,0.04)_0%,transparent_65%)] blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Display Heading matching reference line-for-line */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight text-[#0F172A] leading-[1.14]">
            {headline}
          </h2>

          {/* Subheading matching reference */}
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
    </section>
  );
}

export default CTA;
