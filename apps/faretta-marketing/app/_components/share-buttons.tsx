"use client";

import { useState } from "react";

const SHARE_TEXT = "Faretta AI — pro se legal companion. Stand up for yourself with case law in your corner.";
const SHARE_URL = typeof window !== "undefined" ? window.location.origin : "https://faretta.ai";

export function ShareButtons({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Faretta AI", text: SHARE_TEXT, url: SHARE_URL });
      } catch {
        // user cancelled
      }
    } else {
      void copyLink();
    }
  }

  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`;
  const sms = `sms:?body=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`;
  const email = `mailto:?subject=${encodeURIComponent("Faretta AI")}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${SHARE_URL}`)}`;

  const cls = compact
    ? "inline-flex items-center justify-center w-9 h-9 rounded-full border border-ink/15 text-ink-2 hover:bg-liberty hover:text-paper hover:border-liberty transition-colors"
    : "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/15 text-[0.8125rem] font-semibold text-ink-2 hover:bg-liberty hover:text-paper hover:border-liberty transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={nativeShare} className={cls} aria-label="Share">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        {!compact && <span>Share</span>}
      </button>
      <button onClick={copyLink} className={cls} aria-label="Copy link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        {!compact && <span>{copied ? "Copied" : "Copy link"}</span>}
      </button>
      <a href={x} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Share on X">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.6L23 22h-6.7l-5.2-6.8L5 22H1.7l8-9.2L1 2h6.85l4.7 6.2L18.244 2zm-2.35 18h1.85L7.2 4H5.2l10.694 16z"/></svg>
        {!compact && <span>X</span>}
      </a>
      <a href={fb} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Share on Facebook">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
        {!compact && <span>Facebook</span>}
      </a>
      <a href={sms} className={cls} aria-label="Share via SMS">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        {!compact && <span>Text</span>}
      </a>
      <a href={email} className={cls} aria-label="Share via email">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        {!compact && <span>Email</span>}
      </a>
    </div>
  );
}
