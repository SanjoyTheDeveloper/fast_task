"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  TopHeader,
} from "@/components/dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  GraduationCap,
  X,
  FileText,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { COURSES } from "@/lib/academic";

export interface Note {
  id: string;
  title: string;
  content: string;
  course?: string | null;
  createdAt: string;
  updatedAt: string;
}

const COURSE_LABELS: Record<string, string> = {
  "0611CSE321": "0611CSE321 • AIES",
  "0613CSE333": "0613CSE333 • AP",
  "0541MAT337": "0541MAT337 • MACS",
  "0612CSE315": "0612CSE315 • CN",
  "0031CSE320": "0031CSE320 • TWRM",
  "0612CSE316": "0612CSE316 • CN Sess.",
  "0611CSE322": "0611CSE322 • AIES Sess.",
  "0613CSE334": "0613CSE334 • AP Sess.",
  General: "General Routine",
};

const COURSE_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  "0611CSE321": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/80" },
  "0613CSE333": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200/80" },
  "0541MAT337": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/80" },
  "0612CSE315": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/80" },
  "0031CSE320": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200/80" },
  "0612CSE316": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200/80" },
  "0611CSE322": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200/80" },
  "0613CSE334": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200/80" },
  General: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function NotesPage() {
  const router = useRouter();

  // Core State
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Layout State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Dialog States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = React.useState<Note | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formContent, setFormContent] = React.useState("");
  const [formCourse, setFormCourse] = React.useState("");
  const [formError, setFormError] = React.useState("");

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = React.useState("ALL");

  // 1. Load User
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("User check failed:", err);
      }
    }
    loadUser();
  }, [router]);

  // Storage key
  const storageKey = React.useMemo(() => {
    return currentUser?.id ? `fasttask_notes_${currentUser.id}` : "fasttask_notes_guest";
  }, [currentUser?.id]);

  // 2. Load Notes from Storage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      } else {
        setNotes([]);
      }
    } catch (e) {
      console.error("Failed to load notes:", e);
      setNotes([]);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save notes helper
  const persistNotes = (updated: Note[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setFormTitle("");
    setFormContent("");
    setFormCourse("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCourse(note.course || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Submit Note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError("Note title is required.");
      return;
    }

    const now = new Date().toISOString();

    if (editingNote) {
      const updatedNotes = notes.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: formTitle.trim(),
              content: formContent.trim(),
              course: formCourse || null,
              updatedAt: now,
            }
          : n
      );
      persistNotes(updatedNotes);
      toast.success("Note updated successfully!");
    } else {
      const newNote: Note = {
        id: "note_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        title: formTitle.trim(),
        content: formContent.trim(),
        course: formCourse || null,
        createdAt: now,
        updatedAt: now,
      };
      persistNotes([newNote, ...notes]);
      toast.success("Note created successfully!");
    }

    setIsModalOpen(false);
  };

  // Delete Note
  const handleConfirmDelete = () => {
    if (!deletingNote) return;
    const updated = notes.filter((n) => n.id !== deletingNote.id);
    persistNotes(updated);
    setDeletingNote(null);
    toast.success("Note deleted.");
  };

  // Filtered Notes
  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = note.title.toLowerCase().includes(q);
        const inContent = note.content.toLowerCase().includes(q);
        const inCourse = note.course?.toLowerCase().includes(q);
        if (!inTitle && !inContent && !inCourse) return false;
      }
      if (selectedCourseFilter !== "ALL") {
        if ((note.course || "") !== selectedCourseFilter) return false;
      }
      return true;
    });
  }, [notes, searchQuery, selectedCourseFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Wrapper */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={currentUser}
          searchQuery=""
          onSearchChange={(q) => setSearchQuery(q)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Main Content Body */}
        <main className="flex-1 w-full max-w-[1300px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Header: Title & "+ New Note" Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Notes
                </h1>
                {notes.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#315BFF] border border-blue-200/80 shadow-2xs">
                    {notes.length} {notes.length === 1 ? "Note" : "Notes"}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Your personal study notes and quick thoughts
              </p>
            </div>

            <Button
              onClick={handleOpenCreateModal}
              className="bg-[#315BFF] hover:bg-[#254BE3] text-white font-semibold rounded-xl h-11 px-5 shadow-sm shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition active:scale-[0.99] self-start sm:self-auto shrink-0"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New Note</span>
            </Button>
          </div>

          {/* Search & Filter Bar (shown if notes exist or search is active) */}
          {(notes.length > 0 || searchQuery) && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notes by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-9 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-[#315BFF] focus:ring-4 focus:ring-[#315BFF]/10 text-slate-900 placeholder:text-slate-400 transition outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Course Filter Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="w-full sm:w-auto h-10 pl-3.5 pr-8 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 transition cursor-pointer appearance-none"
                >
                  <option value="ALL">All Subjects</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {COURSE_LABELS[c] || c}
                    </option>
                  ))}
                </select>
                <GraduationCap className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          {!isLoaded ? (
            /* Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 animate-pulse space-y-3"
                >
                  <div className="h-5 w-3/4 rounded-md bg-slate-200" />
                  <div className="h-4 w-1/3 rounded-md bg-slate-100" />
                  <div className="h-16 w-full rounded-md bg-slate-50" />
                  <div className="h-4 w-1/4 rounded-md bg-slate-100" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            /* Clean Empty State with Notebook Illustration */
            <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-slate-200 bg-white shadow-2xs animate-fade-in-up">
              {/* Soft Illustration of a Notebook */}
              <div className="relative w-28 h-28 mx-auto mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-blue-50 border border-blue-100 rotate-3 transition-transform" />
                <div className="relative w-24 h-24 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col p-3.5 justify-between">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#315BFF]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="w-3.5 h-1 rounded-full bg-blue-200" />
                  </div>
                  <div className="space-y-1.5 flex-1 pt-1.5">
                    <div className="w-3/4 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-full h-1.5 rounded-full bg-slate-100" />
                    <div className="w-2/3 h-1.5 rounded-full bg-slate-100" />
                  </div>
                  <div className="pt-1 flex justify-end">
                    <div className="w-5 h-5 rounded-md bg-blue-50 text-[#315BFF] flex items-center justify-center">
                      <Pencil className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                No notes yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1.5 mb-6 text-center leading-relaxed">
                Create your first note to save important points, formulas, or ideas.
              </p>
              <Button
                onClick={handleOpenCreateModal}
                className="h-11 px-6 gap-2 bg-[#315BFF] hover:bg-[#254BE3] text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Create Note</span>
              </Button>
            </div>
          ) : filteredNotes.length === 0 ? (
            /* No search results */
            <div className="w-full flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
              <AlertCircle className="h-8 w-8 text-slate-400 mb-2" />
              <h3 className="text-base font-bold text-slate-900">No matching notes found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                No notes matched &quot;{searchQuery}&quot;. Try adjusting your search query.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCourseFilter("ALL");
                }}
                className="rounded-xl border-slate-200"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            /* Grid of Note Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up">
              {filteredNotes.map((note) => {
                const courseStyle =
                  COURSE_BADGES[note.course || ""] ||
                  COURSE_BADGES["General"];

                return (
                  <div
                    key={note.id}
                    className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header: Title & Dropdown Menu */}
                      <div className="flex items-start justify-between gap-2">
                        <h2
                          onClick={() => handleOpenEditModal(note)}
                          className="font-bold text-base text-slate-900 group-hover:text-[#315BFF] transition-colors break-words line-clamp-1 cursor-pointer flex-1"
                        >
                          {note.title}
                        </h2>

                        {/* Three-dot menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 -mr-1.5 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                              aria-label="Note options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-xl border-slate-200 p-1">
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(note)}
                              className="rounded-lg text-xs font-medium cursor-pointer"
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5 text-slate-500" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => setDeletingNote(note)}
                              className="rounded-lg text-xs font-medium text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-500" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Course Tag */}
                      {note.course && (
                        <div className="pt-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${courseStyle.bg} ${courseStyle.text} ${courseStyle.border}`}
                          >
                            <GraduationCap className="h-3 w-3" />
                            <span>{COURSE_LABELS[note.course] || note.course}</span>
                          </span>
                        </div>
                      )}

                      {/* Short Preview Text */}
                      <p
                        onClick={() => handleOpenEditModal(note)}
                        className="text-sm text-slate-600 line-clamp-4 leading-relaxed mt-2.5 break-words whitespace-pre-wrap cursor-pointer"
                      >
                        {note.content || "No additional content."}
                      </p>
                    </div>

                    {/* Bottom Date Row */}
                    <div className="pt-4 mt-3 border-t border-slate-100/90 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {note.content ? `${note.content.split(/\s+/).filter(Boolean).length} words` : "Empty"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Note Creation / Editing Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[520px] p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.16)]">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
              {editingNote ? "Edit Note" : "New Note"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 font-normal">
              {editingNote
                ? "Update your note title, content, or course tag."
                : "Save your key points, formulas, or lecture takeaways."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNote} className="space-y-4 pt-2">
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 text-xs font-medium text-red-600 border border-red-200">
                {formError}
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1" htmlFor="note-title">
                <span>Title</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="note-title"
                placeholder="e.g. AIES Chapter 4: Search Algorithms"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (formError) setFormError("");
                }}
                className="h-11 px-3.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-[#315BFF]/10 focus-visible:border-[#315BFF] transition"
              />
            </div>

            {/* Course Dropdown (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5" htmlFor="note-course">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                <span>Course (Optional)</span>
              </label>
              <div className="relative">
                <select
                  id="note-course"
                  value={formCourse}
                  onChange={(e) => setFormCourse(e.target.value)}
                  className="w-full h-11 pl-3.5 pr-8 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus:border-[#315BFF] focus:ring-4 focus:ring-[#315BFF]/10 transition cursor-pointer appearance-none"
                >
                  <option value="">None (General Note)</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {COURSE_LABELS[c] || c}
                    </option>
                  ))}
                </select>
                <GraduationCap className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Description / Content Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600" htmlFor="note-content">
                Description / Content
              </label>
              <Textarea
                id="note-content"
                rows={5}
                placeholder="Write your notes here... support formulas, definitions, key takeaways..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="min-h-[130px] p-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-[#315BFF]/10 focus-visible:border-[#315BFF] transition resize-none leading-relaxed"
              />
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold w-full sm:w-auto h-11 px-5 cursor-pointer shadow-2xs transition active:scale-[0.99]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#315BFF] hover:bg-[#254BE3] text-white font-semibold w-full sm:w-auto h-11 px-6 shadow-md shadow-blue-500/25 transition active:scale-[0.99] cursor-pointer"
              >
                Save Note
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingNote} onOpenChange={(open) => !open && setDeletingNote(null)}>
        <DialogContent className="sm:max-w-[420px] p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xl">
          <DialogHeader className="space-y-2 text-left">
            <div className="h-11 w-11 rounded-xl bg-red-50 text-red-600 border border-red-200/70 flex items-center justify-center">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Delete Note
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deletingNote && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 break-words">
              {deletingNote.title}
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingNote(null)}
              className="rounded-xl border-slate-200 text-slate-700 h-10 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold h-10 px-4 cursor-pointer shadow-sm shadow-red-500/20"
            >
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
