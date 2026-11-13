/**
 * FastTask Routine Local Storage & Offline Persistence Layer
 *
 * Ensures all routine slots added, edited, or deleted are persistently
 * preserved on the client across page refreshes, PC restarts, and network downtime.
 */

import type { RoutineSlot } from "@/types";

const STORAGE_KEY = "fasttask_routine_slots_v2";

/**
 * Default sample schedule used when no user-created routine slots exist
 */
export const DEFAULT_SAMPLE_SLOTS: RoutineSlot[] = [
  {
    id: "default-ai-sun",
    courseCode: "0611CSE321",
    courseTitle: "Artificial Intelligence & Expert Systems",
    dayOfWeek: "Sunday",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    roomNo: "Lab 402",
    instructor: "Dr. A. Rahman",
  },
  {
    id: "default-ap-sun",
    courseCode: "0613CSE333",
    courseTitle: "Advanced Programming & Architecture",
    dayOfWeek: "Sunday",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    roomNo: "Room 305",
    instructor: "Prof. K. Hasan",
  },
  {
    id: "default-mat-mon",
    courseCode: "0541MAT337",
    courseTitle: "Discrete Mathematics & Graph Theory",
    dayOfWeek: "Monday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    roomNo: "Room 201",
    instructor: "Dr. S. Sultana",
  },
  {
    id: "default-cn-mon",
    courseCode: "0612CSE315",
    courseTitle: "Computer Networks & Protocols",
    dayOfWeek: "Monday",
    startTime: "01:00 PM",
    endTime: "02:30 PM",
    roomNo: "Lab 501",
    instructor: "Engr. M. Islam",
  },
  {
    id: "default-twrm-tue",
    courseCode: "0031CSE320",
    courseTitle: "Tech Writing & Research (TWRM)",
    dayOfWeek: "Tuesday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    roomNo: "Room 504",
    instructor: "Ms. S. Akter",
  },
  {
    id: "default-ailab-tue",
    courseCode: "0611CSE321",
    courseTitle: "Artificial Intelligence Lab",
    dayOfWeek: "Tuesday",
    startTime: "01:00 PM",
    endTime: "03:00 PM",
    roomNo: "Lab 402",
    instructor: "Dr. A. Rahman",
  },
  {
    id: "default-cn-wed",
    courseCode: "0612CSE315",
    courseTitle: "Computer Networks & Protocols",
    dayOfWeek: "Wednesday",
    startTime: "09:30 AM",
    endTime: "11:00 AM",
    roomNo: "Lab 501",
    instructor: "Engr. M. Islam",
  },
  {
    id: "default-aplab-wed",
    courseCode: "0613CSE333",
    courseTitle: "Advanced Programming Lab",
    dayOfWeek: "Wednesday",
    startTime: "11:30 AM",
    endTime: "01:30 PM",
    roomNo: "Lab 3",
    instructor: "Prof. K. Hasan",
  },
  {
    id: "default-mattut-thu",
    courseCode: "0541MAT337",
    courseTitle: "Discrete Mathematics Tutorial",
    dayOfWeek: "Thursday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    roomNo: "Room 301",
    instructor: "Dr. S. Sultana",
  },
  {
    id: "default-twrmsem-thu",
    courseCode: "0031CSE320",
    courseTitle: "Tech Writing Seminar",
    dayOfWeek: "Thursday",
    startTime: "12:00 PM",
    endTime: "01:30 PM",
    roomNo: "Room 504",
    instructor: "Ms. S. Akter",
  },
];

/**
 * Retrieve all routine slots from localStorage
 */
export function getStoredRoutineSlots(): RoutineSlot[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_SLOTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_SLOTS));
      return DEFAULT_SAMPLE_SLOTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_SLOTS));
    return DEFAULT_SAMPLE_SLOTS;
  } catch (e) {
    console.warn("Failed to load routine slots from localStorage:", e);
    return DEFAULT_SAMPLE_SLOTS;
  }
}

/**
 * Save new or updated routine slot(s) to localStorage
 */
export function saveStoredRoutineSlots(slots: RoutineSlot | RoutineSlot[]): RoutineSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getStoredRoutineSlots();
    const toSaveList = Array.isArray(slots) ? slots : [slots];
    const map = new Map<string, RoutineSlot>();

    // Index existing
    current.forEach((s) => {
      if (s.id) map.set(s.id, s);
    });

    // Merge new / updated
    toSaveList.forEach((s) => {
      if (s.id) map.set(s.id, s);
    });

    const result = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return result;
  } catch (e) {
    console.warn("Failed to save routine slots to localStorage:", e);
    return [];
  }
}

/**
 * Remove a routine slot by ID from localStorage
 */
export function removeStoredRoutineSlot(slotId: string): RoutineSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getStoredRoutineSlots();
    const updated = current.filter((s) => s.id !== slotId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to delete routine slot from localStorage:", e);
    return [];
  }
}
