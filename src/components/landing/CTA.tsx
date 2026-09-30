import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF4FF] via-[#F4F7FF] to-[#E9F0FE] border border-[#DCE7FC] px-6 py-14 text-center shadow-lg sm:px-16 sm:py-20">
        {/* Ambient radial blur backdrops */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-300/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Heading */}
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[#172033] leading-tight">
            {headline}
          </h2>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto font-normal">
            {subheadline}
          </p>

          {/* CTA Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
            <Button asChild size="pillLg" className="w-full sm:w-52">
              <Link href={registerHref} className="flex items-center justify-center gap-2 w-full">
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="pillLg" className="w-full sm:w-52">
              <Link href={loginHref} className="flex items-center justify-center gap-2 w-full">
                <span>Log In</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
