import { EmbedData } from "./templates";

function colorToInt(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

export function toDiscordApiJson(embed: EmbedData): object {
  const e: Record<string, unknown> = {};
  if (embed.title) e.title = embed.title;
  if (embed.description) e.description = embed.description;
  if (embed.url) e.url = embed.url;
  if (embed.color) e.color = colorToInt(embed.color);
  if (embed.authorName) {
    e.author = {
      name: embed.authorName,
      ...(embed.authorUrl && { url: embed.authorUrl }),
      ...(embed.authorIconUrl && { icon_url: embed.authorIconUrl }),
    };
  }
  if (embed.thumbnailUrl) e.thumbnail = { url: embed.thumbnailUrl };
  if (embed.imageUrl) e.image = { url: embed.imageUrl };
  if (embed.footerText) {
    e.footer = {
      text: embed.footerText,
      ...(embed.footerIconUrl && { icon_url: embed.footerIconUrl }),
    };
  }
  if (embed.timestamp) e.timestamp = embed.timestamp;
  if (embed.fields.length > 0) {
    e.fields = embed.fields.map((f) => ({
      name: f.name,
      value: f.value,
      inline: f.inline,
    }));
  }
  return { embeds: [e] };
}

export function toJsonString(embed: EmbedData): string {
  return JSON.stringify(toDiscordApiJson(embed), null, 2);
}

export function toCurlCommand(embed: EmbedData, webhookUrl: string): string {
  const json = JSON.stringify(toDiscordApiJson(embed));
  return `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${json}'`;
}
