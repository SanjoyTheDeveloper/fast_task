import Link from "next/link";
import { CheckSquare } from "lucide-react";

export interface FooterProps {
  loginHref?: string;
  registerHref?: string;
}

export function Footer({
  loginHref = "/login",
  registerHref = "/register",
}: FooterProps) {
  return (
    <footer className="bg-transparent text-[#172033] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enclosing Card / Box Container using Signature Dashboard Colors */}
        <div className="relative rounded-2xl sm:rounded-[32px] border border-[#DCE7FC] bg-gradient-to-r from-[#EEF4FF] via-[#F4F7FF] to-[#E9F0FE] shadow-[0_12px_45px_rgba(49,91,255,0.06)] overflow-hidden p-5 sm:p-10 lg:p-14">
          {/* Decorative ambient subtle background glows matching dashboard */}
          <div className="pointer-events-none absolute -top-12 -left-12 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-indigo-300/10 blur-3xl" />

          {/* Even 4-Column Grid */}
          <div className="relative z-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Column 1: Brand Info */}
            <div className="space-y-3.5">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
                aria-label="FastTask Home"
              >
                <div className="h-9 w-9 rounded-xl bg-[#315BFF] flex items-center justify-center text-white shadow-sm shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-all">
                  <CheckSquare className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-[#172033]">
                    FastTask
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF] uppercase tracking-wide">
                    PRO
                  </span>
                </div>
              </Link>

              <p className="text-sm leading-relaxed text-slate-500 font-normal">
                A personal workspace built for academic focus, semester routines, and daily study flow.
              </p>
            </div>

            {/* Column 2: Workspace */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-900 tracking-normal">
                Workspace
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kanban"
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Kanban Board
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lms"
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Course
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-900 tracking-normal">
                Platform
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/#how-it-works"
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    How FastTask Works
                  </Link>
                </li>
                <li>
                  <a
                    href="#hero"
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Interactive Showcase
                  </a>
                </li>
                <li>
                  <Link
                    href={registerHref}
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Get Started Free
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Account */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-900 tracking-normal">
                Account
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href={loginHref}
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href={registerHref}
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-slate-600 hover:text-[#315BFF] transition-colors"
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
