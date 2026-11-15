import { ChatSession, AiModelConfig, ExploreAssistant } from "@/types/chat";

export const AI_MODELS: AiModelConfig[] = [
  {
    id: "thinka-2.0-flash",
    name: "Thinka 2.0 Flash",
    shortLabel: "2.0 Flashs",
    version: "v2.0.4",
    badge: "Fastest",
    description: "Ultra-low latency reasoning model optimized for real-time student tasks and dynamic code generation.",
    provider: "DeepMind",
    speed: "Ultra-Fast",
    intelligence: "High",
    contextWindow: "1M tokens",
    isDefault: true,
  },
  {
    id: "fasttask-academic-2.5",
    name: "FastTask Academic 2.5",
    shortLabel: "Academic 2.5",
    version: "v2.5.0",
    badge: "Course Sync",
    description: "Directly synchronized with your university routine, CSE lecture notes, and semester deadlines.",
    provider: "FastTask Core",
    speed: "Ultra-Fast",
    intelligence: "High",
    contextWindow: "500k tokens",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    shortLabel: "2.5 Pro",
    version: "v2.5.1",
    badge: "Reasoning",
    description: "Deep multi-step reasoning, architectural planning, and complex mathematical problem solving.",
    provider: "Google",
    speed: "Fast",
    intelligence: "Reasoning",
    contextWindow: "2M tokens",
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    shortLabel: "Sonnet 3.5",
    version: "v3.5.2",
    badge: "Coding",
    description: "Top-tier coding, nuanced essay writing, and clean structured technical documentation.",
    provider: "Anthropic",
    speed: "Fast",
    intelligence: "Reasoning",
    contextWindow: "200k tokens",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o Omniverse",
    shortLabel: "GPT-4o",
    version: "v4.0.8",
    badge: "Multimodal",
    description: "High-accuracy natural language processing, multimodal document parsing, and project analysis.",
    provider: "OpenAI",
    speed: "Fast",
    intelligence: "Advanced",
    contextWindow: "128k tokens",
  },
];

export const EXPLORE_THINKAS: ExploreAssistant[] = [
  {
    id: "academic-tutor",
    title: "CSE & Engineering Tutor",
    category: "Academic",
    description: "Specialized in Artificial Intelligence, Expert Systems, Database Management, and Algorithm proofs.",
    promptTemplate: "Explain First-Order Logic forward chaining with step-by-step resolution proofs for my upcoming AIES exam.",
    iconName: "school",
    accentColor: "bg-blue-50 text-blue-700 border-blue-200",
    badgeText: "Recommended",
  },
  {
    id: "task-strategist",
    title: "Sprint & Velocity Planner",
    category: "Productivity",
    description: "Analyzes pending deadlines, prioritizes high-impact assignments, and balances study routines.",
    promptTemplate: "Review my pending high-priority tasks and organize a 5-day preparation sprint for midterm week.",
    iconName: "task_alt",
    accentColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badgeText: "Productivity",
  },
  {
    id: "code-architect",
    title: "Full-Stack Code Architect",
    category: "Coding",
    description: "Writes idiomatic Next.js, React 19, TypeScript, and Prisma schemas with production rigor.",
    promptTemplate: "Write a type-safe TypeScript API handler in Next.js App Router for pagination and filtering.",
    iconName: "code",
    accentColor: "bg-teal-50 text-teal-700 border-teal-200",
    badgeText: "Engineering",
  },
  {
    id: "copy-creator",
    title: "Executive Copywriter",
    category: "Writing",
    description: "Drafts publication-ready presentations, pitch decks, capstone executive summaries, and cover letters.",
    promptTemplate: "Draft an engaging project overview and abstract for our FastTask academic web application.",
    iconName: "edit_note",
    accentColor: "bg-purple-50 text-purple-700 border-purple-200",
    badgeText: "Copy & Creative",
  },
  {
    id: "avatar-concept",
    title: "Avatar & UI Designer",
    category: "Creativity",
    description: "Formulates vibrant 3D daylight avatars, design systems, and solid-color UI component specs.",
    promptTemplate: "Generate a modern daylight avatar specification with royal blue and violet accent highlights.",
    iconName: "face",
    accentColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    badgeText: "Visual Design",
  },
  {
    id: "research-analyst",
    title: "Deep Literature Synthesizer",
    category: "Academic",
    description: "Condenses multi-page academic papers, extracts methodology, and compiles citation references.",
    promptTemplate: "Synthesize the core architecture of modern Mixture-of-Experts (MoE) neural networks with citations.",
    iconName: "psychology",
    accentColor: "bg-amber-50 text-amber-700 border-amber-200",
    badgeText: "Research",
  },
];

export const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "chat-today-1",
    title: "Forecast next week's data",
    createdAt: "2026-11-15T18:30:00.000Z",
    updatedAt: "2026-11-15T19:45:00.000Z",
    group: "Today",
    modelId: "thinka-2.0-flash",
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content: "Forecast next week's data on study routine compliance and upcoming task submission load.",
        createdAt: "2026-11-15T18:30:00.000Z",
      },
      {
        id: "msg-1-2",
        role: "assistant",
        content: `### 📊 Next Week's Academic Velocity & Forecast

Based on your current semester schedule (Summer 2026) and active tasks in **FastTask**:

#### 1. Study Routine Compliance
- **Projected Lecture Hours**: **14 Hours** across 5 active days (Sunday – Thursday).
- **Peak Engagement Days**: **Sunday** (*AIES Theory + Lab*) and **Tuesday** (*Software Engineering & Distributed Systems*).
- **Recommended Focus Windows**: 03:00 PM – 06:00 PM on non-lecture intervals.

#### 2. Task Deadlines & Submission Load
| Priority | Task Title | Due Date | Estimated Effort |
| :--- | :--- | :--- | :--- |
| **High** | 0611CSE321 • AIES Problem Set 1 | Nov 18, 2026 | 3.5 hrs |
| **Medium** | Database Normalization Exercise | Nov 20, 2026 | 2.0 hrs |
| **Routine** | Weekly Lab Reflection Report | Nov 22, 2026 | 1.5 hrs |

#### 3. Strategic Recommendations
1. **Front-load Sunday Evening**: Complete the AIES theoretical deduction trees early before Tuesday lab sessions.
2. **Buffer Wednesday Afternoon**: Dedicate 2 uninterrupted Pomodoro blocks to the database schema normalization.`,
        createdAt: "2026-11-15T18:31:15.000Z",
        model: "Thinka 2.0 Flash",
      },
    ],
  },
  {
    id: "chat-today-2",
    title: "Exploring latest user behavior t...",
    createdAt: "2026-11-15T14:15:00.000Z",
    updatedAt: "2026-11-15T14:30:00.000Z",
    group: "Today",
    modelId: "thinka-2.0-flash",
    messages: [
      {
        id: "msg-2-1",
        role: "user",
        content: "Summarize key observations from recent study habits and task completion velocity.",
        createdAt: "2026-11-15T14:15:00.000Z",
      },
      {
        id: "msg-2-2",
        role: "assistant",
        content: `### 🔍 Study Habit Diagnostics & Productivity Velocity

- **Completion Rate**: **92.4%** on high-priority tasks completed within 24 hours of routine schedule slots.
- **Top Focus Tool**: Users utilizing the **Kanban Board** with drag-and-drop state transitions maintain a 38% higher completion rate.
- **Cognitive Peak**: Peak productivity occurs between **09:30 AM and 12:45 PM**, corresponding to morning lecture blocks in Room A/507.`,
        createdAt: "2026-11-15T14:16:00.000Z",
        model: "Thinka 2.0 Flash",
      },
    ],
  },
  {
    id: "chat-today-3",
    title: "Forecast next week's analytics...",
    createdAt: "2026-11-15T10:00:00.000Z",
    updatedAt: "2026-11-15T10:20:00.000Z",
    group: "Today",
    modelId: "thinka-2.0-flash",
    messages: [
      {
        id: "msg-3-1",
        role: "user",
        content: "What are the analytics metrics we should track on the dashboard for semester performance?",
        createdAt: "2026-11-15T10:00:00.000Z",
      },
      {
        id: "msg-3-2",
        role: "assistant",
        content: `### 📈 Essential Performance Metrics for FastTask
1. **Semester GPA Projection**: Real-time weighting based on completed quizzes, assignments, and midterms.
2. **Routine Attendance Ratio**: Tracking lecture attendance across scheduled classroom days.
3. **Active Study Streak**: Daily habit tracker with solid coral and emerald status chips.`,
        createdAt: "2026-11-15T10:01:20.000Z",
        model: "Thinka 2.0 Flash",
      },
    ],
  },
  {
    id: "chat-yesterday-1",
    title: "Reviewed strategic goals from...",
    createdAt: "2026-11-14T16:00:00.000Z",
    updatedAt: "2026-11-14T16:45:00.000Z",
    group: "Yesterday",
    modelId: "thinka-2.0-flash",
    messages: [
      {
        id: "msg-4-1",
        role: "user",
        content: "Review strategic goals from last week's coursework planning session.",
        createdAt: "2026-11-14T16:00:00.000Z",
      },
      {
        id: "msg-4-2",
        role: "assistant",
        content: `### 🎯 Strategic Academic Goals Review
- **Goal 1 (Achieved)**: Finalized all lab report submissions for CSE322.
- **Goal 2 (In Progress)**: Setup automated daily routine reminders for 10:00 AM class blocks.
- **Goal 3 (Next Sprint)**: Deep review of Expert Systems inference engines before the week 8 assessment.`,
        createdAt: "2026-11-14T16:01:40.000Z",
        model: "Thinka 2.0 Flash",
      },
    ],
  },
  {
    id: "chat-yesterday-2",
    title: "Collected insights from compe...",
    createdAt: "2026-11-14T11:20:00.000Z",
    updatedAt: "2026-11-14T12:05:00.000Z",
    group: "Yesterday",
    modelId: "thinka-2.0-flash",
    messages: [
      {
        id: "msg-5-1",
        role: "user",
        content: "Summarize best practices from modern academic productivity platforms.",
        createdAt: "2026-11-14T11:20:00.000Z",
      },
      {
        id: "msg-5-2",
        role: "assistant",
        content: `### 💡 Modern Academic Platform Insights
1. **Clean Daylight Visuals**: Solid primary buttons with crisp borders (\\#315BFF, \\#7C3AED) create high clarity and reduce visual strain during long study sessions.
2. **Instant Link Prefetching**: Eliminating navigation delay keeps students in flow when switching between routine schedules, tasks, and notes.
3. **Integrated Context-Aware AI**: Allowing students to summon assistant guidance directly alongside their syllabus delivers immediate clarity.`,
        createdAt: "2026-11-14T11:21:30.000Z",
        model: "Thinka 2.0 Flash",
      },
    ],
  },
];

const STORAGE_KEY = "fasttask_ai_chat_sessions_v2";
const ACTIVE_CHAT_KEY = "fasttask_ai_active_chat_id_v2";

export function loadChatSessions(): ChatSession[] {
  if (typeof window === "undefined") return INITIAL_CHAT_SESSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHAT_SESSIONS));
      return INITIAL_CHAT_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CHAT_SESSIONS;
  } catch (e) {
    console.warn("Failed to read chat sessions from localStorage:", e);
    return INITIAL_CHAT_SESSIONS;
  }
}

export function saveChatSessions(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.warn("Failed to persist chat sessions to localStorage:", e);
  }
}

export function loadActiveChatId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  } catch {
    return null;
  }
}

export function saveActiveChatId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_CHAT_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CHAT_KEY);
    }
  } catch (e) {
    console.warn("Failed to set active chat id:", e);
  }
}

export async function generateAiReply(
  prompt: string,
  options?: {
    modelName?: string;
    isDeepResearch?: boolean;
    isWebSearch?: boolean;
    attachments?: { name: string; type: string }[];
  }
): Promise<{
  content: string;
  sources?: { title: string; url: string; domain: string }[];
  deepResearchSteps?: { step: string; status: "done" | "in-progress" | "pending"; detail: string }[];
}> {
  // Simulate natural latency (600ms - 1100ms)
  await new Promise((resolve) => setTimeout(resolve, 850));

  const lower = prompt.toLowerCase();
  const model = options?.modelName || "Thinka 2.0 Flash";

  // Deep research mode mock steps
  let deepResearchSteps = undefined;
  if (options?.isDeepResearch) {
    deepResearchSteps = [
      { step: "Query Formulation", status: "done" as const, detail: "Extracted core intent, semantic entities, and domain boundaries." },
      { step: "Source Aggregation", status: "done" as const, detail: "Queried academic databases, syllabus archives, and technical specifications." },
      { step: "Synthesis & Reasoning", status: "done" as const, detail: "Cross-referenced deduction trees, validated formulas, and structured output." },
    ];
  }

  // Web search mock sources
  let sources = undefined;
  if (options?.isWebSearch) {
    sources = [
      { title: "FastTask Academic Routine & Syllabus Specification (2026)", url: "https://fasttask.app/docs/academic", domain: "fasttask.app" },
      { title: "CSE321 Artificial Intelligence & Expert Systems Reference", url: "https://cse.university.edu/courses/cse321", domain: "university.edu" },
      { title: "TypeScript & Next.js Production Architecture Best Practices", url: "https://nextjs.org/docs/app", domain: "nextjs.org" },
    ];
  }

  // 1. Write Copy prompt
  if (lower.includes("write copy") || lower.includes("draft copy") || lower.includes("pitch")) {
    return {
      content: `### ✍️ Executive Product & Project Copy

**Headline**: *Master Your Academic Velocity with Clarity and Purpose.*

**Core Value Proposition**:
FastTask unifies your university lecture schedule, daily routine blocks, and task sprint milestones into a single, high-contrast daylight workspace. Designed specifically for ambitious students, it turns chaotic semester workloads into calm, structured execution.

**Key Highlights**:
- **Smart Routine Synchronization**: Never miss a classroom transition or lab session.
- **Zero-Latency Navigation**: Instant page switches with proactive prefetching and background state cache.
- **Context-Aware AI Guidance**: Deep assistance tuned directly to your syllabus and deadlines.

*Ready to accelerate your academic performance? FastTask Pro gives you unlimited clarity.*`,
      sources,
      deepResearchSteps,
    };
  }

  // 2. Create Avatar prompt
  if (lower.includes("avatar") || lower.includes("profile picture") || lower.includes("create avatar")) {
    return {
      content: `### 🎨 3D Daylight Avatar Specification

Here is the design recipe and styling parameters for a modern, daylight-inspired student avatar:

#### Aesthetic Blueprint
- **Primary Palette**: Crisp Royal Blue (\`#315BFF\`), Violet (\`#7C3AED\`), and warm terracotta skin tones.
- **Lighting Model**: Ambient studio daylight from the top-left (45° angle) with soft fill lighting to eliminate harsh drop shadows.
- **Framing**: Clean circular or squircle container with a solid 2px white outline ring and subtle \`#EEF2F6\` backdrop.

\`\`\`tsx
// Modern Tailwind Avatar Component
export function StudentAvatarBadge({ initials, name }: { initials: string; name: string }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="h-14 w-14 rounded-2xl bg-[#315BFF] text-white font-black text-lg flex items-center justify-center ring-4 ring-white shadow-md">
        <span>{initials}</span>
      </div>
      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" title="Active on Campus" />
    </div>
  );
}
\`\`\`
This matches the daylight contrast standard of the FastTask design system.`,
      sources,
      deepResearchSteps,
    };
  }

  // 3. Image Generation prompt
  if (lower.includes("image") || lower.includes("generate image") || lower.includes("visual")) {
    return {
      content: `### 🪄 Visual Composition & Generative Prompt

**Prompt Blueprint**:
> *"Isometric 3D rendering of an ultra-clean, minimalist student study workspace. A sleek glass desk featuring a glowing laptop showing code and calendar schedules, ceramic coffee mug, and organized physical notes. Palette dominated by vibrant royal blue (#315BFF), electric violet, and daylight whites (#EEF2F6). Soft volumetric morning sunlight, 8k resolution, crisp architectural aesthetic, octane render."*

#### Recommended Aspect Ratios
- **Banner / LMS Header**: \`16:9\` (1920 × 1080)
- **Profile / Avatar**: \`1:1\` (1024 × 1024)
- **Social / Presentation Slide**: \`4:3\` (1600 × 1200)`,
      sources,
      deepResearchSteps,
    };
  }

  // 4. Write Code prompt
  if (lower.includes("write code") || lower.includes("code") || lower.includes("typescript") || lower.includes("component")) {
    return {
      content: `### 💻 Production TypeScript Component

Here is a clean, accessible Next.js 16 component adhering strictly to solid colors and type safety:

\`\`\`tsx
import * as React from "react";

export interface StatChipProps {
  label: string;
  count: number;
  variant?: "blue" | "emerald" | "amber" | "violet";
}

const COLOR_VARIANTS = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", dot: "bg-amber-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-600" },
};

export function StatChip({ label, count, variant = "blue" }: StatChipProps) {
  const styles = COLOR_VARIANTS[variant];

  return (
    <div className={\`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border \${styles.bg} \${styles.text} \${styles.border} text-xs font-semibold\`}>
      <span className={\`h-2 w-2 rounded-full \${styles.dot}\`} aria-hidden="true" />
      <span>{label}</span>
      <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded text-[11px] border border-slate-200/50">
        {count}
      </span>
    </div>
  );
}
\`\`\`

#### Key Highlights
1. **Zero Gradients**: Strictly leverages solid color tokens.
2. **Type Safety**: Full TypeScript interfaces with variant keys.
3. **High Contrast**: Compliant with WCAG AAA daylight legibility standards.`,
      sources,
      deepResearchSteps,
    };
  }

  // 5. Academic Routine / FastTask query
  if (lower.includes("routine") || lower.includes("schedule") || lower.includes("class") || lower.includes("cse")) {
    return {
      content: `### 📅 Routine Schedule & Coursework Synthesis

Reviewing your active semester profile in **FastTask**:

- **Current Semester**: Summer 2026 • 6th Semester CSE
- **Primary Coursework**:
  - \`0611CSE321\`: **Artificial Intelligence & Expert Systems (Theory)** • Room A/507
  - \`0611CSE322\`: **Artificial Intelligence & Expert Systems (Lab)** • Room A/502
  - \`0611CSE323\`: **Software Engineering & Project Management** • Room B/301

**Upcoming Milestone**:
AIES Assignment Problem Set 1 is due in **3 days**. Would you like me to generate a step-by-step breakdown of the forward-chaining deduction trace for Dr. Sahedul's problem set?`,
      sources,
      deepResearchSteps,
    };
  }

  // Default contextual response
  return {
    content: `### 💡 ${model} Assistance

I've analyzed your request: **"${prompt.trim()}"**.

Here is what you need to know:
1. **Execution Roadmap**: I can assist in generating code, breaking down semester assignments, drafting project documentation, or synthesizing research.
2. **Context Synchronization**: FastTask's task board, calendar schedules, and routine data are readily accessible.
3. **Next Steps**: You can attach documents using the **+** tool below, enable **Search** for web citations, or toggle **Deep Research** for comprehensive multi-phase analysis.

Let me know how you'd like to proceed!`,
    sources,
    deepResearchSteps,
  };
}
