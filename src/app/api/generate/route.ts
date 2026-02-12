import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a Discord embed designer. Given the user's description, create a Discord embed configuration. Respond ONLY with valid JSON, no markdown code blocks.

The JSON must have this exact structure:
{
  "title": "string",
  "description": "string (use Discord markdown: **bold**, *italic*, __underline__, ~~strikethrough~~, \`code\`, > quotes)",
  "color": "#hex color",
  "authorName": "string or empty",
  "authorIconUrl": "string or empty",
  "authorUrl": "string or empty",
  "thumbnailUrl": "string or empty",
  "imageUrl": "string or empty",
  "footerText": "string or empty",
  "footerIconUrl": "string or empty",
  "timestamp": "ISO string or empty",
  "fields": [{"name": "string", "value": "string", "inline": boolean}]
}

Use appropriate emojis, colors, and formatting. Make it look professional and polished. For image/thumbnail URLs, leave empty unless the user specifically mentions images. Use Discord markdown formatting in description and field values. Max 25 fields.

User request: ${prompt}`,
            },
          ],
        },
      ],
    });

    const text = result.response.text().trim();
    // Strip potential markdown code blocks
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const embed = JSON.parse(cleaned);

    return NextResponse.json(embed);
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
