"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Sparkles,
  Coffee,
  Pencil,
  Trash2,
  Plus,
  CalendarDays,
} from "lucide-react";
import { GIcon } from "@/components/ui/GIcon";
import { useStudentProfile } from "@/lib/studentProfile";
import { AddRoutineModal, RoutineSlot } from "@/components/routine/AddRoutineModal";
import { toast } from "sonner";
import {
  getStoredRoutineSlots,
  saveStoredRoutineSlots,
  removeStoredRoutineSlot,
} from "@/lib/routineStorage";

export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseColor: string;
  type: string;
  typeColor: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  faculty: string;
  borderColor: string;
}

export const WEEKLY_SCHEDULE: Record<string, ScheduleItem[]> = {
  Sun: [],
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
};

const DAYS_LIST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_MAP_TO_SHORT: Record<string, string> = {
  sunday: "Sun",
  sun: "Sun",
  monday: "Mon",
  mon: "Mon",
  tuesday: "Tue",
  tue: "Tue",
  wednesday: "Wed",
  wed: "Wed",
  thursday: "Thu",
  thu: "Thu",
  friday: "Fri",
  fri: "Fri",
  saturday: "Sat",
  sat: "Sat",
};

const DAY_FULL_NAMES: Record<string, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

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

function getCourseCardTheme(courseCode: string) {
  const code = (courseCode || "").toUpperCase();
  if (code.includes("AIES") || code.includes("321")) {
    return {
      courseColor: "bg-[#5B63E6] text-white",
      typeColor: "text-[#5B63E6]",
      borderColor: "border-[#D8E3FD] hover:border-[#5B63E6]/60",
    };
  }
  if (code.includes("AP") || code.includes("333")) {
    return {
      courseColor: "bg-[#315BFF] text-white",
      typeColor: "text-[#315BFF]",
      borderColor: "border-[#D0DFFF] hover:border-[#315BFF]/60",
    };
  }
  if (code.includes("MACS") || code.includes("337")) {
    return {
      courseColor: "bg-[#F59E0B] text-white",
      typeColor: "text-[#D97706]",
      borderColor: "border-[#FED7AA]/80 hover:border-[#F59E0B]/60",
    };
  }
  if (code.includes("CN") || code.includes("315")) {
    return {
      courseColor: "bg-[#0284C7] text-white",
      typeColor: "text-[#0284C7]",
      borderColor: "border-sky-200 hover:border-sky-400",
    };
  }
  if (code.includes("TWRM") || code.includes("320")) {
    return {
      courseColor: "bg-[#8B5CF6] text-white",
      typeColor: "text-[#8B5CF6]",
      borderColor: "border-purple-200 hover:border-purple-400",
    };
  }
  return {
    courseColor: "bg-emerald-600 text-white",
    typeColor: "text-emerald-700",
    borderColor: "border-emerald-200 hover:border-emerald-400",
  };
}

export interface TodayScheduleProps {
  onManageRoutine?: () => void;
  onSelectSession?: (item: ScheduleItem) => void;
  selectedDay?: string;
  onSelectDay?: (day: string) => void;
}

export function TodaySchedule({
  onManageRoutine,
  onSelectSession,
  selectedDay: propSelectedDay,
  onSelectDay,
}: TodayScheduleProps) {
  const { profile } = useStudentProfile();

  // Current actual day of the week abbreviated: e.g. "Sun"
  const currentActualDay = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", { weekday: "short" });
  }, []);

  // Selected day in the day selector pills
  const [internalSelectedDay, setInternalSelectedDay] = React.useState<string>(() => {
    return propSelectedDay || currentActualDay || "Sun";
  });

  React.useEffect(() => {
    if (propSelectedDay) {
      setInternalSelectedDay(propSelectedDay);
    }
  }, [propSelectedDay]);

  const selectedDay = propSelectedDay || internalSelectedDay;

  const handleSelectDay = (day: string) => {
    setInternalSelectedDay(day);
    onSelectDay?.(day);
  };

  const isViewingToday = selectedDay === currentActualDay;

  // Dynamic Routine slots state fetched from API
  const [routineSlots, setRoutineSlots] = React.useState<RoutineSlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal State for Add / Edit routine
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [slotToEdit, setSlotToEdit] = React.useState<RoutineSlot | null>(null);

  // Load routine slots from local storage first, then sync with database API
  React.useEffect(() => {
    let isMounted = true;

    // 1. Instant local load
    const cached = getStoredRoutineSlots();
    if (cached.length > 0 && isMounted) {
      setRoutineSlots(cached);
      setIsLoading(false);
    }

    // 2. Background sync
    async function loadRoutine() {
      try {
        const res = await fetch("/api/routine", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            setRoutineSlots(json.data);
            saveStoredRoutineSlots(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load routine slots:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadRoutine();

    const handleSync = () => {
      const cached = getStoredRoutineSlots();
      if (cached.length > 0) {
        setRoutineSlots(cached);
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

  // Group routine slots by day of week (Sun, Mon, Tue, etc.)
  const weeklyMap = React.useMemo(() => {
    const map: Record<string, RoutineSlot[]> = {
      Sun: [],
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
    };

    routineSlots.forEach((slot) => {
      const raw = slot.dayOfWeek?.trim().toLowerCase() || "sun";
      const short = DAY_MAP_TO_SHORT[raw] || "Sun";
      if (map[short]) {
        map[short].push(slot);
      }
    });

    // Sort chronologically by startTime
    Object.keys(map).forEach((dayKey) => {
      map[dayKey].sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
    });

    return map;
  }, [routineSlots]);

  const activeSlots = weeklyMap[selectedDay] || [];
  const isOffDay = activeSlots.length === 0;
  const totalClassesCount = routineSlots.length;

  // Handle slot saved from modal (single or multiple)
  const handleSlotSaved = (saved: RoutineSlot | RoutineSlot[]) => {
    const list = Array.isArray(saved) ? saved : [saved];
    saveStoredRoutineSlots(list);
    setRoutineSlots((prev) => {
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

  // Handle delete slot with immediate UI update
  const handleDeleteSlot = async (e: React.MouseEvent, slotId: string, courseCode: string) => {
    e.stopPropagation();
    removeStoredRoutineSlot(slotId);
    setRoutineSlots((prev) => prev.filter((s) => s.id !== slotId));
    toast.info(`Removed "${courseCode}" from routine`);

    try {
      await fetch(`/api/routine/${slotId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete routine error:", err);
    }
  };

  // Handle edit slot
  const handleEditSlot = (e: React.MouseEvent, slot: RoutineSlot) => {
    e.stopPropagation();
    setSlotToEdit(slot);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSlotToEdit(null);
    setIsModalOpen(true);
  };

  // Current date formatted string: "(Sunday, Sep 27)"
  const dateFormatted = React.useMemo(() => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const month = now.toLocaleDateString("en-US", { month: "short" });
    const dateNum = now.getDate();
    return `(${day}, ${month} ${dateNum})`;
  }, []);

  return (
    <section className="space-y-4">
      {/* 1. Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-1">
        {/* Left: Title + Date info */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center shrink-0 shadow-2xs">
            <GIcon name="calendar_month" size={20} />
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h2
                className="text-base font-bold text-[#172033] tracking-tight"
                suppressHydrationWarning
              >
                {isViewingToday
                  ? "Today's Schedule"
                  : `${DAY_FULL_NAMES[selectedDay] || selectedDay}'s Schedule`}
              </h2>
              <span
                className="text-xs text-slate-400 font-medium"
                suppressHydrationWarning
              >
                {isViewingToday ? dateFormatted : `(${DAY_FULL_NAMES[selectedDay]} Routine)`}
              </span>
              {!isViewingToday && (
                <button
                  type="button"
                  onClick={() => handleSelectDay(currentActualDay)}
                  className="text-[11px] font-bold text-[#315BFF] hover:underline cursor-pointer ml-1"
                >
                  ← Jump to Today
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Summer 2026 • {profile.batch || "Batch 82A"}
            </p>
          </div>
        </div>

        {/* Center: Horizontal Day Selector Pills (Sun, Mon, Tue, Wed, Thu, Fri, Sat) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {DAYS_LIST.map((day) => {
            const count = (weeklyMap[day] || []).length;
            const isSelected = selectedDay === day;
            const isToday = currentActualDay === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#315BFF] text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-100"
                    : "bg-white border border-[#E5EAF2] text-slate-600 hover:text-[#172033] hover:bg-slate-50"
                }`}
              >
                <span>{day}</span>

                {/* Dot for today */}
                {isToday && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-[#315BFF]"
                    }`}
                  />
                )}

                {/* Counter badge */}
                {count > 0 && (
                  <span
                    className={`h-4 min-w-[16px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center leading-none ${
                      isSelected ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Status / Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#315BFF] hover:bg-[#254BE3] text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
            title="Add Class to Routine"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Class</span>
          </button>

          <Link
            href="/schedule"
            className="text-xs font-bold text-[#315BFF] hover:text-[#254BE3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Routine</span>
            <GIcon name="arrow_forward" size={12} />
          </Link>
        </div>
      </div>

      {/* 2. Content Row: Either Empty state, Off-day state, or Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-slate-100 border border-slate-200/80 p-5 space-y-3" />
          ))}
        </div>
      ) : totalClassesCount === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200 space-y-3 min-h-[220px]">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#315BFF] flex items-center justify-center shadow-xs">
            <CalendarDays className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-bold text-slate-900">
              No schedule added yet. Click &apos;Add Class&apos; to set up your routine.
            </h3>
            <p className="text-xs text-slate-500">
              Your weekly routine is completely empty. Create your first class session to begin tracking your timetable.
            </p>
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Class</span>
            </button>
          </div>
        </div>
      ) : activeSlots.length === 0 ? (
        /* Day Empty State */
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200 space-y-3 min-h-[220px]">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#315BFF] flex items-center justify-center shadow-xs">
            <CalendarDays className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-bold text-slate-900">
              {isViewingToday
                ? "No classes scheduled for today"
                : `No classes scheduled on ${DAY_FULL_NAMES[selectedDay] || selectedDay}`}
            </h3>
            <p className="text-xs text-slate-500">
              {isViewingToday
                ? `You don't have any classes scheduled for ${DAY_FULL_NAMES[currentActualDay] || "today"}. Click 'Add Class' to add a session.`
                : `No routine classes found for ${DAY_FULL_NAMES[selectedDay] || selectedDay}. Click 'Add Class' to schedule a class.`}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Class</span>
            </button>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <span>Full Timetable</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Dynamic User-Uploaded Routine Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSlots.map((item) => {
            const theme = getCourseCardTheme(item.courseCode);

            return (
              <div
                key={item.id}
                onClick={() =>
                  onSelectSession?.({
                    id: item.id,
                    courseCode: item.courseCode,
                    courseColor: theme.courseColor,
                    type: "Class Session",
                    typeColor: theme.typeColor,
                    title: item.courseTitle,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    location: item.roomNo || "Campus",
                    faculty: item.instructor || "Faculty",
                    borderColor: theme.borderColor,
                  })
                }
                className={`group relative flex flex-col justify-between rounded-2xl bg-white border ${theme.borderColor} p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer`}
              >
                <div className="space-y-2">
                  {/* Top of Card: Course code in a colored badge + Edit/Delete actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${theme.courseColor}`}
                    >
                      {item.courseCode}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleEditSlot(e, item)}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit slot"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSlot(e, item.id, item.courseCode)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Course Title in Bold */}
                  <h3 className="text-xs sm:text-sm font-bold text-[#172033] line-clamp-2 leading-snug group-hover:text-[#315BFF] transition-colors pt-0.5">
                    {item.courseTitle}
                  </h3>
                </div>

                {/* Bottom of Card: Time, Room, Faculty */}
                <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                  <div className="space-y-1.5 text-[11px] text-slate-500">
                    {/* Time with clock icon */}
                    <div className="flex items-center gap-1.5">
                      <GIcon name="schedule" size={14} className="text-[#315BFF] shrink-0" />
                      <span className="font-semibold text-slate-700">
                        {item.startTime} – {item.endTime}
                      </span>
                    </div>

                    {/* Room with location icon */}
                    {item.roomNo && (
                      <div className="flex items-center gap-1.5">
                        <GIcon name="location_on" size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[190px]">{item.roomNo}</span>
                      </div>
                    )}

                    {/* Faculty with person icon */}
                    {item.instructor && (
                      <div className="flex items-center gap-1.5">
                        <GIcon name="person" size={14} className="text-[#5B63E6] shrink-0" />
                        <span>
                          Faculty: <strong className="text-slate-700 font-semibold">{item.instructor}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Circular action button */}
                  <div className="h-8 w-8 rounded-full bg-[#EEF3FF] text-[#315BFF] group-hover:bg-[#315BFF] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <GIcon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Routine Modal */}
      <AddRoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSlotSaved}
        slotToEdit={slotToEdit}
        defaultDay={DAY_FULL_NAMES[selectedDay] || "Sunday"}
      />
    </section>
  );
}
