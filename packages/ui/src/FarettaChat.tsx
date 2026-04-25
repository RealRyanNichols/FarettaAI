import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, FarettaChatProps } from "./types";
import { useFarettaStream } from "./useFarettaStream";

// The floating chat widget every product mounts. Pure React — no
// design-tokens import so products can drop this into a non-Tailwind
// host. Colors come from CSS variables if the host has loaded
// @faretta/design-tokens; otherwise the inline fallbacks apply.
//
// Usage (Next.js App Router):
//
//   "use client";
//   import { FarettaChat } from "@faretta/ui";
//
//   export default function Shell() {
//     return (
//       <FarettaChat
//         endpoint="https://<ref>.functions.supabase.co/faretta-chat"
//         project="nest"
//         tier="core"
//         userName="Amanda"
//         userContext={{ tab: "Home", heart: "peace" }}
//       />
//     );
//   }

const fallbackPalette = {
  night:  "var(--g-night, #0A0E1A)",
  ink:    "var(--g-ink, #12131A)",
  gold:   "var(--g-gold, #D4AF37)",
  ember:  "var(--g-ember, #FF6B35)",
  flame:  "var(--g-flame, #F2CB4D)",
  smoke:  "var(--g-smoke, rgba(255,255,255,0.08))",
  parchment: "var(--g-parchment, #F5EFE0)",
};

export function FarettaChat(props: FarettaChatProps) {
  const {
    endpoint, project, tier, userName, userContext,
    initialHistory = [], defaultOpen = false, triggerLabel = "Ask Faretta",
    onTurnComplete,
  } = props;

  const [open, setOpen] = useState(defaultOpen);
  const [history, setHistory] = useState<ChatMessage[]>(initialHistory);
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const streamOpts = useMemo(() => {
    const base = { endpoint, project, tier } as const;
    return {
      ...base,
      ...(userName !== undefined ? { userName } : {}),
      ...(userContext !== undefined ? { userContext } : {}),
    };
  }, [endpoint, project, tier, userName, userContext]);
  const { streaming, draft, error, send, cancel } = useFarettaStream(streamOpts);

  // Autoscroll to latest message whenever the conversation or the
  // in-flight draft changes. Uses scrollTop to stay compatible with
  // older Safari versions that don't support smooth behavior inside
  // overflow containers reliably.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, draft, open]);

  const submit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    const userMsg: ChatMessage = { role: "user", content: trimmed, at: Date.now() };
    const nextHistory = [...history, userMsg];
    setHistory(nextHistory);
    setInput("");
    try {
      const reply = await send({ message: trimmed, history });
      if (reply) {
        const assistantMsg: ChatMessage = { role: "assistant", content: reply, at: Date.now() };
        const after = [...nextHistory, assistantMsg];
        setHistory(after);
        onTurnComplete?.(after);
      }
    } catch {
      // error already surfaced via useFarettaStream's error state.
    }
  }, [input, streaming, history, send, onTurnComplete]);

  const onKey = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }, [submit]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={triggerLabel}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          padding: "14px 20px",
          borderRadius: 28,
          border: "none",
          background: `linear-gradient(135deg, ${fallbackPalette.gold} 0%, ${fallbackPalette.ember} 100%)`,
          color: fallbackPalette.night,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 0.4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          cursor: "pointer",
          zIndex: 1000,
          fontFamily: "var(--g-font-sans, 'Inter', system-ui, sans-serif)",
        }}
      >
        {triggerLabel}
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Faretta chat"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: "min(92vw, 420px)",
        height: "min(80vh, 640px)",
        background: fallbackPalette.ink,
        color: fallbackPalette.parchment,
        borderRadius: 24,
        border: `1px solid ${fallbackPalette.smoke}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 1000,
        fontFamily: "var(--g-font-sans, 'Inter', system-ui, sans-serif)",
      }}
    >
      <header
        style={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${fallbackPalette.smoke}`,
          background: fallbackPalette.night,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>Faretta</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close Faretta"
          style={{
            background: "transparent",
            border: "none",
            color: fallbackPalette.parchment,
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </header>

      <div
        ref={scrollerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {history.length === 0 && !streaming && (
          <div style={{ opacity: 0.7, fontSize: 14, lineHeight: 1.5 }}>
            Ask anything. I'll be short with you, cite when I have evidence,
            and say so when I don't.
          </div>
        )}
        {history.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {streaming && draft && <MessageBubble role="assistant" content={draft} />}
        {streaming && !draft && (
          <div style={{ fontSize: 13, opacity: 0.65, fontStyle: "italic" }}>
            Faretta is thinking…
          </div>
        )}
        {error && (
          <div style={{ fontSize: 13, color: fallbackPalette.ember }}>
            {error}
          </div>
        )}
      </div>

      <footer
        style={{
          borderTop: `1px solid ${fallbackPalette.smoke}`,
          padding: 12,
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Message Faretta"
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            background: fallbackPalette.night,
            color: fallbackPalette.parchment,
            border: `1px solid ${fallbackPalette.smoke}`,
            borderRadius: 12,
            padding: "10px 12px",
            fontSize: 14,
            fontFamily: "inherit",
            outline: "none",
            minHeight: 40,
            maxHeight: 140,
          }}
        />
        {streaming ? (
          <button
            type="button"
            onClick={cancel}
            style={btnSecondary}
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!input.trim()}
            style={{ ...btnPrimary, opacity: input.trim() ? 1 : 0.5 }}
          >
            Send
          </button>
        )}
      </footer>
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
        padding: "10px 14px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? fallbackPalette.gold : fallbackPalette.smoke,
        color: isUser ? fallbackPalette.night : fallbackPalette.parchment,
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {content}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "none",
  background: `linear-gradient(135deg, ${fallbackPalette.gold} 0%, ${fallbackPalette.ember} 100%)`,
  color: fallbackPalette.night,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 13,
};

const btnSecondary: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  border: `1px solid ${fallbackPalette.smoke}`,
  background: "transparent",
  color: fallbackPalette.parchment,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 13,
};
