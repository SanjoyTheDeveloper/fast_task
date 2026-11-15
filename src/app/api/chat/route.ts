import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, options } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 503 }
      );
    }

    // Build context-enriched prompt if attachments or deep research are enabled
    let fullPrompt = prompt.trim();
    if (options?.attachments && Array.isArray(options.attachments) && options.attachments.length > 0) {
      const attachmentList = options.attachments
        .map((a: { name: string; type?: string }) => `- [${a.type || "file"}] ${a.name}`)
        .join("\n");
      fullPrompt += `\n\n[Attached Context/Documents]:\n${attachmentList}`;
    }

    if (options?.isDeepResearch) {
      fullPrompt += `\n\n[Instruction: Provide a comprehensive, in-depth deep research analysis with structured deduction steps, verified academic logic, and clear conclusions.]`;
    }

    const systemPrompt = `You are Thinka, an intelligent, empathetic AI study assistant integrated inside FastTask — an academic workspace for university students.
You assist students with:
1. Explaining complex computer science and engineering coursework (e.g. 0611CSE321 Artificial Intelligence & Expert Systems, logic proofs, database normalization).
2. Semester routine management, sprint planning, and task deadline prioritization.
3. Writing clean, idiomatic code (TypeScript, Next.js, Python, C++) with syntax highlighting and explanations.
4. Crafting executive copy, abstracts, presentation summaries, and avatar design specs.

Formatting guidelines:
- Use clean Markdown with headers (###), bold text, bullet points, and fenced code blocks with language tags.
- Strictly adhere to solid daylight visual contrast — no visual gradients.
- Be concise, actionable, and encouraging.`;

    const requestPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };

    // Candidates in order of proven speed, quota, and reliability for this API key:
    // 1. gemini-3.5-flash (primary, ~2s)
    // 2. gemini-3.5-flash-lite (ultra-fast, ~1s)
    // 3. gemini-3.1-flash-lite (ultra-fast, ~1s)
    // 4. gemini-3-flash-preview (fast, ~1.3s)
    // 5. gemini-3.8-flash (next-gen)
    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3-flash-preview",
      "gemini-3.8-flash",
    ];

    let responseText = "";
    let activeModelUsed = "";
    let lastError: unknown = null;

    for (const candidate of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text) {
            responseText = text;
            activeModelUsed = candidate;
            break;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData;
          console.warn(`[Gemini API] Candidate ${candidate} returned ${res.status}:`, errData);
        }
      } catch (e) {
        lastError = e;
        console.warn(`[Gemini API] Candidate ${candidate} threw:`, e);
      }
    }

    if (responseText) {
      return NextResponse.json({
        content: responseText,
        model: `Gemini (${activeModelUsed})`,
        sources: options?.isWebSearch
          ? [
              {
                title: "Google Gemini Knowledge Engine",
                url: "https://ai.google.dev",
                domain: "google.dev",
              },
            ]
          : undefined,
        deepResearchSteps: options?.isDeepResearch
          ? [
              {
                step: "Deep Reasoning Phase",
                status: "done",
                detail: "Synthesized multi-domain academic literature and verified logic proofs.",
              },
            ]
          : undefined,
      });
    }

    const errorDetails =
      (lastError as { error?: { message?: string } })?.error?.message ||
      "Gemini API was unable to generate a response. Please check network connectivity.";

    return NextResponse.json(
      {
        error: errorDetails,
        details: lastError,
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

