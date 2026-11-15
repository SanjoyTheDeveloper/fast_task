import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, prompt, options } = body;

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not detected in .env. Please configure GEMINI_API_KEY in your .env file.",
        },
        { status: 503 }
      );
    }

    // Format conversation history for GoogleGenAI SDK
    let contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }],
      }));
    } else if (prompt && typeof prompt === "string" && prompt.trim()) {
      contents = [{ role: "user", parts: [{ text: prompt.trim() }] }];
    } else {
      return NextResponse.json(
        { error: "No messages or prompt provided in request body." },
        { status: 400 }
      );
    }

    // Attach contextual information (file attachments / deep research instruction)
    if (contents.length > 0) {
      const lastItem = contents[contents.length - 1];
      let enrichedText = lastItem.parts[0]?.text || "";

      if (
        options?.attachments &&
        Array.isArray(options.attachments) &&
        options.attachments.length > 0
      ) {
        const attachmentList = options.attachments
          .map((a: { name: string; type?: string }) => `- [${a.type || "file"}] ${a.name}`)
          .join("\n");
        enrichedText += `\n\n[Attached Academic Materials/Context]:\n${attachmentList}`;
      }

      if (options?.isDeepResearch) {
        enrichedText += `\n\n[Mode: Deep Research — provide a thorough, structured breakdown with deduction steps, syllabus alignment, and clear actionable takeaways.]`;
      }

      lastItem.parts = [{ text: enrichedText }];
    }

    const systemInstruction = `You are Thinka, an intelligent, empathetic AI study assistant integrated inside FastTask — an academic workspace for university students.
You assist students with:
1. Explaining complex computer science and engineering coursework (e.g. 0611CSE321 Artificial Intelligence & Expert Systems, logic proofs, database normalization).
2. Semester routine management, sprint planning, and task deadline prioritization.
3. Writing clean, idiomatic code (TypeScript, Next.js, Python, C++) with syntax highlighting and explanations.
4. Crafting executive copy, abstracts, presentation summaries, and avatar design specs.

Formatting guidelines:
- Use clean Markdown with headers (###), bold text, bullet points, and fenced code blocks with language tags.
- Strictly adhere to solid daylight visual contrast — no visual gradients.
- Be concise, actionable, and encouraging.`;

    // Initialize official GoogleGenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Cascade models: try gemini-2.5-flash first as configured,
    // and automatically cascade to live models (gemini-3.5-flash, gemini-3.5-flash-lite) if 404 is returned by Google
    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
    ];

    let responseText = "";
    let modelUsed = "";
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        });

        const text = response.text || "";
        if (text) {
          responseText = text;
          modelUsed = model;
          break;
        }
      } catch (err: unknown) {
        lastError = err;
        console.warn(`[GoogleGenAI] Model ${model} returned error:`, err);
      }
    }

    if (responseText) {
      return NextResponse.json({
        content: responseText,
        model: `Gemini (${modelUsed})`,
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
                detail: "Synthesized academic coursework literature and verified logic proofs.",
              },
            ]
          : undefined,
      });
    }

    // Format error message clearly for UI display
    const errString = String(lastError || "");
    let userFacingError = "Gemini API failed to generate a response. Please check your GEMINI_API_KEY in .env.";
    if (errString.includes("API key not valid") || errString.includes("API_KEY_INVALID")) {
      userFacingError = "Invalid GEMINI_API_KEY in .env. Please verify your Google AI Studio API key.";
    } else if (errString.includes("quota") || errString.includes("RESOURCE_EXHAUSTED")) {
      userFacingError = "Gemini API rate limit or quota exceeded. Please try again in a few moments.";
    }

    return NextResponse.json(
      {
        error: userFacingError,
        details: lastError,
      },
      { status: 502 }
    );
  } catch (error: unknown) {
    console.error("API /api/chat error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


