const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_GURU = `You are a knowledgeable and spiritually wise Hindu culture AI Guru. 
You have deep knowledge of Vedas, Upanishads, Puranas, mantras, rituals, festivals, 
deities, yoga, Ayurveda, and Indian philosophy. You speak all Indian languages — respond 
in the same language the user writes in. Be warm, respectful, and insightful. Always 
provide accurate information rooted in authentic Hindu traditions.`;

const SYSTEM_EXPERT = `You are an expert in Hindu culture, Sanskrit, Vedic scriptures, 
mantras, and all Indian languages. Provide accurate, respectful, and spiritually informed 
responses.`;

// ── Helper: call Claude ────────────────────────────────────────────────────────
async function callClaude({ system, messages, maxTokens = 1000 }) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system,
    messages,
  });
  return response.content.map((b) => b.text || "").join("");
}

// ── POST /api/mantra/translate ─────────────────────────────────────────────────
// Body: { mantra: string, languages: string[] }
router.post("/translate", async (req, res) => {
  const { mantra, languages } = req.body;

  if (!mantra?.trim()) {
    return res.status(400).json({ error: "mantra is required" });
  }
  if (!Array.isArray(languages) || languages.length === 0) {
    return res.status(400).json({ error: "languages array is required" });
  }

  const langs = languages.slice(0, 12).join(", ");

  const prompt = `Translate and transliterate the following Hindu mantra into these languages: ${langs}.

Mantra: "${mantra}"

For each language provide:
1. The mantra written in that language's script (or transliteration if script is unavailable)
2. A brief phonetic guide (1 line)
3. The meaning in that language (1–2 sentences)

Format each section with the language name as a clear header. 
Also include the original Sanskrit if not already provided.`;

  try {
    const result = await callClaude({
      system: SYSTEM_EXPERT,
      messages: [{ role: "user", content: prompt }],
      maxTokens: 2000,
    });
    res.json({ result });
  } catch (err) {
    console.error("translate error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/mantra/generate ──────────────────────────────────────────────────
// Body: { intent: string, deity?: string, language?: string, repetitions?: number }
router.post("/generate", async (req, res) => {
  const {
    intent,
    deity = "any appropriate deity",
    language = "English",
    repetitions = 108,
  } = req.body;

  if (!intent?.trim()) {
    return res.status(400).json({ error: "intent is required" });
  }

  const prompt = `Recommend the best Hindu mantra for the following need: "${intent}"
Preferred deity: ${deity}
Output language: ${language}
Chant count: ${repetitions} times

Please provide:
1. Mantra name
2. The mantra in Sanskrit (Devanagari)
3. Transliteration in Roman script
4. The mantra in ${language}
5. Word-by-word meaning
6. Full meaning/translation in ${language}
7. When and how to chant it (best time, direction, preparations)
8. Specific benefits
9. Which scripture it comes from

Be detailed and spiritually authentic.`;

  try {
    const result = await callClaude({
      system: SYSTEM_EXPERT,
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1500,
    });
    res.json({ result });
  } catch (err) {
    console.error("generate error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/mantra/explain ───────────────────────────────────────────────────
// Body: { mantra: string, language?: string, depth?: "simple"|"detailed"|"scholarly" }
router.post("/explain", async (req, res) => {
  const { mantra, language = "English", depth = "detailed" } = req.body;

  if (!mantra?.trim()) {
    return res.status(400).json({ error: "mantra is required" });
  }

  const depthGuide = {
    simple:
      "Use simple, accessible language suitable for beginners. Avoid technical terms.",
    detailed:
      "Provide a thorough explanation including etymology, symbolism, and spiritual significance.",
    scholarly:
      "Give a scholarly analysis including Vedic/Tantric references, philosophical interpretations, different sampradaya views, and historical context.",
  }[depth] || "Provide a thorough explanation.";

  const prompt = `Explain the Hindu mantra or prayer: "${mantra}"

Language: ${language}
Depth level: ${depthGuide}

Cover:
1. Origin and scripture source
2. Full mantra text in Sanskrit (Devanagari)
3. Complete translation in ${language}
4. Word-by-word breakdown
5. Spiritual significance and symbolism
6. Deity associated and their mythology
7. Benefits of chanting
8. Proper method of chanting (time, count, posture)
9. Special occasions or festivals where it is chanted
10. Interesting historical or cultural facts

Respond entirely in ${language}.`;

  try {
    const result = await callClaude({
      system: SYSTEM_EXPERT,
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1500,
    });
    res.json({ result });
  } catch (err) {
    console.error("explain error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/mantra/chat ──────────────────────────────────────────────────────
// Body: { messages: [{role, content}] }
router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Validate message format
  const validMessages = messages
    .filter((m) => m.role && m.content)
    .slice(-20); // keep last 20 turns max

  if (validMessages.length === 0) {
    return res.status(400).json({ error: "No valid messages provided" });
  }

  try {
    const result = await callClaude({
      system: SYSTEM_GURU,
      messages: validMessages,
      maxTokens: 1000,
    });
    res.json({ result });
  } catch (err) {
    console.error("chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
