"use client";

import * as React from "react";

export interface StudentProfile {
  name: string;
  studentId: string;
  department: string;
  batch: string;
  avatarColor: string;
}

export interface AvatarPalette {
  id: string;
  name: string;
  gradient: string;
  ring: string;
}

export const AVATAR_PALETTES: AvatarPalette[] = [
  { id: "purple", name: "Purple Indigo", gradient: "from-purple-600 via-indigo-600 to-purple-500", ring: "ring-purple-400" },
  { id: "blue", name: "Ocean Blue", gradient: "from-blue-600 via-sky-600 to-cyan-500", ring: "ring-blue-400" },
  { id: "emerald", name: "Emerald Mint", gradient: "from-emerald-600 via-teal-600 to-green-500", ring: "ring-emerald-400" },
  { id: "amber", name: "Sunset Amber", gradient: "from-amber-500 via-orange-600 to-rose-500", ring: "ring-amber-400" },
  { id: "rose", name: "Rose Crimson", gradient: "from-rose-600 via-pink-600 to-purple-500", ring: "ring-rose-400" },
  { id: "slate", name: "Midnight Slate", gradient: "from-slate-700 via-zinc-800 to-slate-900", ring: "ring-slate-400" },
];

export const DEPARTMENTS = [
  "Department of Computer Science & Engineering",
  "Department of Software Engineering",
  "Department of Electrical & Electronic Engineering",
  "Department of Information Technology",
  "Department of Mathematics & Natural Sciences",
  "Department of Business Administration",
];

export const PROFILE_STORAGE_KEY = "fasttask_student_profile";
export const PROFILE_UPDATE_EVENT = "fasttask:profile-updated";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: "sanjoy chandro Bhowmick",
  studentId: "2026-CSE-082",
  department: "Department of Computer Science & Engineering",
  batch: "Batch 82A",
  avatarColor: "purple",
};

export function getStoredProfile(): StudentProfile {
  if (typeof window === "undefined") {
    return DEFAULT_STUDENT_PROFILE;
  }
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error("Failed to read student profile:", err);
  }
  return DEFAULT_STUDENT_PROFILE;
}

export function saveStoredProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATE_EVENT, { detail: profile }));
  } catch (err) {
    console.error("Failed to save student profile:", err);
  }
}

export function useStudentProfile(
  initialFallback?: Partial<StudentProfile> | { name?: string | null }
) {
  const [profile, setProfile] = React.useState<StudentProfile>(() => {
    if (typeof window !== "undefined") {
      const stored = getStoredProfile();
      if (initialFallback?.name && (!stored.name || stored.name === DEFAULT_STUDENT_PROFILE.name)) {
        return { ...stored, name: initialFallback.name };
      }
      return stored;
    }
    return {
      ...DEFAULT_STUDENT_PROFILE,
      ...(initialFallback?.name ? { name: initialFallback.name } : {}),
    };
  });

  React.useEffect(() => {
    // Initial sync
    setProfile(getStoredProfile());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<StudentProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        setProfile(getStoredProfile());
      }
    };

    window.addEventListener(PROFILE_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(PROFILE_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateProfile = React.useCallback((newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
  }, []);

  const palette = React.useMemo(() => {
    return AVATAR_PALETTES.find((p) => p.id === profile.avatarColor) || AVATAR_PALETTES[0];
  }, [profile.avatarColor]);

  return {
    profile,
    updateProfile,
    palette,
  };
}
