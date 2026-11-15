"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import { ChatAttachment } from "@/types/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface AiChatInputProps {
  onSendMessage: (
    content: string,
    options?: {
      isDeepResearch?: boolean;
      isWebSearch?: boolean;
      attachments?: ChatAttachment[];
    }
  ) => void;
  isLoading?: boolean;
  prefillValue?: string;
  onClearPrefill?: () => void;
  className?: string;
}

export function AiChatInput({
  onSendMessage,
  isLoading = false,
  prefillValue = "",
  onClearPrefill,
  className = "",
}: AiChatInputProps) {
  const [input, setInput] = React.useState("");
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const [isDeepResearchActive, setIsDeepResearchActive] = React.useState(false);
  const [attachments, setAttachments] = React.useState<ChatAttachment[]>([]);
  const [isListening, setIsListening] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Sync prefill from quick suggestion chips
  React.useEffect(() => {
    if (prefillValue) {
      setInput(prefillValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          160
        )}px`;
      }
      onClearPrefill?.();
    }
  }, [prefillValue, onClearPrefill]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
  };

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;
    if (isLoading) return;

    onSendMessage(input.trim(), {
      isDeepResearch: isDeepResearchActive,
      isWebSearch: isSearchActive,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    setInput("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addPresetAttachment = (type: "routine" | "task" | "syllabus" | "document") => {
    const presets: Record<string, ChatAttachment> = {
      routine: {
        id: `att-${Date.now()}-routine`,
        name: "Semester Routine (Summer 2026)",
        type: "routine",
        size: "3 active courses",
      },
      task: {
        id: `att-${Date.now()}-task`,
        name: "Pending Tasks & Deadlines",
        type: "task",
        size: "4 items",
      },
      syllabus: {
        id: `att-${Date.now()}-syllabus`,
        name: "0611CSE321 Syllabus & Notes",
        type: "syllabus",
        size: "1.4 MB",
      },
      document: {
        id: `att-${Date.now()}-doc`,
        name: "Uploaded Problem Set 1.pdf",
        type: "document",
        size: "240 KB",
      },
    };

    const newAtt = presets[type];
    if (newAtt && !attachments.some((a) => a.type === type)) {
      setAttachments((prev) => [...prev, newAtt]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Toggle voice dictation simulation
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate voice capture
      setTimeout(() => {
        setInput((prev) =>
          prev
            ? `${prev} Summarize today's lecture schedule and recommend study blocks.`
            : "Summarize today's lecture schedule and recommend study blocks."
        );
        setIsListening(false);
      }, 2200);
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <div className={`w-full max-w-3xl lg:max-w-4xl mx-auto px-4 select-none ${className}`}>
      {/* Floating Rounded Input Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-3 sm:p-4 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
        {/* Attachment chips row if any attachments exist */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 mb-2">
            {attachments.map((att) => (
              <span
                key={att.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700"
              >
                <GIcon name="attachment" size={14} className="text-blue-500" />
                <span className="truncate max-w-[180px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                  aria-label="Remove attachment"
                >
                  <GIcon name="close" size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Text Input matching 'Ask me anything...' */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... Speak now..." : "Ask me anything..."}
          rows={1}
          className="w-full resize-none text-sm text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none min-h-[28px] max-h-[160px] py-1"
        />

        {/* Bottom Toolbar row matching screenshot */}
        <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-100/80">
          {/* Left tools: +, Search pill, Deep Research pill, ... */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pr-1">
            {/* + Add Attachment Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-8 w-8 rounded-full border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                  title="Add context or attach files"
                  aria-label="Add context"
                >
                  <GIcon name="add" size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-60 rounded-2xl p-1.5 shadow-xl border border-slate-200 bg-white"
              >
                <DropdownMenuLabel className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Attach FastTask Context
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem
                  onClick={() => addPresetAttachment("routine")}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl cursor-pointer"
                >
                  <GIcon name="schedule" size={16} className="text-indigo-600" />
                  <span>Semester Routine</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => addPresetAttachment("task")}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl cursor-pointer"
                >
                  <GIcon name="task_alt" size={16} className="text-emerald-600" />
                  <span>Pending Tasks &amp; Deadlines</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => addPresetAttachment("syllabus")}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl cursor-pointer"
                >
                  <GIcon name="school" size={16} className="text-cyan-600" />
                  <span>Course Syllabus (AIES)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => addPresetAttachment("document")}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl cursor-pointer"
                >
                  <GIcon name="upload_file" size={16} className="text-slate-500" />
                  <span>Upload Local PDF/File</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Pill matching screenshot */}
            <button
              type="button"
              onClick={() => setIsSearchActive((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer shrink-0",
                isSearchActive
                  ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                  : "bg-white text-slate-700 hover:text-slate-900 border-slate-200/90 hover:bg-slate-50"
              )}
            >
              <GIcon
                name="public"
                size={15}
                className={isSearchActive ? "text-blue-600" : "text-slate-500"}
              />
              <span>Search</span>
            </button>

            {/* Deep Research Pill matching screenshot */}
            <button
              type="button"
              onClick={() => setIsDeepResearchActive((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer shrink-0",
                isDeepResearchActive
                  ? "bg-violet-50 text-violet-700 border-violet-300 font-semibold"
                  : "bg-white text-slate-700 hover:text-slate-900 border-slate-200/90 hover:bg-slate-50"
              )}
            >
              <GIcon
                name="psychology"
                size={15}
                className={isDeepResearchActive ? "text-violet-600" : "text-slate-500"}
              />
              <span>Deep Research</span>
            </button>

            {/* More Tools ... */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-8 w-8 rounded-full border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                  aria-label="More tools"
                >
                  <GIcon name="more_horiz" size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-52 rounded-2xl p-1.5 shadow-xl border border-slate-200 bg-white"
              >
                <DropdownMenuItem
                  onClick={() => setIsSearchActive(true)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 rounded-xl cursor-pointer"
                >
                  <GIcon name="language" size={15} className="text-slate-400" />
                  <span>Ground with Web Knowledge</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeepResearchActive(true)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 rounded-xl cursor-pointer"
                >
                  <GIcon name="auto_awesome" size={15} className="text-amber-500" />
                  <span>Multi-Step Synthesis</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right cluster: Microphone icon & Solid Blue Circle Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                isListening
                  ? "bg-red-50 text-red-600 animate-pulse border border-red-200"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              )}
              title={isListening ? "Listening... click to stop" : "Voice input"}
              aria-label="Voice input"
            >
              <GIcon name="mic" size={18} />
            </button>

            {/* Solid Royal Blue Circle Button matching screenshot */}
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || (!hasText && attachments.length === 0)}
              className={cn(
                "h-9 w-9 rounded-full bg-[#315BFF] hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              title={hasText ? "Send Message" : "Voice Mode / Submit"}
              aria-label="Submit"
            >
              {isLoading ? (
                <GIcon name="progress_activity" size={18} className="animate-spin text-white" />
              ) : hasText ? (
                <GIcon name="arrow_upward" size={18} weight={600} className="text-white" />
              ) : (
                /* Waveform icon matching screenshot */
                <GIcon name="graphic_eq" size={18} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
