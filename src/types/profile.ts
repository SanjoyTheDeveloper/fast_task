/**
 * Student Profile types for FastTask
 */

export interface StudentProfile {
  name: string;
  studentId: string;
  department: string;
  batch: string;
  avatarColor: string;
  linkedin?: string;
}

export interface AvatarPalette {
  id: string;
  name: string;
  gradient: string;
  ring: string;
}
