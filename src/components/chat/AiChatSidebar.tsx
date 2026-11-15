"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import { ThinkaLogo } from "./ThinkaLogo";
import { ChatSession } from "@/types/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface AiChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onOpenExplore: () => void;
  onOpenUpgrade: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export function AiChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onOpenExplore,
  onOpenUpgrade,
  isCollapsed,
  onToggleCollapse,
  className,
}: AiChatSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [todayOpen, setTodayOpen] = React.useState(true);
  const [yesterdayOpen, setYesterdayOpen] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");

  // Filter sessions by search query
  const filteredSessions = React.useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  // Group sessions
  const todaySessions = filteredSessions.filter((s) => s.group === "Today");
  const yesterdaySessions = filteredSessions.filter((s) => s.group === "Yesterday");
  const olderSessions = filteredSessions.filter(
    (s) => s.group !== "Today" && s.group !== "Yesterday"
  );

  const startRename = (session: ChatSession) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleRenameSubmit = (id: string) => {
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  if (isCollapsed) {
    return (
      <aside
        className={cn(
          "w-16 border-r border-slate-200/80 bg-white flex flex-col items-center py-4 px-2 shrink-0 select-none transition-all duration-200",
          className
        )}
        aria-label="Collapsed AI Chat Navigation"
      >
        {/* Expand toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer mb-4"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <GIcon name="dock_to_left" size={20} />
        </button>

        {/* New chat icon button */}
        <button
          type="button"
          onClick={onNewChat}
          className="h-10 w-10 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer mb-4"
          title="New Chat"
          aria-label="New Chat"
        >
          <GIcon name="add" size={22} />
        </button>

        {/* Explore icon button */}
        <button
          type="button"
          onClick={onOpenExplore}
          className="h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer mb-2"
          title="Explore Thinkas"
          aria-label="Explore Thinkas"
        >
          <GIcon name="grid_view" size={20} />
        </button>

        {/* Upgrade badge icon at bottom */}
        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={onOpenUpgrade}
            className="h-9 w-9 rounded-xl bg-violet-50 border border-violet-200/80 hover:bg-violet-100 flex items-center justify-center text-violet-700 transition-colors cursor-pointer"
            title="Get Premium Now"
            aria-label="Get Premium Now"
          >
            <GIcon name="workspace_premium" size={18} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "w-64 sm:w-72 border-r border-slate-200/80 bg-white flex flex-col justify-between p-4 shrink-0 select-none transition-all duration-200",
        className
      )}
      aria-label="AI Chat Board Navigation"
    >
      <div className="flex flex-col min-h-0 flex-1">
        {/* 1. Header: Logo, Thinka Title, Collapse & Search Icons */}
        <div className="flex items-center justify-between pb-3.5">
          <div className="flex items-center gap-2">
            {/* Radiant Sunburst Icon matching screenshot */}
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#315BFF] flex items-center justify-center shrink-0 border border-blue-100">
              <ThinkaLogo className="h-5 w-5 text-[#315BFF]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Thinka
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse toggle */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <GIcon name="dock_to_left" size={18} />
            </button>

            {/* Search toggle */}
            <button
              type="button"
              onClick={() => setIsSearching((prev) => !prev)}
              className={cn(
                "h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
                isSearching && "bg-slate-100 text-[#315BFF]"
              )}
              title="Search chats"
              aria-label="Search chats"
            >
              <GIcon name="search" size={18} />
            </button>
          </div>
        </div>

        {/* Optional Search Bar */}
        {isSearching && (
          <div className="mb-3 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
              />
              <GIcon
                name="search"
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <GIcon name="close" size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. + New Chat Primary Action Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full py-2.5 px-4 mb-3 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <GIcon name="add" size={18} weight={600} />
          <span>New Chat</span>
        </button>

        {/* 3. Explore Thinkas Item */}
        <button
          type="button"
          onClick={onOpenExplore}
          className="w-full flex items-center gap-2.5 px-3 py-2 mb-3 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
        >
          <GIcon name="grid_view" size={18} className="text-slate-400" />
          <span>Explore Thinkas</span>
        </button>

        {/* 4. Chat History Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-3">
          {/* Today Group */}
          {todaySessions.length > 0 && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setTodayOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
              >
                <span>Today</span>
                <GIcon
                  name="expand_more"
                  size={16}
                  className={cn(
                    "text-slate-400 transition-transform duration-200",
                    !todayOpen && "-rotate-90"
                  )}
                />
              </button>

              {todayOpen &&
                todaySessions.map((session) => (
                  <ChatHistoryItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeSessionId}
                    isEditing={editingId === session.id}
                    editTitle={editTitle}
                    onSelect={() => onSelectSession(session.id)}
                    onStartRename={() => startRename(session)}
                    onEditChange={setEditTitle}
                    onSaveRename={() => handleRenameSubmit(session.id)}
                    onCancelRename={() => setEditingId(null)}
                    onDelete={() => onDeleteSession(session.id)}
                  />
                ))}
            </div>
          )}

          {/* Yesterday Group */}
          {yesterdaySessions.length > 0 && (
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => setYesterdayOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
              >
                <span>Yesterday</span>
                <GIcon
                  name="expand_more"
                  size={16}
                  className={cn(
                    "text-slate-400 transition-transform duration-200",
                    !yesterdayOpen && "-rotate-90"
                  )}
                />
              </button>

              {yesterdayOpen &&
                yesterdaySessions.map((session) => (
                  <ChatHistoryItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeSessionId}
                    isEditing={editingId === session.id}
                    editTitle={editTitle}
                    onSelect={() => onSelectSession(session.id)}
                    onStartRename={() => startRename(session)}
                    onEditChange={setEditTitle}
                    onSaveRename={() => handleRenameSubmit(session.id)}
                    onCancelRename={() => setEditingId(null)}
                    onDelete={() => onDeleteSession(session.id)}
                  />
                ))}
            </div>
          )}

          {/* Older Sessions Group (if any) */}
          {olderSessions.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Previous 7 Days
              </div>
              {olderSessions.map((session) => (
                <ChatHistoryItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  isEditing={editingId === session.id}
                  editTitle={editTitle}
                  onSelect={() => onSelectSession(session.id)}
                  onStartRename={() => startRename(session)}
                  onEditChange={setEditTitle}
                  onSaveRename={() => handleRenameSubmit(session.id)}
                  onCancelRename={() => setEditingId(null)}
                  onDelete={() => onDeleteSession(session.id)}
                />
              ))}
            </div>
          )}

          {filteredSessions.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-slate-400">
              No chat history found.
            </div>
          )}
        </div>
      </div>

      {/* 5. Bottom Section: Get Premium Now Card */}
      <div className="pt-3 mt-2 border-t border-slate-100 shrink-0">
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2.5">
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Get Premium Now!
            </h4>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              More acces to the best mode
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenUpgrade}
            className="w-full py-2 px-3 rounded-xl bg-[#315BFF] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}

interface ChatHistoryItemProps {
  session: ChatSession;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  onSelect: () => void;
  onStartRename: () => void;
  onEditChange: (val: string) => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
  onDelete: () => void;
}

function ChatHistoryItem({
  session,
  isActive,
  isEditing,
  editTitle,
  onSelect,
  onStartRename,
  onEditChange,
  onSaveRename,
  onCancelRename,
  onDelete,
}: ChatHistoryItemProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-xl">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveRename();
            if (e.key === "Escape") onCancelRename();
          }}
          autoFocus
          className="flex-1 min-w-0 text-xs bg-transparent focus:outline-none text-slate-900"
        />
        <button
          type="button"
          onClick={onSaveRename}
          className="h-6 w-6 text-blue-600 hover:text-blue-800 flex items-center justify-center cursor-pointer"
        >
          <GIcon name="check" size={14} />
        </button>
        <button
          type="button"
          onClick={onCancelRename}
          className="h-6 w-6 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
        >
          <GIcon name="close" size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex items-center justify-between px-3 py-2 text-xs rounded-xl cursor-pointer transition-colors duration-150 select-none",
        isActive
          ? "bg-slate-100 text-slate-900 font-semibold"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
      )}
    >
      <span className="truncate pr-2">{session.title}</span>

      {/* Options Dropdown Menu */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "shrink-0 transition-opacity",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-6 w-6 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              aria-label="Chat options"
            >
              <GIcon name="more_horiz" size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="w-40 rounded-xl p-1 shadow-lg border border-slate-200 bg-white"
          >
            <DropdownMenuItem
              onClick={onStartRename}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:text-blue-600 rounded-lg cursor-pointer"
            >
              <GIcon name="edit" size={14} className="text-slate-400" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem
              onClick={onDelete}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer"
            >
              <GIcon name="delete" size={14} className="text-red-500" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
