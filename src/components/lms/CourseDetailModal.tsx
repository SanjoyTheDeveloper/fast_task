"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CourseCardData } from "./CourseCard";
import { Star, Clock, BookOpen, CheckCircle2, Play, Bookmark, X } from "lucide-react";
import { toast } from "sonner";

export interface CourseDetailModalProps {
  course: CourseCardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailModal({
  course,
  open,
  onOpenChange,
}: CourseDetailModalProps) {
  if (!course) return null;

  const handleEnroll = () => {
    toast.success(`You are now enrolled in "${course.title}"! 🎉`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl bg-white border border-purple-100/80 shadow-2xl">
        {/* Top Header Thumbnail Banner */}
        <div
          className={`relative w-full h-44 bg-gradient-to-br ${course.bgGradient} p-6 flex items-center justify-center overflow-hidden`}
        >
          <div className="relative w-32 h-32 drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-xs font-bold text-[#6366F1] shadow-xs">
            {course.category || "Featured Course"}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-extrabold text-[#1E1B4B]">
              {course.title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {course.subtitle} Learn core foundational topics, practice with interactive quizzes, and earn an verified certificate upon completion.
            </DialogDescription>
          </div>

          {/* Course Meta Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {course.rating && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 font-bold text-amber-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {course.rating} Rating
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 font-semibold text-purple-700">
              <BookOpen className="h-3.5 w-3.5" />
              {course.lessons || 16} Lessons
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 font-semibold text-emerald-700">
              <Clock className="h-3.5 w-3.5" />
              {course.duration || "4h 30m"}
            </span>
          </div>

          {/* Curriculum Preview */}
          <div className="space-y-2 pt-2 border-t border-purple-50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              What You Will Learn
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Foundations of active reading and retention strategies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Comprehensive knowledge mapping and mental frameworks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Practical assignments reviewed by expert mentors</span>
              </li>
            </ul>
          </div>

          {/* Action Footer */}
          <div className="pt-3 flex items-center gap-3 border-t border-purple-50">
            <button
              type="button"
              onClick={handleEnroll}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Enroll Now — Free</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="py-3 px-5 rounded-2xl border border-purple-200 bg-white hover:bg-purple-50/50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
