/* ===========================
   Poem Generator - Main Script 
   =========================== */

/* === Config === */
const API_KEY = "ta8f14404a1b1cbdb0fo526029d3690d";
const API_URL = "https://api.shecodes.io/ai/v1/generate";

/* === DOM elements === */
const form = document.querySelector("#poem-form");
const topicInput = document.querySelector("#topic");
const output = document.querySelector("#poem-output");
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
    // eslint-disable-next-line no-await-in-loop
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

/* === API request (Axios) === */
async function fetchPoemFromAPI(topic) {
  const prompt = buildPrompt(topic);

  // POST attempt
  try {
    const res = await axios.post(
      API_URL,
      { key: API_KEY, prompt },
      { headers: { "Content-Type": "application/json" } }
    );
    const text = extractText(res.data);
    if (text) return text;
  } catch (e) {
    // silent fallback
  }

  // GET fallback
  const res = await axios.get(API_URL, {
    params: { key: API_KEY, prompt }
  });
  return extractText(res.data);
}

/* === Output rendering === */
async function renderPoem(text) {
  if (!output) return;
  output.innerHTML = `<div class="poem-text"></div>`;
  const target = output.querySelector(".poem-text");

  if (window.Typewriter) {
    new Typewriter(target, {
      strings: sanitize(text),
      autoStart: true,
      delay: 12,
      cursor: ""
    });
    const ms = Math.max(400, text.length * 12);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await typeText(target, text, 12);
}

/* === Main handler === */
async function generatePoem(event) {
  event.preventDefault();
  if (!topicInput || !output) return;

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
    if (!poem) {
      output.innerHTML = `<p class="placeholder">No poem returned. Try another topic.</p>`;
    } else {
      await renderPoem(poem);
    }
  } catch (err) {
    stopLoader();
    console.error(err);
    output.innerHTML = `
      <p class="placeholder">
        Something went wrong while generating your poem.<br/>
        Please try again later.
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
