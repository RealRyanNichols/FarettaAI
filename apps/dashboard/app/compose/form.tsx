"use client";

import { useState } from "react";
import { hashContent } from "@gideon/brain-memory";

const KINDS = ["tactic", "script", "story", "question", "answer", "note"] as const;
const TIERS = ["public", "core", "ultra", "internal"] as const;

export default function ComposeForm() {
  const [project, setProject] = useState("nest");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("note");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tier, setTier] = useState<(typeof TIERS)[number]>("core");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const content_hash = await hashContent(content);
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/brain-query-admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "insert",
          insert: {
            project,
            kind,
            content,
            content_hash,
            tags,
            access_tier: tier,
            source_tier: "internal",
          },
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(body.error || "insert failed");
        return;
      }
      setStatus("ok");
      setMessage(`Saved id=${body.memory.id}`);
      setContent("");
      setTagsInput("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-[0.75rem] tracking-kicker uppercase text-mist-2">Project</span>
        <input
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="px-4 py-2 rounded-g-secondary bg-midnight border border-ink/20 text-ink outline-none focus:border-gold"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[0.75rem] tracking-kicker uppercase text-mist-2">Kind</span>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
          className="px-4 py-2 rounded-g-secondary bg-midnight border border-ink/20 text-ink outline-none focus:border-gold"
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[0.75rem] tracking-kicker uppercase text-mist-2">Content</span>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="px-4 py-2 rounded-g-secondary bg-midnight border border-ink/20 text-ink outline-none focus:border-gold font-sans"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[0.75rem] tracking-kicker uppercase text-mist-2">Tags (comma-separated)</span>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="px-4 py-2 rounded-g-secondary bg-midnight border border-ink/20 text-ink outline-none focus:border-gold"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[0.75rem] tracking-kicker uppercase text-mist-2">Access tier</span>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as typeof tier)}
          className="px-4 py-2 rounded-g-secondary bg-midnight border border-ink/20 text-ink outline-none focus:border-gold"
        >
          {TIERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={status === "saving"}
        className="self-start px-5 py-3 rounded-full bg-gold text-night font-semibold disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save memory"}
      </button>
      {message ? (
        <p className={status === "error" ? "text-wrath text-[0.875rem]" : "text-truth text-[0.875rem]"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
