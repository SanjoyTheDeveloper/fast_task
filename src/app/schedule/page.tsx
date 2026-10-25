"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TopHeader,
} from "@/components/dashboard";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
} from "@/components/ui/GoogleIcon";
import { Toaster, toast } from "sonner";
import { AddRoutineModal, RoutineSlot } from "@/components/routine/AddRoutineModal";
import {
  getStoredRoutineSlots,
  saveStoredRoutineSlots,
  removeStoredRoutineSlot,
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

const COURSE_COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  AIES: { bg: "bg-blue-50/70", text: "text-blue-700", border: "border-blue-200/80", badge: "bg-blue-600 text-white" },
  AP: { bg: "bg-indigo-50/70", text: "text-indigo-700", border: "border-indigo-200/80", badge: "bg-indigo-600 text-white" },
  CN: { bg: "bg-emerald-50/70", text: "text-emerald-700", border: "border-emerald-200/80", badge: "bg-emerald-600 text-white" },
  MACS: { bg: "bg-amber-50/70", text: "text-amber-800", border: "border-amber-200/80", badge: "bg-amber-600 text-white" },
  TWRM: { bg: "bg-purple-50/70", text: "text-purple-700", border: "border-purple-200/80", badge: "bg-purple-600 text-white" },
};

function getCourseBadgeStyle(courseCode: string, courseTitle: string) {
  const code = courseCode.toUpperCase();
  const title = courseTitle.toUpperCase();

  for (const [key, val] of Object.entries(COURSE_COLOR_MAP)) {
    if (code.includes(key) || title.includes(key)) {
      return val;
    }
  }

  // Fallback dynamic palette based on hash
  const palettes = [
    { bg: "bg-sky-50/70", text: "text-sky-700", border: "border-sky-200/80", badge: "bg-sky-600 text-white" },
    { bg: "bg-teal-50/70", text: "text-teal-700", border: "border-teal-200/80", badge: "bg-teal-600 text-white" },
    { bg: "bg-rose-50/70", text: "text-rose-700", border: "border-rose-200/80", badge: "bg-rose-600 text-white" },
    { bg: "bg-violet-50/70", text: "text-violet-700", border: "border-violet-200/80", badge: "bg-violet-600 text-white" },
  ];
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash += code.charCodeAt(i);
  return palettes[hash % palettes.length];
}

export default function SchedulePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);

  // Routine schedule state
  const [slots, setSlots] = React.useState<RoutineSlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDayTab, setSelectedDayTab] = React.useState<string>("All");

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
            setCurrentUser(data.user);
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

    // 1. Instant local load
    const cached = getStoredRoutineSlots();
    if (cached.length > 0 && isMounted) {
      setSlots(cached);
      setIsLoading(false);
    }

    // 2. Background sync
    async function fetchRoutine() {
      try {
        const res = await fetch("/api/routine", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            setSlots(json.data);
            saveStoredRoutineSlots(json.data);
          }
        }
      } catch (err) {
        console.warn("Could not sync routine from server, using local data:", err);
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
      const res = await fetch(`/api/routine/${slotId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.warn("Server delete warning:", res.status);
      }
    } catch (err) {
      console.warn("Delete routine slot server notice:", err);
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

  // Group slots by Day of Week and sort chronologically by startTime
  const groupedSlots = React.useMemo(() => {
    const map = new Map<string, RoutineSlot[]>();

    DAYS_ORDER.forEach((d) => map.set(d, []));

    slots.forEach((slot) => {
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
  }, [slots]);

  // Filtered view based on selected day tab
  const displayDays = React.useMemo(() => {
    if (selectedDayTab !== "All") {
      return [selectedDayTab];
    }
    return DAYS_ORDER;
  }, [selectedDayTab]);

  const totalClassesCount = slots.length;
  const todayClassesCount = groupedSlots.get(currentActualDay)?.length || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Main Wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={currentUser}
          searchQuery=""
          onSearchChange={() => {}}
        />

        {/* Page Main Content */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#315BFF] to-[#6366F1] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Class Routine &amp; Timetable
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    User-driven academic schedule • Today is{" "}
                    <span className="font-semibold text-slate-700">{currentActualDay}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action: "+ Add Schedule" button */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
                {totalClassesCount} {totalClassesCount === 1 ? "Class" : "Classes"} Scheduled
              </span>
              <button
                type="button"
                onClick={() => handleOpenAdd(selectedDayTab !== "All" ? selectedDayTab : currentActualDay)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add Schedule</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Weekly Classes
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {totalClassesCount}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#315BFF] flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Today&apos;s Sessions ({currentActualDay.slice(0, 3)})
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {todayClassesCount}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Routine Status
                </p>
                <h3 className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Active &amp; Synced</span>
                </h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Day Selector Pills Toolbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedDayTab("All")}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedDayTab === "All"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Days ({totalClassesCount})
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
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {isToday && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-white" : "bg-blue-600"
                      }`}
                    />
                  )}
                  <span>{day}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Timetable Body */}
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
          ) : totalClassesCount === 0 ? (
            /* Empty State: Requirement 3 */
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
              <button
                type="button"
                onClick={() => handleOpenAdd(currentActualDay)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add Class</span>
              </button>
            </div>
          ) : (
            /* Timetable Day Groups */
            <div className="space-y-6">
              {displayDays.map((day) => {
                const dayClasses = groupedSlots.get(day) || [];
                const isToday = currentActualDay === day;

                // When in "All Days" view, skip rendering days that have 0 classes unless it's today
                if (selectedDayTab === "All" && dayClasses.length === 0 && !isToday) {
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

                          return (
                            <div
                              key={item.id}
                              className={`group relative rounded-2xl border ${style.border} ${style.bg} p-4 sm:p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200`}
                            >
                              <div className="space-y-2.5">
                                {/* Top: Course Code Badge + Action Controls (Edit & Delete) */}
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${style.badge}`}
                                  >
                                    {item.courseCode}
                                  </span>

                                  {/* Edit & Delete Actions */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(item)}
                                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white/80 transition-colors cursor-pointer"
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
                                    className="text-sm font-bold text-slate-900 leading-snug line-clamp-2"
                                    title={item.courseTitle}
                                  >
                                    {item.courseTitle}
                                  </h3>
                                </div>
                              </div>

                              {/* Card Meta: Time slot, Room No & Instructor */}
                              <div className="mt-3.5 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-600">
                                {/* Time slot */}
                                <div className="flex items-center gap-2 font-medium">
                                  <Clock className="h-3.5 w-3.5 text-[#315BFF] shrink-0" />
                                  <span className="font-semibold text-slate-800">
                                    {item.startTime} – {item.endTime}
                                  </span>
                                </div>

                                {/* Room Number */}
                                {item.roomNo && (
                                  <div className="flex items-center gap-2 font-medium">
                                    <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                    <span>{item.roomNo}</span>
                                  </div>
                                )}

                                {/* Instructor */}
                                {item.instructor && (
                                  <div className="flex items-center gap-2 font-medium text-slate-500">
                                    <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    <span>Faculty: {item.instructor}</span>
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
