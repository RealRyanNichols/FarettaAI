"use client";

import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const sb = getBrowserClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Check your inbox for the magic link.");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="px-4 py-3 rounded-g-secondary bg-midnight border border-ink/20 text-ink outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-5 py-3 rounded-full bg-gold text-night font-semibold disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send magic link"}
      </button>
      {message ? (
        <p className={status === "error" ? "text-wrath text-[0.875rem]" : "text-truth text-[0.875rem]"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
