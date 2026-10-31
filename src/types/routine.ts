/**
 * Routine & Academic Schedule types for FastTask
 */

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

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

export interface RawRoutineSlotInput {
  id?: string;
  userId?: string;
  dayOfWeek?: string;
  day?: string;
  courseTitle?: string;
  title?: string;
  courseCode?: string;
  code?: string;
  startTime?: string;
  endTime?: string;
  roomNumber?: string | null;
  roomNo?: string | null;
  room?: string | null;
  teacherName?: string | null;
  instructor?: string | null;
  faculty?: string | null;
  semester?: string | null;
  batch?: string | null;
}

export interface SemesterConfig {
  semesterName: string;
  startDate: string;
  endDate: string;
  totalWeeks: number;
}
