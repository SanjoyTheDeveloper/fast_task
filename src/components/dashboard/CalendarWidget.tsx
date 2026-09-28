"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  Flame,
  Clock,
  MapPin,
  Hourglass,
  Pin,
  Sparkles,
  X,
  BookOpen,
} from "lucide-react";

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

// Map of event metadata for September 2026 dates
const SEPTEMBER_EVENTS: Record<number, DayEvent> = {
  1: { hasClasses: true, classCount: 3, rooms: "A/507, A/MCL C", pomodoroCompleted: true },
  2: { hasClasses: true, classCount: 3, rooms: "A/MCL B, A/502", pomodoroCompleted: true },
  3: { hasClasses: true, classCount: 2, rooms: "A/502, A/MCL B" },
  4: { pomodoroCompleted: false }, // Friday Off
  5: { pomodoroCompleted: false }, // Saturday Off
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
  25: { pomodoroCompleted: true }, // Friday Off
  26: { pomodoroCompleted: true }, // Saturday Off (Yesterday)
  // Today (Sunday Sep 27): 3 classes, assignment deadline & active pomodoro
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

export interface UpcomingTaskItem {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string;
  time: string;
  dotColor: string;
}

export const defaultUpcomingTasks: UpcomingTaskItem[] = [
  {
    id: "up-1",
    title: "AIES • Lecture & Practice",
    courseCode: "0611CSE321",
    dueDate: "Sep 27, 2026",
    time: "11:00 AM",
    dotColor: "bg-[#5B63E6]",
  },
  {
    id: "up-2",
    title: "AP • Advanced Programming",
    courseCode: "0613CSE333",
    dueDate: "Sep 27, 2026",
    time: "02:00 PM",
    dotColor: "bg-[#315BFF]",
  },
  {
    id: "up-3",
    title: "MACS • Complex Systems Problem Set",
    courseCode: "0541MAT337",
    dueDate: "Sep 27, 2026",
    time: "03:30 PM",
    dotColor: "bg-[#F59E0B]",
  },
  {
    id: "up-4",
    title: "CN • Computer Networks Quiz Prep",
    courseCode: "0612CSE315",
    dueDate: "Sep 29, 2026",
    time: "09:30 AM",
    dotColor: "bg-[#0284C7]",
  },
];

import { WEEKLY_SCHEDULE, ScheduleItem } from "./TodaySchedule";

export interface CalendarWidgetProps {
  onSelectTask?: (id: string) => void;
  onViewAll?: () => void;
  onSelectDate?: (day: number, dayOfWeek: string) => void;
  selectedDate?: number | null;
}

export function CalendarWidget({
  onSelectTask,
  onViewAll,
  onSelectDate,
  selectedDate: propSelectedDate,
}: CalendarWidgetProps) {
  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");
  const [internalSelectedDate, setInternalSelectedDate] = React.useState<number | null>(27);
  const [hoveredDate, setHoveredDate] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (propSelectedDate !== undefined && propSelectedDate !== null) {
      setInternalSelectedDate(propSelectedDate);
    }
  }, [propSelectedDate]);

  const selectedDate = propSelectedDate !== undefined ? propSelectedDate : internalSelectedDate;

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // Month starts on Tuesday: 2 empty slots for Sun, Mon
  const emptyDays = [null, null];

  // Active date for the popover (hovered or clicked)
  const activePopoverDate = hoveredDate || selectedDate;
  const activeEvent = activePopoverDate ? SEPTEMBER_EVENTS[activePopoverDate] : null;

  const activeDayOfWeekIdx = activePopoverDate ? (activePopoverDate + 1) % 7 : 0;
  const activeDayShort = daysOfWeek[activeDayOfWeekIdx];
  const activeDaySessions = activeDayShort ? (WEEKLY_SCHEDULE[activeDayShort] || []) : [];

  const handleDateClick = (day: number) => {
    setInternalSelectedDate(day);
    const dayIdx = (day + 1) % 7;
    const dayStr = daysOfWeek[dayIdx];
    onSelectDate?.(day, dayStr);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#E5EAF2] p-5 shadow-2xs space-y-4 relative transition-all">
      {/* 1. Top Bar: Streak Indicator & View Mode Toggle */}
      <div className="flex items-center justify-between pb-1">
        {/* 5-Day Study Streak Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 text-amber-800 border border-amber-200/60 shadow-2xs text-[11px] font-bold">
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span>5-Day Study Streak</span>
        </div>

        {/* Month / Week View Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setViewMode("month")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              viewMode === "month"
                ? "bg-white text-[#315BFF] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setViewMode("week")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              viewMode === "week"
                ? "bg-white text-[#315BFF] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* 2. Month Header & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-[#EEF3FF] text-[#315BFF] flex items-center justify-center">
            <CalendarIcon className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-xs font-bold text-[#172033]">September 2026</h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {daysOfWeek.map((day, idx) => {
          const isWeekend = idx === 5 || idx === 6; // Fri, Sat
          return (
            <div
              key={day}
              className={`py-1 ${
                isWeekend ? "text-slate-400 font-normal" : "text-slate-600 font-bold"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 4. Calendar Grid with Color-Coded Event Dots & Heatmap Activity */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs relative">
        {/* Leading empty slots for Sun, Mon */}
        {viewMode === "month" &&
          emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="h-8 w-8" />
          ))}

        {/* Days 1 to 30 (or current week if week view) */}
        {(viewMode === "week"
          ? [27, 28, 29, 30] // Current active week sample
          : daysInMonth
        ).map((day) => {
          const isToday = day === 27; // Today is Sep 27
          const isYesterday = day === 26;
          const isSelected = selectedDate === day;
          const event = SEPTEMBER_EVENTS[day];

          // Heatmap activity styling: soft light green or soft blue background tint
          const hasPomodoroHeatmap = event?.pomodoroCompleted;

          // Day of week index (0=Sun, 6=Sat)
          // Sep 1 was Tue (idx 2). Formula: (day + 1) % 7
          const dayOfWeekIdx = (day + 1) % 7;
          const isWeekend = dayOfWeekIdx === 5 || dayOfWeekIdx === 6; // Fri, Sat

          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              className="relative flex flex-col items-center justify-center cursor-pointer group"
            >
              {/* Day Cell Container */}
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#315BFF] text-white font-black shadow-md shadow-blue-500/35 ring-2 ring-blue-100 scale-105"
                    : hasPomodoroHeatmap
                    ? "bg-emerald-50/80 text-emerald-900 font-semibold hover:bg-emerald-100"
                    : isWeekend
                    ? "text-slate-400 hover:bg-slate-50"
                    : isToday
                    ? "text-[#172033] font-bold hover:bg-slate-100"
                    : "text-slate-700 font-medium hover:bg-blue-50/60"
                }`}
              >
                <span>{day}</span>
              </div>

              {/* Event Dots Under Date */}
              {event && (
                <div className="absolute -bottom-1 flex items-center justify-center gap-0.5 pointer-events-none">
                  {/* Blue dot: regular classes */}
                  {event.hasClasses && (
                    <span className="h-1 w-1 rounded-full bg-[#315BFF]" />
                  )}
                  {/* Red/orange dot: assignment deadlines */}
                  {event.hasAssignmentDeadline && (
                    <span className="h-1 w-1 rounded-full bg-rose-500" />
                  )}
                  {/* Purple/yellow dot: quizzes and exams */}
                  {event.hasQuizOrExam && (
                    <span className="h-1 w-1 rounded-full bg-purple-500" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Interactive Schedule Card for Selected Date */}
      {activePopoverDate && (
        <div className="p-3.5 rounded-xl bg-white border border-[#DCE7FC] shadow-sm space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
            <span className="font-bold text-[#172033] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#315BFF]" />
              <span>
                {activeDayShort}, Sep {activePopoverDate}
              </span>
              {activePopoverDate === 27 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold">
                  Today
                </span>
              )}
            </span>
            {activeEvent?.pomodoroCompleted ? (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Study Logged
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">
                {activeDaySessions.length} Classes
              </span>
            )}
          </div>

          {/* List of Scheduled Classes for this date */}
          {activeDaySessions.length > 0 ? (
            <div className="space-y-1.5 pt-0.5">
              {activeDaySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] border border-[#E5EAF2] hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${session.courseColor}`}
                    >
                      {session.courseCode.slice(4) || session.courseCode}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-[#172033] truncate text-[11px]">
                        {session.title.split("•")[0]}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        <span>{session.location}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#315BFF] shrink-0 ml-1.5">
                    {session.startTime}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF2] text-center text-xs text-slate-500">
              ☕ No lectures on {activeDayShort} (Off Day / Self Study)
            </div>
          )}

          {/* Deadlines / Exam Notes */}
          {(activeEvent?.assignmentTitle || activeEvent?.quizTitle) && (
            <div className="pt-1 space-y-1 text-[11px]">
              {activeEvent.assignmentTitle && (
                <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50/70 p-1.5 rounded-lg border border-rose-100">
                  <Pin className="h-3 w-3 shrink-0" />
                  <span className="font-semibold truncate">
                    Deadline: {activeEvent.assignmentTitle}
                  </span>
                </div>
              )}
              {activeEvent.quizTitle && (
                <div className="flex items-center gap-1.5 text-purple-600 bg-purple-50/70 p-1.5 rounded-lg border border-purple-100">
                  <Hourglass className="h-3 w-3 shrink-0" />
                  <span className="font-semibold truncate">
                    Quiz: {activeEvent.quizTitle}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Sleek "Next Milestone" Chips */}
      <div className="space-y-1.5 pt-1">
        {/* Next Quiz Milestone */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-blue-50/80 border border-indigo-100/80 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-sm">⏳</span>
            <div>
              <p className="font-bold text-[#172033] leading-none text-[11px]">
                Next Quiz: CN (Computer Networks)
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Tuesday, Sep 29 • Room A/MCL C</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold shrink-0">
            3 days left
          </span>
        </div>

        {/* Assignment Milestone */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-50/70 to-amber-50/70 border border-rose-100/70 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-sm">📌</span>
            <div>
              <p className="font-bold text-[#172033] leading-none text-[11px]">
                AIES Assignment 1
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Batch 82A • Submit before 11:59 PM</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold shrink-0">
            2 days left
          </span>
        </div>
      </div>

      {/* 7. Upcoming Tasks List */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ListTodo className="h-3.5 w-3.5 text-[#315BFF]" />
            <h4 className="text-xs font-bold text-[#172033]">Upcoming Tasks</h4>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-[11px] font-bold text-[#315BFF] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Task Items */}
        <div className="space-y-2">
          {defaultUpcomingTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask?.(task.id)}
              className="p-2 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer border border-transparent hover:border-slate-100"
            >
              {/* Colored status dot */}
              <span
                className={`h-2 w-2 rounded-full ${task.dotColor} mt-1.5 shrink-0`}
              />

              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-bold text-[#172033] truncate leading-tight">
                  {task.title}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {task.courseCode} • {task.dueDate} • {task.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
