import { ReactNode } from "react";
import { Globe } from "@gravity-ui/icons";

/* Logos de plateformes — inline (absents de @gravity-ui/icons), monochrome
   currentColor. Source unique partagée (DashboardFilters + Call analysis). */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.36 2.3 1.65 3.68 3.88 3.83v2.57c-1.29.13-2.42-.29-3.74-1.09v4.96c0 5.3-5.78 6.96-8.1 3.16-1.49-2.45-.57-6.74 4.23-6.91v2.71c-.37.06-.76.15-1.12.27-1.07.36-1.68 1.04-1.51 2.24.32 2.29 4.52 2.97 4.17-1.51V3h2.19Z" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.3 26.3 0 0 0 22 12a26.3 26.3 0 0 0-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export const SOURCE_ICON: Record<string, ReactNode> = {
  "All sources": <Globe className="size-4 shrink-0" />,
  Instagram: <InstagramIcon />,
  TikTok: <TikTokIcon />,
  YouTube: <YouTubeIcon />,
};

export function SourceIcon({ name }: { name: string }) {
  return <>{SOURCE_ICON[name] ?? null}</>;
}
