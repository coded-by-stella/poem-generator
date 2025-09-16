/* ===========================
   Poem Generator - Main Script (Axios)
   =========================== */

/* === Config === */
const API_KEY = "ta8f14404a1b1cbdb0fo526029d3690d";
const API_URL = "https://api.shecodes.io/ai/v1/generate";

/* === DOM elements === */
const form =
  document.querySelector("#poem-form") ||
  document.querySelector("#poem-generator-form");
const topicInput = document.querySelector("#topic");
const output =
  document.querySelector("#poem-output") || document.querySelector("#poem");
const submitBtn = form?.querySelector('input[type="submit"]');

/* === Utility: text sanitization === */
function sanitize(text) {
  return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* === Utility: loader animation === */
let loaderTimer;
function startLoader(message = "Crafting your poem") {
  if (!output) return;
  let dots = 0;
  output.innerHTML = `<p class="placeholder">${message}<span id="dots"></span></p>`;
  const dotsEl = output.querySelector("#dots");
  loaderTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    dotsEl.textContent = ".".repeat(dots);
  }, 400);
}
function stopLoader() {
  if (loaderTimer) clearInterval(loaderTimer);
}

/* === Utility: typewriter fallback === */
async function typeText(el, text, delay = 12) {
  el.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    el.innerHTML += text[i] === "\n" ? "<br/>" : sanitize(text[i]);
    await new Promise((r) => setTimeout(r, delay));
  }
}

/* === Prompt builder === */
function buildPrompt(topic) {
  return `Write a short, original free-verse poem (6–10 lines) in English about "${topic}".
Use vivid imagery and fresh metaphors in a gentle uplifting tone. Never use —.
Avoid clichés and forced rhymes. End with a subtle resonant final line.`;
}

/* === API response parsing === */
function extractText(data) {
  return (
    data?.answer ||
    data?.output ||
    data?.result ||
    data?.generated_text ||
    data?.response ||
    ""
  )
    .toString()
    .trim();
}

/* === API request (Axios GET) === */
async function fetchPoemFromAPI(topic) {
  const prompt = buildPrompt(topic);
  const res = await axios.get(API_URL, {
    params: { key: API_KEY, prompt }
  });
  const text = extractText(res.data);
  if (!text) {
    const apiMsg =
      res?.data?.message || res?.data?.error || "Empty response from API";
    const err = new Error(apiMsg);
    err.response = { status: res.status, data: res.data };
    throw err;
  }
  return text;
}

/* === Copy button binding === */
function bindCopyButton() {
  const btn = document.querySelector("#copy-poem");
  const poemEl = output?.querySelector(".poem-text");
  if (!btn || !poemEl) return;

  btn.addEventListener("click", async () => {
    const text = poemEl.innerText || "";
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = prev), 1200);
    } catch {}
  });
}

/* === Output rendering === */
async function renderPoem(text) {
  if (!output) return;
  output.innerHTML = `
    <div class="poem-text" aria-label="Generated poem">${sanitize(text).replace(/\n/g, "<br/>")}</div>
    <button id="copy-poem" type="button" class="copy-btn" aria-label="Copy poem">Copy</button>
  `;

  if (window.Typewriter) {
    const target = output.querySelector(".poem-text");
    target.innerHTML = "";
    new Typewriter(target, {
      strings: sanitize(text),
      autoStart: true,
      delay: 12,
      cursor: ""
    });
    const ms = Math.max(400, text.length * 12);
    setTimeout(bindCopyButton, ms);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  bindCopyButton();
}

/* === Main handler === */
async function generatePoem(event) {
  event.preventDefault();
  if (!topicInput || !output) return;

  if (!window.axios) {
    output.innerHTML = `<p class="placeholder">Axios is not available on this page.</p>`;
    return;
  }

  const topic = topicInput.value.trim();
  if (topic.length < 2) {
    output.innerHTML = `<p class="placeholder">Please enter a slightly longer topic.</p>`;
    topicInput.focus();
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  startLoader("Crafting your poem");

  try {
    const poem = await fetchPoemFromAPI(topic);
    stopLoader();
    await renderPoem(poem);
  } catch (err) {
    stopLoader();
    const status = err?.response?.status;
    const detail =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Unknown error";
    console.error("SheCodes API error:", status, detail, err?.response?.data);
    output.innerHTML = `
      <p class="placeholder">
        API error${status ? ` [${status}]` : ""}: ${sanitize(detail)}
      </p>
    `;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* === Event binding === */
if (form) {
  form.addEventListener("submit", generatePoem);
}
