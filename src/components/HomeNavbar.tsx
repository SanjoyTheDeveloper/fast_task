"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import SubNavbar from "./SubNavbar";

export interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

export interface HomeNavbarProps {
  showSubNavbar?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Doctor Console", href: "#console" },
  { label: "Live Queue Triage", href: "#queue", badge: "Live" },
  { label: "Central UHID", href: "#uhid" },
  { label: "Diagnostic Lab", href: "#reports" },
  { label: "Departments", href: "#departments" },
];

export function HomeNavbar({ showSubNavbar = true }: HomeNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20">
              <Activity className="h-5 w-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Health<span className="text-blue-600">Bridge</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Medical Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative px-3 py-1.5 text-xs lg:text-sm font-semibold text-slate-600 transition-colors duration-150 hover:text-blue-600 hover:bg-slate-100/70 rounded-lg flex items-center gap-1.5"
              >
                {item.label}
                {item.badge && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-blue-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>HL7 / FHIR Synchronized</span>
            </div>

            <Link
              href="/login"
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Doctor Portal
            </Link>

            <Link
              href="#demo"
              className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              <span>Book Live Demo</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/95 px-4 pt-3 pb-6 shadow-xl backdrop-blur-lg animate-fade-in-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Doctor Portal
                </Link>
                <Link
                  href="#demo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-500/25"
                >
                  Book Live Demo
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Sticky Sub-Navbar mounted immediately below header */}
      {showSubNavbar && <SubNavbar />}
    </>
  );
}

export { SubNavbar };
export default HomeNavbar;
