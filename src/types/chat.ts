export interface ChatAttachment {
  id: string;
  name: string;
  type: "document" | "routine" | "task" | "syllabus" | "image";
  size?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  model?: string;
  attachments?: ChatAttachment[];
  isDeepResearch?: boolean;
  isWebSearch?: boolean;
  deepResearchSteps?: {
    step: string;
    status: "done" | "in-progress" | "pending";
    detail: string;
  }[];
  sources?: {
    title: string;
    url: string;
    domain: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  group: "Today" | "Yesterday" | "Previous 7 Days" | "Older";
  messages: ChatMessage[];
  pinned?: boolean;
  modelId?: string;
}

export interface AiModelConfig {
  id: string;
  name: string;
  shortLabel: string;
  version: string;
  badge?: string;
  description: string;
  provider: string;
  speed: "Ultra-Fast" | "Fast" | "Standard";
  intelligence: "High" | "Advanced" | "Reasoning";
  contextWindow: string;
  isDefault?: boolean;
}

export interface ExploreAssistant {
  id: string;
  title: string;
  category: "Writing" | "Academic" | "Coding" | "Creativity" | "Productivity";
  description: string;
  promptTemplate: string;
  iconName: string;
  accentColor: string;
  badgeText: string;
}
