import { EmbedData, defaultEmbed } from "./templates";

export function embedToParams(embed: EmbedData): string {
  const data: Record<string, unknown> = {};
  if (embed.title) data.t = embed.title;
  if (embed.description) data.d = embed.description;
  if (embed.url) data.u = embed.url;
  if (embed.color && embed.color !== "#5865F2") data.c = embed.color;
  if (embed.authorName) data.an = embed.authorName;
  if (embed.authorIconUrl) data.ai = embed.authorIconUrl;
  if (embed.authorUrl) data.au = embed.authorUrl;
  if (embed.thumbnailUrl) data.th = embed.thumbnailUrl;
  if (embed.imageUrl) data.im = embed.imageUrl;
  if (embed.footerText) data.ft = embed.footerText;
  if (embed.footerIconUrl) data.fi = embed.footerIconUrl;
  if (embed.timestamp) data.ts = embed.timestamp;
  if (embed.fields.length > 0) data.f = embed.fields;
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json));
}

export function paramsToEmbed(encoded: string): EmbedData | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const data = JSON.parse(json);
    return {
      ...defaultEmbed,
      title: data.t || "",
      description: data.d || "",
      url: data.u || "",
      color: data.c || "#5865F2",
      authorName: data.an || "",
      authorIconUrl: data.ai || "",
      authorUrl: data.au || "",
      thumbnailUrl: data.th || "",
      imageUrl: data.im || "",
      footerText: data.ft || "",
      footerIconUrl: data.fi || "",
      timestamp: data.ts || "",
      fields: data.f || [],
    };
  } catch {
    return null;
  }
}
