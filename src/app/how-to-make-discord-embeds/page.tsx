import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Make Discord Embeds — Complete Guide (2025) | GatekeeperAI",
  description: "Learn how to create Discord embeds step by step. Use our free visual embed builder with AI, templates, and one-click webhook sending. No coding required.",
  keywords: ["how to make discord embeds", "discord embed tutorial", "create discord embed", "discord embed guide", "discord webhook embed"],
  alternates: { canonical: "https://embed.gatekeeperai.app/how-to-make-discord-embeds" },
  openGraph: {
    title: "How to Make Discord Embeds — Complete Guide (2025)",
    description: "Step-by-step guide to creating Discord embeds with our free visual builder.",
    url: "https://embed.gatekeeperai.app/how-to-make-discord-embeds",
  },
};

export default function HowToPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-[#1e1f22] bg-[#111214]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">📨</span> Discord Embed Builder
          </Link>
          <Link href="/" className="px-4 py-2 text-sm bg-[#5865F2] text-white rounded-lg hover:bg-[#4752c4] transition-colors">
            Open Builder →
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold text-white mb-2">How to Make Discord Embeds</h1>
        <p className="text-[#949ba4] text-lg mb-8">The complete guide to creating beautiful Discord embeds in 2025 — no coding required.</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">What Are Discord Embeds?</h2>
          <p className="text-[#dbdee1] leading-relaxed">
            Discord embeds are rich message formats that display structured content with colors, images, fields, and formatting. They&apos;re used by bots, webhooks, and integrations to create professional-looking messages for server rules, welcome messages, announcements, and more.
          </p>
          <p className="text-[#dbdee1] leading-relaxed mt-3">
            Unlike regular messages, embeds support colored sidebars, author sections, thumbnail images, inline fields, footer text, and timestamps — making them perfect for organized, eye-catching server content.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Method 1: Use Our Free Visual Builder (Easiest)</h2>
          <p className="text-[#dbdee1] leading-relaxed mb-4">
            The fastest way to create Discord embeds is with our <Link href="/" className="text-[#5865F2] hover:underline">free Discord Embed Builder</Link>. It gives you a visual editor with real-time preview that looks exactly like Discord.
          </p>
          <ol className="space-y-3 text-[#dbdee1]">
            <li><strong className="text-white">1. Open the builder</strong> — Head to <Link href="/" className="text-[#5865F2] hover:underline">embed.gatekeeperai.app</Link></li>
            <li><strong className="text-white">2. Fill in the fields</strong> — Add a title, description, color, fields, images, and more</li>
            <li><strong className="text-white">3. Preview in real-time</strong> — See exactly how it&apos;ll look in Discord</li>
            <li><strong className="text-white">4. Send or export</strong> — Send directly via webhook, or copy the JSON/cURL for your bot</li>
          </ol>
          <div className="mt-4 p-4 bg-[#5865F2]/10 rounded-lg border border-[#5865F2]/20">
            <p className="text-sm text-[#dbdee1]">💡 <strong className="text-white">Pro tip:</strong> Try the AI generator — just describe what you want (e.g., &ldquo;welcome embed for a gaming server&rdquo;) and it&apos;ll build the entire embed for you.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Method 2: Using a Discord Bot (discord.js)</h2>
          <p className="text-[#dbdee1] leading-relaxed mb-3">If you have a bot, you can send embeds programmatically:</p>
          <pre className="bg-[#1e1f22] rounded-lg p-4 text-sm overflow-x-auto text-[#dbdee1]">{`const { EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()
  .setTitle('My Embed')
  .setDescription('Hello world!')
  .setColor(0x5865F2)
  .addFields(
    { name: 'Field 1', value: 'Value 1', inline: true },
    { name: 'Field 2', value: 'Value 2', inline: true }
  )
  .setTimestamp();

channel.send({ embeds: [embed] });`}</pre>
          <p className="text-[#949ba4] text-sm mt-2">
            Our builder can export the exact JSON you need for discord.js or discord.py — just click &ldquo;Export&rdquo;.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Method 3: Using Webhooks (No Bot Needed)</h2>
          <p className="text-[#dbdee1] leading-relaxed mb-3">Discord webhooks let you send embeds without a bot:</p>
          <ol className="space-y-2 text-[#dbdee1]">
            <li><strong className="text-white">1.</strong> Go to your channel settings → Integrations → Webhooks</li>
            <li><strong className="text-white">2.</strong> Create a new webhook and copy the URL</li>
            <li><strong className="text-white">3.</strong> Paste the URL in our <Link href="/" className="text-[#5865F2] hover:underline">embed builder</Link></li>
            <li><strong className="text-white">4.</strong> Design your embed and click &ldquo;Send to Discord&rdquo;</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Discord Embed Limits</h2>
          <div className="bg-[#1e1f22] rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-px bg-[#3f4147]">
              {[
                ["Title", "256 characters"],
                ["Description", "4,096 characters"],
                ["Fields", "25 max"],
                ["Field Name", "256 characters"],
                ["Field Value", "1,024 characters"],
                ["Footer Text", "2,048 characters"],
                ["Author Name", "256 characters"],
                ["Total Embed", "6,000 characters"],
              ].map(([label, limit]) => (
                <>
                  <div key={`${label}-l`} className="bg-[#1e1f22] px-4 py-2 text-sm text-white font-medium">{label}</div>
                  <div key={`${label}-v`} className="bg-[#1e1f22] px-4 py-2 text-sm text-[#949ba4]">{limit}</div>
                </>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Common Use Cases</h2>
          <ul className="space-y-2 text-[#dbdee1]">
            <li>👋 <strong className="text-white">Welcome messages</strong> — Greet new members with server info</li>
            <li>📜 <strong className="text-white">Server rules</strong> — Clear, organized rule lists</li>
            <li>🎨 <strong className="text-white">Role selection</strong> — Reaction role menus</li>
            <li>📢 <strong className="text-white">Announcements</strong> — Eye-catching server updates</li>
            <li>🎁 <strong className="text-white">Giveaways</strong> — Prize info and entry instructions</li>
            <li>🎫 <strong className="text-white">Ticket panels</strong> — Support ticket systems</li>
          </ul>
          <p className="text-[#949ba4] text-sm mt-3">
            All of these are available as templates in our <Link href="/" className="text-[#5865F2] hover:underline">embed builder</Link>.
          </p>
        </section>

        <div className="bg-gradient-to-r from-[#5865F2]/20 to-[#EB459E]/20 rounded-xl p-6 border border-[#5865F2]/20 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Ready to Build Your Embed?</h2>
          <p className="text-[#dbdee1] mb-4">Create stunning Discord embeds in seconds with our free visual builder.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-[#5865F2] text-white font-medium rounded-lg hover:bg-[#4752c4] transition-colors">
            Open Embed Builder →
          </Link>
        </div>
      </article>

      <footer className="border-t border-[#1e1f22] py-6 text-center">
        <a href="https://www.gatekeeperai.app?utm_source=embed-builder&utm_medium=footer" target="_blank" rel="noopener noreferrer" className="text-xs text-[#949ba4] hover:text-white transition-colors">
          Made by GatekeeperAI
        </a>
      </footer>
    </div>
  );
}
