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
import type { LmsNavSection } from "@/components/lms/LmsLibrarySidebar";
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

const STANDARD_CATEGORIES = [
  "All",
  "TWRM",
  "CN",
  "MACS",
  "AIES",
  "AP",
  "Labs & Sessionals",
];

export default function LmsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [documents, setDocuments] = React.useState<LmsPdfDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoaded, setIsLoaded] = React.useState(false);

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

  // Fetch only user-uploaded materials directly from the database API
  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function fetchMaterials() {
      try {
        const res = await fetch("/api/materials", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const mappedDocs: LmsPdfDocument[] = json.data.map((item: any) => ({
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

            if (isMounted) {
              setDocuments(mappedDocs);
              setIsLoading(false);
              setIsLoaded(true);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch materials from database API, trying offline fallback:", err);
      }

      // Offline / Local storage fallback if API unreachable
      if (isMounted) {
        loadPersistedCourseUploads()
          .then((localDocs) => {
            if (!isMounted) return;
            if (localDocs && localDocs.length > 0) {
              setDocuments(localDocs);
            }
            setIsLoading(false);
            setIsLoaded(true);
          })
          .catch(() => {
            if (isMounted) {
              setIsLoading(false);
              setIsLoaded(true);
            }
          });
      }
    }

    fetchMaterials();

    return () => {
      isMounted = false;
    };
  }, []);

  const [activeSection, setActiveSection] = React.useState<LmsNavSection>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState<"recent" | "name" | "size">("recent");

  const loggedInName =
    currentUser?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "Student");

  // Modals
  const [previewDoc, setPreviewDoc] = React.useState<LmsPdfDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);

  // Toggle Bookmark with API sync
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

  // Upload Document Handler with Immediate Dynamic UI Update
  const handleUploadDocument = async (
    newDoc: LmsPdfDocument,
    autoOpenViewer: boolean = false,
    rawFile?: File | null
  ) => {
    // 1. Immediate optimistic UI update (appears instantly without full page reload)
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);

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

    // 2. Persist to Postgres database via API
    try {
      const sendSaveRequest = async (fileUrlToSave?: string) => {
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
            const saved = json.data;
            // Update document in state with server-generated ID
            setDocuments((prev) =>
              prev.map((item) =>
                item.id === newDoc.id
                  ? {
                      ...item,
                      id: saved.id,
                      schedule: saved.schedule || item.schedule,
                      tag: saved.tag || item.tag,
                      uploadedAt: "Just now",
                    }
                  : item
              )
            );
          }
        }
      };

      // Convert small file to Data URL if feasible, or send existing URL
      if (rawFile && rawFile.size <= 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          sendSaveRequest(dataUrl);
        };
        reader.readAsDataURL(rawFile);
      } else {
        await sendSaveRequest(newDoc.fileUrl);
      }
    } catch (dbErr) {
      console.error("Failed to save course material to database:", dbErr);
    }

    // 3. Local IndexedDB backup
    persistCoursePdfUpload(newDoc, rawFile).catch((err) => {
      console.warn("Could not persist upload to IndexedDB:", err);
    });
  };

  // Delete Document Handler with immediate state update & API sync
  const handleDeleteDocument = async (id: string) => {
    // 1. Immediate client state update
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.info("Document removed from library");

    // 2. Database deletion
    try {
      await fetch(`/api/materials/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete from database:", err);
    }

    // 3. Cleanup local caches
    removePersistedCourseUpload(id).catch((err) => {
      console.warn("Could not delete from IndexedDB:", err);
    });
    saveStoredDeletedId(id);
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

  // Dynamic filter pills: standard course codes + any custom courses uploaded by the user
  const availableCategories = React.useMemo(() => {
    const uploadedCustomCats = documents
      .map((d) => d.category || d.courseName)
      .filter((c): c is string => typeof c === "string" && c.trim().length > 0 && !STANDARD_CATEGORIES.includes(c));
    return Array.from(new Set([...STANDARD_CATEGORIES, ...uploadedCustomCats]));
  }, [documents]);

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
        const matchesCategory = doc.category?.trim().toLowerCase() === catNorm;
        const matchesTag = doc.tag ? doc.tag.trim().toLowerCase() === catNorm : false;
        const matchesCourseName = doc.courseName
          ? doc.courseName.trim().toLowerCase() === catNorm
          : false;
        const matchesCourseCode = doc.courseCode
          ? doc.courseCode.toLowerCase().includes(catNorm)
          : false;
        if (!matchesCategory && !matchesTag && !matchesCourseName && !matchesCourseCode) {
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
        const matchesSchedule = doc.schedule ? doc.schedule.toLowerCase().includes(q) : false;
        if (
          !matchesTitle &&
          !matchesCourse &&
          !matchesCourseName &&
          !matchesCategory &&
          !matchesSchedule
        ) {
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

  // Counts for toolbar indicators
  const sidebarCounts = React.useMemo(() => {
    const bookmarksCount = documents.filter((d) => d.isBookmarked).length;
    const uploadsCount = documents.filter((d) => d.isCustomUpload).length;
    return {
      all: documents.length,
      bookmarks: bookmarksCount,
      uploads: uploadsCount,
    };
  }, [documents]);

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

      {/* Main LMS Library Floating Canvas Window - Full Width */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-200/90 overflow-hidden flex flex-col min-h-[820px]">
        {/* Main Content Area (Full Width) */}
        <div className="w-full flex-1 flex flex-col min-w-0 bg-[#FAF9FD]/25">
          {/* Header Bar */}
          <LmsLibraryHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userName={loggedInName}
            userEmail={currentUser?.email}
            onOpenUpload={handleOpenUploadModal}
          />

          {/* Inner Content Body */}
          <div className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col space-y-5">
            {/* Filter Tabs & View Controls Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
              {/* Category Filter Chips / Tabs (All, TWRM, CN, MACS, etc.) */}
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

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                {/* Quick Toggle: Bookmarks */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection(activeSection === "bookmarks" ? "all" : "bookmarks");
                  }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                    activeSection === "bookmarks"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80"
                  }`}
                  title="View Bookmarked Notes"
                >
                  <Bookmark className={`h-3.5 w-3.5 ${activeSection === "bookmarks" ? "fill-white" : "text-amber-500"}`} />
                  <span>Bookmarks</span>
                  {sidebarCounts.bookmarks > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${activeSection === "bookmarks" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {sidebarCounts.bookmarks}
                    </span>
                  )}
                </button>

                {/* Quick Toggle: My Uploads */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection(activeSection === "uploads" ? "all" : "uploads");
                  }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                    activeSection === "uploads"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80"
                  }`}
                  title="View My Uploaded Notes"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${activeSection === "uploads" ? "text-white" : "text-emerald-500"}`} />
                  <span>My Uploads</span>
                  {sidebarCounts.uploads > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${activeSection === "uploads" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {sidebarCounts.uploads}
                    </span>
                  )}
                </button>
              </div>

              {/* Right View, Add & Sort Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                <span className="text-xs font-medium text-slate-500 tabular-nums hidden xl:inline-block">
                  {filteredDocuments.length} {filteredDocuments.length === 1 ? "item" : "items"}
                </span>

                {/* Add Material Button */}
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
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
            {isLoading ? (
              /* Loading skeleton */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 animate-pulse py-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-44 rounded-2xl bg-slate-100 border border-slate-200/60 p-5 space-y-3">
                    <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : documents.length === 0 ? (
              /* Empty state when no schedule/materials uploaded yet */
              <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl bg-white border border-dashed border-slate-200/90 space-y-4 my-4 min-h-[380px]">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 text-[#315BFF] flex items-center justify-center shadow-xs">
                  <BookOpen className="h-8 w-8 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-base font-bold text-slate-900">
                    No schedule/materials uploaded yet. Click &apos;Upload&apos; to add your first item.
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload course handouts, routine schedules, lab manuals, or lecture notes to populate your library.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenUploadModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload</span>
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
                        ({groupDocs.length} items)
                      </span>
                    </div>

                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5"
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
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5"
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
                          : `No items found for ${selectedCategory}`}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm">
                        {activeSection === "bookmarks"
                          ? "Click the bookmark icon 🔖 on any course note or PDF to pin it here for quick access."
                          : "No uploaded items matched this filter. Try selecting 'All' or uploading an item for this course."}
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
                      {activeSection === "bookmarks" ? "Browse All Items" : "Reset Filters"}
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
