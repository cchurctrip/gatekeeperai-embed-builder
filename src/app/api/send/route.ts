import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { webhookUrl, payload } = await req.json();

    if (!webhookUrl || !payload) {
      return NextResponse.json({ error: "Webhook URL and payload required" }, { status: 400 });
    }

    // Validate webhook URL
    const urlPattern = /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+$/;
    if (!urlPattern.test(webhookUrl)) {
      return NextResponse.json({ error: "Invalid Discord webhook URL" }, { status: 400 });
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Discord API error: ${text}` }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Send error:", error);
    const message = error instanceof Error ? error.message : "Send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
