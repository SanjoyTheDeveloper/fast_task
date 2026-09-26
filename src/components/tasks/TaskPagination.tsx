"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TaskPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function TaskPagination({
  page,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  isLoading = false,
  className = "",
}: TaskPaginationProps) {
  if (total === 0) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination navigation"
      className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-xs ${className}`}
    >
      {/* Item summary */}
      <div className="text-xs text-zinc-500 font-medium">
        Showing <span className="font-bold text-zinc-900">{startItem}</span> to{" "}
        <span className="font-bold text-zinc-900">{endItem}</span> of{" "}
        <span className="font-bold text-zinc-900">{total}</span> tasks
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage || page <= 1 || isLoading}
          className="h-9 px-3 rounded-xl border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-xs">Previous</span>
        </Button>

        {/* Compact indicator on mobile viewports */}
        <span className="sm:hidden text-xs font-semibold text-zinc-700 px-2 select-none">
          {page} / {totalPages || 1}
        </span>

        {/* Full page numbers on tablet and desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((item, idx) => {
            if (typeof item === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-zinc-400 select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = item === page;
            return (
              <Button
                key={item}
                variant={isCurrent ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(item)}
                disabled={isLoading}
                className={`h-8.5 w-8.5 p-0 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
                aria-label={`Page ${item}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || page >= totalPages || isLoading}
          className="h-9 px-3 rounded-xl border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to next page"
        >
          <span className="text-xs">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
