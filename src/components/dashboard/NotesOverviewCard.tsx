"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, ArrowUpRight, BookOpen, Clock } from "lucide-react";

export interface NoteItem {
  id: string;
  title: string;
  course?: string | null;
  content: string;
  updatedAt: string;
}

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: "note-1",
    title: "AI State-Space Search & A* Heuristics Notes",
    course: "0611CSE321",
    content: "Heuristic evaluation functions h(n), admissibility criteria, and graph search tree proofs.",
    updatedAt: "2 hours ago",
  },
  {
    id: "note-2",
    title: "Socket Programming & Multi-Client Concurrency",
    course: "0613CSE333",
    content: "POSIX threads, mutex locking, TCP socket client-server architectural patterns.",
    updatedAt: "Yesterday",
  },
  {
    id: "note-3",
    title: "Eulerian Paths & Bipartite Graph Theorems",
    course: "0541MAT337",
    content: "Degree parity conditions, Hamiltonian paths comparison, and planar graph coloring.",
    updatedAt: "3 days ago",
  },
];

export function NotesOverviewCard() {
  const [notes, setNotes] = React.useState<NoteItem[]>(DEFAULT_NOTES);

  React.useEffect(() => {
    try {
      // Try to load user notes from local storage if any
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("fasttask_notes_"));
      if (keys.length > 0) {
        const stored = localStorage.getItem(keys[0]);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotes(parsed.slice(0, 3));
          }
        }
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Study Notes & LMS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Recent lecture summaries & notebooks
            </p>
          </div>
        </div>

        <Link
          href="/notes"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group"
        >
          <span>View all</span>
          <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Notes List */}
      <div className="divide-y divide-slate-100/80 pt-1">
        {notes.map((note) => (
          <Link
            key={note.id}
            href="/notes"
            className="block py-3 group hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {note.title}
              </h4>
              {note.course && (
                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {note.course}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-1">
              {note.content}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1.5">
              <Clock className="h-3 w-3" />
              <span>{note.updatedAt || "Recently updated"}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
