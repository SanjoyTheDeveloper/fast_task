"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sidebar,
  TopHeader,
} from "@/components/dashboard";
import {
  Home,
  LogOut,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  User,
  Hash,
  Building2,
  Users,
  Palette,
  Check,
  Save,
  RotateCcw,
  Mail,
  Loader2,
  ExternalLink,
} from "@/components/ui/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";

import {
  AVATAR_PALETTES,
  DEPARTMENTS,
  DEFAULT_STUDENT_PROFILE,
  StudentProfile,
  getStoredProfile,
  saveStoredProfile,
} from "@/lib/studentProfile";

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSavedRecently, setIsSavedRecently] = React.useState(false);

  // Profile Form State - Initialized from stored profile if available
  const [name, setName] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getStoredProfile().name;
    }
    return DEFAULT_STUDENT_PROFILE.name;
  });
  const [studentId, setStudentId] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getStoredProfile().studentId;
    }
    return DEFAULT_STUDENT_PROFILE.studentId;
  });
  const [department, setDepartment] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getStoredProfile().department;
    }
    return DEFAULT_STUDENT_PROFILE.department;
  });
  const [batch, setBatch] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getStoredProfile().batch;
    }
    return DEFAULT_STUDENT_PROFILE.batch;
  });
  const [avatarColor, setAvatarColor] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getStoredProfile().avatarColor;
    }
    return DEFAULT_STUDENT_PROFILE.avatarColor;
  });
  const [linkedin, setLinkedin] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getStoredProfile().linkedin || "";
    }
    return DEFAULT_STUDENT_PROFILE.linkedin || "";
  });

  // Track initial state for dirty check / revert
  const [initialProfile, setInitialProfile] = React.useState<StudentProfile>(() => {
    if (typeof window !== "undefined") {
      return getStoredProfile();
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  // Load authenticated user and saved student metadata
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);

          const stored = getStoredProfile();
          const resolvedName =
            stored.name || data.user?.name || (data.user?.email ? data.user.email.split("@")[0] : "Student");
          const resolvedStudentId = stored.studentId || "2026-CSE-082";
          const resolvedDepartment = stored.department || "Department of Computer Science & Engineering";
          const resolvedBatch = stored.batch || "Batch 82A";
          const resolvedAvatar = stored.avatarColor || "purple";
          const resolvedLinkedin = stored.linkedin || "";

          setName(resolvedName);
          setStudentId(resolvedStudentId);
          setDepartment(resolvedDepartment);
          setBatch(resolvedBatch);
          setAvatarColor(resolvedAvatar);
          setLinkedin(resolvedLinkedin);

          setInitialProfile({
            name: resolvedName,
            studentId: resolvedStudentId,
            department: resolvedDepartment,
            batch: resolvedBatch,
            avatarColor: resolvedAvatar,
            linkedin: resolvedLinkedin,
          });
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    }
    loadUser();
  }, [router]);

  // Handle saving profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    const payload: StudentProfile = {
      name: name.trim(),
      studentId: studentId.trim() || "2026-CSE-082",
      department,
      batch: batch.trim() || "Batch 82A",
      avatarColor,
      linkedin: linkedin.trim(),
    };

    try {
      // 1. Immediately persist to localStorage and broadcast fasttask:profile-updated event
      saveStoredProfile(payload);

      // 2. Call profile update API to persist to DB
      await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 3. Update local component state
      setCurrentUser((prev: any) => ({
        ...prev,
        name: payload.name,
      }));

      setInitialProfile(payload);
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 2500);

      toast.success("Student profile updated successfully! 🎓");
    } catch (err) {
      console.error("Profile save error:", err);
      saveStoredProfile(payload);
      setInitialProfile(payload);
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 2500);
      toast.success("Profile preferences saved locally!");
    } finally {
      setIsSaving(false);
    }
  };

  // Revert unsaved edits
  const handleResetProfile = () => {
    setName(initialProfile.name);
    setStudentId(initialProfile.studentId);
    setDepartment(initialProfile.department);
    setBatch(initialProfile.batch);
    setAvatarColor(initialProfile.avatarColor);
    setLinkedin(initialProfile.linkedin || "");
    toast.info("Changes reverted.");
  };

  // Auth.js logout handler with redirect to landing page
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const activePalette = AVATAR_PALETTES.find((p) => p.id === avatarColor) || AVATAR_PALETTES[0];
  const userInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : "S";
  const userEmail = currentUser?.email || "";

  const isDirty =
    name !== initialProfile.name ||
    studentId !== initialProfile.studentId ||
    department !== initialProfile.department ||
    batch !== initialProfile.batch ||
    avatarColor !== initialProfile.avatarColor ||
    linkedin !== (initialProfile.linkedin || "");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Wrapper with Left Margin for Desktop Sidebar */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={currentUser ? { ...currentUser, name } : null}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Settings Page Content */}
        <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-black text-[#172033] tracking-tight">
              Settings &amp; Account
            </h1>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs hover:shadow-xs transition-all border border-slate-200 cursor-pointer"
            >
              <Home className="h-3.5 w-3.5 text-[#315BFF]" />
              <span>Home Page</span>
            </Link>
          </div>

          {/* Top section - Profile Preview Card (Deep Navy) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A1020] border border-slate-800 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden transition-all">
            {/* Decorative ambient subtle background glows */}
            <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-blue-500/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 right-1/4 h-52 w-52 rounded-full bg-indigo-500/15 blur-3xl" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Large circular avatar with reactive gradient */}
                <div
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-tr ${activePalette.gradient} text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 ring-4 ring-white/10 shadow-lg shadow-purple-500/20 transition-all`}
                >
                  <span>{userInitial}</span>
                </div>

                {/* User info */}
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Signed in as
                  </span>

                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                    {name || "Student"}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                    {userEmail}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Hash className="h-3 w-3 text-slate-400" />
                      {studentId}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[200px] sm:max-w-[280px]">
                      {department.replace("Department of ", "")}
                    </span>
                    {linkedin && (
                      <>
                        <span>•</span>
                        <a
                          href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#60A5FA] hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <svg className="h-3 w-3 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Plan Badge */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold shadow-2xs backdrop-blur-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                  <span>PRO Plan</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 text-[11px] font-semibold border border-slate-700/80 backdrop-blur-xs">
                  {batch}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Profile Editing Form Section */}
          <div className="rounded-3xl bg-white border border-[#E5EAF2] p-6 sm:p-7 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#315BFF] flex items-center justify-center shadow-2xs">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                    Edit Student Profile
                  </h3>
                </div>
              </div>

              {isDirty && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 font-bold">
                  Unsaved Changes
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar Palette Chooser */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-slate-400" />
                  <span>Avatar Color Theme</span>
                </label>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {AVATAR_PALETTES.map((palette) => {
                    const isSelected = avatarColor === palette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setAvatarColor(palette.id)}
                        className={`group relative h-9 w-9 rounded-full bg-gradient-to-tr ${palette.gradient} flex items-center justify-center text-white transition-all cursor-pointer shadow-xs ${
                          isSelected
                            ? "ring-3 ring-offset-2 ring-[#315BFF] scale-110 shadow-md"
                            : "opacity-80 hover:opacity-100 hover:scale-105"
                        }`}
                        title={palette.name}
                      >
                        {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Two-Column Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor="student-name" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Full Name</span>
                  </label>
                  <Input
                    id="student-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-10 text-xs rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-[#315BFF]"
                    required
                  />
                </div>

                {/* Student ID Input */}
                <div className="space-y-1.5">
                  <label htmlFor="student-id" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                    <span>Student ID</span>
                  </label>
                  <Input
                    id="student-id"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 2026-CSE-082"
                    className="h-10 text-xs rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-[#315BFF]"
                  />
                </div>

                {/* Department Selection */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Academic Department</span>
                  </label>
                  <Select value={department} onValueChange={(val) => setDepartment(val)}>
                    <SelectTrigger className="h-10 text-xs rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Batch & Section Input */}
                <div className="space-y-1.5">
                  <label htmlFor="batch-name" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>Batch &amp; Section</span>
                  </label>
                  <Input
                    id="batch-name"
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="e.g. Batch 82A"
                    className="h-10 text-xs rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-[#315BFF]"
                  />
                </div>

                {/* Account Email (Read-Only) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>Primary Account Email</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={userEmail}
                      disabled
                      className="h-10 text-xs rounded-xl border-slate-200 bg-slate-50/80 text-slate-500 cursor-not-allowed pr-20"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>

                {/* LinkedIn Profile Input */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="linkedin-url" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 text-[#0A66C2] fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                      <span>LinkedIn Profile</span>
                    </label>
                    {linkedin.trim() && (
                      <a
                        href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#0A66C2] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Visit Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center pointer-events-none text-[#0A66C2]">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </div>
                    <Input
                      id="linkedin-url"
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="h-10 text-xs rounded-xl border-slate-200 pl-9.5 focus-visible:ring-2 focus-visible:ring-[#315BFF]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Add your LinkedIn profile link to connect with batchmates and showcase your professional presence.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                {isDirty && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetProfile}
                    disabled={isSaving}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    <span>Reset</span>
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={isSaving}
                  className={`${
                    isSavedRecently
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                      : "bg-[#315BFF] hover:bg-blue-600 shadow-blue-500/25"
                  } text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : isSavedRecently ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Profile Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Navigation Menu section below */}
          <div className="rounded-2xl bg-white border border-[#E5EAF2] p-2 shadow-2xs divide-y divide-slate-100">
            {/* Travel to Home page button (top position above sign out) */}
            <Link
              href="/"
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/80 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#315BFF] border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <Home className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#315BFF] transition-colors">
                    Home Page
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Visit home page without signing out
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#315BFF] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Log out option */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50/60 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <LogOut className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-bold text-rose-600 group-hover:text-rose-700 transition-colors">
                  {isLoggingOut ? "Signing out..." : "Log out"}
                </h3>
              </div>
              <ChevronRight className="h-4 w-4 text-rose-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>


        </main>
      </div>
    </div>
  );
}
