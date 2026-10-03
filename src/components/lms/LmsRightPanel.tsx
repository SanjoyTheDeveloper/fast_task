"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Flame, Trophy, CheckCircle2, ArrowRight } from "@/components/ui/GoogleIcon";
import { toast } from "sonner";

export interface StudentAchievement {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  percentage: number;
  daysLeft: number;
  trackColor: string;
}

export interface BestSellerItem {
  id: string;
  title: string;
  rating: number;
  thumbnailColor: string;
  thumbnailImage: string;
  price?: string;
}

const defaultAchievements: StudentAchievement[] = [
  {
    id: "1",
    name: "Emma Watson",
    avatarColor: "bg-purple-100 text-purple-700 ring-purple-200",
    initials: "EW",
    percentage: 66,
    daysLeft: 7,
    trackColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
  },
  {
    id: "2",
    name: "Lucas Vance",
    avatarColor: "bg-amber-100 text-amber-700 ring-amber-200",
    initials: "LV",
    percentage: 33,
    daysLeft: 12,
    trackColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
  },
];

const bestSellers: BestSellerItem[] = [
  {
    id: "1",
    title: "Grow green",
    rating: 4.5,
    thumbnailColor: "bg-[#FCE7F3]",
    thumbnailImage: "/images/lms/clay-red-book.jpg",
  },
  {
    id: "2",
    title: "Raise a plant",
    rating: 4.0,
    thumbnailColor: "bg-[#EDE9FE]",
    thumbnailImage: "/images/lms/clay-bookshelf.png",
  },
  {
    id: "3",
    title: "One question...",
    rating: 4.5,
    thumbnailColor: "bg-[#E0F2FE]",
    thumbnailImage: "/images/lms/clay-notebook.png",
  },
  {
    id: "4",
    title: "Unplug day",
    rating: 4.0,
    thumbnailColor: "bg-[#D1FAE5]",
    thumbnailImage: "/images/lms/clay-globe.jpg",
  },
  {
    id: "5",
    title: "Best year",
    rating: 3.5,
    thumbnailColor: "bg-[#FEF3C7]",
    thumbnailImage: "/images/lms/clay-stack.png",
  },
];

export interface LmsRightPanelProps {
  onOrderCourse?: (title: string) => void;
}

export function LmsRightPanel({ onOrderCourse }: LmsRightPanelProps) {
  const [isUnlocked, setIsUnlocked] = React.useState(true);

  const handleOrder = (title: string) => {
    if (onOrderCourse) {
      onOrderCourse(title);
    } else {
      toast.success(`Enrolled in "${title}" successfully! 🎓`);
    }
  };

  return (
    <div className="w-full xl:w-80 shrink-0 space-y-6">
      {/* 1. Unlocks Achievement Card */}
      <div className="rounded-3xl bg-white border border-purple-100/70 p-5 shadow-[0_10px_25px_-5px_rgba(110,80,180,0.06)] space-y-4">
        {/* Card Header with Toggle Switch */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="text-sm font-bold text-[#1E1B4B]">
              Unlocks achievement
            </h3>
            <p className="text-[11px] text-slate-400">
              Goal achieved success unlocked.
            </p>
          </div>

          {/* iOS / Claymorphic style toggle */}
          <button
            type="button"
            onClick={() => setIsUnlocked(!isUnlocked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isUnlocked ? "bg-[#6366F1]" : "bg-slate-200"
            }`}
            role="switch"
            aria-checked={isUnlocked}
            aria-label="Toggle achievements"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isUnlocked ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Student Achievement Rows */}
        <div className="space-y-3.5 pt-1">
          {defaultAchievements.map((student) => (
            <div key={student.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 shadow-2xs ${student.avatarColor}`}
                  >
                    {student.initials}
                  </div>
                  <span className="text-xs font-semibold text-[#1E1B4B]">
                    {student.percentage}% Achieved
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  {student.daysLeft} Days left
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1.5 rounded-full bg-purple-100/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${student.trackColor} transition-all duration-700`}
                  style={{ width: `${student.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Streak Pill */}
        <div className="pt-2">
          <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/50 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
              <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              14-Day Study Streak
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Top 5%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Best sales / Best Sellers List */}
      <div className="rounded-3xl bg-white border border-purple-100/70 p-5 shadow-[0_10px_25px_-5px_rgba(110,80,180,0.06)] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-purple-50">
          <h3 className="text-sm font-bold text-[#1E1B4B]">
            Best sales
          </h3>
          <button
            type="button"
            className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider hover:underline cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>

        {/* Course List */}
        <div className="space-y-3">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-1.5 rounded-2xl hover:bg-purple-50/50 transition-colors"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`relative h-10 w-10 rounded-xl overflow-hidden ${item.thumbnailColor} p-1 shrink-0 flex items-center justify-center border border-white/60 shadow-2xs`}
                >
                  <Image
                    src={item.thumbnailImage}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1E1B4B] truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] font-semibold text-amber-500 flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating.toFixed(1)}</span>
                  </p>
                </div>
              </div>

              {/* Action Button: "Order" */}
              <button
                type="button"
                onClick={() => handleOrder(item.title)}
                className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
