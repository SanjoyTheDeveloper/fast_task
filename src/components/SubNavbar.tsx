"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  Stethoscope,
  Calendar,
  FileText,
  Sparkles,
  Pill,
  FlaskConical,
  Search,
  CheckCircle2,
  X,
  Compass,
} from "lucide-react";
import { HiOutlineTicket } from "react-icons/hi2";

export interface ServiceShortcut {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const serviceShortcuts: ServiceShortcut[] = [
  { id: "doctors", label: "Find Doctors", href: "#doctors", icon: Stethoscope },
  { id: "appointment", label: "Book Appointment", href: "#appointment", icon: Calendar, badge: "Fast" },
  { id: "reports", label: "Online Reports", href: "#reports", icon: FileText },
  { id: "packages", label: "Health Packages", href: "#packages", icon: Sparkles },
  { id: "pharmacy", label: "Pharmacy Store", href: "#pharmacy", icon: Pill },
  { id: "diagnostics", label: "Lab Diagnostics", href: "#diagnostics", icon: FlaskConical },
];

export function SubNavbar() {
  const [activeShortcut, setActiveShortcut] = useState<string>("doctors");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("A-109");
  const [verifiedToken, setVerifiedToken] = useState<string | null>("A-109");
  const [tokenStatus, setTokenStatus] = useState<{
    queuePosition: number;
    estWait: string;
    room: string;
    doctor: string;
  } | null>({
    queuePosition: 2,
    estWait: "4 min",
    room: "Room 3B",
    doctor: "Dr. Sarah Chen, MD",
  });

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const cleanToken = tokenInput.toUpperCase().trim();
    setVerifiedToken(cleanToken);
    setTokenStatus({
      queuePosition: Math.floor(Math.random() * 4) + 1,
      estWait: `${Math.floor(Math.random() * 8) + 3} min`,
      room: "Room 3B",
      doctor: "Dr. Sarah Chen, MD",
    });
    setIsTokenModalOpen(false);
  };

  return (
    <>
      {/* Secondary Sticky Sub-Navbar */}
      <nav
        aria-label="HealthBridge Quick Access Sub-Navbar"
        className="sticky top-16 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-2 sm:gap-4 text-xs">
          
          {/* 1. LEFT SECTION - Live System Status & OPD Quick Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Queue Pulse Pill */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1 text-emerald-800 font-semibold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="hidden xl:inline text-[11px] font-bold tracking-tight">
                Emergency &amp; OPD Active
              </span>
              <span className="xl:hidden inline text-[11px] font-bold">
                OPD Active
              </span>
              <span className="hidden sm:inline text-emerald-600/70 text-[10px]">• Live Queue</span>
            </div>

            {/* OPD Token Quick Status / Verification Pill */}
            <button
              type="button"
              onClick={() => setIsTokenModalOpen(true)}
              className="group flex items-center gap-1.5 rounded-lg border border-blue-200/90 bg-blue-50/60 px-2 sm:px-2.5 py-1 font-semibold text-blue-700 hover:bg-blue-100/70 transition-all active:scale-95 shadow-2xs"
              title="Click to check your live queue position"
            >
              <HiOutlineTicket className="h-3.5 w-3.5 text-blue-600" />
              {verifiedToken ? (
                <span className="flex items-center gap-1">
                  <span className="text-slate-500 hidden sm:inline">Token:</span>
                  <strong className="font-mono font-bold text-blue-800">#{verifiedToken}</strong>
                  {tokenStatus && (
                    <span className="hidden md:inline rounded bg-blue-200/60 px-1 py-0.2 text-[9px] font-bold text-blue-900">
                      {tokenStatus.estWait}
                    </span>
                  )}
                </span>
              ) : (
                <span>Verify Token</span>
              )}
            </button>
          </div>

          {/* 2. MIDDLE SECTION - Direct Service Shortcuts (Horizontally Scrollable) */}
          <div className="flex-1 overflow-x-auto scrollbar-none py-1 mx-1 sm:mx-2 flex items-center justify-start lg:justify-center gap-1 sm:gap-1.5">
            {serviceShortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              const isActive = activeShortcut === shortcut.id;
              return (
                <button
                  key={shortcut.id}
                  type="button"
                  onClick={() => setActiveShortcut(shortcut.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? "text-blue-600 bg-blue-50/90 font-bold shadow-2xs ring-1 ring-blue-500/20"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{shortcut.label}</span>
                  {shortcut.badge && (
                    <span className="rounded bg-sky-100 px-1 py-0.2 text-[9px] font-extrabold text-sky-700">
                      {shortcut.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. RIGHT SECTION - Fast Assistance & CTA Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Emergency Hotline */}
            <a
              href="tel:10678"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50/70 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100/80 transition-colors shadow-2xs"
            >
              <PhoneCall className="h-3 w-3 text-rose-600 animate-pulse" />
              <span>24/7 Hotline: <strong className="font-mono text-rose-800">10678</strong></span>
            </a>

            {/* Track My Position / Call Next Token CTA */}
            <button
              type="button"
              onClick={() => setIsTokenModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
            >
              <Compass className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Track My Position</span>
              <span className="sm:hidden">Track</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Interactive Token Queue Tracking Modal */}
      {isTokenModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in-up"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <HiOutlineTicket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live OPD Token Telemetry
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    St. Jude Central Hospital • Department Queue
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Token Input Form */}
            <form onSubmit={handleVerifyToken} className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor="tokenInput"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Enter Your Token or UHID Number
                </label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                  <input
                    id="tokenInput"
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="e.g. A-109 or #HB-8941"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs font-mono font-bold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Status Display Card if verified */}
              {tokenStatus && (
                <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      Queue Position: #{tokenStatus.queuePosition} in Line
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-blue-100">
                    <div>
                      <span className="text-slate-500 block">Estimated Wait:</span>
                      <strong className="text-slate-800 font-bold">{tokenStatus.estWait}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Assigned Station:</span>
                      <strong className="text-slate-800 font-bold">{tokenStatus.room}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] pt-1 text-slate-600">
                    Attending: <strong className="text-slate-800">{tokenStatus.doctor}</strong>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-98 transition-all"
                >
                  Verify Live Position
                </button>
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(false)}
                  className="rounded-xl border border-slate-200 py-2.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SubNavbar;
