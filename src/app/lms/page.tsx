"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Layers,
  Sparkles,
  Folder,
  FileText,
  Bookmark,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Plus,
  Search,
} from "@/components/ui/GoogleIcon";
import { Toaster, toast } from "sonner";
export type LmsNavSection = "all" | "courses" | "bookmarks" | "uploads";
import { LmsLibraryHeader } from "@/components/lms/LmsLibraryHeader";
import { LmsLibraryCard, LmsPdfDocument } from "@/components/lms/LmsLibraryCard";
import { LmsPdfViewerModal } from "@/components/lms/LmsPdfViewerModal";
import { LmsUploadModal } from "@/components/lms/LmsUploadModal";
import { COURSE_THEMES } from "@/lib/courseThemes";
import {
  persistCoursePdfUpload,
  loadPersistedCourseUploads,
  removePersistedCourseUpload,
  getStoredBookmarks,
  saveStoredBookmark,
  getStoredDeletedIds,
  saveStoredDeletedId,
} from "@/lib/lmsStorage";
import type { SessionUser } from "@/types";

export default function LmsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [documents, setDocuments] = React.useState<LmsPdfDocument[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<LmsNavSection>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState<"recent" | "name" | "size">("recent");

  // Modals state
  const [previewDoc, setPreviewDoc] = React.useState<LmsPdfDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);

  // Load documents safely on client: fast local sync + IndexedDB + DB API sync
  React.useEffect(() => {
    let isMounted = true;
    const deletedIds = getStoredDeletedIds();
    const bookmarks = getStoredBookmarks();

    // 1. Instant sync from localStorage for 0ms visual rendering of existing cards
    try {
      const stored =
        localStorage.getItem("fasttask_course_uploads_v2") ||
        localStorage.getItem("fasttask_course_uploads");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
          const customFiltered = parsed
            .filter((d: LmsPdfDocument) => !deletedIds.has(d.id))
            .map((d: LmsPdfDocument) => ({
              ...d,
              isBookmarked: bookmarks[d.id] !== undefined ? bookmarks[d.id] : d.isBookmarked,
            }));
          setDocuments(customFiltered);
        }
      }
    } catch (e) {
      console.warn("Failed to load initial localStorage:", e);
    }

    // 2. Re-hydrate full PDF blobs from IndexedDB so uploaded PDFs can be previewed/downloaded
    loadPersistedCourseUploads()
      .then((customDocs) => {
        if (!isMounted || !customDocs) return;
        setDocuments(
          customDocs
            .filter((d) => !deletedIds.has(d.id))
            .map((d) => ({
              ...d,
              isBookmarked: bookmarks[d.id] !== undefined ? bookmarks[d.id] : d.isBookmarked,
            }))
        );
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn("Could not rehydrate IndexedDB course uploads:", err);
        if (isMounted) setIsLoaded(true);
      });

    // 3. Background sync with PostgreSQL database via /api/materials
    fetch("/api/materials", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted || !json?.success || !Array.isArray(json.data) || json.data.length === 0) return;
        const dbDocs: LmsPdfDocument[] = json.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          courseCode: item.courseCode,
          courseName: item.courseName || item.category,
          category: item.category,
          tag: item.tag || item.category,
          schedule: item.schedule || undefined,
          size: item.fileSize || "1.5 MB",
          pages: item.pages || 1,
          isBookmarked: Boolean(item.isBookmarked),
          isCustomUpload: true,
          fileUrl: item.fileUrl || undefined,
          description: item.description || undefined,
          materialType: item.materialType || undefined,
          userId: item.userId,
          uploadedAt: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Recent",
        }));

        setDocuments((prev) => {
          const map = new Map<string, LmsPdfDocument>();
          [...prev, ...dbDocs].forEach((d) => {
            if (!deletedIds.has(d.id)) {
              map.set(d.id, {
                ...d,
                isBookmarked: bookmarks[d.id] !== undefined ? bookmarks[d.id] : d.isBookmarked,
              });
            }
          });
          return Array.from(map.values());
        });
      })
      .catch((err) => console.warn("Background API sync notice:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Load authenticated user strictly from auth session
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setCurrentUser(data.user);
          } else {
            window.location.href = "/login?from=/lms";
          }
        } else if (res.status === 401) {
          window.location.href = "/login?from=/lms";
        }
      } catch (err) {
        console.error("Failed to load authenticated user:", err);
      }
    }
    loadUser();
  }, []);

  const loggedInName =
    currentUser?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "Student");

  // Toggle Bookmark
  const handleToggleBookmark = async (id: string) => {
    let nextState = false;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          nextState = !d.isBookmarked;
          saveStoredBookmark(id, nextState);
          toast.info(
            nextState ? `Bookmarked "${d.title}" 🔖` : `Removed "${d.title}" from bookmarks`
          );
          return { ...d, isBookmarked: nextState };
        }
        return d;
      })
    );

    setPreviewDoc((prev) => {
      if (prev && prev.id === id) {
        return { ...prev, isBookmarked: !prev.isBookmarked };
      }
      return prev;
    });

    try {
      await fetch(`/api/materials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBookmarked: nextState }),
      });
    } catch (e) {
      console.warn("Could not sync bookmark state to database:", e);
    }
  };

  // Preview Handler - Functional Read
  const handlePreview = (doc: LmsPdfDocument) => {
    setPreviewDoc(doc);
    setIsViewerOpen(true);
  };

  // Upload Document Handler with immediate dynamic UI update
  const handleUploadDocument = async (
    newDoc: LmsPdfDocument,
    autoOpenViewer: boolean = false,
    rawFile?: File | null
  ) => {
    // Immediate client update
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);

    // Permanently write to IndexedDB & localStorage backup
    persistCoursePdfUpload(newDoc, rawFile).catch((err) => {
      console.warn("Could not persist upload to IndexedDB:", err);
    });

    toast.success(`"${newDoc.title}" added to ${newDoc.courseName || newDoc.category}! 🎉`, {
      action: {
        label: "View Document",
        onClick: () => handlePreview(newDoc),
      },
    });

    // Reset category filter if it would hide the newly uploaded document
    if (
      selectedCategory !== "All" &&
      selectedCategory !== newDoc.category &&
      selectedCategory !== newDoc.courseName
    ) {
      setSelectedCategory("All");
    }

    if (autoOpenViewer) {
      handlePreview(newDoc);
    }

    // Persist to database via API
    try {
      const sendSave = async (fileUrlToSave?: string) => {
        const res = await fetch("/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newDoc.title,
            courseCode: newDoc.courseCode,
            courseName: newDoc.courseName,
            category: newDoc.category,
            tag: newDoc.tag || newDoc.category,
            schedule: newDoc.schedule,
            fileUrl: fileUrlToSave || newDoc.fileUrl,
            fileSize: newDoc.size,
            pages: newDoc.pages,
            description: newDoc.description,
            materialType: newDoc.materialType,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDocuments((prev) =>
              prev.map((item) =>
                item.id === newDoc.id
                  ? { ...item, id: json.data.id, uploadedAt: "Just now" }
                  : item
              )
            );
          }
        }
      };

      if (rawFile && rawFile.size <= 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sendSave(reader.result as string);
        };
        reader.readAsDataURL(rawFile);
      } else {
        await sendSave(newDoc.fileUrl);
      }
    } catch (e) {
      console.warn("API upload sync:", e);
    }
  };

  // Delete Document Handler
  const handleDeleteDocument = async (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    removePersistedCourseUpload(id).catch((err) => {
      console.warn("Could not delete from IndexedDB:", err);
    });
    saveStoredDeletedId(id);
    toast.info("Document removed from library");

    try {
      await fetch(`/api/materials/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("API delete notice:", e);
    }
  };

  // Quick open upload modal
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  // Download Handler - Functional PDF Download
  const handleDownload = (doc: LmsPdfDocument) => {
    toast.success(`Downloading "${doc.title}"... 📥`);
    try {
      if (doc.fileUrl) {
        const link = document.createElement("a");
        link.href = doc.fileUrl;
        link.download = doc.title.endsWith(".pdf") ? doc.title : `${doc.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      const pdfContent = `%PDF-1.4\n%FastTask Academic Portal\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n5 0 obj\n<< /Length 200 >>\nstream\nBT\n/F1 20 Tf\n50 720 Td\n(${doc.courseCode} - ${doc.courseName || doc.category})\n Tj\n0 -35 Td\n/F1 14 Tf\n(${doc.title.replace(/[\(\)]/g, "")}) Tj\n0 -30 Td\n/F1 10 Tf\n(Downloaded from FastTask LMS Academic Portal) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000035 00000 n \n0000000094 00000 n \n0000000161 00000 n \n0000000286 00000 n \n0000000372 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n630\n%%EOF`;
      const blob = new Blob([pdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.title.endsWith(".pdf") ? doc.title : `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF download error:", e);
    }
  };

  // Filtered & Sorted Documents
  const filteredDocuments = React.useMemo(() => {
    const list = documents.filter((doc) => {
      // 1. Sidebar section check
      if (activeSection === "bookmarks" && !doc.isBookmarked) {
        return false;
      }
      if (activeSection === "uploads" && !doc.isCustomUpload) {
        return false;
      }

      // 2. Category tab check (applies across all views)
      if (selectedCategory !== "All") {
        const catNorm = selectedCategory.trim().toLowerCase();
        const matchesCategory = doc.category.trim().toLowerCase() === catNorm;
        const matchesCourseName = doc.courseName
          ? doc.courseName.trim().toLowerCase() === catNorm
          : false;
        const matchesCourseCode = doc.courseCode.toLowerCase().includes(catNorm);
        if (!matchesCategory && !matchesCourseName && !matchesCourseCode) {
          return false;
        }
      }

      // 3. Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesCourse = doc.courseCode.toLowerCase().includes(q);
        const matchesCourseName = doc.courseName ? doc.courseName.toLowerCase().includes(q) : false;
        const matchesCategory = doc.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCourse && !matchesCourseName && !matchesCategory) {
          return false;
        }
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "size") {
        const sA = parseFloat(a.size) || 0;
        const sB = parseFloat(b.size) || 0;
        return sB - sA;
      }
      return 0;
    });
  }, [documents, activeSection, selectedCategory, searchQuery, sortBy]);

  // Grouped by course for "By Courses" view
  const groupedByCourse = React.useMemo(() => {
    const map = new Map<string, LmsPdfDocument[]>();
    filteredDocuments.forEach((doc) => {
      const key = `${doc.courseCode} • ${doc.courseName || doc.category}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(doc);
    });
    return Array.from(map.entries());
  }, [filteredDocuments]);

  // Dynamically derive actual courses and categories strictly from uploaded documents
  const enrolledCourses = React.useMemo(() => {
    const map = new Map<string, { key: string; label: string; code: string; count: number }>();
    documents.forEach((d) => {
      const key = d.category || d.courseName || "General";
      if (!map.has(key)) {
        map.set(key, {
          key: key,
          label: d.courseName || key,
          code: d.courseCode || key,
          count: 0,
        });
      }
      map.get(key)!.count += 1;
    });
    return Array.from(map.values());
  }, [documents]);

  const defaultCategories = ["All", "TWRM", "CN", "MACS", "Labs & Sessionals"];
  const availableCategories = React.useMemo(() => {
    const cats = enrolledCourses.map((c) => c.key);
    const set = new Set([...defaultCategories, ...cats]);
    return Array.from(set);
  }, [enrolledCourses]);

  const courseDotMap: Record<string, string> = {
    All: "bg-slate-400",
    AIES: "bg-indigo-500",
    AP: "bg-blue-500",
    "AP Sess.": "bg-blue-500",
    CN: "bg-emerald-500",
    MACS: "bg-amber-500",
    TWRM: "bg-rose-500",
    "Labs & Sessionals": "bg-purple-500",
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] py-6 px-6 sm:px-8 max-w-7xl mx-auto space-y-6 selection:bg-blue-600 selection:text-white relative">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-100/30 blur-3xl" />

      <Toaster richColors position="top-right" />

      {/* Top Header & Action Bar */}
      <LmsLibraryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userName={loggedInName}
        userEmail={currentUser?.email}
        onOpenUpload={handleOpenUploadModal}
      />

      {/* Top Banner / Header Card */}
      <div className="relative w-full rounded-3xl bg-gradient-to-r from-blue-100/70 via-indigo-50/40 to-white border border-blue-100/80 p-6 shadow-xs overflow-hidden">
        {/* Decorative ambient subtle background glows */}
        <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-1/4 h-52 w-52 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="bg-white/90 text-blue-700 font-semibold text-xs px-3 py-1 rounded-full border border-blue-200/60 inline-flex items-center gap-2 shadow-2xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Academic Resource Vault • FastTask LMS</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Course Notes &amp; Library <span className="text-blue-600">• Batch 82A</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              Quickly browse, preview, and download your lecture notes, handouts, and laboratory manuals with seamless offline support.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-4 bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-blue-100/80 shadow-2xs text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Total Notes</span>
                <span className="font-extrabold text-slate-800 text-sm tabular-nums">{documents.length}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Courses</span>
                <span className="font-extrabold text-slate-800 text-sm tabular-nums">{enrolledCourses.length || 5}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenUploadModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer active:scale-95 text-sm"
              title="Add Material or Upload PDF"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Material</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search input container */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course materials, codes, topics..."
              className="w-full bg-white border border-slate-200/80 text-slate-900 placeholder:text-slate-400 rounded-2xl pl-10 pr-4 py-2.5 shadow-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Action Controls: Note counter, Sort, View switcher */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
            <span className="text-xs font-medium text-slate-500 tabular-nums hidden sm:inline-block">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? "note" : "notes"}
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-300 shadow-2xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Sort: Newest</option>
              <option value="name">Sort: A-Z</option>
              <option value="size">Sort: File Size</option>
            </select>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills ("All", "TWRM", "CN", "MACS", "Labs") */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {availableCategories.map((cat) => {
            const isCatActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  if (activeSection === "bookmarks" || activeSection === "uploads") {
                    setActiveSection("all");
                  }
                }}
                className={`cursor-pointer transition-all shrink-0 ${
                  isCatActive
                    ? "bg-blue-600 text-white font-semibold shadow-xs rounded-xl px-4 py-1.5 text-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl px-4 py-1.5 text-sm font-medium transition-all"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Documents Grid / Section Views */}
      {documents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl bg-white border border-dashed border-slate-200/90 space-y-4 my-4 min-h-[380px] shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100/60">
            <BookOpen className="h-8 w-8 stroke-[2.2]" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-slate-900">
              No Courses Uploaded Yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This course page only displays the courses and materials you upload. Click the button below to upload your first course PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Upload First Course PDF</span>
          </button>
        </div>
      ) : activeSection === "courses" ? (
        <div className="space-y-6">
          {groupedByCourse.map(([groupKey, groupDocs]) => (
            <div key={groupKey} className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                <Folder className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{groupKey}</h3>
                <span className="text-[11px] text-slate-400 font-semibold">
                  ({groupDocs.length} notes)
                </span>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-3"
                }
              >
                {groupDocs.map((doc) => (
                  <LmsLibraryCard
                    key={doc.id}
                    doc={doc}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onToggleBookmark={handleToggleBookmark}
                    onDelete={handleDeleteDocument}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredDocuments.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-3"
              }
            >
              {filteredDocuments.map((doc) => (
                <LmsLibraryCard
                  key={doc.id}
                  doc={doc}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  onToggleBookmark={handleToggleBookmark}
                  onDelete={handleDeleteDocument}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200 space-y-3 min-h-[300px]">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                {activeSection === "bookmarks" ? (
                  <Bookmark className="h-6 w-6 text-amber-500" />
                ) : (
                  <FileText className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">
                  {activeSection === "bookmarks"
                    ? "No Bookmarked Notes Yet"
                    : "No notes found"}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  {activeSection === "bookmarks"
                    ? "Click the bookmark icon 🔖 on any course note or PDF to pin it here for quick access."
                    : "No documents matched your current search or category filter. Try clearing filters or resetting."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setActiveSection("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                {activeSection === "bookmarks" ? "Browse All Course Notes" : "Reset Filters"}
              </button>
            </div>
          )}
        </>
      )}

      {/* PDF Interactive Viewer Modal */}
      <LmsPdfViewerModal
        doc={previewDoc}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onDownload={handleDownload}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Human Note Typing & PDF Upload Modal */}
      <LmsUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadDocument}
        activeCategory={selectedCategory}
        userName={loggedInName}
      />

      {/* Footer copyright */}
      <div className="text-center py-6 text-xs text-slate-400">
        <p>© 2026 Course Materials Vault • FastTask Academic Suite</p>
      </div>
    </div>
  );
}
