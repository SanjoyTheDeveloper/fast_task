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
  { label: "Dashboard", href: "/dashboard" },
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
          ? "border-b border-[#E5EAF2] bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(49,91,255,0.04)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
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

        {/* Center: Minimal Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 backdrop-blur-md shadow-2xs"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-semibold text-slate-600 px-4 py-2 rounded-full transition-all duration-200 hover:text-[#315BFF] hover:bg-white hover:shadow-2xs"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Auth Action Buttons & Gradient Pill CTA (Desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href={loginHref}>Sign In</Link>
          </Button>

          <Button asChild size="pill">
            <Link href={registerHref}>
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-white/98 backdrop-blur-2xl border-b border-slate-200 p-6 flex flex-col justify-between z-50 animate-in fade-in duration-200">
          <div className="space-y-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-[#EEF3FF] hover:text-[#315BFF] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-200">
            <Button asChild variant="outline" className="w-full h-12 rounded-xl text-sm">
              <Link href={loginHref} onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild size="default" className="w-full h-12 rounded-xl text-sm">
              <Link href={registerHref} onClick={() => setMobileMenuOpen(false)}>
                Get Started Free →
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
