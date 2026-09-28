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
import {
  GraduationCap,
  Clock,
  MapPin,
  Calendar,
  BookOpen,
  Trash2,
  Check,
} from "lucide-react";
import {
  CourseSession,
  DayOfWeek,
  SessionType,
  BadgeColor,
  DAYS_OF_WEEK,
  SESSION_TYPES,
  BADGE_COLORS,
} from "@/lib/academic";

interface CourseScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToEdit?: CourseSession | null;
  onSave: (session: CourseSession) => void;
  onDelete?: (sessionId: string) => void;
  defaultDay?: DayOfWeek;
}

export function CourseScheduleModal({
  open,
  onOpenChange,
  sessionToEdit,
  onSave,
  onDelete,
  defaultDay,
}: CourseScheduleModalProps) {
  const isEditing = Boolean(sessionToEdit?.id);

  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SessionType>("Lecture");
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("10:50");
  const [days, setDays] = useState<DayOfWeek[]>([]);
  const [room, setRoom] = useState("");
  const [color, setColor] = useState<BadgeColor>("violet");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionToEdit) {
      setCourse(sessionToEdit.course || "");
      setTitle(sessionToEdit.title || "");
      setType(sessionToEdit.type || "Lecture");
      setStartTime(sessionToEdit.startTime || "09:30");
      setEndTime(sessionToEdit.endTime || "10:50");
      setDays(sessionToEdit.days || []);
      setRoom(sessionToEdit.room || "");
      setColor(sessionToEdit.color || "violet");
    } else {
      setCourse("");
      setTitle("");
      setType("Lecture");
      setStartTime("09:30");
      setEndTime("10:50");
      setDays(defaultDay ? [defaultDay] : ["Monday", "Wednesday"]);
      setRoom("");
      setColor("violet");
    }
    setError(null);
  }, [sessionToEdit, defaultDay, open]);

  const toggleDay = (day: DayOfWeek) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSelectAllWeekdays = () => {
    setDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.trim()) {
      setError("Please enter a course code (e.g. CSE231)");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a class / session title");
      return;
    }
    if (!startTime || !endTime) {
      setError("Please specify both start and end times");
      return;
    }
    if (days.length === 0) {
      setError("Please select at least one day of the week");
      return;
    }
    if (!room.trim()) {
      setError("Please enter a room or building location");
      return;
    }

    const payload: CourseSession = {
      id: sessionToEdit?.id || `session-${Date.now()}`,
      course: course.trim().toUpperCase(),
      title: title.trim(),
      type,
      startTime,
      endTime,
      days,
      room: room.trim(),
      color,
    };

    onSave(payload);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (sessionToEdit?.id && onDelete) {
      onDelete(sessionToEdit.id);
      onOpenChange(false);
    }
  };

  const currentColorConfig = BADGE_COLORS[color] || BADGE_COLORS.violet;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[92dvh] overflow-y-auto p-5 sm:p-7 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
              {isEditing ? "Edit Class Session" : "Add Course / Class Session"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-slate-500">
            {isEditing
              ? "Update schedule timings, room assignment, or session recurrence."
              : "Schedule a recurring lecture, lab, or tutorial in your academic timetable."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Course Code & Color Badge Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                Course Code <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. CSE231, EEPP"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="h-10 text-sm rounded-xl border-slate-200 font-semibold uppercase tracking-wider"
              />
            </div>

            {/* Badge Color Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Accent Pill Color
              </label>
              <div className="grid grid-cols-4 gap-2 pt-0.5">
                {(Object.keys(BADGE_COLORS) as BadgeColor[]).map((cKey) => {
                  const cConfig = BADGE_COLORS[cKey];
                  const isSelected = color === cKey;
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setColor(cKey)}
                      className={`h-9 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        cConfig.bg
                      } ${cConfig.text} ${
                        isSelected
                          ? `ring-2 ring-offset-2 ring-indigo-500 ${cConfig.border} font-black`
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                      title={cConfig.label}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      <span className="capitalize">{cKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Session Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Lecture / Topic Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Operating Systems • Virtual Memory & Page Tables"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 text-sm rounded-xl border-slate-200"
            />
          </div>

          {/* Session Type & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Session Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SessionType)}
                className="w-full h-10 px-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                Room / Venue <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Academic Bldg 3, Room 402"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="h-10 text-sm rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Timings: Start & End */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Start Time <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-10 text-sm rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                End Time <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-10 text-sm rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Days of Week (Multi-select pill buttons) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Recurrence Days <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllWeekdays}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Mon - Fri
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs scale-102"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Card Preview in Schedule:
            </span>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-[#172033] flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${currentColorConfig.bg} ${currentColorConfig.text} ${currentColorConfig.border}`}
                >
                  {course || "COURSE101"}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {type}
                </span>
              </div>
              <p className="text-xs font-bold text-[#172033] line-clamp-1">
                {title || "Course Lecture Title"}
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1 text-[#315BFF] font-semibold">
                  <Clock className="h-3 w-3 text-[#315BFF]" />
                  {startTime} - {endTime}
                </span>
                <span className="flex items-center gap-1 text-slate-500 truncate max-w-[140px]">
                  <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                  <span className="truncate">{room || "Room Number"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-10 gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Session</span>
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border-slate-200 h-10 w-full sm:w-auto cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/25 h-10 w-full sm:w-auto cursor-pointer"
              >
                {isEditing ? "Save Changes" : "Add to Schedule"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
