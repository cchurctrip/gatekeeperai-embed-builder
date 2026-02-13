import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error("GROQ_API_KEY missing. Available env keys:", Object.keys(process.env).filter(k => k.includes("GROQ") || k.includes("VERCEL") || k.includes("NEXT")).join(", "));
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a Discord embed designer. Given the user's description, create a Discord embed configuration. Respond ONLY with valid JSON, no markdown code blocks.

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

Use appropriate emojis, colors, and formatting. Make it look professional and polished. For image/thumbnail URLs, leave empty unless the user specifically mentions images. Use Discord markdown formatting in description and field values. Max 25 fields.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Groq API Error:", groqResponse.status, errorData);
      if (groqResponse.status === 429) {
        return NextResponse.json({ error: "Rate limited. Try again in a moment." }, { status: 429 });
      }
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const text = groqData.choices?.[0]?.message?.content?.trim() || "";
    
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
