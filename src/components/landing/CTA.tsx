import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, GraduationCap } from "lucide-react";

export interface CTAProps {
  headline?: string;
  subheadline?: string;
  registerHref?: string;
  loginHref?: string;
}

export function CTA({
  headline = "Elevate Your Academic Performance Today",
  subheadline = "Join thousands of university students organizing lectures, mastering assignment deadlines, and maintaining peak focus with FastTask.",
  registerHref = "/register",
  loginHref = "/login",
}: CTAProps) {
  return (
    <section id="contact" className="relative px-4 pb-20 sm:px-6 sm:pb-32 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] px-6 py-14 text-center text-white shadow-2xl sm:px-16 sm:py-24">
        {/* Ambient radial blur backdrops */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            <span>Built for High-Achieving Students</span>
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
            {headline}
          </h2>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto">
            {subheadline}
          </p>

          {/* CTA Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
            <Link
              href={registerHref}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-[0_0_25px_rgba(37,99,235,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] hover:scale-102 active:scale-98 transition-all border border-cyan-400/40"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={loginHref}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] transition-all backdrop-blur-md"
            >
              <span>Sign In to Workspace</span>
            </Link>
          </div>

          {/* Value reassurance badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              100% Free student workspace
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              Instant timetable sync
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
