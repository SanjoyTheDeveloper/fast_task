"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeaderBanner } from "@/components/layout";
import { GIcon } from "@/components/ui/GIcon";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  Search,
  X,
  LayoutGrid,
  Columns,
  Printer,
  RotateCcw,
  Sparkles,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Filter,
} from "@/components/ui/GoogleIcon";
import { Toaster, toast } from "sonner";
import { AddRoutineModal, RoutineSlot } from "@/components/routine/AddRoutineModal";
import {
  getStoredRoutineSlots,
  saveStoredRoutineSlots,
  removeStoredRoutineSlot,
  DEFAULT_SAMPLE_SLOTS,
} from "@/lib/routineStorage";
import type { SessionUser } from "@/types";

const DAYS_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SHORT_DAYS_MAP: Record<string, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

/**
 * Converts "09:30 AM", "2:00 PM", or "14:30" to total minutes from midnight for sorting
 */
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");
  const timeOnly = clean.replace(/[AP]M/g, "").trim();
  const parts = timeOnly.split(":");
  let hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Calculates human-readable duration e.g. "1h 30m" or "90m"
 */
function calculateDuration(startTime: string, endTime: string): string {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (!start || !end || end <= start) return "90m";
  const diff = end - start;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

const COURSE_COLOR_MAP: Record<
  string,
  { accentBar: string; badge: string; text: string; lightBg: string; border: string }
> = {
  AIES: {
    accentBar: "bg-[#315BFF]",
    badge: "bg-[#315BFF] text-white shadow-2xs",
    text: "text-[#1D4ED8]",
    lightBg: "bg-blue-50/70",
    border: "border-blue-200",
  },
  AP: {
    accentBar: "bg-[#7C3AED]",
    badge: "bg-[#7C3AED] text-white shadow-2xs",
    text: "text-[#5B21B6]",
    lightBg: "bg-purple-50/70",
    border: "border-purple-200",
  },
  CN: {
    accentBar: "bg-[#10B981]",
    badge: "bg-[#10B981] text-white shadow-2xs",
    text: "text-[#065F46]",
    lightBg: "bg-emerald-50/70",
    border: "border-emerald-200",
  },
  MACS: {
    accentBar: "bg-[#F59E0B]",
    badge: "bg-[#F59E0B] text-white shadow-2xs",
    text: "text-[#92400E]",
    lightBg: "bg-amber-50/70",
    border: "border-amber-200",
  },
  TWRM: {
    accentBar: "bg-[#F97316]",
    badge: "bg-[#F97316] text-white shadow-2xs",
    text: "text-[#C2410C]",
    lightBg: "bg-orange-50/70",
    border: "border-orange-200",
  },
};

function getCourseBadgeStyle(courseCode: string, courseTitle: string) {
  const code = (courseCode || "").toUpperCase();
  const title = (courseTitle || "").toUpperCase();

  for (const [key, val] of Object.entries(COURSE_COLOR_MAP)) {
    if (code.includes(key) || title.includes(key)) {
      return val;
    }
  }

  // Fallback palette
  return {
    accentBar: "bg-slate-700",
    badge: "bg-slate-800 text-white shadow-2xs",
    text: "text-slate-800",
    lightBg: "bg-slate-50",
    border: "border-slate-200",
  };
}

export default function SchedulePage() {
  const router = useRouter();

  // Routine schedule state
  const [slots, setSlots] = React.useState<RoutineSlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDayTab, setSelectedDayTab] = React.useState<string>("All");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCourseFilter, setSelectedCourseFilter] = React.useState<string>("ALL");
  const [viewMode, setViewMode] = React.useState<"cards" | "grid">("cards");

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [slotToEdit, setSlotToEdit] = React.useState<RoutineSlot | null>(null);

  // Current day of week for highlight (e.g. "Sunday")
  const currentActualDay = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  }, []);

  // 1. Load authenticated user
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
          } else {
            router.push("/login?from=/schedule");
          }
        } else if (res.status === 401) {
          router.push("/login?from=/schedule");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }
    loadUser();
  }, [router]);

  // 2. Fetch routine slots (Instant local load + background sync)
  React.useEffect(() => {
    let isMounted = true;

    // 1. Instant local load on client mount after hydration
    try {
      const cached = getStoredRoutineSlots();
      if (cached && cached.length > 0 && isMounted) {
        setSlots(cached);
        setIsLoading(false);
      } else if (isMounted) {
        setSlots(DEFAULT_SAMPLE_SLOTS);
        setIsLoading(false);
      }
    } catch {
      if (isMounted) {
        setSlots(DEFAULT_SAMPLE_SLOTS);
        setIsLoading(false);
      }
    }

    // 2. Background sync
    async function fetchRoutine() {
      try {
        const res = await fetch("/api/routine", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            if (json.data.length > 0) {
              setSlots(json.data);
              saveStoredRoutineSlots(json.data);
            } else {
              const currentLocal = getStoredRoutineSlots();
              if (currentLocal && currentLocal.length > 0) {
                setSlots(currentLocal);
              } else {
                setSlots(DEFAULT_SAMPLE_SLOTS);
                saveStoredRoutineSlots(DEFAULT_SAMPLE_SLOTS);
              }
            }
          }
        }
      } catch {
        // Fallback to local offline cache silently
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchRoutine();

    const handleSync = () => {
      const cached = getStoredRoutineSlots();
      if (cached.length > 0) {
        setSlots(cached);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("fasttask:routine-updated", handleSync);
    }

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("fasttask:routine-updated", handleSync);
      }
    };
  }, []);

  // Handle slot saved (from Add / Edit modal, single or multiple)
  const handleSlotSaved = (savedSlot: RoutineSlot | RoutineSlot[]) => {
    const list = Array.isArray(savedSlot) ? savedSlot : [savedSlot];
    saveStoredRoutineSlots(list);
    setSlots((prev) => {
      const next = [...prev];
      for (const item of list) {
        const idx = next.findIndex((s) => s.id === item.id);
        if (idx >= 0) {
          next[idx] = item;
        } else {
          next.push(item);
        }
      }
      return next;
    });
  };

  // Handle slot deletion with immediate UI update
  const handleDeleteSlot = async (slotId: string, courseCode: string) => {
    removeStoredRoutineSlot(slotId);
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
    toast.info(`Removed "${courseCode}" from routine`);

    try {
      await fetch(`/api/routine/${slotId}`, {
        method: "DELETE",
      });
    } catch {
      // Handled silently
    }
  };

  // Restore default sample routine schedules
  const handleRestoreDefaults = async () => {
    saveStoredRoutineSlots(DEFAULT_SAMPLE_SLOTS);
    setSlots(DEFAULT_SAMPLE_SLOTS);
    toast.success("Standard academic routine restored successfully");

    try {
      await fetch("/api/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: DEFAULT_SAMPLE_SLOTS }),
      });
    } catch (e) {
      console.warn("Failed to sync restored slots to server:", e);
    }
  };

  // Open modal for editing
  const handleOpenEdit = (slot: RoutineSlot) => {
    setSlotToEdit(slot);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleOpenAdd = (dayPreset?: string) => {
    setSlotToEdit(null);
    if (dayPreset && dayPreset !== "All") {
      setSelectedDayTab(dayPreset);
    }
    setIsModalOpen(true);
  };

  // Available unique courses for quick filter chips
  const availableCourses = React.useMemo(() => {
    const map = new Map<string, string>();
    slots.forEach((s) => {
      if (s.courseCode) {
        map.set(s.courseCode, s.courseTitle || s.courseCode);
      }
    });
    return Array.from(map.entries()).map(([code, title]) => ({ code, title }));
  }, [slots]);

  // Filtered slots matching search and course filter
  const filteredSlots = React.useMemo(() => {
    let list = slots;

    if (selectedCourseFilter !== "ALL") {
      list = list.filter((s) => s.courseCode === selectedCourseFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.courseCode.toLowerCase().includes(q) ||
          s.courseTitle.toLowerCase().includes(q) ||
          (s.roomNo && s.roomNo.toLowerCase().includes(q)) ||
          (s.instructor && s.instructor.toLowerCase().includes(q)) ||
          s.dayOfWeek.toLowerCase().includes(q)
      );
    }

    return list;
  }, [slots, selectedCourseFilter, searchQuery]);

  // Group slots by Day of Week and sort chronologically by startTime
  const groupedSlots = React.useMemo(() => {
    const map = new Map<string, RoutineSlot[]>();
    DAYS_ORDER.forEach((d) => map.set(d, []));

    filteredSlots.forEach((slot) => {
      const rawDay = slot.dayOfWeek?.trim() || "Sunday";
      const normDay =
        SHORT_DAYS_MAP[rawDay.toLowerCase()] ||
        DAYS_ORDER.find((d) => d.toLowerCase() === rawDay.toLowerCase()) ||
        "Sunday";

      if (!map.has(normDay)) {
        map.set(normDay, []);
      }
      map.get(normDay)!.push(slot);
    });

    // Sort classes chronologically by startTime
    map.forEach((list) => {
      list.sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
    });

    return map;
  }, [filteredSlots]);

  // Filtered view based on selected day tab
  const displayDays = React.useMemo(() => {
    if (selectedDayTab !== "All") {
      return [selectedDayTab];
    }
    return DAYS_ORDER;
  }, [selectedDayTab]);

  const totalClassesCount = slots.length;
  const filteredClassesCount = filteredSlots.length;
  const todayClasses = groupedSlots.get(currentActualDay) || [];
  const todayClassesCount = todayClasses.length;

  // Real-time "Today at a glance" helper
  const smartStatus = React.useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (todayClasses.length === 0) {
      return {
        type: "off_day",
        title: `${currentActualDay} • Off-Day & Self-Study`,
        subtitle: "No classes scheduled for today. Great time for coursework revisions & labs.",
        icon: "weekend",
        color: "text-slate-600",
        badgeBg: "bg-slate-100 text-slate-700",
      };
    }

    // Check active class now
    for (const item of todayClasses) {
      const start = parseTimeToMinutes(item.startTime);
      const end = parseTimeToMinutes(item.endTime);
      if (currentMinutes >= start && currentMinutes <= end) {
        return {
          type: "live",
          title: `Active Class Now • ${item.courseCode}`,
          subtitle: `${item.courseTitle} in ${item.roomNo || "Campus"} (ends at ${item.endTime})`,
          icon: "play_circle",
          color: "text-emerald-700",
          badgeBg: "bg-emerald-100 text-emerald-800",
        };
      }
    }

    // Check next upcoming class today
    for (const item of todayClasses) {
      const start = parseTimeToMinutes(item.startTime);
      if (currentMinutes < start) {
        const diff = start - currentMinutes;
        const diffText = diff < 60 ? `in ${diff}m` : `in ${Math.floor(diff / 60)}h ${diff % 60}m`;
        return {
          type: "upcoming",
          title: `Next Class Today • ${item.courseCode} (${diffText})`,
          subtitle: `${item.courseTitle} at ${item.startTime} • ${item.roomNo || "Campus"} • ${item.instructor || "Faculty"}`,
          icon: "schedule",
          color: "text-[#315BFF]",
          badgeBg: "bg-blue-100 text-blue-800",
        };
      }
    }

    // All today's classes ended
    return {
      type: "done",
      title: `All Sessions Completed for ${currentActualDay}`,
      subtitle: `Completed ${todayClasses.length} lecture blocks today. See upcoming sessions for the week below.`,
      icon: "check_circle",
      color: "text-emerald-700",
      badgeBg: "bg-emerald-100 text-emerald-800",
    };
  }, [todayClasses, currentActualDay]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Main Wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Page Main Content */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6">
          
          {/* Top Banner matching design reference */}
          <PageHeaderBanner
            title="Class Routine & Lecture Schedule"
            titleHighlight="• Batch 82A"
            stats={[
              { label: "TOTAL CLASSES", value: totalClassesCount },
              { label: "TODAY", value: todayClassesCount },
            ]}
            actionButton={{
              label: "Add Class",
              onClick: () => handleOpenAdd(selectedDayTab !== "All" ? selectedDayTab : currentActualDay),
            }}
          />

          {/* 1. SMART STATUS CALLOUT: Today at a Glance */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-4.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 print:hidden">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#315BFF] flex items-center justify-center shrink-0 border border-blue-200/60 shadow-2xs">
                <GIcon name={smartStatus.icon} size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${smartStatus.badgeBg}`}>
                    {smartStatus.type === "live" ? "Live" : smartStatus.type === "upcoming" ? "Next Up" : "Status"}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {smartStatus.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  {smartStatus.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {selectedDayTab !== currentActualDay && (
                <button
                  type="button"
                  onClick={() => setSelectedDayTab(currentActualDay)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#315BFF] text-xs font-bold border border-blue-200/60 transition-colors cursor-pointer"
                >
                  <span>Jump to Today ({currentActualDay.slice(0, 3)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. COURSE QUICK FILTER CHIPS */}
          {availableCourses.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 print:hidden">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1.5 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Filter:</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedCourseFilter("ALL")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  selectedCourseFilter === "ALL"
                    ? "bg-[#315BFF] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Courses ({totalClassesCount})
              </button>

              {availableCourses.map((c) => {
                const isSelected = selectedCourseFilter === c.code;
                const count = slots.filter((s) => s.courseCode === c.code).length;

                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCourseFilter(isSelected ? "ALL" : c.code)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? "bg-[#0F172A] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span>{c.code}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. CONTROLS TOOLBAR: Search, Day Selector Pills, View Mode & Actions */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-3 sm:p-4 shadow-2xs space-y-3.5 print:hidden">
            {/* Top Row: Search Input + View Toggle & Utility Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course code, title, room no, or faculty..."
                  className="w-full pl-9.5 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* View Toggle (Cards vs Weekly Grid Matrix) + Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {/* View Switcher */}
                <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "cards"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Detailed Cards View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Weekly Matrix Table View"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Weekly Grid</span>
                  </button>
                </div>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                  title="Print or export routine"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Print Routine</span>
                </button>

                {/* Reset Standard Routine */}
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                  title="Restore standard CSE schedule"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Day Tabs (Only relevant when in Cards View) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedDayTab("All")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  selectedDayTab === "All"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                All Days ({filteredClassesCount})
              </button>

              {DAYS_ORDER.map((day) => {
                const dayClasses = groupedSlots.get(day) || [];
                const count = dayClasses.length;
                const isSelected = selectedDayTab === day;
                const isToday = currentActualDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDayTab(day)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? "bg-[#315BFF] text-white shadow-xs shadow-blue-500/20"
                        : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isToday && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-white" : "bg-[#315BFF]"
                        }`}
                      />
                    )}
                    <span>{day}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Search & Filter Banner (if filtering active) */}
          {(searchQuery || selectedCourseFilter !== "ALL") && (
            <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 font-medium">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#315BFF]" />
                <span>
                  Showing {filteredClassesCount} of {totalClassesCount} classes
                  {searchQuery && ` matching "${searchQuery}"`}
                  {selectedCourseFilter !== "ALL" && ` for course ${selectedCourseFilter}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCourseFilter("ALL");
                }}
                className="text-xs font-bold text-[#315BFF] hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* 4. TIMETABLE BODY */}
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="space-y-6 animate-pulse py-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4">
                  <div className="h-6 w-32 bg-slate-200 rounded-lg" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-32 rounded-2xl bg-slate-100 p-4 space-y-2" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredClassesCount === 0 && totalClassesCount === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-4 min-h-[380px]">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 text-[#315BFF] flex items-center justify-center shadow-xs">
                <CalendarDays className="h-8 w-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">
                  No schedule added yet. Click &apos;Add Class&apos; to set up your routine.
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Easily build and organize your weekly routine with class times, course codes, and room numbers.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenAdd(currentActualDay)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Class</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition-all cursor-pointer active:scale-95"
                >
                  <span>Restore Standard Routine</span>
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* ============================================================ */
            /* VIEW 1: WEEKLY MATRIX GRID (TIMETABLE BOARD VIEW)           */
            /* ============================================================ */
            <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <div className="min-w-[900px] grid grid-cols-7 gap-3.5">
                  {DAYS_ORDER.map((day) => {
                    const dayClasses = groupedSlots.get(day) || [];
                    const isToday = currentActualDay === day;

                    return (
                      <div
                        key={day}
                        className={`rounded-2xl border p-3 flex flex-col justify-between min-h-[460px] transition-all ${
                          isToday
                            ? "bg-blue-50/30 border-blue-300 ring-2 ring-blue-500/10"
                            : "bg-slate-50/60 border-slate-200/80"
                        }`}
                      >
                        {/* Day Column Header */}
                        <div>
                          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-slate-900 uppercase">
                                  {day.slice(0, 3)}
                                </span>
                                {isToday && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#315BFF] animate-pulse" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                {dayClasses.length} {dayClasses.length === 1 ? "session" : "sessions"}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenAdd(day)}
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-colors"
                              title={`Add class to ${day}`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Column Classes Stack */}
                          <div className="mt-3 space-y-2.5">
                            {dayClasses.length === 0 ? (
                              <div className="py-12 text-center text-[11px] text-slate-400">
                                <span>Off-Day</span>
                              </div>
                            ) : (
                              dayClasses.map((item) => {
                                const style = getCourseBadgeStyle(item.courseCode, item.courseTitle);

                                return (
                                  <div
                                    key={item.id}
                                    className="group relative rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 p-3 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
                                  >
                                    {/* Vertical accent stripe on left */}
                                    <div
                                      className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${style.accentBar}`}
                                    />

                                    <div className="pl-1 space-y-1.5">
                                      {/* Top Row: Course Code + Actions */}
                                      <div className="flex items-center justify-between gap-1">
                                        <span
                                          className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${style.badge}`}
                                        >
                                          {item.courseCode}
                                        </span>

                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEdit(item)}
                                            className="p-0.5 rounded text-slate-400 hover:text-blue-600"
                                            title="Edit"
                                          >
                                            <Pencil className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteSlot(item.id, item.courseCode)}
                                            className="p-0.5 rounded text-slate-400 hover:text-rose-600"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Course Title */}
                                      <h4
                                        className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight"
                                        title={item.courseTitle}
                                      >
                                        {item.courseTitle}
                                      </h4>

                                      {/* Time & Room */}
                                      <div className="pt-1.5 border-t border-slate-100 space-y-1 text-[10px] text-slate-600">
                                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                                          <Clock className="w-3 h-3 text-[#315BFF] shrink-0" />
                                          <span>{item.startTime}</span>
                                        </div>
                                        {item.roomNo && (
                                          <div className="flex items-center gap-1 text-slate-500">
                                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                            <span className="truncate">{item.roomNo}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Column Footer: Quick Add Link */}
                        <button
                          type="button"
                          onClick={() => handleOpenAdd(day)}
                          className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-200 hover:border-blue-300 hover:bg-white text-[11px] font-bold text-slate-400 hover:text-[#315BFF] transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* VIEW 2: CHRONOLOGICAL CARDS VIEW (DEFAULT)                  */
            /* ============================================================ */
            <div className="space-y-6">
              {displayDays.map((day) => {
                const dayClasses = groupedSlots.get(day) || [];
                const isToday = currentActualDay === day;

                // When in "All Days" view, skip rendering days that have 0 classes unless it's today
                if (selectedDayTab === "All" && dayClasses.length === 0 && !isToday && !searchQuery && selectedCourseFilter === "ALL") {
                  return null;
                }

                return (
                  <div
                    key={day}
                    className={`rounded-3xl bg-white border p-5 sm:p-6 shadow-2xs space-y-4 transition-all ${
                      isToday
                        ? "border-blue-300 ring-2 ring-blue-500/10"
                        : "border-slate-200/90"
                    }`}
                  >
                    {/* Day Group Header */}
                    <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                            isToday
                              ? "bg-[#315BFF] text-white shadow-xs"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm sm:text-base font-bold text-slate-900">
                              {day}
                            </h2>
                            {isToday && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                                Today
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {dayClasses.length} {dayClasses.length === 1 ? "class session" : "class sessions"}
                          </p>
                        </div>
                      </div>

                      {/* Add Slot specifically for this day */}
                      <button
                        type="button"
                        onClick={() => handleOpenAdd(day)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                        title={`Add class to ${day}`}
                      >
                        <Plus className="h-3.5 w-3.5 text-blue-600" />
                        <span>Add Class</span>
                      </button>
                    </div>

                    {/* Classes Grid */}
                    {dayClasses.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 text-xs text-slate-400 space-y-2">
                        <p>No classes scheduled for {day} (Off-Day / Self-Study)</p>
                        <button
                          type="button"
                          onClick={() => handleOpenAdd(day)}
                          className="text-xs font-bold text-[#315BFF] hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add class to {day}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dayClasses.map((item) => {
                          const style = getCourseBadgeStyle(item.courseCode, item.courseTitle);
                          const durationText = calculateDuration(item.startTime, item.endTime);

                          return (
                            <div
                              key={item.id}
                              className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 p-4.5 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                              {/* 4px Vertical accent bar on left */}
                              <div
                                className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full ${style.accentBar}`}
                              />

                              <div className="pl-1.5 space-y-2.5">
                                {/* Top: Course Code Badge + Duration Pill + Actions */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${style.badge}`}
                                    >
                                      {item.courseCode}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-100">
                                      {durationText}
                                    </span>
                                  </div>

                                  {/* Edit & Delete Actions */}
                                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(item)}
                                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                      title="Edit class"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSlot(item.id, item.courseCode)}
                                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                      title="Delete class"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Course Title */}
                                <div>
                                  <h3
                                    className="text-sm font-bold text-slate-900 group-hover:text-[#315BFF] transition-colors leading-snug line-clamp-2"
                                    title={item.courseTitle}
                                  >
                                    {item.courseTitle}
                                  </h3>
                                </div>
                              </div>

                              {/* Card Meta: Time slot, Room No & Instructor */}
                              <div className="pl-1.5 mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                                {/* Time slot */}
                                <div className="flex items-center gap-2 font-medium">
                                  <Clock className="w-3.5 h-3.5 text-[#315BFF] shrink-0" />
                                  <span className="font-semibold text-slate-800">
                                    {item.startTime} – {item.endTime}
                                  </span>
                                </div>

                                {/* Room Number */}
                                {item.roomNo && (
                                  <div className="flex items-center gap-2 font-medium text-slate-600">
                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span>{item.roomNo}</span>
                                  </div>
                                )}

                                {/* Instructor */}
                                {item.instructor && (
                                  <div className="flex items-center gap-2 font-medium text-slate-500">
                                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">Faculty: {item.instructor}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Routine Modal */}
      <AddRoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSlotSaved}
        slotToEdit={slotToEdit}
        defaultDay={selectedDayTab !== "All" ? selectedDayTab : currentActualDay}
      />
    </div>
  );
}
