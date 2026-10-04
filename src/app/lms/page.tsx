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
} from "@/components/ui/GoogleIcon";
import { Toaster, toast } from "sonner";
import { LmsLibrarySidebar, LmsNavSection } from "@/components/lms/LmsLibrarySidebar";
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

const initialLibraryDocuments: LmsPdfDocument[] = [];

export default function LmsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [documents, setDocuments] = React.useState<LmsPdfDocument[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load documents safely on the client to avoid SSR hydration mismatches
  React.useEffect(() => {
    let isMounted = true;
    const deletedIds = getStoredDeletedIds();
    const bookmarks = getStoredBookmarks();

    // 1. Quick initial sync from localStorage
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
      console.error("Failed to load initial storage:", e);
    }

    // 2. Re-hydrate full PDF blobs from IndexedDB so uploaded PDFs can be previewed/downloaded after reboot
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

    return () => {
      isMounted = false;
    };
  }, []);

  const [activeSection, setActiveSection] = React.useState<LmsNavSection>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState<"recent" | "name" | "size">("recent");

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

  // Modals
  const [previewDoc, setPreviewDoc] = React.useState<LmsPdfDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = !d.isBookmarked;
          saveStoredBookmark(id, updated);
          toast.info(
            updated ? `Bookmarked "${d.title}" 🔖` : `Removed "${d.title}" from bookmarks`
          );
          return { ...d, isBookmarked: updated };
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
  };

  // Preview Handler - Functional Read
  const handlePreview = (doc: LmsPdfDocument) => {
    setPreviewDoc(doc);
    setIsViewerOpen(true);
  };

  // Upload Document Handler
  const handleUploadDocument = (
    newDoc: LmsPdfDocument,
    autoOpenViewer: boolean = false,
    rawFile?: File | null
  ) => {
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
  };

  // Delete Document Handler
  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    removePersistedCourseUpload(id).catch((err) => {
      console.warn("Could not delete from IndexedDB:", err);
    });
    saveStoredDeletedId(id);
    toast.info("Document removed from library");
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

  const availableCategories = React.useMemo(() => {
    const cats = enrolledCourses.map((c) => c.key);
    return ["All", ...cats];
  }, [enrolledCourses]);

  // Counts for sidebar badges
  const sidebarCounts = React.useMemo(() => {
    const bookmarksCount = documents.filter((d) => d.isBookmarked).length;
    const uploadsCount = documents.filter((d) => d.isCustomUpload).length;
    return {
      all: documents.length,
      courses: enrolledCourses.length,
      bookmarks: bookmarksCount,
      uploads: uploadsCount,
    };
  }, [documents, enrolledCourses]);

  const courseDotMap: Record<string, string> = {
    All: "bg-slate-400",
    AIES: "bg-indigo-500",
    AP: "bg-blue-500",
    CN: "bg-emerald-500",
    MACS: "bg-amber-500",
    TWRM: "bg-rose-500",
    "Labs & Sessionals": "bg-purple-500",
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#F8FAFC] text-slate-900 p-3 sm:p-5 lg:p-7 flex flex-col justify-between selection:bg-[#315BFF] selection:text-white">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-100/30 blur-3xl" />

      <Toaster richColors position="top-right" />



      {/* Main LMS Library Floating Canvas Window */}
      <div className="relative z-10 max-w-[1560px] w-full mx-auto bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-200/90 overflow-hidden flex flex-col lg:flex-row min-h-[820px]">
        {/* 1. Left Sidebar */}
        <div className="hidden lg:block shrink-0 border-r border-slate-100 bg-[#FAF9FD]/80">
          <LmsLibrarySidebar
            activeSection={activeSection}
            onSelectSection={(sec) => {
              setActiveSection(sec);
              if (sec === "courses") setSelectedCategory("All");
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onOpenUpload={handleOpenUploadModal}
            counts={sidebarCounts}
            enrolledCourses={enrolledCourses}
          />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200 p-2">
              <LmsLibrarySidebar
                activeSection={activeSection}
                onSelectSection={(sec) => {
                  setActiveSection(sec);
                  setIsMobileMenuOpen(false);
                }}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setIsMobileMenuOpen(false);
                }}
                onOpenUpload={() => {
                  setIsMobileMenuOpen(false);
                  handleOpenUploadModal();
                }}
                counts={sidebarCounts}
                enrolledCourses={enrolledCourses}
              />
            </div>
            <div
              className="flex-1 h-full"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* 2. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9FD]/25">
          {/* Header Bar */}
          <LmsLibraryHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userName={loggedInName}
            userEmail={currentUser?.email}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onOpenUpload={handleOpenUploadModal}
          />

          {/* Inner Content Body */}
          <div className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col space-y-5">
            {/* Filter Tabs & View Controls Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
              {/* Category Filter Chips / Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {availableCategories.map((cat) => {
                  const isCatActive = selectedCategory === cat;
                  const dotColor = courseDotMap[cat] || "bg-slate-400";
                  const theme = COURSE_THEMES[cat];
                  const activeClass = theme?.activePill || "bg-slate-900 text-white shadow-xs";

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
                      className={`text-xs font-semibold tracking-[-0.01em] px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                        isCatActive
                          ? activeClass
                          : "text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isCatActive ? "bg-white" : dotColor}`} />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right View, Add & Sort Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                <span className="text-xs font-medium text-slate-500 tabular-nums hidden xl:inline-block">
                  {filteredDocuments.length} {filteredDocuments.length === 1 ? "note" : "notes"}
                </span>

                {/* Add Material Button */}
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
                  title="Add Course Note or PDF"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Material</span>
                </button>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer hover:border-slate-300 shadow-2xs"
                >
                  <option value="recent">Sort: Newest</option>
                  <option value="name">Sort: A-Z</option>
                  <option value="size">Sort: File Size</option>
                </select>

                {/* View switcher (Grid vs List) */}
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
                    <LayoutGrid className="h-3.5 w-3.5" />
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
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bookmark indicator badge */}
            {activeSection === "bookmarks" && (
              <div className="flex items-center justify-between gap-3 p-1 pl-3 pr-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-xs w-fit shadow-2xs">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="font-bold text-amber-900 text-xs">
                    {filteredDocuments.length} bookmarked {filteredDocuments.length === 1 ? "document" : "documents"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection("all")}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-amber-100 text-[11px] font-bold text-amber-800 border border-amber-200 shadow-2xs transition-colors cursor-pointer"
                >
                  View All
                </button>
              </div>
            )}

            {/* Uploads indicator badge */}
            {activeSection === "uploads" && (
              <div className="flex items-center justify-between gap-3 p-1 pl-3 pr-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs w-fit shadow-2xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-900 text-xs">
                    {filteredDocuments.length} uploaded {filteredDocuments.length === 1 ? "document" : "documents"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection("all")}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-emerald-100 text-[11px] font-bold text-emerald-800 border border-emerald-200 shadow-2xs transition-colors cursor-pointer"
                >
                  View All
                </button>
              </div>
            )}

            {/* Main Documents Grid / Section Views */}
            {documents.length === 0 ? (
              /* Empty state when no courses or notes have been uploaded yet */
              <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl bg-white border border-dashed border-slate-200/90 space-y-4 my-4 min-h-[380px]">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 text-[#315BFF] flex items-center justify-center shadow-xs">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload First Course PDF</span>
                </button>
              </div>
            ) : activeSection === "courses" ? (
              /* Grouped by Courses View */
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
                          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
                          : "space-y-2.5"
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
              /* Standard Library View (Grid or List) */
              <>
                {filteredDocuments.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
                        : "space-y-2.5"
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
                  /* Empty state if search/filter returned nothing */
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
          </div>
        </div>
      </div>

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
      <div className="relative z-10 text-center py-4 text-xs text-slate-400">
        <p>© 2026 Course Materials Vault • FastTask Academic Suite</p>
      </div>
    </div>
  );
}
