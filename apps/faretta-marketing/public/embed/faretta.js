/*!
 * Faretta AI — embeddable chat widget loader.
 *
 * Usage on a partner site:
 *   <script
 *     src="https://faretta.ai/embed/faretta.js"
 *     data-faretta-key="frt_live_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
 *     data-faretta-surface="repwatchr.com"
 *     defer
 *   ></script>
 *
 * v1 mounts a floating button bottom-right. Click opens an iframe that
 * loads /embed/iframe at faretta.ai with the visitor surface in the URL.
 * The iframe uses the same /api/v1/chat endpoint, authenticated by the
 * data-faretta-key, so visitors talk to the same Faretta voice as the
 * marketing site.
 *
 * No external dependencies. Runs in any modern browser (>=2020).
 */
(function () {
  if (typeof window === "undefined" || window.__faretta_loaded) return;
  window.__faretta_loaded = true;

  var script = document.currentScript;
  if (!script) return;
  var apiKey = script.getAttribute("data-faretta-key") || "";
  var surface = script.getAttribute("data-faretta-surface") || window.location.host;
  var origin = "https://faretta.ai";
  if (script.src) {
    try {
      origin = new URL(script.src).origin;
    } catch (_) {
      // fall back to default
    }
  }

  var styles = [
    ".faretta-fab{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:9999px;background:#1E3A8A;color:#FFFFFF;display:grid;place-items:center;cursor:pointer;box-shadow:0 12px 32px rgba(30,58,138,0.30);z-index:2147483646;border:none;transition:transform 120ms ease;}",
    ".faretta-fab:hover{transform:translateY(-2px);}",
    ".faretta-fab svg{width:24px;height:24px;}",
    ".faretta-frame{position:fixed;bottom:88px;right:20px;width:380px;height:560px;max-width:calc(100vw - 32px);max-height:calc(100vh - 120px);border:1px solid rgba(26,35,50,0.12);border-radius:20px;overflow:hidden;box-shadow:0 24px 64px rgba(30,58,138,0.18);z-index:2147483647;background:#FFFFFF;display:none;}",
    ".faretta-frame.is-open{display:block;}",
    ".faretta-frame iframe{width:100%;height:100%;border:0;display:block;}",
    "@media (max-width:520px){.faretta-frame{width:calc(100vw - 24px);height:calc(100vh - 110px);right:12px;bottom:72px;}}",
  ].join("");

  var styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  var fab = document.createElement("button");
  fab.className = "faretta-fab";
  fab.setAttribute("aria-label", "Open Faretta chat");
  fab.type = "button";
  fab.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var frame = document.createElement("div");
  frame.className = "faretta-frame";

  function openFrame() {
    if (frame.classList.contains("is-open")) return;
    if (!frame.querySelector("iframe")) {
      var iframe = document.createElement("iframe");
      var url = origin + "/embed/iframe?surface=" + encodeURIComponent(surface);
      if (apiKey) url += "&key=" + encodeURIComponent(apiKey);
      iframe.src = url;
      iframe.title = "Faretta AI chat";
      iframe.setAttribute("allow", "microphone");
      frame.appendChild(iframe);
    }
    frame.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true");
  }

  function closeFrame() {
    frame.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
  }

  fab.addEventListener("click", function () {
    if (frame.classList.contains("is-open")) closeFrame();
    else openFrame();
  });

  window.addEventListener("message", function (e) {
    if (e.origin !== origin) return;
    if (e.data && e.data.type === "faretta:close") closeFrame();
  });

  function mount() {
    document.body.appendChild(fab);
    document.body.appendChild(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
