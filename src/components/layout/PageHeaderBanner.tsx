"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";

export interface PageStatItem {
  label: string;
  value: string | number;
}

export interface PageHeaderBannerProps {
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
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
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF4FF] via-[#F4F8FF] to-white border border-[#DCE7FC]/90 p-4 sm:p-5 lg:py-4.5 lg:px-6 shadow-[0_2px_12px_rgba(37,99,235,0.05)] ${className}`}
    >
      {/* Subtle ambient background glow */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-blue-500/8 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 right-12 h-36 w-36 rounded-full bg-indigo-500/5 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        {/* Left Side: Title & Optional Subtitle */}
        <div className="max-w-2xl">
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 border border-blue-200/80 text-blue-700 text-[11px] sm:text-xs font-bold shadow-2xs mb-2 ring-2 ring-blue-500/5">
              {badgeIcon}
              <span>{badgeText}</span>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {title}{" "}
            {titleHighlight && (
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black">
                {titleHighlight}
              </span>
            )}
          </h1>

          {/* Optional Subtitle */}
          {description && (
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Right Side: Stats Pill Card + Action Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Stats Pill Box */}
          {stats.length > 0 && (
            <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200/80 px-4 py-2 sm:py-2.5 shadow-2xs flex items-center divide-x divide-slate-100 gap-4 sm:gap-5">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start px-1.5 first:pl-0 last:pr-0"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight mt-0.5">
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
              className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] text-white font-bold text-xs sm:text-sm px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-98 shrink-0"
            >
              {actionButton.icon || <GIcon name="add" size={18} weight={600} />}
              <span>{actionButton.label.replace(/^\+\s*/, "")}</span>
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
