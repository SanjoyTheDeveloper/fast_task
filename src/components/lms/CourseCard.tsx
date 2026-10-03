"use client";

import * as React from "react";
import Image from "next/image";
import { Bookmark, Heart, Star, CheckCircle, Clock } from "@/components/ui/GoogleIcon";

export interface CourseCardData {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  bgGradient: string; // e.g. "from-[#E0F2FE] to-[#BAE6FD]"
  progress?: number; // 0 to 100 for ongoing
  lessons?: number;
  rating?: number;
  category?: string;
  duration?: string;
}

export interface CourseCardProps {
  course: CourseCardData;
  onSelectCourse?: (course: CourseCardData) => void;
}

export function CourseCard({ course, onSelectCourse }: CourseCardProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <div
      onClick={() => onSelectCourse?.(course)}
      className="group relative flex flex-col justify-between rounded-3xl bg-white border border-purple-100/70 p-3 sm:p-3.5 shadow-[0_10px_25px_-5px_rgba(110,80,180,0.06)] hover:shadow-[0_16px_35px_-8px_rgba(110,80,180,0.14)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div>
        {/* Pastel 3D Clay Thumbnail Container */}
        <div
          className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br ${course.bgGradient} p-2 flex items-center justify-center`}
        >
          {/* Subtle inner clay highlight */}
          <div className="absolute inset-0 bg-white/20 pointer-events-none" />

          {/* 3D Clay Image */}
          <div className="relative w-full h-full p-2 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.12)]"
            />
          </div>

          {/* Action Overlay Pills: Bookmark & Like (Frosted Glass) */}
          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              className={`h-7 w-7 rounded-xl backdrop-blur-md border border-white/60 flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isBookmarked
                  ? "bg-purple-600 text-white"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-purple-600"
              }`}
              title="Bookmark course"
              aria-label="Bookmark course"
            >
              <Bookmark className="h-3.5 w-3.5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`h-7 w-7 rounded-xl backdrop-blur-md border border-white/60 flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isLiked
                  ? "bg-rose-500 text-white"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-rose-500"
              }`}
              title="Like course"
              aria-label="Like course"
            >
              <Heart className="h-3.5 w-3.5" fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div className="pt-3 px-1 space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-[#1E1B4B] tracking-tight line-clamp-1 group-hover:text-[#6366F1] transition-colors">
            {course.title}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
            {course.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar or Info Meta */}
      <div className="pt-3 px-1">
        {course.progress !== undefined ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-semibold text-purple-900/70">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            {/* Smooth rounded mint/purple progress track */}
            <div className="w-full h-1.5 rounded-full bg-purple-100/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-purple-50">
            {course.rating && (
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
              </span>
            )}
            {course.lessons && (
              <span className="text-[10px] font-medium text-slate-500">
                {course.lessons} lessons
              </span>
            )}
            {course.duration && (
              <span className="text-[10px] font-medium text-purple-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.duration}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
