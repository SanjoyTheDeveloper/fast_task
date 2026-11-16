"use client";

import * as React from "react";
import { AiChatSidebar } from "./AiChatSidebar";
import { AiChatHeader } from "./AiChatHeader";
import { AiPromptSuggestions } from "./AiPromptSuggestions";
import { AiChatInput } from "./AiChatInput";
import { AiChatMessageList } from "./AiChatMessageList";
import { ExploreThinkasModal } from "./ExploreThinkasModal";
import { UpgradeModal } from "./UpgradeModal";
import { ThinkaLogo } from "./ThinkaLogo";
import {
  ChatSession,
  ChatMessage,
  ChatAttachment,
  ExploreAssistant,
} from "@/types/chat";
import {
  loadChatSessions,
  saveChatSessions,
  loadActiveChatId,
  saveActiveChatId,
  generateAiReply,
  AI_MODELS,
} from "@/lib/chatStorage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface AiChatBoardProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  className?: string;
}

export function AiChatBoard({ user, className = "" }: AiChatBoardProps) {
  const [sessions, setSessions] = React.useState<ChatSession[]>(() => {
    if (typeof window === "undefined") return [];
    return loadChatSessions();
  });
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const loaded = loadChatSessions();
    const activeId = loadActiveChatId();
    if (activeId && loaded.some((s) => s.id === activeId)) {
      return activeId;
    }
    return loaded[0]?.id || null;
  });
  const [currentModelId, setCurrentModelId] = React.useState<string>("thinka-2.0-flash");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState<boolean>(false);
  const [isExploreOpen, setIsExploreOpen] = React.useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = React.useState<boolean>(false);
  const [prefillPrompt, setPrefillPrompt] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Sync to storage
  const updateSessions = React.useCallback(
    (newSessions: ChatSession[]) => {
      setSessions(newSessions);
      saveChatSessions(newSessions);
    },
    []
  );

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    saveActiveChatId(id);
    setIsMobileSidebarOpen(false);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    saveActiveChatId(null);
    setIsMobileSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    updateSessions(updated);
    if (activeSessionId === id) {
      const nextId = updated[0]?.id || null;
      setActiveSessionId(nextId);
      saveActiveChatId(nextId);
    }
    toast.success("Chat deleted");
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, title: newTitle, updatedAt: new Date().toISOString() } : s
    );
    updateSessions(updated);
    toast.success("Chat renamed");
  };

  // Active Session object
  const activeSession = React.useMemo(() => {
    if (!activeSessionId) return null;
    return sessions.find((s) => s.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  // Send message handler
  const handleSendMessage = async (
    content: string,
    options?: {
      isDeepResearch?: boolean;
      isWebSearch?: boolean;
      attachments?: ChatAttachment[];
    }
  ) => {
    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content,
      createdAt: now,
      attachments: options?.attachments,
      isDeepResearch: options?.isDeepResearch,
      isWebSearch: options?.isWebSearch,
    };

    let targetSessionId = activeSessionId;
    let targetSessions = [...sessions];
    const targetSession = targetSessionId
      ? targetSessions.find((s) => s.id === targetSessionId)
      : null;

    // If starting a brand new conversation
    if (!targetSessionId || !targetSession) {
      // Generate concise title from first sentence
      const rawTitle = content.split("\n")[0].slice(0, 32);
      const title = rawTitle.length >= 32 ? `${rawTitle}...` : rawTitle;

      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        title: title || "New Conversation",
        createdAt: now,
        updatedAt: now,
        group: "Today",
        modelId: currentModelId,
        messages: [userMessage],
      };

      targetSessionId = newSession.id;
      targetSessions = [newSession, ...targetSessions];
      setActiveSessionId(targetSessionId);
      saveActiveChatId(targetSessionId);
      updateSessions(targetSessions);
    } else {
      // Append user message to active session
      targetSessions = targetSessions.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            updatedAt: now,
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      });
      updateSessions(targetSessions);
    }

    setIsLoading(true);

    try {
      const selectedModel =
        AI_MODELS.find((m) => m.id === currentModelId)?.name || "Gemini 2.5 Flash";

      const conversationHistory = (
        targetSession ? [...targetSession.messages, userMessage] : [userMessage]
      ).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiReply = await generateAiReply(conversationHistory, {
        modelName: selectedModel,
        isDeepResearch: options?.isDeepResearch,
        isWebSearch: options?.isWebSearch,
        attachments: options?.attachments,
      });

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: aiReply.content,
        createdAt: new Date().toISOString(),
        model: aiReply.model || selectedModel,
        sources: aiReply.sources,
        deepResearchSteps: aiReply.deepResearchSteps,
      };

      const finalSessions = targetSessions.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, assistantMessage],
          };
        }
        return s;
      });

      updateSessions(finalSessions);
    } catch (err) {
      console.error("AI Generation error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to generate AI reply. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setPrefillPrompt(promptText);
  };

  const handleSelectAssistant = (assistant: ExploreAssistant) => {
    setPrefillPrompt(assistant.promptTemplate);
  };

  const handleClearChat = () => {
    if (!activeSessionId) return;
    const updated = sessions.map((s) =>
      s.id === activeSessionId ? { ...s, messages: [] } : s
    );
    updateSessions(updated);
    toast.info("Conversation cleared");
  };

  const handleExportChat = () => {
    if (!activeSession || activeSession.messages.length === 0) {
      toast.info("No messages to export");
      return;
    }

    const transcript = [
      `# ${activeSession.title}`,
      `Date: ${new Date(activeSession.createdAt).toLocaleDateString()}`,
      `Model: ${activeSession.modelId || "thinka-2.0-flash"}`,
      "",
      ...activeSession.messages.map(
        (m) =>
          `### [${m.role.toUpperCase()}] (${new Date(m.createdAt).toLocaleTimeString()}):\n${m.content}\n`
      ),
    ].join("\n\n");

    const blob = new Blob([transcript], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeSession.title.replace(/[^a-z0-9]/gi, "_")}_transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript exported to Markdown");
  };

  const handleShareChat = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/ai-chat?session=${activeSessionId || "share"}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Shareable conversation link copied to clipboard!");
    }
  };

  const handleRegenerateLast = () => {
    if (!activeSession || activeSession.messages.length < 2) return;
    const lastUserMessage = [...activeSession.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, {
        isDeepResearch: lastUserMessage.isDeepResearch,
        isWebSearch: lastUserMessage.isWebSearch,
        attachments: lastUserMessage.attachments,
      });
    }
  };

  const messages = activeSession ? activeSession.messages : [];
  const showHeroState = messages.length === 0;

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#315BFF] flex items-center justify-center">
            <ThinkaLogo className="h-5 w-5 text-[#315BFF] animate-spin" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Loading Thinka AI Board...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full h-[calc(100vh-3.5rem)] md:h-screen bg-white overflow-hidden relative",
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. Left Dedicated AI Sub-Sidebar (Desktop & Tablet)          */}
      {/* ============================================================ */}
      <div className="hidden md:flex h-full shrink-0">
        <AiChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
          onOpenExplore={() => setIsExploreOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. Mobile AI Sub-Sidebar Drawer (Overlay on small screens)   */}
      {/* ============================================================ */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden animate-in fade-in duration-150"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-200 md:hidden flex flex-col",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AiChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
          onOpenExplore={() => {
            setIsMobileSidebarOpen(false);
            setIsExploreOpen(true);
          }}
          isCollapsed={false}
          onToggleCollapse={() => setIsMobileSidebarOpen(false)}
          className="w-full h-full border-r-0"
        />
      </div>

      {/* ============================================================ */}
      {/* 3. Main Chat Area (Canvas)                                   */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-white relative">
        {/* Top Header Bar */}
        <AiChatHeader
          currentModelId={currentModelId}
          onSelectModel={setCurrentModelId}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          onShareChat={handleShareChat}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          userName={user?.name || "Sanjoy Chandro Bhowmick"}
          userImage={user?.image}
        />

        {/* Scrollable Chat Viewport / Hero Center */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          {showHeroState ? (
            <div className="my-auto">
              <AiPromptSuggestions onSelectPrompt={handleSelectPrompt} />
            </div>
          ) : (
            <div className="flex-1">
              <AiChatMessageList
                messages={messages}
                isLoading={isLoading}
                onRegenerateLast={handleRegenerateLast}
              />
            </div>
          )}

          {/* Floating Bottom Prompt Box matching screenshot */}
          <div className="sticky bottom-0 pb-4 pt-2 bg-white/90 backdrop-blur-xs z-10">
            <AiChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              prefillValue={prefillPrompt}
              onClearPrefill={() => setPrefillPrompt("")}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. Modals: Explore Thinkas & Upgrade                         */}
      {/* ============================================================ */}
      <ExploreThinkasModal
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        onSelectAssistant={handleSelectAssistant}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
