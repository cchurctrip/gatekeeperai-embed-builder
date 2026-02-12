'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Send, Sparkles, ChevronDown, ChevronUp, Plus, Trash2, Share2, Code, Terminal, Check, X, Loader2 } from 'lucide-react';
import EmbedPreview from '@/components/EmbedPreview';
import { EmbedData, EmbedField, defaultEmbed, templates } from '@/lib/templates';
import { embedToParams, paramsToEmbed } from '@/lib/share';
import { toJsonString, toCurlCommand, toDiscordApiJson } from '@/lib/export';

function Input({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[#949ba4] mb-1 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1e1f22] text-[#dbdee1] text-sm rounded px-3 py-2 border border-[#3f4147] focus:border-[#5865F2] focus:outline-none transition-colors"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-[#949ba4] mb-1 font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-[#1e1f22] text-[#dbdee1] text-sm rounded px-3 py-2 border border-[#3f4147] focus:border-[#5865F2] focus:outline-none transition-colors resize-y"
      />
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#3f4147] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#2b2d31] hover:bg-[#32353b] transition-colors text-sm font-medium text-[#dbdee1]"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="p-4 space-y-3 bg-[#1e1f22]/50">{children}</div>}
    </div>
  );
}

export default function Home() {
  const [embed, setEmbed] = useState<EmbedData>(defaultEmbed);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    showToast(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  }, [showToast]);

  // Load from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("d");
    if (data) {
      const loaded = paramsToEmbed(data);
      if (loaded) setEmbed(loaded);
    }
  }, []);

  const update = useCallback((partial: Partial<EmbedData>) => {
    setEmbed((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateField = useCallback((index: number, partial: Partial<EmbedField>) => {
    setEmbed((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) => (i === index ? { ...f, ...partial } : f)),
    }));
  }, []);

  const addField = useCallback(() => {
    setEmbed((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: "Field Name", value: "Field Value", inline: false }],
    }));
  }, []);

  const removeField = useCallback((index: number) => {
    setEmbed((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEmbed({
        ...defaultEmbed,
        ...data,
        fields: data.fields || [],
        url: data.url || "",
        authorIconUrl: data.authorIconUrl || "",
        authorUrl: data.authorUrl || "",
        thumbnailUrl: data.thumbnailUrl || "",
        imageUrl: data.imageUrl || "",
        footerIconUrl: data.footerIconUrl || "",
        timestamp: data.timestamp || "",
      });
      showToast("Embed generated with AI! ✨");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed";
      showToast(message, "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSend = async () => {
    if (!webhookUrl.trim()) { showToast("Enter a webhook URL", "error"); return; }
    setSending(true);
    try {
      const payload = toDiscordApiJson(embed);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl, payload }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showToast("Embed sent to Discord! 🚀");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Send failed";
      showToast(message, "error");
    } finally {
      setSending(false);
    }
  };

  const handleShare = async () => {
    const encoded = embedToParams(embed);
    const url = `${window.location.origin}?d=${encoded}`;
    await copyToClipboard(url, "Share link");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-[fadeIn_0.2s_ease-out] ${
          toast.type === 'success' ? 'bg-[#248046] text-white' : 'bg-[#da373c] text-white'
        }`}>
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#1e1f22] bg-[#111214]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📨</span> Discord Embed Builder
            </h1>
            <p className="text-xs text-[#949ba4] mt-0.5">Free visual editor with AI generation</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-3 py-2 text-sm bg-[#2b2d31] text-[#dbdee1] rounded-lg hover:bg-[#32353b] transition-colors border border-[#3f4147]"
            >
              📋 Templates
            </button>
            <button
              onClick={() => setShowExport(!showExport)}
              className="px-3 py-2 text-sm bg-[#2b2d31] text-[#dbdee1] rounded-lg hover:bg-[#32353b] transition-colors border border-[#3f4147]"
            >
              <Code size={16} className="inline mr-1" /> Export
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-2 text-sm bg-[#5865F2] text-white rounded-lg hover:bg-[#4752c4] transition-colors"
            >
              <Share2 size={16} className="inline mr-1" /> Share
            </button>
          </div>
        </div>
      </header>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowTemplates(false)}>
          <div className="bg-[#2b2d31] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 border border-[#3f4147]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">📋 Template Library</h2>
              <button onClick={() => setShowTemplates(false)} className="text-[#949ba4] hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { setEmbed(t.embed); setShowTemplates(false); showToast(`Loaded "${t.name}" template`); }}
                  className="text-left p-4 bg-[#1e1f22] rounded-lg hover:bg-[#32353b] transition-colors border border-[#3f4147]"
                >
                  <div className="text-lg mb-1">{t.emoji} {t.name}</div>
                  <div className="text-xs text-[#949ba4]">{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowExport(false)}>
          <div className="bg-[#2b2d31] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 border border-[#3f4147]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Export Embed</h2>
              <button onClick={() => setShowExport(false)} className="text-[#949ba4] hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#dbdee1] flex items-center gap-1"><Code size={14} /> JSON (discord.js / discord.py)</span>
                  <button onClick={() => copyToClipboard(toJsonString(embed), "JSON")} className="text-xs px-2 py-1 bg-[#5865F2] text-white rounded hover:bg-[#4752c4]">
                    {copied === "JSON" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-[#1e1f22] p-3 rounded text-xs text-[#dbdee1] overflow-x-auto max-h-64">{toJsonString(embed)}</pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#dbdee1] flex items-center gap-1"><Terminal size={14} /> cURL Command</span>
                  <button onClick={() => copyToClipboard(toCurlCommand(embed, webhookUrl || "YOUR_WEBHOOK_URL"), "cURL")} className="text-xs px-2 py-1 bg-[#5865F2] text-white rounded hover:bg-[#4752c4]">
                    {copied === "cURL" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-[#1e1f22] p-3 rounded text-xs text-[#dbdee1] overflow-x-auto max-h-64 whitespace-pre-wrap">{toCurlCommand(embed, webhookUrl || "YOUR_WEBHOOK_URL")}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* AI Generator */}
        <div className="mb-6 bg-gradient-to-r from-[#5865F2]/10 to-[#EB459E]/10 rounded-xl p-4 border border-[#5865F2]/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-[#5865F2]" />
            <span className="text-sm font-semibold text-white">AI Embed Generator</span>
          </div>
          <div className="flex gap-2">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              placeholder='Describe what you want, e.g. "Welcome embed for a gaming server"'
              className="flex-1 bg-[#1e1f22] text-[#dbdee1] text-sm rounded-lg px-4 py-2.5 border border-[#3f4147] focus:border-[#5865F2] focus:outline-none"
            />
            <button
              onClick={handleAiGenerate}
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-4 py-2.5 bg-[#5865F2] text-white text-sm font-medium rounded-lg hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {aiLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-3">
            <Section title="Basic">
              <Input label="Title" value={embed.title} onChange={(v) => update({ title: v })} placeholder="Embed title" />
              <Textarea label="Description" value={embed.description} onChange={(v) => update({ description: v })} placeholder="Supports **markdown** and *formatting*" rows={4} />
              <Input label="URL" value={embed.url} onChange={(v) => update({ url: v })} placeholder="https://example.com" />
              <div>
                <label className="block text-xs text-[#949ba4] mb-1 font-medium">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={embed.color}
                    onChange={(e) => update({ color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border border-[#3f4147] bg-transparent"
                  />
                  <input
                    type="text"
                    value={embed.color}
                    onChange={(e) => update({ color: e.target.value })}
                    className="flex-1 bg-[#1e1f22] text-[#dbdee1] text-sm rounded px-3 py-2 border border-[#3f4147] focus:border-[#5865F2] focus:outline-none"
                  />
                </div>
              </div>
            </Section>

            <Section title="Author" defaultOpen={false}>
              <Input label="Author Name" value={embed.authorName} onChange={(v) => update({ authorName: v })} placeholder="Author name" />
              <Input label="Author Icon URL" value={embed.authorIconUrl} onChange={(v) => update({ authorIconUrl: v })} placeholder="https://..." />
              <Input label="Author URL" value={embed.authorUrl} onChange={(v) => update({ authorUrl: v })} placeholder="https://..." />
            </Section>

            <Section title="Images" defaultOpen={false}>
              <Input label="Thumbnail URL" value={embed.thumbnailUrl} onChange={(v) => update({ thumbnailUrl: v })} placeholder="Small image in top right" />
              <Input label="Image URL" value={embed.imageUrl} onChange={(v) => update({ imageUrl: v })} placeholder="Large image at bottom" />
            </Section>

            <Section title="Footer" defaultOpen={false}>
              <Input label="Footer Text" value={embed.footerText} onChange={(v) => update({ footerText: v })} placeholder="Footer text" />
              <Input label="Footer Icon URL" value={embed.footerIconUrl} onChange={(v) => update({ footerIconUrl: v })} placeholder="https://..." />
              <div>
                <label className="block text-xs text-[#949ba4] mb-1 font-medium">Timestamp</label>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={embed.timestamp ? embed.timestamp.slice(0, 16) : ""}
                    onChange={(e) => update({ timestamp: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                    className="flex-1 bg-[#1e1f22] text-[#dbdee1] text-sm rounded px-3 py-2 border border-[#3f4147] focus:border-[#5865F2] focus:outline-none"
                  />
                  <button
                    onClick={() => update({ timestamp: new Date().toISOString() })}
                    className="px-3 py-2 text-xs bg-[#2b2d31] text-[#dbdee1] rounded border border-[#3f4147] hover:bg-[#32353b]"
                  >
                    Now
                  </button>
                </div>
              </div>
            </Section>

            <Section title={`Fields (${embed.fields.length}/25)`} defaultOpen={embed.fields.length > 0}>
              {embed.fields.map((field, i) => (
                <div key={i} className="bg-[#1e1f22] rounded-lg p-3 space-y-2 border border-[#3f4147]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#949ba4] font-medium">Field {i + 1}</span>
                    <button onClick={() => removeField(i)} className="text-[#da373c] hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                  <input
                    value={field.name}
                    onChange={(e) => updateField(i, { name: e.target.value })}
                    placeholder="Field name"
                    className="w-full bg-[#313338] text-[#dbdee1] text-sm rounded px-3 py-1.5 border border-[#3f4147] focus:border-[#5865F2] focus:outline-none"
                  />
                  <textarea
                    value={field.value}
                    onChange={(e) => updateField(i, { value: e.target.value })}
                    placeholder="Field value"
                    rows={2}
                    className="w-full bg-[#313338] text-[#dbdee1] text-sm rounded px-3 py-1.5 border border-[#3f4147] focus:border-[#5865F2] focus:outline-none resize-y"
                  />
                  <label className="flex items-center gap-2 text-xs text-[#949ba4] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.inline}
                      onChange={(e) => updateField(i, { inline: e.target.checked })}
                      className="accent-[#5865F2]"
                    />
                    Inline
                  </label>
                </div>
              ))}
              {embed.fields.length < 25 && (
                <button
                  onClick={addField}
                  className="w-full py-2 text-sm text-[#949ba4] hover:text-white border border-dashed border-[#3f4147] rounded-lg hover:border-[#5865F2] transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Add Field
                </button>
              )}
            </Section>

            {/* Webhook Send */}
            <Section title="Send via Webhook" defaultOpen={false}>
              <Input label="Webhook URL" value={webhookUrl} onChange={setWebhookUrl} placeholder="https://discord.com/api/webhooks/..." />
              <button
                onClick={handleSend}
                disabled={sending || !webhookUrl.trim()}
                className="w-full py-2.5 bg-[#248046] text-white text-sm font-medium rounded-lg hover:bg-[#1a6334] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? "Sending..." : "Send to Discord"}
              </button>
            </Section>

            {/* Reset */}
            <button
              onClick={() => setEmbed(defaultEmbed)}
              className="w-full py-2 text-sm text-[#da373c] hover:text-red-400 border border-[#3f4147] rounded-lg hover:border-[#da373c] transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="text-xs text-[#949ba4] font-medium mb-2 uppercase tracking-wider">Preview</div>
            <div className="rounded-xl overflow-hidden border border-[#1e1f22]">
              <EmbedPreview embed={embed} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e1f22] mt-16 py-6 text-center">
        <a
          href="https://www.gatekeeperai.app?utm_source=embed-builder&utm_medium=footer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#949ba4] hover:text-white transition-colors"
        >
          Made by GatekeeperAI
        </a>
      </footer>
    </div>
  );
}
