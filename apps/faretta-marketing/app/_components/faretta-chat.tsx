"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "I think my civil rights were violated. Where do I start?",
  "How do I file a small claims case in my state?",
  "What's the Sixth Amendment and how does it apply to me?",
  "I'm being evicted and I don't have a lawyer. What now?",
];

const VISITOR_KEY = "faretta:visitor_id";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `v_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

// Browser SpeechRecognition (Web Speech API). Click-to-toggle, not push-to-hold.
type SR = {
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

function getRecognition(): SR | null {
  if (typeof window === "undefined") return null;
  const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.continuous = false;
  r.interimResults = true;
  r.lang = "en-US";
  return r;
}

export function FarettaChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recRef = useRef<SR | null>(null);
  const baseInputRef = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const r = getRecognition();
    if (r) setVoiceSupported(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  function startListening() {
    const r = getRecognition();
    if (!r) return;
    baseInputRef.current = input ? input.trim() + " " : "";
    r.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      setInput(baseInputRef.current + final + interim);
    };
    r.onerror = () => {
      setListening(false);
    };
    r.onend = () => {
      setListening(false);
    };
    recRef.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      // start() throws if already running — flip to off.
      setListening(false);
    }
  }

  function stopListening() {
    try {
      recRef.current?.stop();
    } catch {
      // no-op
    }
    setListening(false);
  }

  function toggleVoice() {
    if (listening) stopListening();
    else startListening();
  }

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    if (listening) stopListening();
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }, { role: "assistant", content: "" }];
    setMessages(next);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-12),
          tier: "free",
          surface: typeof window !== "undefined" ? window.location.host : "faretta.ai",
          visitor_id: getVisitorId(),
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = {
            role: "assistant",
            content: `Something went wrong: ${errText || res.statusText}. Try again in a moment.`,
          };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const lines = evt.split("\n");
          let event = "";
          let data = "";
          for (const line of lines) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (!event || !data) continue;
          try {
            const parsed = JSON.parse(data);
            if (event === "content_block_delta" && parsed?.delta?.type === "text_delta") {
              const chunk = String(parsed.delta.text || "");
              setMessages((prev) => {
                const copy = prev.slice();
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = { role: "assistant", content: last.content + chunk };
                }
                return copy;
              });
            } else if (event === "error") {
              setMessages((prev) => {
                const copy = prev.slice();
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: `Sorry — ${parsed?.error || "stream error"}.`,
                };
                return copy;
              });
            }
          } catch {
            // ignore parse errors on individual events
          }
        }
      }
    } finally {
      setStreaming(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  function pickStarter(p: string) {
    setInput(p);
    inputRef.current?.focus();
  }

  return (
    <div className="rounded-f-primary bg-paper border border-ink/10 shadow-f-card overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-ink/[0.08] bg-f-dawn">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-verdict" aria-hidden />
          <span className="text-[0.8125rem] font-semibold text-ink">Faretta is listening</span>
        </div>
        <span className="text-[0.6875rem] uppercase tracking-kicker text-mute font-semibold">Free tier · Haiku 4.5</span>
      </div>

      <div
        ref={scrollRef}
        className="px-5 py-5 min-h-[280px] max-h-[440px] overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-ink-2 text-[1rem] leading-[1.55]">
              Start typing or hit the mic. I'll point you at the law and the next step. I'm not a
              lawyer — but I'll keep you out of the deep end while you find one.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => pickStarter(p)}
                  className="text-left px-3 py-2 rounded-f-secondary border border-ink/10 bg-parchment text-ink-2 text-[0.875rem] hover:border-liberty hover:text-liberty transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`f-msg-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] px-4 py-2.5 rounded-f-secondary bg-liberty text-paper text-[0.9375rem] leading-[1.5]"
                      : "max-w-[88%] px-4 py-2.5 rounded-f-secondary bg-parchment-2 text-ink text-[0.9375rem] leading-[1.55] whitespace-pre-wrap"
                  }
                >
                  {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-ink/[0.08] p-3 bg-paper">
        <div className="flex items-end gap-2">
          {voiceSupported && (
            <button
              onClick={toggleVoice}
              aria-pressed={listening}
              aria-label={listening ? "Stop listening" : "Start voice input"}
              className={
                listening
                  ? "w-11 h-11 grid place-items-center rounded-full bg-flag text-paper transition-colors"
                  : "w-11 h-11 grid place-items-center rounded-full border border-ink/15 text-ink-2 hover:border-liberty hover:text-liberty transition-colors"
              }
              style={listening ? { animation: "f-listen 1.2s ease-out infinite" } : undefined}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={listening ? "Listening… speak now" : "Tell me what happened…"}
            className="flex-1 resize-none px-4 py-3 rounded-f-secondary border border-ink/15 bg-paper text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors max-h-32"
            style={{ minHeight: 44 }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="px-4 h-11 rounded-full bg-liberty text-paper text-[0.875rem] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-liberty-deep transition-colors shadow-f-cta"
            type="button"
          >
            {streaming ? "…" : "Send"}
          </button>
        </div>
        <p className="mt-2 text-[0.6875rem] text-mute leading-[1.4]">
          Faretta is not a law firm and does not provide legal advice. By using this chat you
          consent to your messages being used to improve the product. Your name and contact info
          are kept separate from training data.
        </p>
      </div>
    </div>
  );
}
