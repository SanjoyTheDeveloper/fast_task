"use client";

import * as React from "react";

import type { StudentProfile, AvatarPalette } from "@/types";
export type { StudentProfile, AvatarPalette };

export const AVATAR_PALETTES: AvatarPalette[] = [
  { id: "purple", name: "Violet", gradient: "bg-[#7C3AED]", ring: "ring-purple-400" },
  { id: "blue", name: "Royal Blue", gradient: "bg-[#315BFF]", ring: "ring-blue-400" },
  { id: "emerald", name: "Emerald", gradient: "bg-[#10B981]", ring: "ring-emerald-400" },
  { id: "amber", name: "Amber", gradient: "bg-[#F59E0B]", ring: "ring-amber-400" },
  { id: "coral", name: "Coral Orange", gradient: "bg-[#F97316]", ring: "ring-orange-400" },
  { id: "teal", name: "Teal", gradient: "bg-[#0D9488]", ring: "ring-teal-400" },
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
  linkedin: "",
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
  // Consistent initial state on both SSR and Client to prevent hydration mismatch
  const [profile, setProfile] = React.useState<StudentProfile>(() => ({
    ...DEFAULT_STUDENT_PROFILE,
    ...(initialFallback?.name ? { name: initialFallback.name } : {}),
  }));

  React.useEffect(() => {
    // 1. Sync client localStorage on mount safely after hydration
    try {
      const stored = getStoredProfile();
      if (stored) {
        setProfile(stored);
      }
    } catch (err) {
      console.error("Failed to sync profile:", err);
    }

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
