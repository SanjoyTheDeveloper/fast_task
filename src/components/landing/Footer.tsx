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
    <footer className="bg-transparent text-[#172033]">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        {/* Even 4-Column Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
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
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-[#315BFF] border border-blue-200 uppercase tracking-wide">
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
                  href="/calendar"
                  className="text-slate-600 hover:text-[#315BFF] transition-colors"
                >
                  Schedule & Routine
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
                  LMS Library
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
                <a
                  href="#features"
                  className="text-slate-600 hover:text-[#315BFF] transition-colors"
                >
                  Showcase
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-slate-600 hover:text-[#315BFF] transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  href="/notes"
                  className="text-slate-600 hover:text-[#315BFF] transition-colors"
                >
                  Study Notes
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-600 hover:text-[#315BFF] transition-colors"
                >
                  Get Started
                </a>
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
                  href="/settings"
                  className="text-slate-600 hover:text-[#315BFF] transition-colors"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FastTask PRO. Built for academic focus & high-grade results.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
