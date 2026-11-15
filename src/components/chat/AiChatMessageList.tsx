"use client";

import * as React from "react";
import { GIcon } from "@/components/ui/GIcon";
import { ThinkaLogo } from "./ThinkaLogo";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface AiChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onRegenerateLast?: () => void;
  className?: string;
}

export function AiChatMessageList({
  messages,
  isLoading = false,
  onRegenerateLast,
  className = "",
}: AiChatMessageListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const copyToClipboard = (text: string, label = "Response copied!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  return (
    <div className={`w-full max-w-3xl lg:max-w-4xl mx-auto px-4 py-6 space-y-6 ${className}`}>
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        const isLast = index === messages.length - 1;

        if (isUser) {
          return (
            <div key={message.id} className="flex justify-end select-text">
              <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl bg-slate-100 border border-slate-200/80 px-4 py-3 text-slate-900 text-sm font-medium shadow-2xs space-y-2">
                {/* Attachments if any */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {message.attachments.map((att) => (
                      <span
                        key={att.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700"
                      >
                        <GIcon name="attachment" size={12} className="text-blue-500" />
                        <span>{att.name}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tags for search / deep research */}
                {(message.isDeepResearch || message.isWebSearch) && (
                  <div className="flex items-center gap-1.5 pb-1">
                    {message.isDeepResearch && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[10px] font-black uppercase">
                        <GIcon name="psychology" size={12} />
                        Deep Research
                      </span>
                    )}
                    {message.isWebSearch && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                        <GIcon name="public" size={12} />
                        Web Search
                      </span>
                    )}
                  </div>
                )}

                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          );
        }

        // Assistant Message
        return (
          <div key={message.id} className="flex items-start gap-3 select-text group">
            {/* Thinka Sunburst Avatar */}
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#315BFF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <ThinkaLogo className="h-4 w-4 text-[#315BFF]" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              {/* Header: Model badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {message.model || "Thinka 2.0 Flash"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Deep research steps expandable */}
              {message.deepResearchSteps && message.deepResearchSteps.length > 0 && (
                <div className="rounded-2xl bg-violet-50/70 border border-violet-200/80 p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-violet-900">
                    <GIcon name="psychology" size={16} className="text-violet-600" />
                    <span>Deep Research Analysis ({message.deepResearchSteps.length} phases completed)</span>
                  </div>
                  <div className="space-y-1.5 pl-6 border-l-2 border-violet-200">
                    {message.deepResearchSteps.map((s, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-semibold text-violet-800">
                          <GIcon name="check_circle" size={13} className="text-emerald-600" />
                          <span>{s.step}</span>
                        </div>
                        <p className="text-[11px] text-violet-700/80">{s.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Web search sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Sources:</span>
                  {message.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    >
                      <GIcon name="link" size={12} />
                      <span className="truncate max-w-[150px]">{src.title}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Formatted Markdown Content */}
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-2">
                <RenderMarkdown content={message.content} onCopy={copyToClipboard} />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-1 pt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => copyToClipboard(message.content)}
                  className="h-7 px-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy response"
                >
                  <GIcon name="content_copy" size={14} />
                  <span className="text-[11px]">Copy</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.success("Feedback submitted! Thanks for helping Thinka learn.")}
                  className="h-7 w-7 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Good response"
                >
                  <GIcon name="thumb_up" size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => toast.info("Feedback noted. We will adjust the response model.")}
                  className="h-7 w-7 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Poor response"
                >
                  <GIcon name="thumb_down" size={14} />
                </button>

                {isLast && onRegenerateLast && (
                  <button
                    type="button"
                    onClick={onRegenerateLast}
                    className="h-7 px-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Regenerate response"
                  >
                    <GIcon name="refresh" size={14} />
                    <span className="text-[11px]">Retry</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex items-start gap-3 select-none animate-in fade-in duration-200">
          <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#315BFF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <ThinkaLogo className="h-4 w-4 text-[#315BFF] animate-spin" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Gemini Live AI</span>
              <span className="text-[10px] text-blue-600 font-semibold animate-pulse">
                Reasoning...
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-2xl">
              <span className="h-2 w-2 rounded-full bg-[#315BFF] animate-ping" />
              <span>Analyzing syllabus context and synthesizing response...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function RenderMarkdown({
  content,
  onCopy,
}: {
  content: string;
  onCopy: (text: string, label?: string) => void;
}) {
  // Simple custom parser for code blocks, headers, bullet points, and tables
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Code block
          const lines = part.slice(3, -3).trim().split("\n");
          const language = lines[0].trim() || "typescript";
          const code = lines.slice(1).join("\n");

          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/90 bg-slate-900 text-slate-100 overflow-hidden shadow-sm my-3 select-text"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700 text-xs font-mono text-slate-300">
                <span>{language}</span>
                <button
                  type="button"
                  onClick={() => onCopy(code, "Code copied to clipboard!")}
                  className="hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <GIcon name="content_copy" size={13} />
                  <span>Copy code</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Regular prose & headings
        return (
          <div key={index} className="space-y-2">
            {part.split("\n\n").map((paragraph, pIdx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={pIdx} className="text-base font-bold text-slate-900 mt-3 mb-1">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("#### ")) {
                return (
                  <h4 key={pIdx} className="text-sm font-bold text-slate-800 mt-2 mb-1">
                    {trimmed.replace("#### ", "")}
                  </h4>
                );
              }

              // Check for table
              if (trimmed.includes("|") && trimmed.includes("\n|")) {
                const rows = trimmed.split("\n").filter((r) => r.trim().startsWith("|"));
                if (rows.length >= 2) {
                  return (
                    <div key={pIdx} className="overflow-x-auto my-2 rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-xs text-left">
                        <tbody>
                          {rows.map((row, rIdx) => {
                            if (row.includes("---")) return null;
                            const cells = row.split("|").filter((c, i, a) => i > 0 && i < a.length - 1);
                            const isHeader = rIdx === 0;
                            return (
                              <tr
                                key={rIdx}
                                className={cn(
                                  "border-b border-slate-100 last:border-0",
                                  isHeader ? "bg-slate-50 font-bold text-slate-900" : "text-slate-700"
                                )}
                              >
                                {cells.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-3 py-2">
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              // Bullet points
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const items = trimmed.split("\n");
                return (
                  <ul key={pIdx} className="list-disc pl-5 space-y-1 text-slate-700">
                    {items.map((it, iIdx) => (
                      <li key={iIdx}>
                        {it.replace(/^[-*]\s+/, "")}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={pIdx} className="text-slate-700 text-sm leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
