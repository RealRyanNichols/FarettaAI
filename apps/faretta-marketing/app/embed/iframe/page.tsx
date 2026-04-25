// /embed/iframe — the chat surface mounted inside the embeddable
// floating widget. Stripped layout — no nav, no footer, just the chat.

import { FarettaChat } from "../../_components/faretta-chat";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Faretta — Embedded chat",
  robots: { index: false, follow: false },
};

export default function EmbedIframePage() {
  return (
    <div className="min-h-screen p-3 bg-parchment">
      <FarettaChat />
    </div>
  );
}
