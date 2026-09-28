"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Upload, BookOpen, Layers, Sparkles, Folder, FileText } from "lucide-react";
import { Toaster, toast } from "sonner";
import { LmsLibrarySidebar, LmsNavSection } from "@/components/lms/LmsLibrarySidebar";
import { LmsLibraryHeader } from "@/components/lms/LmsLibraryHeader";
import { LmsLibraryCard, LmsPdfDocument } from "@/components/lms/LmsLibraryCard";
import { LmsPdfViewerModal } from "@/components/lms/LmsPdfViewerModal";
import { LmsUploadModal } from "@/components/lms/LmsUploadModal";

const initialLibraryDocuments: LmsPdfDocument[] = [
  {
    id: "doc-1",
    title: "Chapter 1 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Data Structures",
    size: "3.2 MB",
    category: "Data Structures",
    pages: 24,
    uploadedAt: "Sep 20, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-2",
    title: "Chapter 2 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Data Structures",
    size: "3.2 MB",
    category: "Data Structures",
    pages: 32,
    uploadedAt: "Sep 21, 2026",
    isBookmarked: true,
  },
  {
    id: "doc-3",
    title: "Chapter 3 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Data Structures",
    size: "3.2 MB",
    category: "Data Structures",
    pages: 28,
    uploadedAt: "Sep 22, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-4",
    title: "Chapter 1 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Operating Systems",
    size: "3.2 MB",
    category: "Operating Systems",
    pages: 18,
    uploadedAt: "Sep 23, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-5",
    title: "Chapter 2 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Operating Systems",
    size: "3.2 MB",
    category: "Operating Systems",
    pages: 26,
    uploadedAt: "Sep 24, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-6",
    title: "Chapter 3 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Operating Systems",
    size: "3.2 MB",
    category: "Operating Systems",
    pages: 30,
    uploadedAt: "Sep 25, 2026",
    isBookmarked: true,
  },
  {
    id: "doc-7",
    title: "Chapter 4 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Math",
    size: "3.2 MB",
    category: "Math",
    pages: 22,
    uploadedAt: "Sep 25, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-8",
    title: "Chapter 5 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Math",
    size: "3.2 MB",
    category: "Math",
    pages: 35,
    uploadedAt: "Sep 26, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-9",
    title: "Chapter 6 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Physics",
    size: "3.2 MB",
    category: "Physics",
    pages: 19,
    uploadedAt: "Sep 26, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-10",
    title: "Chapter 4 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Physics",
    size: "3.2 MB",
    category: "Physics",
    pages: 25,
    uploadedAt: "Sep 27, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-11",
    title: "Chapter 8 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Data Structures",
    size: "3.2 MB",
    category: "Data Structures",
    pages: 40,
    uploadedAt: "Sep 27, 2026",
    isBookmarked: false,
  },
  {
    id: "doc-12",
    title: "Chapter 9 - Introduction.pdf",
    courseCode: "CSE101",
    courseName: "Data Structures",
    size: "3.2 MB",
    category: "Data Structures",
    pages: 36,
    uploadedAt: "Sep 28, 2026",
    isBookmarked: false,
  },
];

const CATEGORIES = [
  "All",
  "Data Structures",
  "Operating Systems",
  "Math",
  "Physics",
  "etc.",
] as const;

export default function LmsPage() {
  const [documents, setDocuments] = React.useState<LmsPdfDocument[]>(initialLibraryDocuments);
  const [activeSection, setActiveSection] = React.useState<LmsNavSection>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals
  const [previewDoc, setPreviewDoc] = React.useState<LmsPdfDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = !d.isBookmarked;
          toast.info(
            updated ? `Bookmarked "${d.title}"` : `Removed "${d.title}" from bookmarks`
          );
          return { ...d, isBookmarked: updated };
        }
        return d;
      })
    );
  };

  // Preview Handler
  const handlePreview = (doc: LmsPdfDocument) => {
    setPreviewDoc(doc);
    setIsViewerOpen(true);
  };

  // Download Handler
  const handleDownload = (doc: LmsPdfDocument) => {
    toast.success(`Downloading "${doc.title}" (${doc.size})... 📥`);
  };

  // Upload Add Handler
  const handleAddDocument = (newDoc: LmsPdfDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Filtered Documents
  const filteredDocuments = React.useMemo(() => {
    return documents.filter((doc) => {
      // 1. Sidebar section check
      if (activeSection === "bookmarks" && !doc.isBookmarked) {
        return false;
      }

      // 2. Category tab check (when on "all" or specific category)
      if (selectedCategory !== "All" && activeSection !== "courses") {
        if (selectedCategory === "etc.") {
          if (
            ["Data Structures", "Operating Systems", "Math", "Physics"].includes(doc.category)
          ) {
            return false;
          }
        } else if (doc.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesCourse = doc.courseCode.toLowerCase().includes(q);
        const matchesCategory = doc.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCourse && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [documents, activeSection, selectedCategory, searchQuery]);

  // Grouped by course for "By Courses" view
  const groupedByCourse = React.useMemo(() => {
    const map = new Map<string, LmsPdfDocument[]>();
    filteredDocuments.forEach((doc) => {
      const key = `${doc.courseCode} - ${doc.category}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(doc);
    });
    return Array.from(map.entries());
  }, [filteredDocuments]);

  // Counts for sidebar badges
  const sidebarCounts = React.useMemo(() => {
    const courseCodes = new Set(documents.map((d) => d.courseCode));
    const bookmarksCount = documents.filter((d) => d.isBookmarked).length;
    return {
      all: documents.length,
      courses: courseCodes.size,
      bookmarks: bookmarksCount,
    };
  }, [documents]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-[#EFE8F9] via-[#F4EEFB] to-[#FCEEF6] p-3 sm:p-5 lg:p-8 flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none fixed -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#DDD6FE] blur-3xl opacity-60" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#FCE7F3] blur-3xl opacity-60" />

      <Toaster richColors position="top-right" />

      {/* Top Outer Navigation Return Button */}
      <div className="relative z-10 max-w-[1540px] w-full mx-auto mb-3 px-2 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all border border-slate-200/60"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to FastTask Workspace</span>
        </Link>

        <span className="text-[11px] font-semibold text-purple-900/50 hidden sm:inline-block">
          SkillSet LMS Library • Academic Document Repository
        </span>
      </div>

      {/* Main LMS Library Floating Canvas Window */}
      <div className="relative z-10 max-w-[1540px] w-full mx-auto bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_70px_rgba(110,80,180,0.09)] border border-white/90 overflow-hidden flex flex-col lg:flex-row min-h-[820px]">
        {/* 1. Left Sidebar */}
        <div className="hidden lg:block shrink-0 border-r border-[#EFF1F6] bg-[#FAF9FD]/70">
          <LmsLibrarySidebar
            activeSection={activeSection}
            onSelectSection={(sec) => {
              setActiveSection(sec);
              if (sec === "courses") setSelectedCategory("All");
            }}
            counts={sidebarCounts}
          />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
            <div className="w-72 bg-[#FAF9FD] h-full shadow-2xl animate-in slide-in-from-left duration-200 p-2">
              <LmsLibrarySidebar
                activeSection={activeSection}
                onSelectSection={(sec) => {
                  setActiveSection(sec);
                  setIsMobileMenuOpen(false);
                }}
                counts={sidebarCounts}
              />
            </div>
            <div
              className="flex-1 h-full"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* 2. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9FD]/30">
          {/* Header Bar */}
          <LmsLibraryHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userName="Irham Muhammad"
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {/* Inner Content Body */}
          <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col space-y-6">
            {/* Filter Tabs & Upload Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
              {/* Category Filter Chips / Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {CATEGORIES.map((cat) => {
                  const isCatActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (activeSection === "bookmarks") {
                          setActiveSection("all");
                        }
                      }}
                      className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        isCatActive
                          ? "bg-white text-[#181829] shadow-xs font-bold ring-1 ring-slate-200/80"
                          : "text-slate-500 hover:text-[#181829] hover:bg-white/60"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Upload PDF Action Button */}
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer hover:shadow-md hover:shadow-indigo-500/20 active:scale-98 shrink-0"
              >
                <Upload className="h-4 w-4" />
                <span>Upload PDF</span>
              </button>
            </div>

            {/* Active section title indicator if not 'all' */}
            {activeSection === "bookmarks" && (
              <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 px-4 py-2.5 rounded-xl text-xs text-amber-900">
                <span className="font-semibold">
                  Showing {filteredDocuments.length} bookmarked documents
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSection("all")}
                  className="font-bold text-[#4F46E5] hover:underline cursor-pointer"
                >
                  View All Notes
                </button>
              </div>
            )}

            {/* Main Documents Grid / Section Views */}
            {activeSection === "courses" ? (
              /* Grouped by Courses View */
              <div className="space-y-6">
                {groupedByCourse.map(([groupKey, groupDocs]) => (
                  <div key={groupKey} className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Folder className="h-4 w-4 text-[#4F46E5]" />
                      <h3 className="text-sm font-bold text-[#181829]">{groupKey}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({groupDocs.length} notes)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {groupDocs.map((doc) => (
                        <LmsLibraryCard
                          key={doc.id}
                          doc={doc}
                          onPreview={handlePreview}
                          onDownload={handleDownload}
                          onToggleBookmark={handleToggleBookmark}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Standard 3-Column Library Grid View */
              <>
                {filteredDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDocuments.map((doc) => (
                      <LmsLibraryCard
                        key={doc.id}
                        doc={doc}
                        onPreview={handlePreview}
                        onDownload={handleDownload}
                        onToggleBookmark={handleToggleBookmark}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty state if search/filter returned nothing */
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200 space-y-3 min-h-[300px]">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">No notes found</h4>
                      <p className="text-xs text-slate-500 max-w-sm">
                        No documents matched your current search or category filter. Try clearing filters or upload a new PDF note.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("All");
                        setSearchQuery("");
                        setActiveSection("all");
                      }}
                      className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Filters
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
      />

      {/* Upload PDF Modal */}
      <LmsUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleAddDocument}
      />

      {/* Footer copyright */}
      <div className="relative z-10 text-center py-4 text-xs text-purple-900/50">
        <p>© 2026 SkillSet LMS Library • FastTask Academic Suite</p>
      </div>
    </div>
  );
}
