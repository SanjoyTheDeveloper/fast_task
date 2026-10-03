"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Sparkles,
  Coffee,
} from "lucide-react";
import { GIcon } from "@/components/ui/GIcon";

export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseColor: string;
  type: "Lecture" | "Lab" | "Tutorial" | "Seminar";
  typeColor: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  faculty: string;
  borderColor: string;
}

export const WEEKLY_SCHEDULE: Record<string, ScheduleItem[]> = {
  Sun: [
    {
      id: "sun-1",
      courseCode: "0611CSE321",
      courseColor: "bg-[#5B63E6] text-white",
      type: "Lecture",
      typeColor: "text-[#5B63E6]",
      title: "AIES • Artificial Intelligence & Expert Systems",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      location: "Room A/507",
      faculty: "DRI",
      borderColor: "border-[#D8E3FD] hover:border-[#5B63E6]/60",
    },
    {
      id: "sun-2",
      courseCode: "0613CSE333",
      courseColor: "bg-[#315BFF] text-white",
      type: "Lecture",
      typeColor: "text-[#315BFF]",
      title: "AP • Advanced Programming",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      location: "Room A/502",
      faculty: "AR",
      borderColor: "border-[#D0DFFF] hover:border-[#315BFF]/60",
    },
    {
      id: "sun-3",
      courseCode: "0541MAT337",
      courseColor: "bg-[#F59E0B] text-white",
      type: "Lecture",
      typeColor: "text-[#D97706]",
      title: "MACS • Mathematical Analysis & Complex Systems",
      startTime: "03:30 PM",
      endTime: "05:00 PM",
      location: "Room A/502",
      faculty: "MH",
      borderColor: "border-[#FED7AA]/80 hover:border-[#F59E0B]/60",
    },
  ],
  Mon: [
    {
      id: "mon-1",
      courseCode: "0612CSE315",
      courseColor: "bg-[#0284C7] text-white",
      type: "Lecture",
      typeColor: "text-[#0284C7]",
      title: "CN • Computer Networks",
      startTime: "09:30 AM",
      endTime: "11:00 AM",
      location: "Room A/502, A-2003",
      faculty: "PCK",
      borderColor: "border-sky-200 hover:border-sky-400",
    },
    {
      id: "mon-2",
      courseCode: "0031CSE320",
      courseColor: "bg-[#8B5CF6] text-white",
      type: "Lecture",
      typeColor: "text-[#8B5CF6]",
      title: "TWRM • Technical Writing & Research Methodology",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      location: "Room A/MCL A, A-2002",
      faculty: "TR",
      borderColor: "border-purple-200 hover:border-purple-400",
    },
  ],
  Tue: [
    {
      id: "tue-1",
      courseCode: "0541MAT337",
      courseColor: "bg-[#F59E0B] text-white",
      type: "Lecture",
      typeColor: "text-[#D97706]",
      title: "MACS • Mathematical Analysis & Complex Systems",
      startTime: "08:00 AM",
      endTime: "09:30 AM",
      location: "Room A/507",
      faculty: "MH",
      borderColor: "border-[#FED7AA]/80 hover:border-[#F59E0B]/60",
    },
    {
      id: "tue-2",
      courseCode: "0612CSE316",
      courseColor: "bg-[#10B981] text-white",
      type: "Lab",
      typeColor: "text-[#059669]",
      title: "CN Sess. • Computer Networks Sessional",
      startTime: "11:00 AM",
      endTime: "02:00 PM",
      location: "Room A/MCL C",
      faculty: "PCK",
      borderColor: "border-[#A7F3D0]/80 hover:border-[#10B981]/60",
    },
    {
      id: "tue-3",
      courseCode: "0612CSE315",
      courseColor: "bg-[#0284C7] text-white",
      type: "Lecture",
      typeColor: "text-[#0284C7]",
      title: "CN • Computer Networks",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      location: "Room A/502",
      faculty: "PCK",
      borderColor: "border-sky-200 hover:border-sky-400",
    },
  ],
  Wed: [
    {
      id: "wed-1",
      courseCode: "0611CSE322",
      courseColor: "bg-[#10B981] text-white",
      type: "Lab",
      typeColor: "text-[#059669]",
      title: "AIES Sess. • Artificial Intelligence Sessional",
      startTime: "09:30 AM",
      endTime: "12:30 PM",
      location: "Room A/MCL B",
      faculty: "DRI",
      borderColor: "border-[#A7F3D0]/80 hover:border-[#10B981]/60",
    },
    {
      id: "wed-2",
      courseCode: "0031CSE320",
      courseColor: "bg-[#8B5CF6] text-white",
      type: "Lecture",
      typeColor: "text-[#8B5CF6]",
      title: "TWRM • Technical Writing & Research Methodology",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      location: "Room A/MCL D",
      faculty: "TR",
      borderColor: "border-purple-200 hover:border-purple-400",
    },
    {
      id: "wed-3",
      courseCode: "0611CSE321",
      courseColor: "bg-[#5B63E6] text-white",
      type: "Lecture",
      typeColor: "text-[#5B63E6]",
      title: "AIES • Artificial Intelligence & Expert Systems",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      location: "Room A/502",
      faculty: "DRI",
      borderColor: "border-[#D8E3FD] hover:border-[#5B63E6]/60",
    },
  ],
  Thu: [
    {
      id: "thu-1",
      courseCode: "0613CSE333",
      courseColor: "bg-[#315BFF] text-white",
      type: "Lecture",
      typeColor: "text-[#315BFF]",
      title: "AP • Advanced Programming",
      startTime: "12:30 PM",
      endTime: "02:00 PM",
      location: "Room A/502",
      faculty: "AR",
      borderColor: "border-[#D0DFFF] hover:border-[#315BFF]/60",
    },
    {
      id: "thu-2",
      courseCode: "0613CSE334",
      courseColor: "bg-[#10B981] text-white",
      type: "Lab",
      typeColor: "text-[#059669]",
      title: "AP Sess. • Advanced Programming Sessional",
      startTime: "02:00 PM",
      endTime: "05:00 PM",
      location: "Room A/MCL B",
      faculty: "AR",
      borderColor: "border-[#A7F3D0]/80 hover:border-[#10B981]/60",
    },
  ],
  Fri: [],
  Sat: [],
};

const DAYS_LIST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

import { useStudentProfile } from "@/lib/studentProfile";

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
    const dayLong = new Date().toLocaleDateString("en-US", { weekday: "short" });
    return dayLong; // e.g. "Sun"
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

  const dayNameMap: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

  // Current date formatted string: "(Sunday, Sep 27)"
  const dateFormatted = React.useMemo(() => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const month = now.toLocaleDateString("en-US", { month: "short" });
    const dateNum = now.getDate();
    return `(${day}, ${month} ${dateNum})`;
  }, []);

  const activeSessions = WEEKLY_SCHEDULE[selectedDay] || [];
  const isOffDay = activeSessions.length === 0;

  return (
    <section className="space-y-4">
      {/* 1. Header Row: Left Title & Info, Center Day Selector Pills, Right Status & Action */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-1">
        {/* Left: “Today’s Schedule” with calendar icon + date “(Sunday, Sep 27)” + subtitle */}
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
                  : `${dayNameMap[selectedDay] || selectedDay}'s Schedule`}
              </h2>
              <span
                className="text-xs text-slate-400 font-medium"
                suppressHydrationWarning
              >
                {isViewingToday ? dateFormatted : `(Summer 2026 Routine)`}
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
            const count = (WEEKLY_SCHEDULE[day] || []).length;
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

                {/* Small notification badge */}
                {count > 0 ? (
                  <span
                    className={`text-[10px] px-1 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                ) : (
                  <span
                    className={`text-[9px] px-1 rounded-full uppercase ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    Off
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: small green badge “3 active sessions” + “View Routine →” link */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${
              isOffDay
                ? "bg-amber-50 text-amber-700 border-amber-200/60"
                : "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]/60"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOffDay ? "bg-amber-500" : "bg-[#10B981] animate-pulse"
              }`}
            />
            <span>
              {isOffDay
                ? "0 sessions (Off-Day)"
                : `${activeSessions.length} active sessions`}
            </span>
          </span>

          {onManageRoutine && (
            <button
              type="button"
              onClick={onManageRoutine}
              className="text-xs font-bold text-[#315BFF] hover:text-[#254BE3] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Routine</span>
              <GIcon name="arrow_forward" size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Below the header: Three elegant horizontal course cards in a row */}
      {isOffDay ? (
        /* Off-day informative card with next class preview */
        <div className="rounded-2xl bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-blue-50/50 border border-amber-200/60 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <GIcon name="coffee" size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                    No Classes Scheduled on {selectedDay} (Off-Day)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                    Weekend
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  No routine classes scheduled for today. Great time for revision, self-study, or completing pending assignments!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectDay("Sun")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#315BFF] hover:bg-[#254BE3] text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer shrink-0"
            >
              <span>Preview Sunday&apos;s Classes</span>
              <GIcon name="arrow_forward" size={14} />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/85 border border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <GIcon name="schedule" size={14} className="text-[#315BFF] shrink-0" />
              <span>
                <strong>রবিবার (Sunday) সকাল ১১:০০ টায়</strong> রুম <strong>A/507</strong>-এ{" "}
                <span className="text-[#315BFF] font-bold">0611CSE321 (AIES)</span> দিয়ে ক্লাস শুরু হবে।
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-500">Faculty: DRI</span>
          </div>
        </div>
      ) : (
        /* Course cards row: 3 horizontal cards on desktop, responsive stack on tablet/mobile */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSessions.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSession?.(item)}
              className={`group relative flex flex-col justify-between rounded-2xl bg-white border ${item.borderColor} p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer`}
            >
              <div className="space-y-2">
                {/* Top of Card: Course code in a small colored badge + Session type on right */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${item.courseColor}`}
                  >
                    {item.courseCode}
                  </span>
                  <span className={`text-[11px] font-bold ${item.typeColor}`}>
                    {item.type}
                  </span>
                </div>

                {/* Course Name in Bold */}
                <h3 className="text-xs sm:text-sm font-bold text-[#172033] line-clamp-2 leading-snug group-hover:text-[#315BFF] transition-colors pt-0.5">
                  {item.title}
                </h3>
              </div>

              {/* Bottom of Card: Time with clock icon, Room with location icon, Faculty with user icon, Arrow button */}
              <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                <div className="space-y-1.5 text-[11px] text-slate-500">
                  {/* Time with clock icon */}
                  <div className="flex items-center gap-1.5">
                    <GIcon name="schedule" size={14} className="text-[#315BFF] shrink-0" />
                    <span className="font-semibold text-slate-700">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>

                  {/* Room with location icon */}
                  <div className="flex items-center gap-1.5">
                    <GIcon name="location_on" size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate max-w-[190px]">{item.location}</span>
                  </div>

                  {/* Faculty with person/user icon */}
                  <div className="flex items-center gap-1.5">
                    <GIcon name="person" size={14} className="text-[#5B63E6] shrink-0" />
                    <span>
                      Faculty: <strong className="text-slate-700 font-semibold">{item.faculty}</strong>
                    </span>
                  </div>
                </div>

                {/* Small circular arrow button on the right side of each card */}
                <div className="h-8 w-8 rounded-full bg-[#EEF3FF] text-[#315BFF] group-hover:bg-[#315BFF] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <GIcon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
