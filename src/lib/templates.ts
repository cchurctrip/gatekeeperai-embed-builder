export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface EmbedData {
  title: string;
  description: string;
  url: string;
  color: string;
  authorName: string;
  authorIconUrl: string;
  authorUrl: string;
  thumbnailUrl: string;
  imageUrl: string;
  footerText: string;
  footerIconUrl: string;
  timestamp: string;
  fields: EmbedField[];
}

export const defaultEmbed: EmbedData = {
  title: "",
  description: "",
  url: "",
  color: "#5865F2",
  authorName: "",
  authorIconUrl: "",
  authorUrl: "",
  thumbnailUrl: "",
  imageUrl: "",
  footerText: "",
  footerIconUrl: "",
  timestamp: "",
  fields: [],
};

export interface Template {
  name: string;
  emoji: string;
  description: string;
  embed: EmbedData;
}

export const templates: Template[] = [
  {
    name: "Welcome Message",
    emoji: "👋",
    description: "Greet new members joining your server",
    embed: {
      ...defaultEmbed,
      title: "Welcome to Our Server! 🎉",
      description: "Hey there! We're glad to have you. Here's how to get started:\n\n**1.** Read the rules in <#rules>\n**2.** Grab your roles in <#roles>\n**3.** Introduce yourself in <#introductions>\n\nEnjoy your stay! 🎮",
      color: "#57F287",
      thumbnailUrl: "https://cdn.discordapp.com/embed/avatars/0.png",
      footerText: "Welcome aboard!",
      timestamp: new Date().toISOString(),
    },
  },
  {
    name: "Server Rules",
    emoji: "📜",
    description: "Establish clear rules for your community",
    embed: {
      ...defaultEmbed,
      title: "📜 Server Rules",
      description: "Please follow these rules to keep the community safe and fun for everyone.",
      color: "#ED4245",
      fields: [
        { name: "1. Be Respectful", value: "Treat everyone with respect. No harassment, hate speech, or discrimination.", inline: false },
        { name: "2. No Spam", value: "Don't spam messages, images, or links. Keep conversations meaningful.", inline: false },
        { name: "3. No NSFW", value: "Keep all content appropriate. No explicit or disturbing material.", inline: false },
        { name: "4. Follow Discord ToS", value: "All Discord Terms of Service and Community Guidelines apply.", inline: false },
        { name: "5. Listen to Staff", value: "Moderators have the final say. If you have concerns, DM a mod.", inline: false },
      ],
      footerText: "Breaking rules may result in a mute, kick, or ban.",
    },
  },
  {
    name: "Role Selection",
    emoji: "🎨",
    description: "Let members pick their roles",
    embed: {
      ...defaultEmbed,
      title: "🎨 Pick Your Roles",
      description: "React to this message to assign yourself roles!\n\nChoose as many as you'd like.",
      color: "#EB459E",
      fields: [
        { name: "🎮 Gamer", value: "Get pinged for gaming sessions", inline: true },
        { name: "🎵 Music", value: "Music recommendations & events", inline: true },
        { name: "🎨 Art", value: "Art sharing & feedback", inline: true },
        { name: "📢 Announcements", value: "Get server announcements", inline: true },
        { name: "🎉 Events", value: "Get notified about events", inline: true },
        { name: "💬 Chatter", value: "Active chat participant", inline: true },
      ],
      footerText: "React below to get your roles!",
    },
  },
  {
    name: "Announcement",
    emoji: "📢",
    description: "Make an important announcement",
    embed: {
      ...defaultEmbed,
      title: "📢 Important Announcement",
      description: "We have some exciting news to share with the community!\n\nStay tuned for more updates. Make sure you have the **Announcements** role to never miss a post.",
      color: "#FEE75C",
      footerText: "Server Announcements",
      timestamp: new Date().toISOString(),
    },
  },
  {
    name: "Giveaway",
    emoji: "🎁",
    description: "Run an exciting giveaway",
    embed: {
      ...defaultEmbed,
      title: "🎁 GIVEAWAY 🎁",
      description: "**Prize:** Nitro Classic (1 Month)\n\n**How to Enter:**\n✅ React with 🎉\n✅ Must be in the server\n✅ Account must be 30+ days old\n\n**Ends:** <t:1700000000:R>",
      color: "#F47FFF",
      fields: [
        { name: "Winners", value: "1", inline: true },
        { name: "Hosted by", value: "@Admin", inline: true },
      ],
      footerText: "Good luck everyone! 🍀",
      timestamp: new Date().toISOString(),
    },
  },
  {
    name: "FAQ",
    emoji: "❓",
    description: "Answer frequently asked questions",
    embed: {
      ...defaultEmbed,
      title: "❓ Frequently Asked Questions",
      description: "Find answers to the most common questions below.",
      color: "#5865F2",
      fields: [
        { name: "How do I get roles?", value: "Head to <#roles> and react to the messages there.", inline: false },
        { name: "How do I report a user?", value: "DM any online moderator or use the /report command.", inline: false },
        { name: "Can I promote my content?", value: "Use <#self-promo> — spam anywhere else will be removed.", inline: false },
        { name: "How do I apply for staff?", value: "Applications open periodically. Watch <#announcements> for updates.", inline: false },
      ],
      footerText: "Still have questions? Open a ticket!",
    },
  },
  {
    name: "Ticket Panel",
    emoji: "🎫",
    description: "Set up a support ticket system",
    embed: {
      ...defaultEmbed,
      title: "🎫 Support Tickets",
      description: "Need help? Click the button below to open a ticket.\n\n**What you can get help with:**\n• Account issues\n• Bug reports\n• Appeals\n• General questions\n\nPlease be patient — our team will respond as soon as possible.",
      color: "#5865F2",
      footerText: "Average response time: < 2 hours",
    },
  },
  {
    name: "About Us",
    emoji: "ℹ️",
    description: "Tell people about your server",
    embed: {
      ...defaultEmbed,
      title: "ℹ️ About This Server",
      description: "Welcome to our community! We're a group of passionate people who love gaming, creativity, and good vibes.",
      color: "#5865F2",
      fields: [
        { name: "🗓️ Founded", value: "January 2024", inline: true },
        { name: "👥 Members", value: "10,000+", inline: true },
        { name: "🌍 Region", value: "Global", inline: true },
        { name: "What We Offer", value: "• Active community\n• Regular events\n• Friendly staff\n• Custom bots & features", inline: false },
      ],
      thumbnailUrl: "https://cdn.discordapp.com/embed/avatars/1.png",
      footerText: "Thanks for being here! ❤️",
    },
  },
  {
    name: "Event",
    emoji: "📅",
    description: "Announce an upcoming event",
    embed: {
      ...defaultEmbed,
      title: "📅 Movie Night This Friday!",
      description: "Join us for our weekly movie night!\n\n**Movie:** Interstellar 🚀\n**When:** Friday at 8 PM EST\n**Where:** Voice Channel #movie-night\n\nReact with 🍿 if you're coming!",
      color: "#EB459E",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=200&fit=crop",
      footerText: "Don't miss it!",
      timestamp: new Date().toISOString(),
    },
  },
  {
    name: "Changelog",
    emoji: "📝",
    description: "Share what's new or changed",
    embed: {
      ...defaultEmbed,
      title: "📝 Server Update — v2.0",
      description: "We've made some big changes! Here's what's new:",
      color: "#57F287",
      fields: [
        { name: "✅ Added", value: "• New roles system\n• Auto-moderation\n• Custom emojis pack", inline: false },
        { name: "🔄 Changed", value: "• Reorganized channels\n• Updated rules\n• New welcome message", inline: false },
        { name: "🗑️ Removed", value: "• Inactive channels\n• Deprecated bots", inline: false },
      ],
      footerText: "Thanks for your feedback!",
      timestamp: new Date().toISOString(),
    },
  },
];
