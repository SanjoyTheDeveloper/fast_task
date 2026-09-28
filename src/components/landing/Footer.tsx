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
    <footer className="border-t border-[#E5EAF2] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 md:flex-row md:items-start md:justify-between">
        {/* Left Column: Brand Info */}
        <div className="max-w-sm">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
            aria-label="FastTask Home"
          >
            {/* FastTask Logo Icon */}
            <div className="h-9 w-9 rounded-xl bg-[#315BFF] flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-all">
              <CheckSquare className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#172033]">
                FastTask
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF] uppercase tracking-wide">
                PRO
              </span>
            </div>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 font-normal">
            A fast, high-performance personal workspace built for academic focus, semester routines, and daily study flow.
          </p>
        </div>

        {/* Right Columns: Links */}
        <div className="grid grid-cols-2 gap-8 sm:gap-16 text-sm">
          {/* Navigation Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              Navigation
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-slate-500 transition-colors hover:text-[#315BFF]"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-slate-500 transition-colors hover:text-[#315BFF]"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-500 transition-colors hover:text-[#315BFF]"
                >
                  Join Community
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              Account
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={loginHref}
                  className="text-slate-500 transition-colors hover:text-[#315BFF]"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href={registerHref}
                  className="text-slate-500 transition-colors hover:text-[#315BFF]"
                >
                  Register Free
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[#F1F5F9] px-4 py-6 text-center text-xs text-slate-400 sm:px-6">
        <p>© {new Date().getFullYear()} FastTask PRO. Engineered for scholars & students.</p>
      </div>
    </footer>
  );
}

export default Footer;
