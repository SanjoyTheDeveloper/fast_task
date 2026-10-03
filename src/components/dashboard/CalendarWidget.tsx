"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";

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
    title: "CN • Computer Networks Quiz Prep",
    courseCode: "0612CSE315",
    dueDate: "Sep 29, 2026",
    time: "09:30 AM",
    dotColor: "bg-[#0284C7]",
  },
  {
    id: "up-2",
    title: "MACS • Complex Systems Problem Set",
    courseCode: "0541MAT337",
    dueDate: "Sep 29, 2026",
    time: "03:30 PM",
    dotColor: "bg-[#F59E0B]",
  },
  {
    id: "up-3",
    title: "TWRM • Report Draft Submission",
    courseCode: "0031CSE320",
    dueDate: "Sep 30, 2026",
    time: "11:00 AM",
    dotColor: "bg-[#8B5CF6]",
  },
  {
    id: "up-4",
    title: "AP • Advanced Programming Task",
    courseCode: "0613CSE333",
    dueDate: "Oct 01, 2026",
    time: "12:30 PM",
    dotColor: "bg-[#315BFF]",
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

  const [internalSelectedDate, setInternalSelectedDate] = React.useState<number | null>(() => {
    return isCurrentMonth ? todayDate : 1;
  });

  React.useEffect(() => {
    if (propSelectedDate !== undefined && propSelectedDate !== null) {
      setInternalSelectedDate(propSelectedDate);
    }
  }, [propSelectedDate]);

  const selectedDate = propSelectedDate !== undefined ? propSelectedDate : internalSelectedDate;
  const activePopoverDate = selectedDate || (isCurrentMonth ? todayDate : 1);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Total days in month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // First day offset (0 = Sunday)
  const firstDayOffset = new Date(year, month, 1).getDay();
  const emptyDays = Array.from({ length: firstDayOffset }, (_, i) => null);

  // Active day info
  const activeDayDateObj = new Date(year, month, activePopoverDate);
  const activeDayShort = daysOfWeek[activeDayDateObj.getDay()];
  const activeDaySessions = activeDayShort ? (WEEKLY_SCHEDULE[activeDayShort] || []) : [];
  const activeEvent = SEPTEMBER_EVENTS[activePopoverDate] || null;

  // Current week days for week view
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
    setInternalSelectedDate(day);
    const dayDateObj = new Date(year, month, day);
    const dayStr = daysOfWeek[dayDateObj.getDay()];
    onSelectDate?.(day, dayStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="rounded-2xl bg-white border border-[#E5EAF2] p-5 shadow-2xs space-y-4 relative transition-all">
      {/* 1. Top Bar: Streak Indicator & View Mode Toggle */}
      <div className="flex items-center justify-between pb-1">
        {/* 5-Day Study Streak Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 text-amber-800 border border-amber-200/60 shadow-2xs text-[11px] font-bold">
          <GIcon name="local_fire_department" size={14} filled className="text-amber-500 animate-pulse" />
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
            <GIcon name="calendar_month" size={14} />
          </div>
          <h3 className="text-xs font-bold text-[#172033]">
            {monthName} {year}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <GIcon name="chevron_left" size={14} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <GIcon name="chevron_right" size={14} />
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
        {/* Leading empty slots */}
        {viewMode === "month" &&
          emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="h-8 w-8" />
          ))}

        {/* Days of month or week view */}
        {(viewMode === "week" ? currentWeekDays : daysInMonth).map((day) => {
          const isToday = isCurrentMonth && day === todayDate;
          const isSelected = selectedDate === day;
          const event = SEPTEMBER_EVENTS[day];

          // Heatmap activity styling: soft light green background
          const hasPomodoroHeatmap = event?.pomodoroCompleted;

          const dayDateObj = new Date(year, month, day);
          const dayOfWeekIdx = dayDateObj.getDay();
          const isWeekend = dayOfWeekIdx === 5 || dayOfWeekIdx === 6; // Fri, Sat

          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className="relative flex flex-col items-center justify-center cursor-pointer group"
            >
              {/* Day Cell Container */}
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200 ease-out ${
                  isSelected
                    ? "bg-[#315BFF] text-white font-black shadow-md shadow-blue-500/40 ring-2 ring-blue-100 scale-105"
                    : isToday
                    ? "text-[#315BFF] font-black bg-blue-50/70 hover:bg-blue-100/70"
                    : hasPomodoroHeatmap
                    ? "bg-emerald-50/80 text-emerald-900 font-semibold hover:bg-emerald-100"
                    : isWeekend
                    ? "text-slate-400 hover:bg-slate-50"
                    : "text-slate-700 font-medium hover:bg-blue-50/60"
                }`}
              >
                <span>{day}</span>
              </div>

              {/* Event Dots Under Date */}
              {event ? (
                <div className="absolute -bottom-1 flex items-center justify-center gap-0.5 pointer-events-none">
                  {/* Blue dot: regular classes */}
                  {event.hasClasses && (
                    <span className="h-1 w-1 rounded-full bg-[#315BFF]" />
                  )}
                  {/* Red/orange dot: assignment deadlines */}
                  {event.hasAssignmentDeadline && (
                    <span className="h-1 w-1 rounded-full bg-rose-500" />
                  )}
                  {/* Purple dot: quizzes and exams */}
                  {event.hasQuizOrExam && (
                    <span className="h-1 w-1 rounded-full bg-purple-500" />
                  )}
                </div>
              ) : isToday && !isSelected ? (
                <div className="absolute -bottom-1 flex items-center justify-center pointer-events-none">
                  <span className="h-1 w-1 rounded-full bg-[#315BFF]/70" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* 5. Interactive Schedule Card for Selected Date */}
      {activePopoverDate && (
        <div className="p-3.5 rounded-xl bg-white border border-[#DCE7FC] shadow-sm space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
            <span className="font-bold text-[#172033] flex items-center gap-1.5">
              <GIcon name="auto_awesome" size={14} className="text-[#315BFF]" />
              <span>
                {activeDayShort}, {monthName.slice(0, 3)} {activePopoverDate}
              </span>
              {isCurrentMonth && activePopoverDate === todayDate && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold">
                  Today
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {isCurrentMonth && activePopoverDate !== todayDate && (
                <button
                  type="button"
                  onClick={() => handleDateClick(todayDate)}
                  className="text-[10px] font-bold text-[#315BFF] hover:underline cursor-pointer"
                >
                  ← Jump to Today
                </button>
              )}
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
                        <GIcon name="location_on" size={10} className="shrink-0" />
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
                  <GIcon name="push_pin" size={12} className="shrink-0" />
                  <span className="font-semibold truncate">
                    Deadline: {activeEvent.assignmentTitle}
                  </span>
                </div>
              )}
              {activeEvent.quizTitle && (
                <div className="flex items-center gap-1.5 text-purple-600 bg-purple-50/70 p-1.5 rounded-lg border border-purple-100">
                  <GIcon name="hourglass_empty" size={12} className="shrink-0" />
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
                Active Quiz: CN (Computer Networks)
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Tuesday, Sep 29 • Room A/MCL C</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold shrink-0">
            Today
          </span>
        </div>

        {/* Assignment Milestone */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-50/70 to-amber-50/70 border border-rose-100/70 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-sm">📌</span>
            <div>
              <p className="font-bold text-[#172033] leading-none text-[11px]">
                TWRM Report Draft
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Batch 82A • Tomorrow, Sep 30</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold shrink-0">
            Tomorrow
          </span>
        </div>
      </div>

      {/* 7. Upcoming Tasks List */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <GIcon name="format_list_bulleted" size={14} className="text-[#315BFF]" />
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
