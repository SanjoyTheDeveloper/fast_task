"use client";

import * as React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  User,
  Plus,
  Check,
  AlertCircle,
  Copy,
  Sparkles,
  BookOpen,
} from "@/components/ui/GoogleIcon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveStoredRoutineSlots } from "@/lib/routineStorage";

export interface RoutineSlot {
  id: string;
  userId?: string;
  courseCode: string;
  courseTitle: string;
  dayOfWeek: string;
  day?: string;
  startTime: string;
  endTime: string;
  roomNo?: string | null;
  roomNumber?: string | null;
  instructor?: string | null;
  teacherName?: string | null;
  semester?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (slot: RoutineSlot | RoutineSlot[]) => void;
  slotToEdit?: RoutineSlot | null;
  defaultDay?: string;
}

export interface DayConfig {
  dayOfWeek: string;
  short: string;
  startTime: string;
  endTime: string;
  roomNo: string;
}

const DAYS_OF_WEEK: { short: string; full: string }[] = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

/**
 * Standard 1h 30m (90 minutes) university lecture slot presets
 */
export const STANDARD_SLOTS = [
  { start: "08:00 AM", end: "09:30 AM", label: "08:00 – 09:30 AM" },
  { start: "09:30 AM", end: "11:00 AM", label: "09:30 – 11:00 AM" },
  { start: "11:00 AM", end: "12:30 PM", label: "11:00 – 12:30 PM" },
  { start: "12:30 PM", end: "02:00 PM", label: "12:30 – 02:00 PM" },
  { start: "02:00 PM", end: "03:30 PM", label: "02:00 – 03:30 PM" },
  { start: "03:30 PM", end: "05:00 PM", label: "03:30 – 05:00 PM" },
  { start: "05:00 PM", end: "06:30 PM", label: "05:00 – 06:30 PM" },
];

/**
 * Automatically computes End Time by adding 90 minutes (1h 30m) to Start Time
 */
export function calculateDefaultEndTime(startTimeStr: string, durationMinutes = 90): string {
  if (!startTimeStr) return "";
  const clean = startTimeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");
  const timeOnly = clean.replace(/[AP]M/g, "").trim();
  const parts = timeOnly.split(":");
  if (parts.length < 2) return "";

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return "";

  // Convert 12h clock to 24h clock for accurate math
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  // Add duration
  let totalMinutes = hours * 60 + minutes + durationMinutes;
  totalMinutes = totalMinutes % (24 * 60);

  let endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  const ampm = endHours >= 12 ? "PM" : "AM";

  if (endHours > 12) endHours -= 12;
  if (endHours === 0) endHours = 12;

  const paddedHours = endHours.toString().padStart(2, "0");
  const paddedMinutes = endMinutes.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes} ${ampm}`;
}

const PRESET_COURSES = [
  { code: "0611CSE321", title: "AIES • Artificial Intelligence & Expert Systems" },
  { code: "0613CSE333", title: "AP • Advanced Programming" },
  { code: "0612CSE315", title: "CN • Computer Networks" },
  { code: "0541MAT337", title: "MACS • Mathematical Analysis & Complex Systems" },
  { code: "0031CSE320", title: "TWRM • Technical Writing & Research Methodology" },
  { code: "0612CSE316", title: "CN Sessional (Lab)" },
  { code: "0611CSE322", title: "AIES Sessional (Lab)" },
  { code: "0613CSE334", title: "AP Sessional (Lab)" },
];

export function AddRoutineModal({
  isOpen,
  onClose,
  onSaved,
  slotToEdit,
  defaultDay = "Sunday",
}: AddRoutineModalProps) {
  const router = useRouter();
  const isEditing = Boolean(slotToEdit?.id);

  // Common Course Info (Fully customizable & editable)
  const [courseTitle, setCourseTitle] = React.useState("");
  const [courseCode, setCourseCode] = React.useState("");
  const [instructor, setInstructor] = React.useState("");
  const [selectedPreset, setSelectedPreset] = React.useState<string>("");
  const [isCustomCourse, setIsCustomCourse] = React.useState(false);

  // Ref to automatically focus Course Title input
  const courseTitleInputRef = React.useRef<HTMLInputElement>(null);

  // Base / Default timing template (Defaults to 09:30 AM - 11:00 AM: 90 mins)
  const [baseStartTime, setBaseStartTime] = React.useState("09:30 AM");
  const [baseEndTime, setBaseEndTime] = React.useState("11:00 AM");
  const [baseRoomNo, setBaseRoomNo] = React.useState("");

  // Selected days
  const [selectedDays, setSelectedDays] = React.useState<string[]>([defaultDay]);

  // Per-day custom configurations: key is dayOfWeek ("Sunday", "Monday", etc.)
  const [dayConfigs, setDayConfigs] = React.useState<Record<string, DayConfig>>({});

  // Submitting & Error state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Initialize or reset state on open/edit
  React.useEffect(() => {
    if (slotToEdit) {
      const editDay = slotToEdit.dayOfWeek || defaultDay;
      const short = DAYS_OF_WEEK.find((d) => d.full === editDay)?.short || "Sun";

      setCourseTitle(slotToEdit.courseTitle || "");
      setCourseCode(slotToEdit.courseCode || "");
      setInstructor(slotToEdit.instructor || "");
      setSelectedDays([editDay]);
      setSelectedPreset("custom");
      setIsCustomCourse(true);

      const initialConfig: DayConfig = {
        dayOfWeek: editDay,
        short,
        startTime: slotToEdit.startTime || "09:30 AM",
        endTime: slotToEdit.endTime || "11:00 AM",
        roomNo: slotToEdit.roomNo || "",
      };

      setDayConfigs({ [editDay]: initialConfig });
      setBaseStartTime(slotToEdit.startTime || "09:30 AM");
      setBaseEndTime(slotToEdit.endTime || "11:00 AM");
      setBaseRoomNo(slotToEdit.roomNo || "");
    } else {
      setCourseTitle("");
      setCourseCode("");
      setInstructor("");
      setSelectedPreset("");
      setIsCustomCourse(false);
      setSelectedDays([defaultDay]);

      const initialShort = DAYS_OF_WEEK.find((d) => d.full === defaultDay)?.short || "Sun";
      setDayConfigs({
        [defaultDay]: {
          dayOfWeek: defaultDay,
          short: initialShort,
          startTime: "09:30 AM",
          endTime: "11:00 AM",
          roomNo: "",
        },
      });
      setBaseStartTime("09:30 AM");
      setBaseEndTime("11:00 AM");
      setBaseRoomNo("");
    }
    setErrorMsg(null);
  }, [slotToEdit, defaultDay, isOpen]);

  // Trigger custom course mode and auto-focus Course Title
  const handleEnableCustomCourse = React.useCallback(() => {
    setIsCustomCourse(true);
    setSelectedPreset("custom");
    setCourseTitle("");
    setCourseCode("");
    setTimeout(() => {
      courseTitleInputRef.current?.focus();
    }, 50);
    toast.info("Custom course mode enabled. Type your course title and code below.");
  }, []);

  // Switch back to preset selection mode
  const handleSwitchToPresets = React.useCallback(() => {
    setIsCustomCourse(false);
    setSelectedPreset("");
    toast.info("Preset selection mode enabled. Choose a course template.");
  }, []);

  if (!isOpen) return null;

  // Preset or Custom selection handler
  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPreset(val);

    if (val === "custom") {
      setIsCustomCourse(true);
      setCourseTitle("");
      setCourseCode("");
      setTimeout(() => {
        courseTitleInputRef.current?.focus();
      }, 50);
      toast.info("Custom course mode: Type any course title and code below.");
      return;
    }

    if (!val) {
      setIsCustomCourse(false);
      setCourseTitle("");
      setCourseCode("");
      return;
    }

    const found = PRESET_COURSES.find((c) => c.code === val);
    if (found) {
      setIsCustomCourse(false);
      setCourseCode(found.code);
      setCourseTitle(found.title);
      toast.success(`Loaded "${found.code}" template. You can customize the fields anytime.`);
    }
  };

  // Toggle day selection
  const handleToggleDay = (dayFull: string, short: string) => {
    if (isEditing) {
      setSelectedDays([dayFull]);
      setDayConfigs((prev) => {
        const existing = prev[dayFull] || {
          dayOfWeek: dayFull,
          short,
          startTime: baseStartTime,
          endTime: baseEndTime,
          roomNo: baseRoomNo,
        };
        return { [dayFull]: existing };
      });
      return;
    }

    if (selectedDays.includes(dayFull)) {
      const updated = selectedDays.filter((d) => d !== dayFull);
      setSelectedDays(updated);
    } else {
      const updated = [...selectedDays, dayFull];
      updated.sort((a, b) => {
        const idxA = DAYS_OF_WEEK.findIndex((d) => d.full === a);
        const idxB = DAYS_OF_WEEK.findIndex((d) => d.full === b);
        return idxA - idxB;
      });
      setSelectedDays(updated);

      setDayConfigs((prev) => ({
        ...prev,
        [dayFull]: prev[dayFull] || {
          dayOfWeek: dayFull,
          short,
          startTime: baseStartTime,
          endTime: baseEndTime,
          roomNo: baseRoomNo,
        },
      }));
    }
  };

  // Base Start Time change with automatic 90-min End Time calculation
  const handleBaseStartTimeChange = (newStart: string) => {
    setBaseStartTime(newStart);
    const autoEnd = calculateDefaultEndTime(newStart, 90);
    if (autoEnd) {
      setBaseEndTime(autoEnd);
    }
  };

  // Quick preset slot selection for Base Template
  const handleSelectBaseSlotPreset = (start: string, end: string) => {
    setBaseStartTime(start);
    setBaseEndTime(end);
  };

  // Day-specific Start Time change with automatic 90-min End Time calculation
  const handleDayStartTimeChange = (dayFull: string, newStart: string) => {
    const autoEnd = calculateDefaultEndTime(newStart, 90);

    setDayConfigs((prev) => {
      const current = prev[dayFull] || {
        dayOfWeek: dayFull,
        short: DAYS_OF_WEEK.find((d) => d.full === dayFull)?.short || "Sun",
        startTime: baseStartTime,
        endTime: baseEndTime,
        roomNo: baseRoomNo,
      };

      return {
        ...prev,
        [dayFull]: {
          ...current,
          startTime: newStart,
          // Auto-calculate +90 mins end time if valid, else keep previous end time
          endTime: autoEnd || current.endTime,
        },
      };
    });
  };

  // Day-specific End Time change (manual override)
  const handleDayEndTimeChange = (dayFull: string, newEnd: string) => {
    setDayConfigs((prev) => {
      const current = prev[dayFull] || {
        dayOfWeek: dayFull,
        short: DAYS_OF_WEEK.find((d) => d.full === dayFull)?.short || "Sun",
        startTime: baseStartTime,
        endTime: baseEndTime,
        roomNo: baseRoomNo,
      };

      return {
        ...prev,
        [dayFull]: {
          ...current,
          endTime: newEnd,
        },
      };
    });
  };

  // Day-specific Room Number change
  const handleDayRoomNoChange = (dayFull: string, roomNo: string) => {
    setDayConfigs((prev) => {
      const current = prev[dayFull] || {
        dayOfWeek: dayFull,
        short: DAYS_OF_WEEK.find((d) => d.full === dayFull)?.short || "Sun",
        startTime: baseStartTime,
        endTime: baseEndTime,
        roomNo: baseRoomNo,
      };

      return {
        ...prev,
        [dayFull]: {
          ...current,
          roomNo,
        },
      };
    });
  };

  // Day-specific Quick 90m Slot preset selection
  const handleSelectDaySlotPreset = (dayFull: string, start: string, end: string) => {
    setDayConfigs((prev) => {
      const current = prev[dayFull] || {
        dayOfWeek: dayFull,
        short: DAYS_OF_WEEK.find((d) => d.full === dayFull)?.short || "Sun",
        startTime: baseStartTime,
        endTime: baseEndTime,
        roomNo: baseRoomNo,
      };

      return {
        ...prev,
        [dayFull]: {
          ...current,
          startTime: start,
          endTime: end,
        },
      };
    });
  };

  // Copy one day's timing and room to all other selected days
  const handleCopyDayToAll = (sourceDay: string) => {
    const source = dayConfigs[sourceDay];
    if (!source) return;

    setDayConfigs((prev) => {
      const next: Record<string, DayConfig> = { ...prev };
      selectedDays.forEach((d) => {
        next[d] = {
          ...next[d],
          dayOfWeek: d,
          short: DAYS_OF_WEEK.find((day) => day.full === d)?.short || "Sun",
          startTime: source.startTime,
          endTime: source.endTime,
          roomNo: source.roomNo,
        };
      });
      return next;
    });

    setBaseStartTime(source.startTime);
    setBaseEndTime(source.endTime);
    if (source.roomNo) setBaseRoomNo(source.roomNo);

    toast.success(`Copied ${sourceDay}'s schedule to all selected days! 📋`);
  };

  // Apply base time template to all selected days
  const handleApplyBaseToAll = () => {
    if (!baseStartTime.trim() || !baseEndTime.trim()) {
      toast.error("Please provide both Start and End time in the template");
      return;
    }

    setDayConfigs((prev) => {
      const next: Record<string, DayConfig> = { ...prev };
      selectedDays.forEach((d) => {
        next[d] = {
          dayOfWeek: d,
          short: DAYS_OF_WEEK.find((day) => day.full === d)?.short || "Sun",
          startTime: baseStartTime.trim(),
          endTime: baseEndTime.trim(),
          roomNo: baseRoomNo.trim() || next[d]?.roomNo || "",
        };
      });
      return next;
    });

    toast.success(`Applied template (${baseStartTime} – ${baseEndTime}) to all days!`);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseTitle.trim()) {
      setErrorMsg("Please enter the Course Title (e.g., Software Engineering)");
      return;
    }
    if (!courseCode.trim()) {
      setErrorMsg("Please enter the Course Code (e.g., CSE411)");
      return;
    }
    if (selectedDays.length === 0) {
      setErrorMsg("Please select at least one day of the week");
      return;
    }

    for (const day of selectedDays) {
      const cfg = dayConfigs[day] || {
        startTime: baseStartTime,
        endTime: baseEndTime,
        roomNo: baseRoomNo,
      };
      if (!cfg.startTime?.trim() || !cfg.endTime?.trim()) {
        setErrorMsg(`Please specify both Start and End Time for ${day}`);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (isEditing && slotToEdit?.id) {
        const singleDay = selectedDays[0];
        const cfg = dayConfigs[singleDay] || {
          startTime: baseStartTime,
          endTime: baseEndTime,
          roomNo: baseRoomNo,
        };

        const payload = {
          courseTitle: courseTitle.trim(),
          courseCode: courseCode.trim().toUpperCase(),
          dayOfWeek: singleDay,
          day: singleDay,
          startTime: cfg.startTime.trim(),
          endTime: cfg.endTime.trim(),
          roomNo: cfg.roomNo?.trim() || null,
          roomNumber: cfg.roomNo?.trim() || null,
          instructor: instructor.trim() || null,
          teacherName: instructor.trim() || null,
        };

        let updatedSlot: RoutineSlot = {
          ...slotToEdit,
          ...payload,
        };

        try {
          const res = await fetch(`/api/routine/${slotToEdit.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              updatedSlot = json.data;
            }
          }
        } catch (fetchErr) {
          console.warn("API update notice, persisting locally:", fetchErr);
        }

        saveStoredRoutineSlots(updatedSlot);
        toast.success(`Updated routine for "${payload.courseCode}" ✏️`);
        onSaved(updatedSlot);

        // Real-time synchronization & revalidation
        try {
          router.refresh();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("fasttask:routine-updated"));
          }
        } catch {}

        onClose();
      } else {
        const slotsPayload = selectedDays.map((day) => {
          const cfg = dayConfigs[day] || {
            startTime: baseStartTime,
            endTime: baseEndTime,
            roomNo: baseRoomNo,
          };
          return {
            dayOfWeek: day,
            day: day,
            startTime: cfg.startTime.trim(),
            endTime: cfg.endTime.trim(),
            roomNo: cfg.roomNo?.trim() || null,
            roomNumber: cfg.roomNo?.trim() || null,
            courseTitle: courseTitle.trim(),
            courseCode: courseCode.trim().toUpperCase(),
            instructor: instructor.trim() || null,
            teacherName: instructor.trim() || null,
          };
        });

        const payload = {
          courseTitle: courseTitle.trim(),
          courseCode: courseCode.trim().toUpperCase(),
          instructor: instructor.trim() || null,
          teacherName: instructor.trim() || null,
          slots: slotsPayload,
        };

        // Prepare local slots for instant fallback & optimistic real-time rendering
        const localSlots: RoutineSlot[] = slotsPayload.map((s, idx) => ({
          id: `slot_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          courseCode: payload.courseCode,
          courseTitle: payload.courseTitle,
          dayOfWeek: s.dayOfWeek,
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          roomNo: s.roomNo,
          roomNumber: s.roomNumber,
          instructor: payload.instructor,
          teacherName: payload.teacherName,
        }));

        let createdSlots: RoutineSlot[] = localSlots;

        try {
          const res = await fetch("/api/routine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const json = await res.json();
            if (json.success) {
              createdSlots = Array.isArray(json.slots)
                ? json.slots
                : Array.isArray(json.data)
                ? json.data
                : [json.data];
            }
          }
        } catch (fetchErr) {
          console.warn("API save notice, persisting locally:", fetchErr);
        }

        // Save persistently to localStorage
        saveStoredRoutineSlots(createdSlots);

        toast.success(
          createdSlots.length === 1
            ? `Added "${payload.courseCode}" to ${selectedDays[0]}'s schedule! 📅`
            : `Added "${payload.courseCode}" across ${selectedDays.length} days! 📅`
        );

        onSaved(createdSlots);

        // Real-time synchronization & revalidation
        try {
          router.refresh();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("fasttask:routine-updated"));
          }
        } catch {}

        onClose();
      }
    } catch (err: any) {
      console.error("Routine save error:", err);
      setErrorMsg(err.message || "Failed to save class routine");
      toast.error(err.message || "Could not save class routine");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#315BFF] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {isEditing ? "Edit Class Routine" : "Add Schedule / Class Routine"}
              </h2>
              <p className="text-xs text-slate-500">
                Setup your weekly timetable with standard 1.5h slots or custom timings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body with Subtle Custom Scrollbar */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 no-scrollbar sm:scrollbar-thin sm:scrollbar-thumb-slate-200 sm:scrollbar-track-transparent">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Preset Selector or Custom Mode */}
          {!isEditing && (
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span>{isCustomCourse ? "Custom Course Entry" : "Course Preset Template"}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isCustomCourse ? "(Manual mode)" : "(Optional shortcut)"}
                  </span>
                </label>

                {/* Quick Toggle Button between Custom Mode and Preset Selection */}
                {isCustomCourse ? (
                  <button
                    type="button"
                    onClick={handleSwitchToPresets}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 bg-white shadow-2xs active:scale-95"
                    title="Switch back to selecting a preset course"
                  >
                    <span>🎯 Select Preset</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnableCustomCourse}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-blue-600 hover:bg-blue-50 border border-blue-200 bg-white shadow-2xs active:scale-95"
                    title="Type custom course title and code manually"
                  >
                    <span>✏️ Type Custom Course</span>
                  </button>
                )}
              </div>

              <select
                value={selectedPreset}
                onChange={handleSelectPreset}
                className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 shadow-2xs cursor-pointer"
              >
                <option value="">-- Choose from preset courses or enter custom below --</option>
                <option value="custom" className="font-bold text-blue-600">
                  ✏️ Custom Course / Type Manually (Custom Title &amp; Code)
                </option>
                <optgroup label="Semester Presets">
                  {PRESET_COURSES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} • {c.title}
                    </option>
                  ))}
                </optgroup>
              </select>

              {isCustomCourse && (
                <div className="flex items-center justify-between text-[11px] text-blue-700 bg-blue-50/80 border border-blue-100/90 rounded-xl px-3 py-1.5 shadow-2xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span>✨</span> Custom course mode active. Type your title and code below.
                  </span>
                  <button
                    type="button"
                    onClick={() => courseTitleInputRef.current?.focus()}
                    className="underline font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    Focus Title
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 1. Unified 3-Column Input Row (Course Title, Code, Teacher) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
            {/* Course Title (col-span-5) */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between h-5">
                <span>Course Title *</span>
                <span className="text-[10px] text-blue-600 font-semibold">
                  {isCustomCourse ? "Custom (Editable)" : "Editable"}
                </span>
              </label>
              <input
                ref={courseTitleInputRef}
                type="text"
                value={courseTitle}
                onChange={(e) => {
                  setCourseTitle(e.target.value);
                  setIsCustomCourse(true);
                  if (selectedPreset !== "custom") setSelectedPreset("custom");
                }}
                placeholder="e.g. Software Engineering"
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs font-medium"
                required
              />
            </div>

            {/* Course Code (col-span-3) */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between h-5">
                <span>Course Code *</span>
                <span className="text-[10px] text-blue-600 font-semibold">
                  {isCustomCourse ? "Custom Code" : "Code"}
                </span>
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => {
                  setCourseCode(e.target.value);
                  setIsCustomCourse(true);
                  if (selectedPreset !== "custom") setSelectedPreset("custom");
                }}
                placeholder="e.g. CSE411"
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs font-bold"
                required
              />
            </div>

            {/* Faculty / Teacher (col-span-4) */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between h-5">
                <span>Faculty / Teacher</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Dr. Rahman"
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* 2. Day Selector Pills (Sun – Sat) in a Clean Equal Grid */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#315BFF]" />
                <span>Select Days of the Week *</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                {selectedDays.length === 0 ? (
                  <span className="text-rose-500 font-bold">Select at least 1 day</span>
                ) : (
                  <span className="text-[#315BFF] bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                    {selectedDays.length} {selectedDays.length === 1 ? "day selected" : "days selected"}
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = selectedDays.includes(d.full);
                return (
                  <button
                    key={d.full}
                    type="button"
                    onClick={() => handleToggleDay(d.full, d.short)}
                    className={`w-full h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? "bg-[#315BFF] text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-500/20"
                        : "bg-slate-50 border border-slate-200/90 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                    title={d.full}
                  >
                    <span>{d.short}</span>
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isEditing && (
              <p className="text-[10px] text-slate-400 italic">
                Editing single routine slot. Click any day to change its day.
              </p>
            )}
          </div>

          {/* 3. Base Time Template Tool (When multiple days selected) */}
          {!isEditing && selectedDays.length > 1 && (
            <div className="rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 p-3 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#315BFF]" />
                  <span className="text-xs font-bold text-slate-800">
                    Base Timetable Template
                  </span>
                  <span className="text-[10px] text-slate-500">
                    (Auto-fill all {selectedDays.length} days)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyBaseToAll}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#315BFF] hover:text-blue-700 hover:underline cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Apply template to all days</span>
                </button>
              </div>

              {/* Standard 90m Slot Quick Presets for Base Template */}
              <div className="flex items-center gap-2 overflow-x-auto px-1 py-1 no-scrollbar scrollbar-none">
                <span className="text-[11px] font-bold text-slate-500 shrink-0 whitespace-nowrap">Standard 1.5h Slots:</span>
                {STANDARD_SLOTS.map((slot) => {
                  const isCurrent = baseStartTime === slot.start && baseEndTime === slot.end;
                  return (
                    <button
                      key={slot.start}
                      type="button"
                      onClick={() => handleSelectBaseSlotPreset(slot.start, slot.end)}
                      className={`shrink-0 whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[#315BFF] text-white shadow-sm ring-1 ring-blue-600 font-bold"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-2xs"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600">Base Start Time</span>
                    <span className="text-[9px] text-[#315BFF] font-semibold">+90m Auto-End</span>
                  </div>
                  <input
                    type="text"
                    value={baseStartTime}
                    onChange={(e) => handleBaseStartTimeChange(e.target.value)}
                    placeholder="09:30 AM"
                    className="w-full h-8.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600">Base End Time</span>
                    <span className="text-[9px] text-slate-400 font-normal">Editable</span>
                  </div>
                  <input
                    type="text"
                    value={baseEndTime}
                    onChange={(e) => setBaseEndTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full h-8.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-600">Base Room (Optional)</span>
                  <input
                    type="text"
                    value={baseRoomNo}
                    onChange={(e) => setBaseRoomNo(e.target.value)}
                    placeholder="e.g. Room A/502"
                    className="w-full h-8.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Day-Specific Schedule Configuration Cards */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#315BFF]" />
                <span>
                  {selectedDays.length <= 1
                    ? "Day Schedule & Room Configuration"
                    : "Individual Day Schedules & Overrides"}
                </span>
              </label>
              <span className="text-[10px] text-slate-400">
                1h 30m standard slots auto-calculate on change
              </span>
            </div>

            <div className="space-y-2.5">
              {selectedDays.map((dayFull) => {
                const cfg = dayConfigs[dayFull] || {
                  dayOfWeek: dayFull,
                  short: DAYS_OF_WEEK.find((d) => d.full === dayFull)?.short || "Sun",
                  startTime: baseStartTime,
                  endTime: baseEndTime,
                  roomNo: baseRoomNo,
                };

                return (
                  <div
                    key={dayFull}
                    className="rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50/90 p-3 sm:p-3.5 space-y-2.5 transition-colors shadow-2xs"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="h-5.5 px-2 rounded-md bg-[#315BFF] text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center shadow-2xs">
                          {cfg.short}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {dayFull}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          • {cfg.startTime} – {cfg.endTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isEditing && selectedDays.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleCopyDayToAll(dayFull)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#315BFF] hover:bg-white px-2 py-0.5 rounded-md border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                            title={`Copy ${dayFull}'s time and room to all selected days`}
                          >
                            <Copy className="h-3 w-3" />
                            <span className="hidden sm:inline">Copy to all</span>
                          </button>
                        )}

                        {!isEditing && selectedDays.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleToggleDay(dayFull, cfg.short)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Remove ${dayFull}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Standard 90m Slot Quick Presets for This Day */}
                    <div className="flex items-center gap-2 overflow-x-auto px-1 py-1 no-scrollbar scrollbar-none">
                      <span className="text-[11px] font-bold text-slate-400 shrink-0 whitespace-nowrap">90m Presets:</span>
                      {STANDARD_SLOTS.map((slot) => {
                        const isCurrent = cfg.startTime === slot.start && cfg.endTime === slot.end;
                        return (
                          <button
                            key={slot.start}
                            type="button"
                            onClick={() => handleSelectDaySlotPreset(dayFull, slot.start, slot.end)}
                            className={`shrink-0 whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-[#315BFF] text-white shadow-sm ring-1 ring-blue-600 font-bold"
                                : "bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-2xs"
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Inputs Row for This Specific Day */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Start Time input */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between h-4">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>Start Time *</span>
                          </label>
                          <span className="text-[9px] text-[#315BFF] font-semibold">+1.5h Auto</span>
                        </div>
                        <input
                          type="text"
                          value={cfg.startTime}
                          onChange={(e) => handleDayStartTimeChange(dayFull, e.target.value)}
                          placeholder="09:30 AM"
                          className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-900 outline-none transition-all shadow-2xs"
                          required
                        />
                      </div>

                      {/* End Time input (Manually overrideable for labs, etc.) */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between h-4">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>End Time *</span>
                          </label>
                          <span className="text-[9px] text-slate-400 font-normal">Editable</span>
                        </div>
                        <input
                          type="text"
                          value={cfg.endTime}
                          onChange={(e) => handleDayEndTimeChange(dayFull, e.target.value)}
                          placeholder="11:00 AM"
                          className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-slate-900 outline-none transition-all shadow-2xs"
                          required
                        />
                      </div>

                      {/* Room No input */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 h-4">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>Room No</span>
                        </label>
                        <input
                          type="text"
                          value={cfg.roomNo}
                          onChange={(e) => handleDayRoomNoChange(dayFull, e.target.value)}
                          placeholder="e.g. Room 502"
                          className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-medium text-slate-900 outline-none transition-all shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        {/* 5. Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            {selectedDays.length === 1 ? (
              <span>Scheduling for <strong>{selectedDays[0]}</strong></span>
            ) : (
              <span>Scheduling across <strong>{selectedDays.length} days</strong></span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span>
                {isEditing
                  ? "Save Changes"
                  : `Add to Schedule${selectedDays.length > 1 ? ` (${selectedDays.length} Days)` : ""}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
