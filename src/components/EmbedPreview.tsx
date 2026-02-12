'use client';

import { EmbedData } from "@/lib/templates";

function parseDiscordMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // underline
  html = html.replace(/__(.+?)__/g, "<u>$1</u>");
  // strikethrough
  html = html.replace(/~~(.+?)~~/g, "<s>$1</s>");
  // inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#00a8fc] hover:underline">$1</a>');
  // channel mentions
  html = html.replace(/&lt;#(\w+)&gt;/g, '<span class="text-[#c9cdfb] bg-[#3c4270]/50 px-0.5 rounded">#$1</span>');
  // newlines
  html = html.replace(/\n/g, "<br/>");
  return html;
}

function formatTimestamp(ts: string): string {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " at " +
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return ts;
  }
}

export default function EmbedPreview({ embed }: { embed: EmbedData }) {
  const hasContent = embed.title || embed.description || embed.fields.length > 0 ||
    embed.imageUrl || embed.thumbnailUrl || embed.authorName || embed.footerText;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-64 text-[#949ba4] text-sm">
        Your embed preview will appear here
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#313338] rounded-lg">
      {/* Discord message wrapper */}
      <div className="flex gap-4">
        {/* Bot avatar */}
        <div className="w-10 h-10 rounded-full bg-[#5865F2] flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
          B
        </div>
        <div className="flex-1 min-w-0">
          {/* Bot name */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">Embed Bot</span>
            <span className="bg-[#5865F2] text-white text-[10px] font-medium px-1 py-0.5 rounded">BOT</span>
          </div>
          {/* Embed */}
          <div
            className="rounded overflow-hidden border-l-4 max-w-[520px]"
            style={{ borderColor: embed.color || "#5865F2", backgroundColor: "#2b2d31" }}
          >
            <div className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  {/* Author */}
                  {embed.authorName && (
                    <div className="flex items-center gap-2 mb-1">
                      {embed.authorIconUrl && (
                        <img src={embed.authorIconUrl} alt="" className="w-6 h-6 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      {embed.authorUrl ? (
                        <a href={embed.authorUrl} className="text-white text-sm font-medium hover:underline">{embed.authorName}</a>
                      ) : (
                        <span className="text-white text-sm font-medium">{embed.authorName}</span>
                      )}
                    </div>
                  )}
                  {/* Title */}
                  {embed.title && (
                    embed.url ? (
                      <a href={embed.url} className="block text-[#00a8fc] font-semibold text-base hover:underline mb-1">{embed.title}</a>
                    ) : (
                      <div className="text-white font-semibold text-base mb-1">{embed.title}</div>
                    )
                  )}
                  {/* Description */}
                  {embed.description && (
                    <div
                      className="text-[#dbdee1] text-sm leading-relaxed mb-2 discord-markup"
                      dangerouslySetInnerHTML={{ __html: parseDiscordMarkdown(embed.description) }}
                    />
                  )}
                  {/* Fields */}
                  {embed.fields.length > 0 && (
                    <div className="grid gap-2 mb-2" style={{
                      gridTemplateColumns: embed.fields.some(f => f.inline) ? "repeat(3, 1fr)" : "1fr",
                    }}>
                      {embed.fields.map((field, i) => (
                        <div
                          key={i}
                          className={field.inline ? "" : "col-span-full"}
                        >
                          <div className="text-white text-xs font-semibold mb-0.5">{field.name}</div>
                          <div
                            className="text-[#dbdee1] text-sm discord-markup"
                            dangerouslySetInnerHTML={{ __html: parseDiscordMarkdown(field.value) }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Thumbnail */}
                {embed.thumbnailUrl && (
                  <img
                    src={embed.thumbnailUrl}
                    alt=""
                    className="w-20 h-20 rounded object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
              {/* Image */}
              {embed.imageUrl && (
                <img
                  src={embed.imageUrl}
                  alt=""
                  className="w-full rounded mt-2 max-h-[300px] object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              {/* Footer */}
              {(embed.footerText || embed.timestamp) && (
                <div className="flex items-center gap-2 mt-2 text-[#949ba4] text-xs">
                  {embed.footerIconUrl && (
                    <img src={embed.footerIconUrl} alt="" className="w-5 h-5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <span>
                    {embed.footerText}
                    {embed.footerText && embed.timestamp && " • "}
                    {embed.timestamp && formatTimestamp(embed.timestamp)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
