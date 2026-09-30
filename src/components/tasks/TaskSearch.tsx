"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";

export interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function TaskSearch({
  value,
  onChange,
  isLoading = false,
  placeholder = "Search tasks by title or description...",
  className = "",
}: TaskSearchProps) {
  const [query, setQuery] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  // Handle debounced search updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setQuery(nextVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(nextVal);
    }, 300);
  };

  // Immediate submit on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onChange(query);
    }
  };

  // Clear search input
  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setQuery("");
    onChange("");
    inputRef.current?.focus();
  };

  // Shortcut key '/' to focus
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        // Only trigger if not already focused in another input/textarea
        const tag = document.activeElement?.tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className={`relative flex-1 w-full min-w-[180px] ${className}`}>
      <label htmlFor="task-search-input" className="sr-only">
        Search tasks by title or description
      </label>
      <Search
        className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400 pointer-events-none"
        aria-hidden="true"
      />
      <Input
        id="task-search-input"
        ref={inputRef}
        type="search"
        role="searchbox"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-20 h-10 w-full rounded-xl border-zinc-300/80 bg-zinc-50/60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white text-sm transition-all"
        aria-label="Search tasks"
      />

      <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
        {isLoading && (
          <Loader2
            className="h-4 w-4 text-blue-600 animate-spin"
            aria-label="Searching..."
          />
        )}

        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
