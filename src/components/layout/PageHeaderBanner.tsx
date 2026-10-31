"use client";

import * as React from "react";
import { Plus } from "lucide-react";

export interface PageStatItem {
  label: string;
  value: string | number;
}

export interface PageHeaderBannerProps {
  badgeIcon?: React.ReactNode;
  badgeText: string;
  title: string;
  titleHighlight?: string;
  description: string;
  stats?: PageStatItem[];
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
  className?: string;
}

export function PageHeaderBanner({
  badgeIcon,
  badgeText,
  title,
  titleHighlight,
  description,
  stats = [],
  actionButton,
  children,
  className = "",
}: PageHeaderBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF4FF] via-[#F4F8FF] to-white border border-[#DCE7FC]/90 p-6 sm:p-7 lg:p-8 shadow-[0_2px_16px_rgba(37,99,235,0.06)] ${className}`}
    >
      {/* Subtle ambient background glow */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 h-48 w-48 rounded-full bg-blue-500/8 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 right-12 h-44 w-44 rounded-full bg-indigo-500/5 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Badge + Title + Description */}
        <div className="max-w-2xl">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs mb-3 ring-2 ring-blue-500/5">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {title}{" "}
            {titleHighlight && (
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black">
                {titleHighlight}
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Side: Stats Pill Card + Action Button */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
          {/* Stats Pill Box */}
          {stats.length > 0 && (
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 px-5 py-2.5 sm:py-3 shadow-2xs flex items-center divide-x divide-slate-100 gap-5 sm:gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start px-2 first:pl-0 last:pr-0"
                >
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight mt-0.5">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          {actionButton && (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-98 shrink-0"
            >
              {actionButton.icon || <Plus className="h-4 w-4 stroke-[3]" />}
              <span>{actionButton.label}</span>
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
