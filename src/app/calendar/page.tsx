"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/types";
import {
  Sidebar,
  TopHeader,
} from "@/components/dashboard";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  MapPin,
  Flag,
  Hourglass,
  Pin,
  Sparkles,
  CheckCircle2,
  ListTodo,
  ArrowRight,
  BookOpen,
  Coffee,
  User,
} from "@/components/ui/GoogleIcon";
import { toast, Toaster } from "sonner";
import { WEEKLY_SCHEDULE, ScheduleItem } from "@/components/dashboard/TodaySchedule";

// ==============================================================================
// 1. COURSE COLOR REGISTRY & DYNAMIC PALETTE
// ==============================================================================

export interface CourseColorInfo {
  code: string;
  shortName: string;
  fullName: string;
  color: string;      // Safe Hex color for inline styles e.g. "#6366F1"
  bgLight: string;    // Light tint background for legend e.g. "#EEF2FF"
  borderColor: string;// Border tint e.g. "#C7D2FE"
  textColor: string;  // Text color e.g. "#4338CA"
}

/**
 * Standard university courses mapped to distinct, curated, high-contrast colors
 */
export const COURSE_COLOR_REGISTRY: Record<string, CourseColorInfo> = {
  AIES: {
    code: "0611CSE321",
    shortName: "AIES",
    fullName: "Artificial Intelligence & Expert Systems",
    color: "#6366F1", // Indigo
    bgLight: "#EEF2FF",
    borderColor: "#C7D2FE",
    textColor: "#4338CA",
  },
  AP: {
    code: "0613CSE333",
    shortName: "AP",
    fullName: "Advanced Programming",
    color: "#2563EB", // Royal Blue
    bgLight: "#EFF6FF",
    borderColor: "#BFDBFE",
    textColor: "#1D4ED8",
  },
  CN: {
    code: "0612CSE315",
    shortName: "CN",
    fullName: "Computer Networks",
    color: "#06B6D4", // Cyan / Teal
    bgLight: "#ECFEFF",
    borderColor: "#A5F3FC",
    textColor: "#0E7490",
  },
  MACS: {
    code: "0541MAT337",
    shortName: "MACS",
    fullName: "Mathematical Analysis & Complex Systems",
    color: "#F59E0B", // Amber / Warm Orange
    bgLight: "#FFFBEB",
    borderColor: "#FDE68A",
    textColor: "#B45309",
  },
  TWRM: {
    code: "0031CSE320",
    shortName: "TWRM",
    fullName: "Technical Writing & Research Methodology",
    color: "#8B5CF6", // Purple / Violet
    bgLight: "#F5F3FF",
    borderColor: "#DDD6FE",
    textColor: "#6D28D9",
  },
  LABS: {
    code: "Sessionals",
    shortName: "Labs",
    fullName: "Practical & Laboratory Sessions",
    color: "#10B981", // Emerald
    bgLight: "#ECFDF5",
    borderColor: "#A7F3D0",
    textColor: "#047857",
  },
};

/**
 * Aesthetic fallback palette for dynamic courses from database or custom additions
 */
export const PALETTE_FALLBACKS: Array<Omit<CourseColorInfo, "code" | "shortName" | "fullName">> = [
  { color: "#6366F1", bgLight: "#EEF2FF", borderColor: "#C7D2FE", textColor: "#4338CA" }, // Indigo
  { color: "#2563EB", bgLight: "#EFF6FF", borderColor: "#BFDBFE", textColor: "#1D4ED8" }, // Blue
  { color: "#06B6D4", bgLight: "#ECFEFF", borderColor: "#A5F3FC", textColor: "#0E7490" }, // Cyan
  { color: "#F59E0B", bgLight: "#FFFBEB", borderColor: "#FDE68A", textColor: "#B45309" }, // Amber
  { color: "#8B5CF6", bgLight: "#F5F3FF", borderColor: "#DDD6FE", textColor: "#6D28D9" }, // Purple
  { color: "#10B981", bgLight: "#ECFDF5", borderColor: "#A7F3D0", textColor: "#047857" }, // Emerald
  { color: "#F43F5E", bgLight: "#FFF1F2", borderColor: "#FECDD3", textColor: "#BE123C" }, // Rose
  { color: "#0D9488", bgLight: "#F0FDFA", borderColor: "#99F6E4", textColor: "#0F766E" }, // Teal
  { color: "#D946EF", bgLight: "#FDF4FF", borderColor: "#F5D0FE", textColor: "#A21CAF" }, // Fuchsia
  { color: "#EA580C", bgLight: "#FFF7ED", borderColor: "#FFEDD5", textColor: "#C2410C" }, // Orange
];

/**
 * Returns the exact unique color info for any course by ID, code, or title
 */
export function getCourseColor(courseIdOrName?: string, explicitColor?: string): CourseColorInfo {
  // If an explicit hex color is provided in the model/DB, prioritize it
  if (explicitColor && explicitColor.startsWith("#")) {
    return {
      code: courseIdOrName || "COURSE",
      shortName: courseIdOrName || "Course",
      fullName: courseIdOrName || "Course Event",
      color: explicitColor,
      bgLight: `${explicitColor}15`,
      borderColor: `${explicitColor}40`,
      textColor: explicitColor,
    };
  }

  if (!courseIdOrName) {
    return {
      code: "GEN",
      shortName: "General",
      fullName: "General Academic Schedule",
      color: "#64748B",
      bgLight: "#F8FAFC",
      borderColor: "#E2E8F0",
      textColor: "#475569",
    };
  }

  const norm = courseIdOrName.trim().toUpperCase();

  if (norm.includes("AIES") || norm.includes("0611CSE321") || norm.includes("0611CSE322") || norm.includes("EXPERT SYSTEMS")) {
    return COURSE_COLOR_REGISTRY.AIES;
  }
  if (norm.includes("AP") || norm.includes("0613CSE333") || norm.includes("0613CSE334") || norm.includes("ADVANCED PROGRAMMING")) {
    return COURSE_COLOR_REGISTRY.AP;
  }
  if (norm.includes("CN") || norm.includes("0612CSE315") || norm.includes("0612CSE316") || norm.includes("COMPUTER NETWORKS") || norm.includes("NETWORK")) {
    return COURSE_COLOR_REGISTRY.CN;
  }
  if (norm.includes("MACS") || norm.includes("0541MAT337") || norm.includes("MATH") || norm.includes("COMPLEX SYSTEMS")) {
    return COURSE_COLOR_REGISTRY.MACS;
  }
  if (norm.includes("TWRM") || norm.includes("0031CSE320") || norm.includes("TECHNICAL WRITING") || norm.includes("RESEARCH")) {
    return COURSE_COLOR_REGISTRY.TWRM;
  }
  if (norm.includes("LAB") || norm.includes("SESS") || norm.includes("SESSIONAL")) {
    return COURSE_COLOR_REGISTRY.LABS;
  }

  // Deterministic hash-based color picking for custom courses
  let hash = 0;
  for (let i = 0; i < courseIdOrName.length; i++) {
    hash = (hash << 5) - hash + courseIdOrName.charCodeAt(i);
    hash |= 0;
  }
  const picked = PALETTE_FALLBACKS[Math.abs(hash) % PALETTE_FALLBACKS.length];

  return {
    code: courseIdOrName,
    shortName: courseIdOrName.length > 8 ? courseIdOrName.slice(0, 6) : courseIdOrName,
    fullName: courseIdOrName,
    ...picked,
  };
}

// ==============================================================================
// 2. CALENDAR EVENTS & TASKS DEFINITION
// ==============================================================================

export interface DayEvent {
  hasClasses?: boolean;
  classCount?: number;
  rooms?: string;
  hasAssignmentDeadline?: boolean;
  assignmentTitle?: string;
  hasQuizOrExam?: boolean;
  quizTitle?: string;
  pomodoroCompleted?: boolean;
}

const SEPTEMBER_EVENTS: Record<number, DayEvent> = {
  1: { hasClasses: true, classCount: 3, rooms: "A/507, A/MCL C", pomodoroCompleted: true },
  2: { hasClasses: true, classCount: 3, rooms: "A/MCL B, A/502", pomodoroCompleted: true },
  3: { hasClasses: true, classCount: 2, rooms: "A/502, A/MCL B" },
  4: { pomodoroCompleted: false },
  5: { pomodoroCompleted: false },
  6: { hasClasses: true, classCount: 3, rooms: "A/507, A/502", pomodoroCompleted: true },
  7: { hasClasses: true, classCount: 2, rooms: "A/502", pomodoroCompleted: true },
  8: { hasClasses: true, classCount: 3, rooms: "A/507, A/502" },
  9: { hasClasses: true, classCount: 3, rooms: "A/MCL B, A/502", pomodoroCompleted: true },
  10: { hasClasses: true, classCount: 2, rooms: "A/502" },
  13: { hasClasses: true, classCount: 3, rooms: "A/507, A/502", hasAssignmentDeadline: true, assignmentTitle: "AIES Problem Set 1" },
  14: { hasClasses: true, classCount: 2, rooms: "A/502", pomodoroCompleted: true },
  15: { hasClasses: true, classCount: 3, rooms: "A/507, A/502", hasQuizOrExam: true, quizTitle: "MACS Midterm Review" },
  16: { hasClasses: true, classCount: 3, rooms: "A/MCL B, A/502", pomodoroCompleted: true },
  17: { hasClasses: true, classCount: 2, rooms: "A/502", pomodoroCompleted: true },
  20: { hasClasses: true, classCount: 3, rooms: "A/507, A/502", pomodoroCompleted: true },
  21: { hasClasses: true, classCount: 2, rooms: "A/502", pomodoroCompleted: true },
  22: { hasClasses: true, classCount: 3, rooms: "A/507, A/MCL C", pomodoroCompleted: true },
  23: { hasClasses: true, classCount: 3, rooms: "A/MCL B, A/502", pomodoroCompleted: true },
  24: { hasClasses: true, classCount: 2, rooms: "A/502", pomodoroCompleted: true },
  25: { pomodoroCompleted: true },
  26: { pomodoroCompleted: true },
  // Today (Sunday Sep 27)
  27: {
    hasClasses: true,
    classCount: 3,
    rooms: "A/507, A/502",
    hasAssignmentDeadline: true,
    assignmentTitle: "AIES • Lecture & Practice",
    pomodoroCompleted: true,
  },
  28: {
    hasClasses: true,
    classCount: 2,
    rooms: "A/502, A-2003",
    hasAssignmentDeadline: true,
    assignmentTitle: "AP Programming Task",
    pomodoroCompleted: true,
  },
  29: {
    hasClasses: true,
    classCount: 3,
    rooms: "A/507, A/MCL C",
    hasQuizOrExam: true,
    quizTitle: "CN Quiz 1 • Today (02:00 PM)",
    pomodoroCompleted: true,
  },
  30: {
    hasClasses: true,
    classCount: 3,
    rooms: "A/MCL B, A/MCL D",
    hasAssignmentDeadline: true,
    assignmentTitle: "TWRM Report Draft",
  },
};

const UPCOMING_TASKS_LIST = [
  {
    id: "task-1",
    title: "CN • Computer Networks Quiz Prep",
    courseCode: "0612CSE315",
    dueDate: "Sep 29, 2026",
    time: "09:30 AM",
  },
  {
    id: "task-2",
    title: "MACS • Complex Systems Problem Set",
    courseCode: "0541MAT337",
    dueDate: "Sep 29, 2026",
    time: "03:30 PM",
  },
  {
    id: "task-3",
    title: "TWRM • Report Draft Submission",
    courseCode: "0031CSE320",
    dueDate: "Sep 30, 2026",
    time: "11:00 AM",
  },
  {
    id: "task-4",
    title: "AP • Advanced Programming Task",
    courseCode: "0613CSE333",
    dueDate: "Oct 01, 2026",
    time: "12:30 PM",
  },
];

export default function CalendarPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");

  // Real today from system/browser
  const today = React.useMemo(() => new Date(), []);
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [currentMonthDate, setCurrentMonthDate] = React.useState(() => new Date());
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleDateString("en-US", { month: "long" });

  const isCurrentMonth = year === todayYear && month === todayMonth;

  const [selectedDate, setSelectedDate] = React.useState<number>(() => {
    return isCurrentMonth ? todayDate : 1;
  });

  // Load authenticated user
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("User check failed:", err);
      }
    }
    loadUser();
  }, [router]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const firstDayOffset = new Date(year, month, 1).getDay();
  const emptyDays = Array.from({ length: firstDayOffset }, (_, i) => null);

  const activeEvent = SEPTEMBER_EVENTS[selectedDate] || null;

  const selectedDateObj = new Date(year, month, selectedDate);
  const selectedDayOfWeekIdx = selectedDateObj.getDay();
  const selectedDayShort = daysOfWeek[selectedDayOfWeekIdx];
  const dayNameFullMap: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };
  const selectedDayFullName = dayNameFullMap[selectedDayShort] || selectedDayShort;
  const selectedDaySessions = WEEKLY_SCHEDULE[selectedDayShort] || [];

  /**
   * Deduplicates and retrieves all distinct courses active for any given date
   */
  const getCoursesForDay = React.useCallback(
    (day: number): CourseColorInfo[] => {
      const dObj = new Date(year, month, day);
      const dayShort = daysOfWeek[dObj.getDay()];
      const event = SEPTEMBER_EVENTS[day];
      const courseMap = new Map<string, CourseColorInfo>();

      // 1. Routine scheduled classes for that weekday
      if (event?.hasClasses !== false) {
        const routineSessions = WEEKLY_SCHEDULE[dayShort] || [];
        routineSessions.forEach((session) => {
          const info = getCourseColor(session.courseCode || session.title);
          if (info && !courseMap.has(info.code)) {
            courseMap.set(info.code, info);
          }
        });
      }

      // 2. Assignment deadline course
      if (event?.assignmentTitle) {
        const info = getCourseColor(event.assignmentTitle);
        if (info && !courseMap.has(info.code)) {
          courseMap.set(info.code, info);
        }
      }

      // 3. Quiz / Exam reminder course
      if (event?.quizTitle) {
        const info = getCourseColor(event.quizTitle);
        if (info && !courseMap.has(info.code)) {
          courseMap.set(info.code, info);
        }
      }

      // 4. Upcoming task due date match
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const curMonthShort = monthNames[month];
      UPCOMING_TASKS_LIST.forEach((task) => {
        const formattedDay1 = `${curMonthShort} ${day < 10 ? `0${day}` : day}`;
        const formattedDay2 = `${curMonthShort} ${day}`;
        if (task.dueDate.includes(formattedDay1) || task.dueDate.includes(formattedDay2)) {
          const info = getCourseColor(task.courseCode || task.title);
          if (info && !courseMap.has(info.code)) {
            courseMap.set(info.code, info);
          }
        }
      });

      return Array.from(courseMap.values());
    },
    [year, month, daysOfWeek]
  );

  // Week view calculation
  const currentWeekDays = React.useMemo(() => {
    const targetDay = selectedDate || todayDate;
    const targetDate = new Date(year, month, targetDay);
    const dayOfWeek = targetDate.getDay();
    const days: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(targetDate);
      d.setDate(targetDate.getDate() + (i - dayOfWeek));
      if (d.getMonth() === month) {
        days.push(d.getDate());
      }
    }
    return days.length > 0 ? days : [27, 28, 29, 30];
  }, [year, month, selectedDate, todayDate]);

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    const dObj = new Date(year, month, day);
    const dStr = dayNameFullMap[daysOfWeek[dObj.getDay()]];
    const coursesOnDay = getCoursesForDay(day);
    if (coursesOnDay.length > 0) {
      toast.info(
        `Viewing ${dStr} (${monthName.slice(0, 3)} ${day}) • ${coursesOnDay
          .map((c) => c.shortName)
          .join(", ")}`
      );
    } else {
      toast.info(`Viewing ${dStr} (${monthName.slice(0, 3)} ${day}) schedule`);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Wrapper with Left Margin for Desktop Sidebar */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={currentUser}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Calendar Page Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Section: Streak Badge & View Toggle */}
          <div className="flex items-center justify-between">
            {/* Left: Yellow rounded badge with flame icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs text-xs font-bold">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>5-Day Study Streak</span>
            </div>

            {/* Right: Soft toggle buttons Month & Week */}
            <div className="flex items-center p-1 rounded-xl bg-white border border-[#E5EAF2] shadow-2xs text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "month"
                    ? "bg-[#315BFF] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "week"
                    ? "bg-[#315BFF] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {/* Main Calendar Card */}
          <div className="rounded-2xl bg-white border border-[#E5EAF2] p-6 shadow-2xs space-y-6">
            {/* Header: Month and Year with calendar icon + left/right navigation arrows */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center shadow-2xs">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#172033] tracking-tight">
                    {monthName} {year}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Summer 2026 • Academic Calendar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="h-8 w-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="h-8 w-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header (Sun to Sat) */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold">
              {daysOfWeek.map((day, idx) => {
                const isWeekend = idx === 5 || idx === 6; // Fri, Sat
                return (
                  <div
                    key={day}
                    className={`py-1 ${
                      isWeekend ? "text-slate-400 font-medium" : "text-slate-700"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {/* Empty leading slots */}
              {viewMode === "month" &&
                emptyDays.map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-12 w-full" />
                ))}

              {/* Days list (full month or current week) */}
              {(viewMode === "week" ? currentWeekDays : daysInMonth).map((day) => {
                const isToday = isCurrentMonth && day === todayDate;
                const isSelected = selectedDate === day;
                const event = SEPTEMBER_EVENTS[day];
                const hasStudyActivity = event?.pomodoroCompleted;

                // Weekend detection
                const dObj = new Date(year, month, day);
                const dayOfWeekIdx = dObj.getDay();
                const isWeekend = dayOfWeekIdx === 5 || dayOfWeekIdx === 6;

                // Extract all unique courses for this day
                const dayCourses = getCoursesForDay(day);

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className="relative flex flex-col items-center justify-center py-1 cursor-pointer group"
                  >
                    {/* Day number cell */}
                    <div
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center transition-all duration-200 ease-out ${
                        isSelected
                          ? "bg-[#315BFF] text-white font-black shadow-md shadow-blue-500/40 ring-4 ring-blue-100 scale-105"
                          : isToday
                          ? "text-[#315BFF] font-black bg-blue-50/70 hover:bg-blue-100/70"
                          : hasStudyActivity
                          ? "bg-emerald-50/80 text-emerald-950 font-semibold hover:bg-emerald-100"
                          : isWeekend
                          ? "text-slate-400 hover:bg-slate-100"
                          : "text-slate-800 font-medium hover:bg-blue-50/50"
                      }`}
                    >
                      <span>{day}</span>
                    </div>

                    {/* Dynamic Course Colored Dots under date */}
                    {dayCourses.length > 0 ? (
                      <div className="flex items-center justify-center gap-1 mt-1.5 h-2 pointer-events-none max-w-[42px] overflow-hidden">
                        {dayCourses.slice(0, 4).map((c) => (
                          <span
                            key={c.code}
                            title={`${c.shortName} • ${c.fullName}`}
                            className="h-1.5 w-1.5 rounded-full shadow-2xs transition-transform group-hover:scale-125 shrink-0"
                            style={{ backgroundColor: c.color }}
                          />
                        ))}
                        {dayCourses.length > 4 && (
                          <span
                            title={`+${dayCourses.length - 4} more courses`}
                            className="h-1 w-1 rounded-full bg-slate-400 shrink-0"
                          />
                        )}
                      </div>
                    ) : (
                      /* Placeholder spacing to keep cell vertical alignment steady */
                      <div className="h-2 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ========================================================== */}
            {/* 3. COURSE COLOR LEGEND (LIZEND) SECTION                    */}
            {/* ========================================================== */}
            <div className="rounded-2xl bg-slate-50/80 border border-[#E5EAF2] p-4 shadow-2xs space-y-3">
              <div className="pb-2 border-b border-slate-200/80">
                <span className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  Academic Course Color Legend
                </span>
              </div>

              {/* Course Badges Grid */}
              <div className="flex flex-wrap items-center gap-2">
                {Object.values(COURSE_COLOR_REGISTRY).map((c) => (
                  <div
                    key={c.code}
                    title={c.fullName}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all hover:scale-105 cursor-default select-none shadow-2xs"
                    style={{
                      backgroundColor: c.bgLight,
                      borderColor: c.borderColor,
                      color: c.textColor,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: c.color }}
                    />
                    <span>{c.shortName}</span>
                    <span className="text-[10px] font-medium opacity-75">
                      ({c.code})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Below the Calendar Grid: Comprehensive Day Schedule */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-50/40 via-indigo-50/20 to-slate-50/60 border border-[#DCE7FC] p-5 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#315BFF] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#172033] tracking-tight">
                        {isCurrentMonth && selectedDate === todayDate
                          ? "Today's Schedule"
                          : `${selectedDayFullName}'s Schedule`}
                      </h3>
                      <span className="text-xs font-semibold text-[#315BFF] bg-[#EEF3FF] border border-[#D0DFFF] px-2 py-0.5 rounded-md">
                        {monthName.slice(0, 3)} {selectedDate}, {year}
                      </span>
                      {isCurrentMonth && selectedDate === todayDate && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedDaySessions.length > 0
                        ? `${selectedDaySessions.length} routine class sessions scheduled • Summer 2026`
                        : "Weekend / Free study day"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {!(isCurrentMonth && selectedDate === todayDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isCurrentMonth) {
                          setCurrentMonthDate(new Date());
                        }
                        handleDateClick(todayDate);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      ← Jump to Today
                    </button>
                  )}
                  {activeEvent?.pomodoroCompleted && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Study Activity Logged</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Class Schedule Cards Grid */}
              {selectedDaySessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                  {selectedDaySessions.map((session) => {
                    const courseInfo = getCourseColor(session.courseCode || session.title);

                    return (
                      <div
                        key={session.id}
                        onClick={() => toast.info(`${session.courseCode}: ${session.title}`)}
                        className="group p-4 rounded-xl bg-white border border-[#E5EAF2] hover:border-[#315BFF]/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3 cursor-pointer"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className="px-2 py-0.5 rounded-md text-[11px] font-bold text-white shadow-2xs"
                              style={{ backgroundColor: courseInfo.color }}
                            >
                              {session.courseCode}
                            </span>
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider ${session.typeColor}`}
                            >
                              {session.type}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#172033] group-hover:text-[#315BFF] transition-colors line-clamp-2 leading-snug">
                            {session.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              <Clock className="h-3 w-3 text-[#315BFF]" />
                              <span>
                                {session.startTime} - {session.endTime}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Faculty: {session.faculty}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 truncate">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{session.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Off-Day Empty State */
                <div className="p-8 text-center rounded-xl bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-2xs">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="text-sm font-bold text-[#172033]">
                      No Scheduled Classes for {selectedDayFullName}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This is an off-day from scheduled lectures. Great opportunity to review coursework, prepare pending assignments, or take a well-deserved rest.
                    </p>
                  </div>
                </div>
              )}

              {/* Day Deadlines & Quizzes if any */}
              {(activeEvent?.assignmentTitle || activeEvent?.quizTitle) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeEvent.assignmentTitle && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Pin className="h-4 w-4 text-rose-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-rose-950 truncate">Assignment Deadline</p>
                          <p className="text-[11px] text-rose-700 truncate">
                            {activeEvent.assignmentTitle}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-200/60 text-rose-800 text-[10px] font-bold shrink-0">
                        Due Today
                      </span>
                    </div>
                  )}

                  {activeEvent.quizTitle && (
                    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Hourglass className="h-4 w-4 text-purple-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-purple-950 truncate">Quiz / Exam Reminder</p>
                          <p className="text-[11px] text-purple-700 truncate">
                            {activeEvent.quizTitle}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-200/60 text-purple-800 text-[10px] font-bold shrink-0">
                        Scheduled
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Next Section: Two Milestone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light blue rounded card: Active Quiz */}
            <div className="rounded-2xl bg-gradient-to-r from-sky-50/90 to-blue-50/70 border border-sky-100/90 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Hourglass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
                    Active Quiz: CN (Computer Networks)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tuesday, Sep 29 • Room A/MCL C
                  </p>
                </div>
              </div>

              {/* Emerald badge “Today” */}
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase shrink-0">
                Today
              </span>
            </div>

            {/* Soft orange/pink card: TWRM Report Draft */}
            <div className="rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/70 border border-rose-100/80 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Pin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
                    TWRM Report Draft
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Batch 82A • Tomorrow, Sep 30
                  </p>
                </div>
              </div>

              {/* Red badge “Tomorrow” */}
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase shrink-0">
                Tomorrow
              </span>
            </div>
          </div>

          {/* Bottom Section: Upcoming Tasks */}
          <div className="rounded-2xl bg-white border border-[#E5EAF2] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-[#315BFF]" />
                <h3 className="text-sm font-bold text-[#172033]">
                  Upcoming Tasks
                </h3>
              </div>
              <Link
                href="/dashboard#tasks"
                className="text-xs font-bold text-[#315BFF] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* List of 4 tasks with dynamically coordinated colored dots */}
            <div className="space-y-3">
              {UPCOMING_TASKS_LIST.map((task) => {
                const taskCourse = getCourseColor(task.courseCode || task.title);

                return (
                  <div
                    key={task.id}
                    onClick={() => toast.info(`Task selected: ${task.title}`)}
                    className="p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100/80 flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Dynamic Course-coordinated dot */}
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: taskCourse.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#172033] group-hover:text-[#315BFF] transition-colors truncate">
                          {task.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {task.courseCode} • {task.dueDate} • {task.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
