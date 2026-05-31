/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";

export type PlatformLogoKey =
  | "uoink"
  | "youtube"
  | "x"
  | "apple-podcasts"
  | "spotify"
  | "substack"
  | "linkedin"
  | "reddit"
  | "bluesky"
  | "threads"
  | "mastodon"
  | "beehiiv"
  | "ghost"
  | "buttondown"
  | "web"
  | "mcp"
  | "claude"
  | "chatgpt"
  | "cursor"
  | "obsidian"
  | "github";

type LogoMeta = {
  label: string;
  src?: string;
  wide?: boolean;
  dark?: boolean;
};

const logoMeta: Record<PlatformLogoKey, LogoMeta> = {
  uoink: { label: "Uoink", src: "/assets/favicon.svg" },
  youtube: { label: "YouTube" },
  x: { label: "X", src: "/assets/brand-logos/x.png", dark: true },
  "apple-podcasts": { label: "Apple Podcasts", src: "/assets/brand-logos/apple-podcasts.png" },
  spotify: { label: "Spotify", src: "/assets/brand-logos/spotify.png", wide: true },
  substack: { label: "Substack" },
  linkedin: { label: "LinkedIn" },
  reddit: { label: "Reddit" },
  bluesky: { label: "Bluesky" },
  threads: { label: "Threads", dark: true },
  mastodon: { label: "Mastodon" },
  beehiiv: { label: "Beehiiv" },
  ghost: { label: "Ghost", dark: true },
  buttondown: { label: "Buttondown" },
  web: { label: "Web page" },
  mcp: { label: "Model Context Protocol", dark: true },
  claude: { label: "Claude", src: "/assets/brand-logos/claude.svg" },
  chatgpt: { label: "ChatGPT", src: "/assets/brand-logos/chatgpt.svg", dark: true },
  cursor: { label: "Cursor", src: "/assets/brand-logos/cursor.svg" },
  obsidian: { label: "Obsidian", src: "/assets/brand-logos/obsidian.svg" },
  github: { label: "GitHub", src: "/assets/brand-logos/github.svg" },
};

const featureLogos: Record<string, PlatformLogoKey[]> = {
  "in-page-button": ["youtube"],
  "right-click-any-link": ["youtube", "x"],
  "keyboard-shortcut": ["youtube", "x"],
  "mobile-playlist-bridge": ["youtube"],
  "universal-page-uoink": ["web"],
  "twitter-video": ["x"],
  "podcast-feeds": ["apple-podcasts", "spotify"],
  "youtube-shorts": ["youtube"],
  "playlist-mode": ["youtube"],
  substack: ["substack"],
  "linkedin-videos": ["linkedin"],
  "reddit-threads": ["reddit"],
  "bluesky-threads-mastodon": ["bluesky", "threads", "mastodon"],
  "memory-search": ["uoink"],
  "faceted-classification": ["uoink"],
  "your-channel": ["youtube"],
  "resurface-for-you": ["uoink"],
  "engagement-memory": ["uoink"],
  "taste-anchors": ["uoink"],
  "build-workspace": ["uoink"],
  "critique-corpus": ["uoink"],
  "script-studio": ["uoink"],
  "writing-studio": ["x", "substack"],
  "style-anchors": ["substack"],
  "claim-extraction": ["uoink"],
  "evidence-panel": ["uoink"],
  "mcp-server": ["mcp"],
  "claude-desktop-integration": ["claude"],
  "cursor-integration": ["cursor"],
  "byo-anthropic-key": ["claude"],
  "local-first": ["uoink"],
  "no-cloud": ["uoink"],
};

export function getFeatureLogoKeys(feature: { slug: string }): PlatformLogoKey[] {
  return featureLogos[feature.slug] ?? ["uoink"];
}

export function PlatformLogoStrip({
  logos,
  className = "",
  compact = false,
}: {
  logos: PlatformLogoKey[];
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={`platform-logo-strip ${compact ? "compact" : ""} ${className}`.trim()} aria-label={logos.map((logo) => logoMeta[logo].label).join(", ")}>
      {logos.map((logo) => {
        const meta = logoMeta[logo];

        return (
          <span
            className={`platform-logo-chip platform-logo-${logo} ${meta.wide ? "wide" : ""} ${meta.dark ? "dark" : ""}`.trim()}
            aria-label={meta.label}
            key={logo}
            title={meta.label}
          >
            {meta.src ? <img src={meta.src} alt={meta.label} loading="lazy" decoding="async" /> : renderInlineLogo(logo)}
          </span>
        );
      })}
    </span>
  );
}

function renderInlineLogo(logo: PlatformLogoKey): ReactNode {
  switch (logo) {
    case "youtube":
      return (
        <svg viewBox="0 0 64 44" aria-hidden="true">
          <rect width="64" height="44" rx="12" fill="#ff0033" />
          <path d="M27 13l17 9-17 9V13z" fill="#fff4ec" />
        </svg>
      );
    case "substack":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="9" y="7" width="30" height="6" rx="1" fill="#ff6719" />
          <rect x="9" y="17" width="30" height="6" rx="1" fill="#ff6719" />
          <path d="M9 27h30v15L24 34 9 42V27z" fill="#ff6719" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#0a66c2" />
          <circle cx="14" cy="14" r="4" fill="#fff4ec" />
          <path d="M10 21h8v18h-8V21zm13 0h7v3c1.2-2 3.6-3.6 7-3.6 5 0 8 3.4 8 9.3V39h-8v-8.2c0-2.4-1-3.9-3.1-3.9-2.2 0-3.4 1.5-3.4 3.9V39H23V21z" fill="#fff4ec" />
        </svg>
      );
    case "reddit":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#ff4500" />
          <circle cx="17" cy="24" r="9" fill="#fff4ec" />
          <circle cx="31" cy="24" r="9" fill="#fff4ec" />
          <circle cx="18" cy="24" r="2.2" fill="#0a0a0a" />
          <circle cx="30" cy="24" r="2.2" fill="#0a0a0a" />
          <path d="M18 31c3.2 2.2 8.8 2.2 12 0" fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M26 13l5-7 5 2" fill="none" stroke="#fff4ec" strokeWidth="3" strokeLinecap="round" />
          <circle cx="37" cy="9" r="4" fill="#fff4ec" />
        </svg>
      );
    case "bluesky":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M23 24C16 12 8 7 5 9c-3 2-1 13 8 18-9 4-10 12-5 14 5 3 12-4 15-11 3 7 10 14 15 11 5-2 4-10-5-14 9-5 11-16 8-18-3-2-11 3-18 15z" fill="#1185fe" />
          <path d="M23 24c-2.8-4.6-5.9-8.3-8.8-10.9C18 14.6 22.1 19 24 24h-1z" fill="#8fd3ff" />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#0a0a0a" />
          <path d="M31 20.5c-.8-5-4.4-7.8-9.4-7.8-5.8 0-9.8 4.5-9.8 11.4 0 7.5 4.4 11.3 10.5 11.3 5.4 0 9.8-3 9.8-7.5 0-4.1-3-6.2-7.7-6.2h-3.2v5h3.4c2.3 0 3.3.8 3.3 2.1 0 1.7-2.2 2.8-5.2 2.8-4.1 0-6.4-2.7-6.4-7.6 0-4.6 2.1-7.5 5.6-7.5 2.8 0 4.5 1.6 5.1 4h4z" fill="#fff4ec" />
        </svg>
      );
    case "mastodon":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#6364ff" />
          <path d="M12 34V19c0-5 3.4-8 8-8 3 0 5 1.4 6 3.6 1.1-2.2 3.4-3.6 6.4-3.6 4.8 0 7.6 3.2 7.6 8.2V34h-7V20c0-2-1-3.2-2.8-3.2-1.9 0-3 1.3-3 3.2v8.7h-6.5V20c0-2-1.1-3.2-3-3.2S15 18.1 15 20v14h-3z" fill="#fff4ec" />
          <path d="M15 34c3.3 2.2 10.2 2.9 20 1.2" fill="none" stroke="#fff4ec" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "beehiiv":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 4l18 10v20L24 44 6 34V14L24 4z" fill="#ffd23f" stroke="#0a0a0a" strokeWidth="3" />
          <path d="M17 14h10c5 0 8 2.2 8 6.2 0 2.2-1 4-3 5 2.8.9 4.3 2.9 4.3 5.8 0 4.5-3.4 7-9.3 7H17V14zm7 9h2.8c1.7 0 2.6-.8 2.6-2.1 0-1.3-.9-2-2.6-2H24v4.1zm0 10h3.5c1.9 0 3-.9 3-2.4s-1.1-2.4-3-2.4H24V33z" fill="#0a0a0a" />
        </svg>
      );
    case "ghost":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#0a0a0a" />
          <path d="M12 34V14h24v20l-4-3-4 3-4-3-4 3-4-3-4 3z" fill="#fff4ec" />
          <circle cx="20" cy="23" r="2" fill="#0a0a0a" />
          <circle cx="28" cy="23" r="2" fill="#0a0a0a" />
        </svg>
      );
    case "buttondown":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="9" fill="#2663eb" />
          <path d="M10 16h28v18H10V16zm2 2l12 9 12-9" fill="none" stroke="#fff4ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 8v7m0 0l-5-5m5 5l5-5" fill="none" stroke="#fff4ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#fff4ec" stroke="#ff3d00" strokeWidth="4" />
          <path d="M5 24h38M24 5c6 6 9 12.3 9 19s-3 13-9 19c-6-6-9-12.3-9-19s3-13 9-19z" fill="none" stroke="#ff3d00" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "mcp":
      return (
        <svg viewBox="0 0 64 44" aria-hidden="true">
          <rect width="64" height="44" rx="10" fill="#0a0a0a" />
          <path d="M12 31V13h6l5 8 5-8h6v18h-5V20l-5 8h-2l-5-8v11h-5zm27 0V13h8c6 0 10 3.5 10 9s-4 9-10 9h-8zm5-4h3c3 0 5-2 5-5s-2-5-5-5h-3v10z" fill="#fff4ec" />
        </svg>
      );
    default:
      return null;
  }
}
