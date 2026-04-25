# 🕉️ Hindu Mantra Sangrah — AI Backend

A full-stack Hindu culture app powered by **Claude AI** (Anthropic). Every sacred mantra translated into every Indian language, with AI-driven generation, explanation, and a spiritual Guru chatbot.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Browse** | 10+ mantras with Sanskrit text, meaning, and benefits |
| **Translate** | Any mantra → 12 languages (Hindi, Tamil, Telugu, Bengali, Kannada, Malayalam, Gujarati, Marathi, Odia, Punjabi, Sanskrit) |
| **Generate** | Describe your need → Claude recommends the perfect mantra with full instructions |
| **Explain** | Simple / Detailed / Scholarly explanation of any mantra in your language |
| **Guru Chat** | Conversational AI with knowledge of Vedas, Puranas, rituals, deities — responds in your language |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/hindu-mantra-sangrah.git
cd hindu-mantra-sangrah
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at: https://console.anthropic.com

### 4. Run the server

```bash
# Production
npm start

# Development (auto-restart on changes)
npm run dev
```

Open http://localhost:3000 in your browser. 🙏

---

## 📁 Project Structure

```
hindu-mantra-sangrah/
├── server.js              # Express server + middleware
├── routes/
│   └── mantra.js          # API routes (translate, generate, explain, chat)
├── public/
│   └── index.html         # Full frontend (single-page app)
├── .env.example           # Environment variable template
├── .gitignore
└── package.json
```

---

## 🔌 API Endpoints

All endpoints: `POST /api/mantra/{endpoint}`

### `POST /api/mantra/translate`
```json
{
  "mantra": "ॐ नमः शिवाय",
  "languages": ["Hindi", "Tamil", "Telugu", "Bengali"]
}
```

### `POST /api/mantra/generate`
```json
{
  "intent": "mantra for success in exam",
  "deity": "Saraswati",
  "language": "Hindi",
  "repetitions": 108
}
```

### `POST /api/mantra/explain`
```json
{
  "mantra": "Gayatri Mantra",
  "language": "English",
  "depth": "detailed"
}
```
Depth options: `"simple"` | `"detailed"` | `"scholarly"`

### `POST /api/mantra/chat`
```json
{
  "messages": [
    { "role": "user", "content": "What is the best mantra for Navratri?" }
  ]
}
```

### `GET /api/health`
Returns server status.

---

## 🌐 Deploy to Render (free)

1. Push this repo to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Set environment variable: `ANTHROPIC_API_KEY`
5. Build command: `npm install`
6. Start command: `npm start`

---

## 🌐 Deploy to Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway add
railway deploy
```
Set `ANTHROPIC_API_KEY` in Railway dashboard → Variables.

---

## 🛡️ Security Features

- **Helmet.js** — Secure HTTP headers
- **Rate limiting** — 60 requests/minute per IP
- **API key on server** — Never exposed to the browser
- **.gitignore** — `.env` never committed

---

## 🙏 Supported Languages

Sanskrit · Hindi · English · Tamil · Telugu · Bengali · Kannada · Malayalam · Gujarati · Marathi · Odia · Punjabi

---

## 📜 License

MIT

---

*ॐ सर्वे भवन्तु सुखिनः — May all beings be happy*
