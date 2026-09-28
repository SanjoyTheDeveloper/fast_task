"use client";

import * as React from "react";
import {
  DEFAULT_COURSE_SESSIONS,
  CourseSession,
  DayOfWeek,
  BADGE_COLORS,
  formatSessionTime,
  SemesterConfig,
  DEFAULT_SEMESTER_CONFIG,
  getSemesterStatus,
  sortSessionsChronologically,
} from "@/lib/academic";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Pencil,
  Sparkles,
  Layers,
  Coffee,
  CheckCircle2,
  Settings2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { CourseScheduleModal } from "./CourseScheduleModal";
import { SemesterSetupModal } from "./SemesterSetupModal";
import { toast } from "sonner";

export interface AcademicHeaderProps {
  userName?: string | null;
  onOpenCreateModal: () => void;
}

const STORAGE_KEY = "fast_task_academic_routine_v1";
const SEMESTER_STORAGE_KEY = "fast_task_semester_config_v1";

export function AcademicHeader({
  userName = "Student",
  onOpenCreateModal,
}: AcademicHeaderProps) {
  // Dynamic greeting based on current local time
  const [greeting, setGreeting] = React.useState("Welcome back");
  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Today's formatted date & Day of the week
  const todayDate = React.useMemo(() => new Date(), []);

  const todayFormatted = React.useMemo(() => {
    return todayDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, [todayDate]);

  const currentDayOfWeek = React.useMemo(() => {
    return todayDate.toLocaleDateString("en-US", {
      weekday: "long",
    }) as DayOfWeek;
  }, [todayDate]);

  // Semester Configuration State & Persistence
  const [semesterConfig, setSemesterConfig] = React.useState<SemesterConfig>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(SEMESTER_STORAGE_KEY);
          if (stored) {
            return JSON.parse(stored);
          }
        } catch {
          // Fallback
        }
      }
      return DEFAULT_SEMESTER_CONFIG;
    }
  );

  const persistSemesterConfig = (newConfig: SemesterConfig) => {
    setSemesterConfig(newConfig);
    try {
      localStorage.setItem(SEMESTER_STORAGE_KEY, JSON.stringify(newConfig));
      toast.success("Semester dates updated successfully!");
    } catch {
      // Storage error
    }
  };

  // Calculate dynamic semester status (week number, active vs ended, etc.)
  const semesterStatus = React.useMemo(() => {
    return getSemesterStatus(semesterConfig, todayDate);
  }, [semesterConfig, todayDate]);

  // Routine Sessions State & LocalStorage Persistence
  const [sessions, setSessions] = React.useState<CourseSession[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_COURSE_SESSIONS;
  });

  const persistSessions = (newSessions: CourseSession[]) => {
    setSessions(newSessions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    } catch {
      // Storage error
    }
  };

  // View mode: 'today' or 'all' (all week's routine)
  const [viewMode, setViewMode] = React.useState<"today" | "all">("today");

  // Auto-filter today's sessions & sort chronologically
  const todaySessions = React.useMemo(() => {
    // If semester is ended or not started, we still show sessions if user wants or 0
    if (semesterStatus.status === "ended") {
      return [];
    }
    const filtered = sessions.filter(
      (s) => Array.isArray(s.days) && s.days.includes(currentDayOfWeek)
    );
    return sortSessionsChronologically(filtered);
  }, [sessions, currentDayOfWeek, semesterStatus.status]);

  const displayedSessions =
    viewMode === "today"
      ? todaySessions
      : sortSessionsChronologically(sessions);

  // Modals State
  const [isClassModalOpen, setIsClassModalOpen] = React.useState(false);
  const [sessionToEdit, setSessionToEdit] = React.useState<CourseSession | null>(
    null
  );
  const [isSemesterModalOpen, setIsSemesterModalOpen] = React.useState(false);

  const handleOpenAddSession = () => {
    setSessionToEdit(null);
    setIsClassModalOpen(true);
  };

  const handleOpenEditSession = (session: CourseSession) => {
    setSessionToEdit(session);
    setIsClassModalOpen(true);
  };

  const handleSaveSession = (savedSession: CourseSession) => {
    const exists = sessions.some((s) => s.id === savedSession.id);
    let updated: CourseSession[];
    if (exists) {
      updated = sessions.map((s) =>
        s.id === savedSession.id ? savedSession : s
      );
      toast.success(`${savedSession.course} session updated!`);
    } else {
      updated = [savedSession, ...sessions];
      toast.success(`${savedSession.course} added to weekly routine!`);
    }
    persistSessions(updated);
  };

  const handleDeleteSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    const updated = sessions.filter((s) => s.id !== sessionId);
    persistSessions(updated);
    toast.success(`${target?.course || "Class"} removed from schedule.`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Main Welcome & Academic Status Banner (Frosted Glass) */}
      <div className="w-full p-4 sm:p-6 lg:p-7 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-blue-500/40 via-indigo-500/60 to-purple-500/30" />

        <div className="space-y-2 min-w-0 flex-1">
          {/* Semester & Academic Week Badge (Clickable to Configure Semester) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSemesterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 text-xs font-bold shadow-2xs backdrop-blur-xs hover:bg-blue-500/20 hover:border-blue-400/50 transition-all cursor-pointer group"
              title="Click to edit semester dates"
            >
              <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
              <span>{semesterStatus.message}</span>
              <Settings2 className="h-3 w-3 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-slate-600 text-xs font-semibold backdrop-blur-xs">
              <Calendar className="h-3 w-3 text-slate-500" />
              <span>{todayFormatted}</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 leading-tight">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {userName || "Scholar"}
            </span>{" "}
            📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Stay on top of lectures, assignment deadlines, exam prep, and personal study targets.
          </p>
        </div>

        {/* Primary CTA: Full-width on mobile, compact on tablet/desktop */}
        <div className="w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <Button
            onClick={onOpenCreateModal}
            className="w-full sm:w-auto h-11 px-6 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/25 border border-indigo-400/30 active:scale-[0.98] transition-all rounded-xl cursor-pointer justify-center"
            aria-label="Add new assignment or task"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Assignment</span>
          </Button>
        </div>
      </div>

      {/* 2. Today's Routine & Lecture Strip (Light Dashboard Card) with Schedule Management */}
      <div
        id="schedule"
        className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-[#172033] relative overflow-hidden"
      >
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-blue-500/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/5 blur-2xl" />

        {/* Header Bar */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#315BFF] border border-blue-200/60 shadow-2xs">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold tracking-tight text-[#172033] uppercase flex items-center gap-2">
                {viewMode === "today"
                  ? `Today's Schedule (${currentDayOfWeek})`
                  : "All Weekly Course Schedule"}
              </h2>
            </div>
          </div>

          {/* Action & Status Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Active sessions counter badge */}
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60">
              {todaySessions.length > 0 ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-slate-800 font-semibold">
                    • {todaySessions.length} active session{todaySessions.length !== 1 ? "s" : ""}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="text-slate-500">No classes today</span>
                </>
              )}
            </span>

            {/* Semester Setup Modal Button */}
            <button
              type="button"
              onClick={() => setIsSemesterModalOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Configure semester duration and term name"
            >
              <CalendarDays className="h-3 w-3 text-[#315BFF]" />
              <span className="hidden sm:inline">Term Dates</span>
            </button>

            {/* View Mode Toggle (Today vs All) */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "today" ? "all" : "today")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Toggle weekly timetable"
            >
              <Layers className="h-3 w-3" />
              <span>{viewMode === "today" ? "Weekly Timetable" : "Today Only"}</span>
            </button>

            {/* Setup Course Schedule (+ Add Class) Button */}
            <button
              type="button"
              onClick={handleOpenAddSession}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#315BFF] hover:bg-[#254BE3] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Setup Course Schedule</span>
            </button>
          </div>
        </div>

        {/* Outside Semester Alert Banners */}
        {semesterStatus.status === "not_started" && (
          <div className="mb-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Upcoming Semester:</strong> {semesterStatus.message}. Weekly routine is previewed below.
              </span>
            </div>
            <button
              onClick={() => setIsSemesterModalOpen(true)}
              className="underline hover:text-amber-950 font-medium shrink-0 ml-2"
            >
              Adjust Dates
            </button>
          </div>
        )}

        {semesterStatus.status === "ended" && (
          <div className="mb-3.5 p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs text-purple-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              <span>
                <strong>Term Concluded:</strong> {semesterStatus.message}. Great job completing this academic term!
              </span>
            </div>
            <button
              onClick={() => setIsSemesterModalOpen(true)}
              className="underline hover:text-purple-950 font-medium shrink-0 ml-2"
            >
              Start New Term
            </button>
          </div>
        )}

        {/* Schedule Cards Carousel / Grid */}
        {displayedSessions.length > 0 ? (
          <div className="relative flex md:grid md:grid-cols-3 overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 pb-2 pt-1 -mx-1 px-1">
            {displayedSessions.map((session) => {
              const colorKey = session.color || "violet";
              const cConfig = BADGE_COLORS[colorKey] || BADGE_COLORS.violet;
              const formattedTime = formatSessionTime(
                session.startTime,
                session.endTime
              );

              return (
                <div
                  key={session.id}
                  onClick={() => handleOpenEditSession(session)}
                  className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all duration-200 min-w-[260px] sm:min-w-[280px] md:min-w-0 snap-center shrink-0 md:shrink cursor-pointer"
                  title="Click to edit session details"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${cConfig.bg} ${cConfig.text} ${cConfig.border} ${cConfig.glow}`}
                      >
                        {session.course}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-500">
                          {session.type}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-slate-200/60 text-slate-600 transition-opacity">
                          <Pencil className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#172033] group-hover:text-[#315BFF] transition-colors line-clamp-1">
                      {session.title}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-[#315BFF] font-semibold">
                      <Clock className="h-3 w-3 text-[#315BFF]" />
                      {formattedTime}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 truncate max-w-[130px]">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                      <span className="truncate">{session.room}</span>
                    </span>
                  </div>

                  {/* Recurrence Days pill on weekly view */}
                  {viewMode === "all" && session.days && (
                    <div className="mt-2 pt-1 flex flex-wrap gap-1">
                      {session.days.map((d) => (
                        <span
                          key={d}
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            d === currentDayOfWeek
                              ? "bg-[#315BFF] text-white font-bold"
                              : "bg-slate-200/70 text-slate-600"
                          }`}
                        >
                          {d.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Attractive Empty State for Off-Day / No Classes */
          <div className="p-6 sm:p-8 text-center rounded-xl bg-[#F8FAFC] border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-2.5">
            <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-amber-500 mb-1 shadow-2xs">
              <Coffee className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-sm sm:text-base font-bold text-[#172033]">
              No classes scheduled for today. Take rest or catch up on study!
            </p>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Today is free from scheduled lectures. Use this time to prepare assignments, review past lecture notes, or schedule an ad-hoc tutorial.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>View Full Weekly Timetable</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAddSession}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#315BFF] hover:bg-[#254BE3] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Add a Class for {currentDayOfWeek}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Course Schedule Modal */}
      <CourseScheduleModal
        open={isClassModalOpen}
        onOpenChange={setIsClassModalOpen}
        sessionToEdit={sessionToEdit}
        onSave={handleSaveSession}
        onDelete={handleDeleteSession}
        defaultDay={currentDayOfWeek}
      />

      {/* Semester Setup & Duration Modal */}
      <SemesterSetupModal
        open={isSemesterModalOpen}
        onOpenChange={setIsSemesterModalOpen}
        config={semesterConfig}
        onSave={persistSemesterConfig}
      />
    </div>
  );
}
