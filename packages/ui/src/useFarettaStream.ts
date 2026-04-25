import { useCallback, useRef, useState } from "react";
import type { ChatMessage, FarettaChatProps } from "./types";

type StreamArgs = {
  message: string;
  history: ChatMessage[];
};

type State = {
  streaming: boolean;
  draft: string;
  error: string | null;
};

// Minimal SSE reader — the server emits events from the Anthropic
// stream as `event: <type>\ndata: <json>\n\n`. We only care about
// content_block_delta and message_stop for assembling the visible
// text; the rest are logged for debugging.
async function* parseSse(res: Response): AsyncGenerator<{ type: string; data: any }> {
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Events are delimited by blank lines.
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const ev of events) {
      if (!ev.trim()) continue;
      const lines = ev.split("\n");
      let type = "message";
      let data = "";
      for (const line of lines) {
        if (line.startsWith("event:")) type = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;
      try {
        yield { type, data: JSON.parse(data) };
      } catch {
        // Malformed frame — skip, log to console so it shows up in dev.
        console.warn("[faretta-ui] malformed SSE frame:", data);
      }
    }
  }
}

// React hook that wraps a single POST to the faretta-chat endpoint
// and streams the assistant's text back one delta at a time.
export function useFarettaStream(opts: Pick<FarettaChatProps,
  "endpoint" | "project" | "tier" | "userName" | "userContext"
>) {
  const [state, setState] = useState<State>({ streaming: false, draft: "", error: null });
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async ({ message, history }: StreamArgs): Promise<string> => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState({ streaming: true, draft: "", error: null });

    let assembled = "";
    try {
      const res = await fetch(opts.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          project: opts.project,
          tier: opts.tier,
          user_name: opts.userName,
          user_context: opts.userContext,
          message,
          history: history.map((h) => ({ role: h.role, content: h.content })),
        }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`faretta-chat ${res.status}: ${errBody.slice(0, 200)}`);
      }

      for await (const { type, data } of parseSse(res)) {
        if (type === "content_block_delta" && data?.delta?.type === "text_delta") {
          assembled += data.delta.text ?? "";
          setState({ streaming: true, draft: assembled, error: null });
        } else if (type === "error") {
          throw new Error(data?.error ?? "stream error");
        }
      }

      setState({ streaming: false, draft: "", error: null });
      return assembled;
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setState({ streaming: false, draft: "", error: null });
        return assembled;
      }
      const msg = err?.message ?? String(err);
      setState({ streaming: false, draft: "", error: msg });
      throw err;
    }
  }, [opts.endpoint, opts.project, opts.tier, opts.userName, opts.userContext]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { ...state, send, cancel };
}
