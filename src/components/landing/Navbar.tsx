"use client";

import * as React from "react";
import Link from "next/link";
import { CheckSquare, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems?: NavItem[];
  loginHref?: string;
  registerHref?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "LMS Library", href: "/lms" },
  { label: "Schedule", href: "#portfolio" },
  { label: "Features", href: "#features" },
  { label: "Routine", href: "#routine" },
];

export function Navbar({
  navItems = defaultNavItems,
  loginHref = "/login",
  registerHref = "/register",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.08] bg-[#0A0D14]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90 group"
          aria-label="FastTask Home"
        >
          {/* Glowing abstract geometric icon */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0B0F17]">
              <div className="relative">
                <CheckSquare className="h-5 w-5 text-cyan-400 stroke-[2.3]" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Fast<span className="text-cyan-400">Task</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
              Academic
            </span>
          </div>
        </Link>

        {/* Center: Minimal Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-inner"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-semibold text-slate-300 px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Auth Action Buttons & Gradient Pill CTA (Desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={loginHref}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </Link>

          <Link
            href={registerHref}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all border border-cyan-400/30"
          >
            <span>Launch App</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[#0A0D14]/95 backdrop-blur-2xl border-b border-white/[0.1] p-6 flex flex-col justify-between z-50 animate-in fade-in duration-200">
          <div className="space-y-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/[0.08]">
            <Link
              href={loginHref}
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.1] text-sm font-semibold text-white hover:bg-white/[0.06]"
            >
              Sign In
            </Link>
            <Link
              href={registerHref}
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-600/30"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
