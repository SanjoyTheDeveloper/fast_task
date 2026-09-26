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
    <footer className="border-t border-white/[0.08] bg-[#0A0D14]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 md:flex-row md:items-start md:justify-between">
        {/* Left Column: Brand Info */}
        <div className="max-w-sm">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90 group"
            aria-label="FastTask Home"
          >
            {/* Glowing abstract geometric icon */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B0F17]">
                <CheckSquare className="h-4 w-4 text-cyan-400 stroke-[2.3]" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                Fast<span className="text-cyan-400">Task</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
                Academic
              </span>
            </div>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            A fast, high-performance personal workspace built for academic focus, semester routines, and daily study flow.
          </p>
        </div>

        {/* Right Columns: Links */}
        <div className="grid grid-cols-2 gap-8 sm:gap-16 text-sm">
          {/* Navigation Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-slate-400 transition-colors hover:text-cyan-400"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-slate-400 transition-colors hover:text-cyan-400"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-400 transition-colors hover:text-cyan-400"
                >
                  Join Community
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Account
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={loginHref}
                  className="text-slate-400 transition-colors hover:text-cyan-400"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href={registerHref}
                  className="text-slate-400 transition-colors hover:text-cyan-400"
                >
                  Register Free
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/[0.06] px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
        <p>© {new Date().getFullYear()} FastTask Academic. Engineered for scholars.</p>
      </div>
    </footer>
  );
}

export default Footer;
