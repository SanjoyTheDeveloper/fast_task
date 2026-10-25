/**
 * FastTask Routine Local Storage & Offline Persistence Layer
 *
 * Ensures all routine slots added, edited, or deleted are persistently
 * preserved on the client across page refreshes, PC restarts, and network downtime.
 */

import { RoutineSlot } from "@/components/routine/AddRoutineModal";

const STORAGE_KEY = "fasttask_routine_slots_v2";

/**
 * Default sample schedule used when no user-created routine slots exist
 */
export const DEFAULT_SAMPLE_SLOTS: RoutineSlot[] = [
  {
    id: "default-ap-sun",
    courseCode: "0613CSE323",
    courseTitle: "Advanced Programming (AP)",
    dayOfWeek: "Sunday",
    startTime: "09:30 AM",
    endTime: "10:50 AM",
    roomNo: "Room 402",
    instructor: "Dr. A. Rahman",
  },
  {
    id: "default-cn-sun",
    courseCode: "0612CSE315",
    courseTitle: "Computer Networks (CN)",
    dayOfWeek: "Sunday",
    startTime: "11:00 AM",
    endTime: "12:20 PM",
    roomNo: "Lab 3",
    instructor: "Prof. K. Hasan",
  },
  {
    id: "default-macs-mon",
    courseCode: "0541MAT337",
    courseTitle: "Maths for CS (MACS)",
    dayOfWeek: "Monday",
    startTime: "10:00 AM",
    endTime: "11:20 AM",
    roomNo: "Room 301",
    instructor: "Dr. M. Islam",
  },
  {
    id: "default-twrm-tue",
    courseCode: "0031CSE320",
    courseTitle: "Tech Writing & Research (TWRM)",
    dayOfWeek: "Tuesday",
    startTime: "01:00 PM",
    endTime: "02:20 PM",
    roomNo: "Room 504",
    instructor: "Ms. S. Akter",
  },
  {
    id: "default-cn-wed",
    courseCode: "0612CSE315",
    courseTitle: "Computer Networks (CN)",
    dayOfWeek: "Wednesday",
    startTime: "09:30 AM",
    endTime: "10:50 AM",
    roomNo: "Lab 3",
    instructor: "Prof. K. Hasan",
  },
  {
    id: "default-ap-thu",
    courseCode: "0613CSE323",
    courseTitle: "Advanced Programming (AP)",
    dayOfWeek: "Thursday",
    startTime: "11:00 AM",
    endTime: "12:20 PM",
    roomNo: "Room 402",
    instructor: "Dr. A. Rahman",
  },
];

/**
 * Retrieve all routine slots from localStorage
 */
export function getStoredRoutineSlots(): RoutineSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to load routine slots from localStorage:", e);
    return [];
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
