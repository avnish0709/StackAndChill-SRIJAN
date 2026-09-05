import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function handleChatRequest(req: Request, res: Response) {
  try {
    const { conversationId, message, jurisdiction, file } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message string is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const currentId = conversationId || `conv_${nanoid(10)}`;

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-2.5-pro",
      "gemini-flash-latest",
      "gemini-pro-latest",
    ];

    const systemInstruction = `You are ClauseIQ, an evidence-first legal assistance engine.
Analyze the user's legal situation for the jurisdiction: "${jurisdiction || "General Legal / Unspecified"}".

Return a valid JSON object strictly matching this schema:
{
  "confidenceScore": 85,
  "message": "Clear, concise legal advice and practical next steps for the user.",
  "options": [
    "Next Step Option 1",
    "Next Step Option 2",
    "Next Step Option 3"
  ],
  "summary": "Short 1-sentence summary of the legal issue",
  "evidence": [
    {
      "title": "Evidence / Clause / Law Title",
      "detail": "Reference section or observation detail",
      "status": "Supported"
    },
    {
      "title": "Evidence / Requirement",
      "detail": "Detail about missing or partial evidence",
      "status": "Partly supported"
    },
    {
      "title": "Local Law / Mandate",
      "detail": "Status detail",
      "status": "Insufficient"
    }
  ]
}

Rules:
1. "confidenceScore" MUST be an integer percentage from 0 to 100 reflecting your certainty based on available contract facts, legal statutes, and jurisdiction.
2. If you DO NOT know the answer, lack facts, or the query is ambiguous/unclear, assign a low confidenceScore (< 50 or 0) and state professionally in "message": "I do not have sufficient legal or factual information to provide a definitive answer. Please upload your lease document or specify the relevant facts."
3. "options" must contain 3-4 distinct, actionable choices for the user's next response or action.
4. "status" in "evidence" MUST be Bootstrapped as exactly one of: "Supported", "Partly supported", "Insufficient".
5. Output raw JSON only. Do not include markdown code block formatting like \`\`\`json.`;

    const userPrompt = `User Message: ${message.trim()}
Jurisdiction: ${jurisdiction || "Not specified"}`;

    const userParts: any[] = [];

    if (file && file.data && file.mimeType) {
      const base64Data = file.data.replace(/^data:[^;]+;base64,/, "");
      userParts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: base64Data,
        },
      });
    }

    const fileNotice = file
      ? `\n\nATTACHED DOCUMENT: "${file.name}" (MIME: ${file.mimeType}). Read and extract specific contract clauses, page/section references, and exact details directly from this document.`
      : "";

    userParts.push({
      text: `${systemInstruction}${fileNotice}\n\n${userPrompt}`,
    });

    const geminiPayload = {
      contents: [
        {
          role: "user",
          parts: userParts,
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    };

    let response: any = null;
    let lastError: string = "";

    for (const modelName of modelsToTry) {
      // Try each model up to 2 times to handle temporary 503 spikes
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiPayload),
          });

          if (res.ok) {
            response = res;
            break;
          } else {
            lastError = await res.text();
            console.warn(`Attempt ${attempt} for model ${modelName} returned status ${res.status}: ${lastError}`);
            if (res.status === 503 || res.status === 429) {
              await new Promise((r) => setTimeout(r, 400));
            }
          }
        } catch (err: any) {
          lastError = err.message || String(err);
          console.warn(`Attempt ${attempt} for model ${modelName} fetch failed:`, lastError);
        }
      }

      if (response && response.ok) {
        break;
      }
    }

    if (!response || !response.ok) {
      console.error("All Gemini API models failed. Last error:", lastError);
      return res.status(502).json({
        error: "The AI service is experiencing a temporary spike in traffic. Please try your action again in a moment.",
      });
    }

    const geminiResult: any = await response.json();
    const candidateText = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return res.status(500).json({ error: "Empty response received from Gemini API" });
    }

    let parsed: any;
    try {
      const cleanJson = candidateText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", candidateText);
      parsed = {
        message: candidateText,
        confidenceScore: 50,
        options: ["Draft formal notice", "Check local tenancy laws", "Seek legal consultation"],
        summary: "Legal analysis result",
        evidence: [],
      };
    }

    const rawScore = Number(parsed.confidenceScore);
    const confidenceScore = Number.isFinite(rawScore) ? Math.min(100, Math.max(0, Math.round(rawScore))) : 85;

    return res.json({
      conversationId: currentId,
      message: parsed.message || candidateText,
      confidenceScore,
      options: Array.isArray(parsed.options) ? parsed.options : [],
      summary: parsed.summary || "Legal issue analysis",
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
    });
  } catch (err: any) {
    console.error("Error handling /api/chat:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post("/api/chat", handleChatRequest);

  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startServer().catch(console.error);
}
