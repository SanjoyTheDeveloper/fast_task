"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LmsSidebar } from "@/components/lms/LmsSidebar";
import { LmsHeader } from "@/components/lms/LmsHeader";
import { LmsHeroBanner } from "@/components/lms/LmsHeroBanner";
import { CourseCard, CourseCardData } from "@/components/lms/CourseCard";
import { LmsRightPanel } from "@/components/lms/LmsRightPanel";
import { CourseDetailModal } from "@/components/lms/CourseDetailModal";
import { Toaster, toast } from "sonner";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

const initialPopularCourses: CourseCardData[] = [
  {
    id: "pop-1",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-stack.png",
    bgGradient: "from-[#E0F2FE] via-[#BAE6FD] to-[#93C5FD]/60",
    rating: 4.9,
    lessons: 18,
    duration: "3h 45m",
    category: "Literature",
  },
  {
    id: "pop-2",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-notebook.png",
    bgGradient: "from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]",
    rating: 4.8,
    lessons: 14,
    duration: "4h 10m",
    category: "Reading & Habits",
  },
  {
    id: "pop-3",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-clock.jpg",
    bgGradient: "from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE]",
    rating: 5.0,
    lessons: 22,
    duration: "5h 20m",
    category: "Time & Study",
  },
  {
    id: "pop-4",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-coffee.jpg",
    bgGradient: "from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]",
    rating: 4.7,
    lessons: 12,
    duration: "2h 30m",
    category: "Morning Routines",
  },
];

const initialOngoingCourses: CourseCardData[] = [
  {
    id: "ong-1",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-bookshelf.png",
    bgGradient: "from-[#EDE9FE] to-[#DDD6FE]",
    progress: 68,
    category: "Library Science",
  },
  {
    id: "ong-2",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-blue-char.jpg",
    bgGradient: "from-[#D1FAE5] to-[#A7F3D0]",
    progress: 45,
    category: "Creative Stories",
  },
  {
    id: "ong-3",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-red-book.jpg",
    bgGradient: "from-[#FEF3C7] to-[#FDE68A]",
    progress: 82,
    category: "Arts & Archiving",
  },
  {
    id: "ong-4",
    title: "The book is an essent...",
    subtitle: "This is just a general example...",
    thumbnail: "/images/lms/clay-yellow-char.jpg",
    bgGradient: "from-[#E0F2FE] to-[#BAE6FD]",
    progress: 30,
    category: "Storytime & Logic",
  },
];

export default function LmsDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("library");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCourse, setSelectedCourse] = React.useState<CourseCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Search filter
  const filteredPopular = React.useMemo(() => {
    if (!searchQuery.trim()) return initialPopularCourses;
    const q = searchQuery.toLowerCase();
    return initialPopularCourses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredOngoing = React.useMemo(() => {
    if (!searchQuery.trim()) return initialOngoingCourses;
    const q = searchQuery.toLowerCase();
    return initialOngoingCourses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleOpenCourse = (course: CourseCardData) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleUpgrade = () => {
    toast.success("SkillSet Pro Plan unlocked! Unlimited library access activated ✨");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#EBE5F7] p-3 sm:p-5 lg:p-8 flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Decorative ambient background blobs */}
      <div className="pointer-events-none fixed -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#DDD6FE] blur-3xl opacity-70" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#FCE7F3] blur-3xl opacity-70" />
      <div className="pointer-events-none fixed top-1/2 left-1/4 h-80 w-80 rounded-full bg-[#EDE9FE] blur-2xl opacity-60" />

      {/* Floating 3D Clay Elements in Outer Canvas Corners */}
      <div className="hidden xl:block pointer-events-none fixed top-8 left-12 w-20 h-20 opacity-80 transition-transform duration-700 hover:rotate-6">
        <Image
          src="/images/lms/clay-stack.png"
          alt="Clay Books Deco"
          width={80}
          height={80}
          className="object-contain drop-shadow-[0_15px_20px_rgba(110,80,180,0.2)] animate-pulse"
        />
      </div>

      <div className="hidden xl:block pointer-events-none fixed bottom-10 right-12 w-24 h-24 opacity-80">
        <Image
          src="/images/lms/clay-notebook.png"
          alt="Clay Notebook Deco"
          width={96}
          height={96}
          className="object-contain drop-shadow-[0_15px_20px_rgba(110,80,180,0.2)]"
        />
      </div>

      <Toaster richColors position="top-right" />

      {/* Navigation Return Pill Header */}
      <div className="relative z-10 max-w-[1540px] w-full mx-auto mb-3 px-2 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-purple-200/60 text-xs font-bold text-[#6366F1] shadow-2xs hover:shadow-xs transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to FastTask Workspace</span>
        </Link>

        <span className="text-[11px] font-semibold text-purple-900/60 hidden sm:inline-block">
          SkillSet LMS Dashboard • Soft Claymorphic Edition
        </span>
      </div>

      {/* Main Floating Dashboard Window (SkillSet LMS Canvas) */}
      <div className="relative z-10 max-w-[1540px] w-full mx-auto bg-[#FAFAFC] rounded-[32px] sm:rounded-[36px] shadow-[0_25px_80px_rgba(110,80,180,0.14)] border border-white/90 overflow-hidden flex flex-col lg:flex-row">
        {/* 1. Left Sidebar (Vertical Menu) */}
        <div className="hidden lg:block shrink-0">
          <LmsSidebar
            activeItem={activeTab}
            onSelectItem={(id) => setActiveTab(id)}
            onUpgradeClick={handleUpgrade}
          />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
            <div className="w-72 bg-[#FAFAFC] h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <LmsSidebar
                activeItem={activeTab}
                onSelectItem={(id) => {
                  setActiveTab(id);
                  setIsMobileMenuOpen(false);
                }}
                onUpgradeClick={handleUpgrade}
              />
            </div>
            <div
              className="flex-1 h-full"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* 2. Main Content & Right Panel Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <LmsHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {/* Body Columns: Center Content + Right Panel */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 sm:gap-8 items-start">
            {/* Center Content Column (Hero Banner + Popular + Ongoing) */}
            <div className="flex-1 min-w-0 space-y-7 sm:space-y-8 w-full">
              {/* Hero Banner */}
              <LmsHeroBanner
                userName="Irham Muhammad Shidiq"
                onLearnMore={() => {
                  if (initialPopularCourses[0]) handleOpenCourse(initialPopularCourses[0]);
                }}
              />

              {/* "Popular" Grid Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-[#1E1B4B] tracking-tight">
                    Popular
                  </h2>
                  <button
                    type="button"
                    onClick={() => toast.info("Viewing all 24 popular courses")}
                    className="text-[11px] font-bold text-[#6366F1] uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {filteredPopular.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelectCourse={handleOpenCourse}
                    />
                  ))}
                </div>
              </section>

              {/* "Ongoing" Grid Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-[#1E1B4B] tracking-tight">
                    Ongoing
                  </h2>
                  <button
                    type="button"
                    onClick={() => toast.info("Viewing all ongoing courses")}
                    className="text-[11px] font-bold text-[#6366F1] uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {filteredOngoing.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelectCourse={handleOpenCourse}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Panel: Achievement Unlocks & Best Sellers */}
            <LmsRightPanel
              onOrderCourse={(title) => {
                toast.success(`Enrolled in "${title}" successfully! 🎓`);
              }}
            />
          </div>
        </div>
      </div>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Footer hint */}
      <div className="relative z-10 text-center py-4 text-xs text-purple-900/60">
        <p>© 2026 SkillSet Learning Management System. Claymorphism & Pastel Design System.</p>
      </div>
    </div>
  );
}
