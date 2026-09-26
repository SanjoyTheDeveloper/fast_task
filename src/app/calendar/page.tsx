"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { toast, Toaster } from "sonner";

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
    quizTitle: "CN Quiz 1 • 3 Days Left",
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
    title: "AIES • Lecture & Practice",
    courseCode: "0611CSE321",
    dueDate: "Sep 27, 2026",
    time: "11:00 AM",
    dotColor: "bg-[#315BFF]", // Blue
  },
  {
    id: "task-2",
    title: "AP • Advanced Programming",
    courseCode: "0613CSE333",
    dueDate: "Sep 27, 2026",
    time: "02:00 PM",
    dotColor: "bg-[#315BFF]", // Blue
  },
  {
    id: "task-3",
    title: "MACS • Complex Systems Problem Set",
    courseCode: "0541MAT337",
    dueDate: "Sep 27, 2026",
    time: "03:30 PM",
    dotColor: "bg-[#F59E0B]", // Orange
  },
  {
    id: "task-4",
    title: "CN • Computer Networks Quiz Prep",
    courseCode: "0612CSE315",
    dueDate: "Sep 28, 2026",
    time: "09:30 AM",
    dotColor: "bg-[#06B6D4]", // Cyan
  },
];

export default function CalendarPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = React.useState<number>(27);

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
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const emptyDays = [null, null]; // Sep 2026 starts on Tuesday

  const activeEvent = SEPTEMBER_EVENTS[selectedDate] || null;

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
            {/* Header: “September 2026” with calendar icon + left/right navigation arrows */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center shadow-2xs">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#172033] tracking-tight">
                    September 2026
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Summer 2026 • Academic Calendar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toast.info("Viewing August 2026")}
                  className="h-8 w-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("Viewing October 2026")}
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
              {/* Empty leading slots for Sun, Mon */}
              {viewMode === "month" &&
                emptyDays.map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-12 w-full" />
                ))}

              {/* Days list (full month or current week) */}
              {(viewMode === "week"
                ? [27, 28, 29, 30]
                : daysInMonth
              ).map((day) => {
                const isToday = day === 27;
                const isSelected = selectedDate === day;
                const event = SEPTEMBER_EVENTS[day];
                const hasStudyActivity = event?.pomodoroCompleted;

                // Weekend detection
                const dayOfWeekIdx = (day + 1) % 7;
                const isWeekend = dayOfWeekIdx === 5 || dayOfWeekIdx === 6;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className="relative flex flex-col items-center justify-center py-1 cursor-pointer group"
                  >
                    {/* Day number cell */}
                    <div
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center transition-all ${
                        isToday
                          ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black shadow-md shadow-blue-500/35 ring-4 ring-blue-100"
                          : isSelected
                          ? "border-2 border-[#315BFF] text-[#315BFF] font-bold bg-blue-50/40"
                          : hasStudyActivity
                          ? "bg-emerald-50/80 text-emerald-950 font-semibold hover:bg-emerald-100"
                          : isWeekend
                          ? "text-slate-400 hover:bg-slate-100"
                          : "text-slate-800 font-medium hover:bg-blue-50/50"
                      }`}
                    >
                      <span>{day}</span>
                    </div>

                    {/* Small colored dots under dates */}
                    {event && (
                      <div className="flex items-center justify-center gap-1 mt-1 h-1.5 pointer-events-none">
                        {/* Green: Classes / sessions */}
                        {event.hasClasses && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-2xs" />
                        )}
                        {/* Blue: Assignment deadlines */}
                        {event.hasAssignmentDeadline && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#315BFF] shadow-2xs" />
                        )}
                        {/* Purple: Quizzes & exams */}
                        {event.hasQuizOrExam && (
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-2xs" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Below the Calendar Grid: Soft Info Card */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 border border-blue-100/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#315BFF]" />
                  <span className="text-sm font-bold text-[#172033]">
                    Sep {selectedDate}, 2026 {selectedDate === 27 && "• Today"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#315BFF]" />
                    <span>
                      <strong>{activeEvent?.classCount || 0} Classes</strong> • Room {activeEvent?.rooms || "Online / None"}
                    </span>
                  </div>
                  {activeEvent?.assignmentTitle && (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                      <Flag className="h-3.5 w-3.5" />
                      <span>Deadline: {activeEvent.assignmentTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Green text “Study Activity Logged” */}
              {activeEvent?.pomodoroCompleted && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-bold shadow-2xs shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Study Activity Logged</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Section: Two Milestone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light blue rounded card: Next Quiz: CN (Computer Networks) */}
            <div className="rounded-2xl bg-gradient-to-r from-sky-50/90 to-blue-50/70 border border-sky-100/90 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Hourglass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
                    Next Quiz: CN (Computer Networks)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tuesday, Sep 29 • Room A/MCL C
                  </p>
                </div>
              </div>

              {/* Purple badge “3 days left” */}
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase shrink-0">
                3 days left
              </span>
            </div>

            {/* Soft orange/pink card: AIES Assignment 1 */}
            <div className="rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/70 border border-rose-100/80 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Pin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
                    AIES Assignment 1
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Batch 82A • Submit before 11:59 PM
                  </p>
                </div>
              </div>

              {/* Red badge “2 days left” */}
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase shrink-0">
                2 days left
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

            {/* List of 4 tasks with colored dots */}
            <div className="space-y-3">
              {UPCOMING_TASKS_LIST.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toast.info(`Task selected: ${task.title}`)}
                  className="p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100/80 flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Colored dot */}
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${task.dotColor} shrink-0`}
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

                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#315BFF] transition-colors shrink-0">
                    Details →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
