const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const mantraRoutes = require("./routes/mantra");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security middleware ────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json({ limit: "10kb" }));

// Rate limiting — 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests. Please slow down." },
});
app.use("/api", limiter);

// ── Static frontend ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── API routes ─────────────────────────────────────────────────────────────────
app.use("/api/mantra", mantraRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Hindu Mantra API is running 🕉️" });
});

// Catch-all → serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🕉️  Hindu Mantra API running on http://localhost:${PORT}`);
  console.log(`📿  API Key: ${process.env.ANTHROPIC_API_KEY ? "✅ Loaded" : "❌ Missing (set ANTHROPIC_API_KEY in .env)"}\n`);
});
