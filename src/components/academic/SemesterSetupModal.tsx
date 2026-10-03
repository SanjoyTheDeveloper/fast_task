"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, GraduationCap, Clock, Sparkles } from "@/components/ui/GoogleIcon";
import { SemesterConfig } from "@/lib/academic";

interface SemesterSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SemesterConfig;
  onSave: (config: SemesterConfig) => void;
}

export function SemesterSetupModal({
  open,
  onOpenChange,
  config,
  onSave,
}: SemesterSetupModalProps) {
  const [name, setName] = useState(config.name);
  const [startDate, setStartDate] = useState(config.startDate);
  const [endDate, setEndDate] = useState(config.endDate);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(config.name || "Fall Semester 2026");
      setStartDate(config.startDate || "2026-08-24");
      setEndDate(config.endDate || "2026-12-18");
      setError(null);
    }
  }, [open, config]);

  // Calculate duration in weeks
  const calculatedWeeks = React.useMemo(() => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const diffDays = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return null;
    return Math.ceil(diffDays / 7);
  }, [startDate, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a semester name");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("Semester end date must be after the start date");
      return;
    }

    onSave({
      name: name.trim(),
      startDate,
      endDate,
    });
    onOpenChange(false);
  };

  const applyPreset = (presetName: string, start: string, end: string) => {
    setName(presetName);
    setStartDate(start);
    setEndDate(end);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5 sm:p-7 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
              Semester Setup & Dates
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-slate-500">
            Define your academic term duration to calculate week numbers and automate routine schedules.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Quick Term Presets
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  applyPreset("Fall Semester 2026", "2026-08-24", "2026-12-18")
                }
                className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 text-left font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <span className="font-bold block text-slate-900">Fall 2026</span>
                <span className="text-[10px] text-slate-500">Aug 24 - Dec 18</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset("Spring Semester 2027", "2027-01-11", "2027-05-14")
                }
                className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 text-left font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <span className="font-bold block text-slate-900">Spring 2027</span>
                <span className="text-[10px] text-slate-500">Jan 11 - May 14</span>
              </button>
            </div>
          </div>

          {/* Semester Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Semester / Term Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Fall Semester 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 text-sm rounded-xl border-slate-200"
            />
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 text-sm rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                End Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 text-sm rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Calculated Week Duration Preview */}
          {calculatedWeeks && (
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-indigo-600" />
                Total Academic Duration:
              </span>
              <span className="font-bold">{calculatedWeeks} Academic Weeks</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-slate-200 h-10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/25 h-10 cursor-pointer"
            >
              Save Semester Dates
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
