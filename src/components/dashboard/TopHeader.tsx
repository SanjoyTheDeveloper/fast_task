"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Sparkles } from "lucide-react";

export interface TopHeaderProps {
  title?: string;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenMobileMenu?: () => void;
  onOpenZenMode?: () => void;
  onOpenCreateModal?: () => void;
}

export function TopHeader({
  title = "Dashboard",
  user: _user,
  searchQuery: _searchQuery,
  onSearchChange: _onSearchChange,
  onOpenMobileMenu: _onOpenMobileMenu,
  onOpenZenMode,
  onOpenCreateModal,
}: TopHeaderProps) {
  const collaborators = [
    { name: "David", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" },
    { name: "Liam", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces" },
    { name: "Ethan", src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&h=64&fit=crop&crop=faces" },
    { name: "Noah", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      {/* Right: Collaborator Avatar Stack with Plus button + Focus Action */}
      <div className="flex items-center gap-3">
        {/* Avatars Stack */}
        <div className="flex items-center -space-x-2">
          {collaborators.map((user, idx) => (
            <div
              key={idx}
              className="relative h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-slate-200 shrink-0"
              title={user.name}
            >
              <Image
                src={user.src}
                alt={user.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          ))}

        </div>

        {/* Zen Mode Button */}
        {onOpenZenMode && (
          <button
            type="button"
            onClick={onOpenZenMode}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Zen Focus</span>
          </button>
        )}
      </div>
    </div>
  );
}
