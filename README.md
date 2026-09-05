# ClauseIQ ⚖️

> **Evidence-first legal document understanding for your next move.**

ClauseIQ is an AI-powered LegalTech web application that helps users analyze, understand, and extract actionable legal strategic options from legal documents, agreements, and text inputs. Powered by Google Gemini AI, ClauseIQ prioritizes evidence before advice, calculating real-time confidence scores and breaking down complex legal jargon into clear, structured insights.

---

## 🌟 Key Features

- 📑 **Multimodal Document Upload**: Analyze PDF contracts, scanned legal documents, agreements, and images.
- 🎯 **Targeted Intent Focus**: Choose what you want to achieve (e.g., termination options, compliance check, obligation review) rather than receiving generic summaries.
- 🤖 **Gemini AI Integration**: Multi-model backend supporting `gemini-2.5-flash`, `gemini-3.6-flash`, and `gemini-3.5-flash` with dynamic fallback handling.
- 📊 **Confidence Score Gauge**: AI confidence rating (0–100%) provided with every analysis for legal transparency.
- 💬 **Interactive AI Legal Assistant**: Integrated side drawer chat assistant for follow-up legal queries and document deep-dives.
- 🏛️ **Jurisdiction-Aware Analysis**: Tailor document evaluation based on select jurisdictions (US Federal, California, New York, UK, EU, India, etc.).
- 🎨 **Modern Premium UI**: Built with a sleek paper-textured design system, custom typography (`DM Serif Display` + `Manrope`), dynamic responsive layout, and accessible UI controls.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite 7
- **Styling**: Vanilla CSS design system with Tailwind CSS & Lucide Icons
- **UI Components**: Radix UI primitives, Framer Motion animations, Sonner toasts

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **AI SDK**: `@google/genai` (Google Gemini AI REST API)
- **Bundler**: esbuild

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+ recommended)
- `npm` or `pnpm`
- A Google Gemini API Key ([Get your API key here](https://aistudio.google.com/))

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 3. Installation
```bash
npm install
```

### 4. Development Server
Run the unified Vite + Express development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with backend middleware on port 3000 |
| `npm run build` | Builds the client bundle and compiles server TypeScript into `dist/` |
| `npm run start` | Runs the production Node server (`node dist/index.js`) |
| `npm run check` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run format` | Formats codebase using Prettier |

---

## 🔒 Responsible Use Disclaimer

*ClauseIQ provides general legal information using Gemini AI. It does not replace a qualified attorney or constitute formal legal advice.*
