/* ===========================
   Poem Generator - Main Script (Axios)
   =========================== */

/* Config */
const API_KEY = "ta8f14404a1b1cbdb0fo526029d3690d";
const API_URL = "https://api.shecodes.io/ai/v1/generate";

/* DOM */
const root = document.documentElement;
const form = document.querySelector("#poem-form");
const topicInput = document.querySelector("#topic");
const output = document.querySelector("#poem-output");
const submitBtn = document.querySelector("#generate-btn");
const languageSelect = document.querySelector("#language");
const styleSelect = document.querySelector("#style");
const moodSelect = document.querySelector("#mood");
const linesRange = document.querySelector("#lines");
const linesValue = document.querySelector("#lines-value");
const themeToggle = document.querySelector("#theme-toggle");
const titleEl = document.querySelector("#title");
const subtitleEl = document.querySelector("#subtitle");
const footerText = document.querySelector("#footer-text");

/* State */
const THEME_KEY = "poem.theme";
const LANG_KEY = "poem.lang";

/* UI strings */
const UI = {
  en: {
    title: "AI Poem Generator",
    subtitle: "Create unique poems with the power of AI - Coded_by_Stella ✨",
    language: "Language",
    style: "Style",
    mood: "Mood",
    lines: "Lines",
    styleOptions: {
      free_verse: "Free verse",
      haiku: "Haiku",
      sonnet: "Sonnet",
      tanka: "Tanka",
      limerick: "Limerick",
      villanelle: "Villanelle",
      ode: "Ode"
    },
    moodOptions: {
      calm: "Calm",
      joyful: "Joyful",
      melancholic: "Melancholic",
      romantic: "Romantic",
      mysterious: "Mysterious",
      hopeful: "Hopeful",
      nostalgic: "Nostalgic"
    },
    topicPlaceholder: "Enter the topic of the poem you want to generate 📜",
    generate: "Generate Poem",
    dark: "Dark mode",
    light: "Light mode",
    loading: "Crafting your poem",
    placeholder: "Your poem will appear here 💭",
    copy: "Copy",
    copied: "Copied",
    download: "Download PDF",
    footer: (html) =>
      `This AI project was coded with ❤️ by ${html.name}, is open-sourced on ${html.github} and hosted on ${html.host}.`
  },
  it: {
    title: "Generatore di Poesie AI",
    subtitle: "Crea poesie uniche con la potenza dell'AI - Coded_by_Stella ✨",
    language: "Lingua",
    style: "Stile",
    mood: "Umore",
    lines: "Righe",
    styleOptions: {
      free_verse: "Verso libero",
      haiku: "Haiku",
      sonnet: "Sonetto",
      tanka: "Tanka",
      limerick: "Limerick",
      villanelle: "Villanella",
      ode: "Ode"
    },
    moodOptions: {
      calm: "Calmo",
      joyful: "Gioioso",
      melancholic: "Malinconico",
      romantic: "Romantico",
      mysterious: "Misterioso",
      hopeful: "Speranzoso",
      nostalgic: "Nostalgico"
    },
    topicPlaceholder: "Scrivi l’argomento della poesia che vuoi generare 📜",
    generate: "Genera poesia",
    dark: "Modalità scura",
    light: "Modalità chiara",
    loading: "Sto creando la tua poesia",
    placeholder: "La tua poesia apparirà qui 💭",
    copy: "Copia",
    copied: "Copiato",
    download: "Scarica PDF",
    footer: (html) =>
      `Questo progetto AI è stato creato con ❤️ da ${html.name}, è open-source su ${html.github} ed è ospitato su ${html.host}.`
  },
  no: {
    title: "AI Diktgenerator",
    subtitle: "Lag unike dikt med kraften av AI - Coded_by_Stella ✨",
    language: "Språk",
    style: "Stil",
    mood: "Stemning",
    lines: "Linjer",
    styleOptions: {
      free_verse: "Frie vers",
      haiku: "Haiku",
      sonnet: "Sonett",
      tanka: "Tanka",
      limerick: "Limerick",
      villanelle: "Villanelle",
      ode: "Ode"
    },
    moodOptions: {
      calm: "Rolig",
      joyful: "Gledelig",
      melancholic: "Melankolsk",
      romantic: "Romantisk",
      mysterious: "Mystisk",
      hopeful: "Håpefull",
      nostalgic: "Nostalgisk"
    },
    topicPlaceholder: "Skriv emnet for diktet du vil generere 📜",
    generate: "Generer dikt",
    dark: "Mørk modus",
    light: "Lys modus",
    loading: "Lager diktet ditt",
    placeholder: "Diktet ditt vises her 💭",
    copy: "Kopier",
    copied: "Kopiert",
    download: "Last ned PDF",
    footer: (html) =>
      `Dette AI-prosjektet ble laget med ❤️ av ${html.name}, er åpen kildekode på ${html.github} og er hostet på ${html.host}.`
  }
};

/* Prompt templates */
const PROMPTS = {
  en({ topic, style, moodLabel, lines }) {
    const base =
      style === "haiku"
        ? `Write a haiku in English about "${topic}". Use 3 lines with a natural 5-7-5 rhythm.`
        : style === "tanka"
        ? `Write a tanka in English about "${topic}". Use 5 lines with a natural 5-7-5-7-7 cadence.`
        : style === "limerick"
        ? `Write a limerick in English about "${topic}". Use 5 lines with a playful anapestic rhythm.`
        : style === "sonnet"
        ? `Write a sonnet in English about "${topic}" in approximately iambic pentameter. Use about 14 lines.`
        : style === "villanelle"
        ? `Write a villanelle in English about "${topic}". Use 19 lines with repeating refrains.`
        : style === "ode"
        ? `Write an ode in English about "${topic}" of exactly ${lines} lines.`
        : `Write an original free-verse poem in English about "${topic}" of exactly ${lines} lines.`;
    return `${base}
Use vivid imagery and fresh metaphors in a ${moodLabel} tone.
Do not use the em dash character (—).
Avoid clichés and forced rhymes. End with a subtle resonant final line.`;
  },
  it({ topic, style, moodLabel, lines }) {
    const base =
      style === "haiku"
        ? `Scrivi un haiku in italiano su "${topic}". Usa 3 righe con ritmo naturale 5-7-5.`
        : style === "tanka"
        ? `Scrivi un tanka in italiano su "${topic}". Usa 5 righe con cadenza 5-7-5-7-7.`
        : style === "limerick"
        ? `Scrivi un limerick in italiano su "${topic}". Usa 5 righe con ritmo giocoso anapestico.`
        : style === "sonnet"
        ? `Scrivi un sonetto in italiano su "${topic}" con metro approssimativo in decasillabi. Usa circa 14 righe.`
        : style === "villanelle"
        ? `Scrivi una villanella in italiano su "${topic}". Usa 19 righe con ritornelli ripetuti.`
        : style === "ode"
        ? `Scrivi un'ode in italiano su "${topic}" di esattamente ${lines} righe.`
        : `Scrivi una poesia originale in verso libero in italiano su "${topic}" di esattamente ${lines} righe.`;
    return `${base}
Usa immagini vivide e metafore fresche in un tono ${moodLabel}.
Non usare il carattere trattino lungo (—).
Evita i cliché e le rime forzate. Concludi con un verso finale sottile e risonante.`;
  },
  no({ topic, style, moodLabel, lines }) {
    const base =
      style === "haiku"
        ? `Skriv et haiku på norsk om "${topic}". Bruk 3 linjer med naturlig 5-7-5 rytme.`
        : style === "tanka"
        ? `Skriv en tanka på norsk om "${topic}". Bruk 5 linjer med 5-7-5-7-7 kadense.`
        : style === "limerick"
        ? `Skriv en limerick på norsk om "${topic}". Bruk 5 linjer med leken anapestisk rytme.`
        : style === "sonnet"
        ? `Skriv et sonett på norsk om "${topic}" med omtrent jambisk pentameter. Bruk omtrent 14 linjer.`
        : style === "villanelle"
        ? `Skriv en villanelle på norsk om "${topic}". Bruk 19 linjer med gjentatte refrenger.`
        : style === "ode"
        ? `Skriv en ode på norsk om "${topic}" med nøyaktig ${lines} linjer.`
        : `Skriv et originalt dikt i frie vers på norsk om "${topic}" med nøyaktig ${lines} linjer.`;
    return `${base}
Bruk levende bilder og friske metaforer i en ${moodLabel} tone.
Ikke bruk tankestrek-tegnet (—).
Unngå klisjeer og tvungne rim. Avslutt med en subtil, resonant siste linje.`;
  }
};

/* Text sanitization */
function sanitize(text) {
  return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Loader */
let loaderTimer;
function startLoader(message) {
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

/* API response parsing */
function extractText(data) {
  return (
    (data?.answer ||
      data?.output ||
      data?.result ||
      data?.generated_text ||
      data?.response ||
      "")
      .toString()
      .replace(/—/g, "")
      .trim()
  );
}

/* API request */
async function fetchPoemFromAPI(params) {
  const prompt = (PROMPTS[params.lang] || PROMPTS.en)(params);
  const res = await axios.get(API_URL, { params: { key: API_KEY, prompt } });
  const text = extractText(res.data);
  if (!text) {
    const apiMsg = res?.data?.message || res?.data?.error || "Empty response from API";
    const err = new Error(apiMsg);
    err.response = { status: res.status, data: res.data };
    throw err;
  }
  return text;
}

/* Copy */
function bindCopyButton() {
  const btn = document.querySelector("#copy-poem");
  const poemEl = output?.querySelector(".poem-text");
  if (!btn || !poemEl) return;
  btn.addEventListener("click", async () => {
    const text = poemEl.innerText || "";
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = UI[currentLang()].copied;
      setTimeout(() => (btn.textContent = prev), 1200);
    } catch {}
  });
}

/* PDF */
function bindPdfButton(meta) {
  const btn = document.querySelector("#download-pdf");
  const poemEl = output?.querySelector(".poem-text");
  if (!btn || !poemEl) return;

  btn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 56;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    const title = `${UI[currentLang()].title}`;
    const metaLine = `${meta.topic} • ${meta.styleLabel} • ${meta.moodLabel} • ${meta.linesUsed} ${UI[currentLang()].lines}`;

    doc.setFont("Times", "Bold");
    doc.setFontSize(18);
    doc.text(title, margin, margin);

    doc.setFont("Times", "Normal");
    doc.setFontSize(11);
    doc.text(metaLine, margin, margin + 18);

    doc.setFontSize(12);
    const text = poemEl.innerText;
    const lines = doc.splitTextToSize(text, width);
    doc.text(lines, margin, margin + 48);

    const safeTopic = meta.topic.replace(/[^\w\s-]+/g, "").trim().replace(/\s+/g, "_").slice(0, 40) || "poem";
    doc.save(`${safeTopic}_${meta.lang}.pdf`);
  });
}

/* Render */
async function renderPoem(text, meta) {
  if (!output) return;
  const labels = UI[currentLang()];
  output.innerHTML = `
    <div class="poem-text" aria-label="Generated poem"></div>
    <div class="actions">
      <button id="copy-poem" type="button" class="copy-btn" aria-label="${labels.copy}">${labels.copy}</button>
      <button id="download-pdf" type="button" class="copy-btn" aria-label="${labels.download}">${labels.download}</button>
    </div>
  `;
  const target = output.querySelector(".poem-text");

  if (window.Typewriter) {
    new Typewriter(target, { strings: sanitize(text), autoStart: true, delay: 12, cursor: "" });
    const ms = Math.max(400, text.length * 12);
    setTimeout(() => {
      bindCopyButton();
      bindPdfButton(meta);
    }, ms);
    return;
  }

  target.innerHTML = sanitize(text).replace(/\n/g, "<br/>");
  bindCopyButton();
  bindPdfButton(meta);
}

/* Helpers: language and theme */
function currentLang() {
  return languageSelect?.value || "en";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggleLabel = theme === "dark" ? UI[currentLang()].light : UI[currentLang()].dark;
  themeToggle.textContent = toggleLabel;
  themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") applyTheme(saved);
  else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
}

/* UI translation */
function updateUIStrings() {
  const lang = currentLang();
  const S = UI[lang];

  if (titleEl) titleEl.textContent = S.title;
  if (subtitleEl) subtitleEl.textContent = S.subtitle;

  document.querySelector("#label-language").textContent = S.language;
  document.querySelector("#label-style").textContent = S.style;
  document.querySelector("#label-mood").textContent = S.mood;
  document.querySelector("#label-lines").textContent = S.lines;

  Object.entries(S.styleOptions).forEach(([value, label]) => {
    const opt = styleSelect.querySelector(`option[value="${value}"]`);
    if (opt) opt.textContent = label;
  });
  Object.entries(S.moodOptions).forEach(([value, label]) => {
    const opt = moodSelect.querySelector(`option[value="${value}"]`);
    if (opt) opt.textContent = label;
  });

  if (topicInput) topicInput.placeholder = S.topicPlaceholder;
  if (submitBtn) submitBtn.value = S.generate;

  const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  themeToggle.textContent = theme === "dark" ? S.light : S.dark;

  const placeholderEl = output?.querySelector(".placeholder");
  if (placeholderEl) placeholderEl.textContent = S.placeholder;

  if (footerText) {
    const name = document.querySelector("#footer-link-name").outerHTML;
    const github = document.querySelector("#footer-link-github").outerHTML;
    const host = document.querySelector("#footer-link-host").outerHTML;
    footerText.innerHTML = S.footer({ name, github, host });
  }
}

/* Submit */
async function generatePoem(event) {
  event.preventDefault();
  if (!window.axios) {
    output.innerHTML = `<p class="placeholder">Axios is not available on this page.</p>`;
    return;
  }

  const topic = (topicInput?.value || "").trim();
  if (topic.length < 2) {
    output.innerHTML = `<p class="placeholder">${UI[currentLang()].placeholder}</p>`;
    topicInput.focus();
    return;
  }

  const lang = currentLang();
  const style = styleSelect?.value || "free_verse";
  const mood = moodSelect?.value || "calm";
  const linesWanted = parseInt(linesRange?.value || "8", 10);

  const fixedLines = {
    haiku: 3,
    tanka: 5,
    limerick: 5,
    sonnet: 14,
    villanelle: 19
  };
  const linesUsed = fixedLines[style] || Math.min(Math.max(linesWanted, 3), 100);

  const loaderText = UI[lang].loading;
  if (submitBtn) submitBtn.disabled = true;
  startLoader(loaderText);

  try {
    const poem = await fetchPoemFromAPI({
      topic,
      style,
      mood,
      lines: linesUsed,
      lang,
      moodLabel: UI[lang].moodOptions[mood],
      styleLabel: UI[lang].styleOptions[style]
    });
    stopLoader();
    await renderPoem(poem, {
      topic,
      lang,
      style,
      mood,
      linesUsed,
      styleLabel: UI[lang].styleOptions[style],
      moodLabel: UI[lang].moodOptions[mood]
    });
  } catch (err) {
    stopLoader();
    const status = err?.response?.status;
    const detail =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Unknown error";
    output.innerHTML = `<p class="placeholder">API error${status ? ` [${status}]` : ""}: ${sanitize(detail)}</p>`;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* Events */
if (form) form.addEventListener("submit", generatePoem);
if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    localStorage.setItem(LANG_KEY, currentLang());
    updateUIStrings();
  });
}
if (linesRange && linesValue) {
  linesValue.textContent = linesRange.value;
  linesRange.addEventListener("input", () => (linesValue.textContent = linesRange.value));
}

/* Init */
(function init() {
  const savedLang = localStorage.getItem(LANG_KEY);
  if (savedLang && ["en", "it", "no"].includes(savedLang)) languageSelect.value = savedLang;
  initTheme();
  updateUIStrings();
})();
