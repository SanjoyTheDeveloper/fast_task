export const COURSES = [
  "CSE231", // Operating Systems
  "EEPP",   // Ethics & Professional Practice
  "MAT112", // Linear Algebra & Calculus
  "PHY101", // Engineering Physics
  "General",
] as const;

export type CourseCode = (typeof COURSES)[number] | string;

export const CATEGORIES = [
  "Assignment",
  "Exam",
  "Lab Report",
  "Personal Routine",
] as const;

export type TaskCategory = (typeof CATEGORIES)[number] | string;

export interface CategoryStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Assignment: {
    label: "Assignment",
    bg: "bg-blue-50 text-blue-700 border-blue-200/80",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  Exam: {
    label: "Exam",
    bg: "bg-rose-50 text-rose-700 border-rose-200/80",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  "Lab Report": {
    label: "Lab Report",
    bg: "bg-purple-50 text-purple-700 border-purple-200/80",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  "Personal Routine": {
    label: "Personal Routine",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
};

export const COURSE_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  CSE231: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200/80" },
  EEPP: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200/80" },
  MAT112: { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200/80" },
  PHY101: { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200/80" },
  General: { bg: "bg-zinc-100", text: "text-zinc-700", border: "border-zinc-200/80" },
};

/**
 * Packs course & category metadata into task description
 */
export function serializeTaskDescription(
  rawText: string | null | undefined,
  course?: string | null,
  category?: string | null
): string | null {
  const clean = rawText?.trim() || "";
  const meta: Record<string, string> = {};
  if (course && course.trim()) meta.course = course.trim();
  if (category && category.trim()) meta.category = category.trim();

  if (Object.keys(meta).length === 0) {
    return clean || null;
  }

  const metaTag = `<!--meta:${JSON.stringify(meta)}-->`;
  return clean ? `${metaTag}\n${clean}` : metaTag;
}

/**
 * Extracts course, category, and human-readable description
 */
export function parseTaskDescription(raw: string | null | undefined): {
  description: string | null;
  course: string | null;
  category: string | null;
} {
  if (!raw || !raw.trim()) {
    return { description: null, course: null, category: null };
  }

  const text = raw.trim();
  const metaMatch = text.match(/<!--meta:(\{.*?\})-->/);

  if (metaMatch) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      const cleanDesc = text.replace(/<!--meta:(\{.*?\})-->\n?/, "").trim();
      return {
        description: cleanDesc || null,
        course: parsed.course || null,
        category: parsed.category || null,
      };
    } catch {
      // Fallback
    }
  }

  // Also support legacy or title bracket tags: [CSE231] [Assignment]
  return { description: text, course: null, category: null };
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type SessionType = "Lecture" | "Lab" | "Tutorial" | "Seminar";

export const SESSION_TYPES: SessionType[] = [
  "Lecture",
  "Lab",
  "Tutorial",
  "Seminar",
];

export type BadgeColor = "violet" | "amber" | "emerald" | "sky";

export const BADGE_COLORS: Record<
  BadgeColor,
  { label: string; bg: string; text: string; border: string; glow: string }
> = {
  violet: {
    label: "Electric Violet",
    bg: "bg-violet-500/20",
    text: "text-violet-300",
    border: "border-violet-500/30",
    glow: "shadow-[0_0_10px_rgba(139,92,246,0.2)]",
  },
  amber: {
    label: "Warm Amber",
    bg: "bg-amber-500/20",
    text: "text-amber-300",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_10px_rgba(245,158,11,0.2)]",
  },
  emerald: {
    label: "Neon Emerald",
    bg: "bg-emerald-500/20",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_10px_rgba(16,185,129,0.2)]",
  },
  sky: {
    label: "Cyan Sky",
    bg: "bg-cyan-500/20",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_10px_rgba(6,182,212,0.2)]",
  },
};

export interface CourseSession {
  id: string;
  course: string;
  title: string;
  type: SessionType;
  startTime: string; // e.g. "09:30"
  endTime: string;   // e.g. "10:50"
  days: DayOfWeek[];
  room: string;
  color?: BadgeColor;
}

export function formatTime24to12(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  const paddedH = String(h).padStart(2, "0");
  return `${paddedH}:${m} ${ampm}`;
}

export function formatSessionTime(startTime: string, endTime: string): string {
  return `${formatTime24to12(startTime)} - ${formatTime24to12(endTime)}`;
}

export const DEFAULT_COURSE_SESSIONS: CourseSession[] = [
  {
    id: "session-1",
    course: "CSE231",
    title: "Operating Systems • Virtual Memory & Page Tables",
    type: "Lecture",
    startTime: "09:30",
    endTime: "10:50",
    days: ["Monday", "Wednesday", "Saturday"],
    room: "Academic Bldg 3, Room 402",
    color: "violet",
  },
  {
    id: "session-2",
    course: "EEPP",
    title: "Ethics & Professional Practice • Case Study 4",
    type: "Lecture",
    startTime: "11:15",
    endTime: "12:35",
    days: ["Monday", "Wednesday", "Saturday", "Sunday"],
    room: "Auditorium B",
    color: "amber",
  },
  {
    id: "session-3",
    course: "CSE231L",
    title: "Systems Lab 3 • Thread Concurrency & Locks",
    type: "Lab",
    startTime: "14:00",
    endTime: "16:00",
    days: ["Tuesday", "Thursday", "Saturday"],
    room: "Computer Lab 4B",
    color: "emerald",
  },
  {
    id: "session-4",
    course: "MAT112",
    title: "Linear Algebra • Eigenvalues & Matrix Diagonalization",
    type: "Lecture",
    startTime: "08:30",
    endTime: "09:50",
    days: ["Tuesday", "Thursday", "Sunday"],
    room: "Lecture Hall 101",
    color: "sky",
  },
  {
    id: "session-5",
    course: "PHY101",
    title: "Engineering Physics • Wave Optics & Diffraction",
    type: "Lecture",
    startTime: "13:00",
    endTime: "14:20",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Science Complex 204",
    color: "violet",
  },
];

// Backwards compatibility alias
export interface TodayLecture {
  id: string;
  time: string;
  course: string;
  title: string;
  room: string;
  type: "Lecture" | "Lab" | "Tutorial" | "Seminar";
}

export const TODAY_SCHEDULE: TodayLecture[] = DEFAULT_COURSE_SESSIONS.slice(0, 3).map((s) => ({
  id: s.id,
  time: formatSessionTime(s.startTime, s.endTime),
  course: s.course,
  title: s.title,
  room: s.room,
  type: s.type,
}));

export interface SemesterConfig {
  name: string; // e.g. "Fall Semester 2026"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export const DEFAULT_SEMESTER_CONFIG: SemesterConfig = {
  name: "Fall Semester 2026",
  startDate: "2026-08-24",
  endDate: "2026-12-18",
};

export interface SemesterStatusResult {
  status: "not_started" | "active" | "ended";
  currentWeek: number;
  totalWeeks: number;
  message: string;
}

export function getSemesterStatus(
  config: SemesterConfig,
  currentDate: Date = new Date()
): SemesterStatusResult {
  if (!config.startDate || !config.endDate) {
    return {
      status: "active",
      currentWeek: 1,
      totalWeeks: 16,
      message: config.name || "Academic Semester",
    };
  }

  const start = new Date(config.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(config.endDate);
  end.setHours(23, 59, 59, 999);

  const now = new Date(currentDate);
  const nowMs = now.getTime();

  const totalDurationMs = end.getTime() - start.getTime();
  const totalWeeks = Math.max(1, Math.ceil(totalDurationMs / (7 * 86400000)));

  if (nowMs < start.getTime()) {
    const startFormatted = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return {
      status: "not_started",
      currentWeek: 0,
      totalWeeks,
      message: `Semester has not started yet (Starts ${startFormatted})`,
    };
  }

  if (nowMs > end.getTime()) {
    const endFormatted = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return {
      status: "ended",
      currentWeek: totalWeeks,
      totalWeeks,
      message: `Semester ended on ${endFormatted}`,
    };
  }

  // Active semester
  const elapsedMs = nowMs - start.getTime();
  const currentWeek = Math.min(
    totalWeeks,
    Math.max(1, Math.floor(elapsedMs / (7 * 86400000)) + 1)
  );

  return {
    status: "active",
    currentWeek,
    totalWeeks,
    message: `Week ${currentWeek} of ${totalWeeks} • ${config.name}`,
  };
}

export function sortSessionsChronologically(
  sessions: CourseSession[]
): CourseSession[] {
  return [...sessions].sort((a, b) => {
    const aTime = a.startTime || "00:00";
    const bTime = b.startTime || "00:00";
    return aTime.localeCompare(bTime);
  });
}
