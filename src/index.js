/* ===========================
   Poem Generator - Main Script
   =========================== */

/* === DOM elements === */
const form = document.querySelector("#poem-form");
const topicInput = document.querySelector("#topic");
const output = document.querySelector("#poem-output");
const submitBtn = form?.querySelector('input[type="submit"]');

/* === Utility: text sanitization === */
function sanitize(text) {
  return String(text)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
Use vivid imagery, fresh metaphors, and a gentle, uplifting tone. 
Avoid clichés and forced rhymes. End with a subtle, resonant final line.`;
}

/* === API request === */
async function fetchPoemFromAPI(topic) {
  const prompt = buildPrompt(topic);

  // Placeholder simulation (replace with real SheCodes API request)
  await new Promise((r) => setTimeout(r, 1200));
  const demo = `Under a sky the color of ${topic},
a hush gathers on the windowsill—
and even the dust remembers music.

Between your palms, the air warms
into something almost like courage,
a lantern you didn’t know you carried.

You inhale, and the room learns to glow.`;

  return demo;
}

/* === Output rendering === */
async function renderPoem(text) {
  if (!output) return;
  output.innerHTML = `<div class="poem-text"></div>`;
  const target = output.querySelector(".poem-text");

  if (window.Typewriter) {
    const tw = new Typewriter(target, {
      strings: sanitize(text),
      autoStart: true,
      delay: 12,
      cursor: "",
    });
    return new Promise((resolve) => {
      const ms = Math.max(400, text.length * 12);
      setTimeout(resolve, ms);
    });
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
