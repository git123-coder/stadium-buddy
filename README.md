# 🏟️ StadiumBuddy – AI Stadium Companion for FIFA World Cup 2026

> An AI-powered web application that helps FIFA World Cup 2026 visitors navigate stadiums through intelligent recommendations for entrances, crowd conditions, accessibility, transportation, sustainability, and emergency assistance.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 🌟 Overview

**StadiumBuddy** is a conversational AI assistant designed for FIFA World Cup 2026 visitors.

Instead of simply answering questions, StadiumBuddy combines:

* Rule-based recommendations
* Structured stadium knowledge
* Google Gemini for natural language generation
* Automatic fallback for reliability

This hybrid architecture ensures responses remain **grounded, deterministic, and reliable**, while still benefiting from modern Generative AI.

---

# ✨ Features

## 🤖 AI Stadium Assistant

Ask natural questions such as:

* Which gate should I use?
* Where is the nearest accessible entrance?
* Which gate has the shortest queue?
* What's the fastest transport option?
* How do I reach the medical station?
* Where is the nearest emergency exit?

The application automatically determines how to answer each request.

---

## 🚪 Smart Gate Recommendations

Provides:

* Recommended entrance
* Estimated wait time
* Crowd level
* Accessibility information
* Reasoning behind the recommendation

---

## 📊 Crowd Intelligence

Displays simulated operational data including:

* Queue lengths
* Crowd density
* Estimated waiting times
* Alternative entrances

---

## ♿ Accessibility Assistant

Provides guidance for:

* Accessible entrances
* Wheelchair routes
* Elevators
* Accessible restrooms
* Assistance desks
* Medical facilities

---

## 🚇 Smart Transport

Compare transportation options by:

* Travel time
* Estimated cost
* Crowd level
* Recommended use case

---

## 🌱 Sustainability Guidance

Shows:

* Environmental impact
* Green score
* Estimated CO₂ savings
* Sustainable travel recommendations

---

## 🆘 Emergency Assistance

Quick access to:

* Medical stations
* Security
* Emergency exits
* Lost child assistance
* Assembly areas

---

## 🌐 Multilingual Support

Currently supports:

* English
* Hindi

---

# 🧠 AI Architecture

StadiumBuddy uses a **hybrid AI architecture**.

The recommendation engine remains the authoritative decision maker, while Gemini focuses on generating natural language.

```
                    User

                      │

                      ▼

              AI Chat Interface

                      │

                      ▼

              Intent Detector

                      │

                      ▼

          Stadium Knowledge Base

                      │

                      ▼

           Recommendation Engine

      (Determines the best answer)

                      │

                      ▼

              Prompt Builder

                      │

          Is GEMINI_API_KEY set?

             ┌────────┴────────┐

            YES               NO

             │                 │

             ▼                 ▼

      Google Gemini      Recommendation
        API (BYOK)          Response

             │                 │

             └────────┬────────┘

                      ▼

               Final Chat Response
```

---

# 🤖 Generative AI Integration

## Bring Your Own Key (BYOK)

StadiumBuddy supports **Bring Your Own Key (BYOK)**.

Developers can optionally provide their own Gemini API key.

```
GEMINI_API_KEY=your_api_key
```

No API key is stored in the repository.

If no key is configured, StadiumBuddy automatically falls back to the built-in recommendation engine.

---

## Grounded AI Responses

Gemini never answers directly from the user's question.

Instead, StadiumBuddy first gathers relevant stadium information.

```
User Question

↓

Intent Detector

↓

Knowledge Base

↓

Recommendation Engine

↓

Prompt Builder

↓

Gemini

↓

Natural Response
```

The prompt builder supplies:

* Relevant stadium data
* Recommendation engine output
* Safety instructions
* System prompt restricting hallucinations

Gemini is instructed to:

* Never invent stadium information
* Use only supplied context
* Clearly indicate when information is unavailable

---

## Automatic Fallback

If any of the following occur:

* API key missing
* Invalid API key
* API timeout
* Rate limiting
* Gemini service error

The application automatically falls back to the recommendation engine.

No user action is required.

---

## Response Indicators

Assistant messages display their source.

### AI Powered

```
🟢 AI Powered
```

Displayed when Gemini generated the response.

### Recommendation Engine

```
⚙ Recommendation Engine
```

Displayed when the application uses its deterministic fallback.

---

# ⚙️ Recommendation Engine

The recommendation engine remains the core decision-making component.

Responsibilities include:

* Intent detection
* Rule evaluation
* Context selection
* Stadium knowledge lookup
* Recommendation generation

Gemini improves **how** responses are written—not **what** the recommendation should be.

---

# 📚 Knowledge Base

The application uses structured JSON datasets.

Examples include:

```
data/

├── gates.json
├── crowd.json
├── accessibility.json
├── transport.json
├── sustainability.json
├── emergency.json
└── translations/
    ├── en.json
    └── hi.json
```

Benefits:

* Fast lookups
* Offline-friendly
* Predictable recommendations
* No database dependency

---

# 🛠 Tech Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui

## AI

* Google Gemini
* Prompt Engineering
* Grounded Prompt Builder
* Recommendation Engine
* Automatic AI Fallback

## Logic

* Intent Detection
* Rule-Based Recommendation Engine
* Static Knowledge Base

## Deployment

* Vercel

---

# 📂 Project Structure

```
app/
├── api/
│   └── chat/
│       └── route.ts

components/

data/

lib/
├── aiService.ts
├── gemini.ts
├── intentDetector.ts
├── knowledgeBase.ts
├── promptBuilder.ts
└── recommendationEngine.ts

public/

tests/

types/

README.md
package.json
```

---

# 🔒 Security

StadiumBuddy follows a server-side AI architecture.

* Gemini API key never reaches the browser.
* Gemini requests are routed through a server API endpoint.
* No secrets are committed to Git.
* Automatic fallback prevents exposing internal errors.

Because Gemini is accessed server-side, users only receive the generated response—not the API credentials.

---

# ⚡ Performance

Designed for:

* Instant JSON lookups
* Lightweight recommendation engine
* Server-side AI routing
* Fast fallback
* Minimal latency
* No database

---

# 🧪 Testing

Validated components include:

* Intent detection
* Recommendation engine
* Prompt builder
* Gemini integration
* Automatic fallback
* Accessibility recommendations
* Crowd recommendations
* Transport recommendations
* Sustainability recommendations
* Emergency guidance
* Responsive UI

---

# 🚀 Running Locally

Clone the repository.

```bash
git clone <repository-url>
cd stadium-buddy
```

Install dependencies.

```bash
npm install
```

Create a `.env.local` file.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the development server.

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🌍 Deployment

The application is designed for deployment on platforms such as Vercel.

Environment variables required:

```
GEMINI_API_KEY
```

No additional infrastructure is required.

* ❌ Database
* ❌ Authentication
* ❌ Docker
* ❌ External Maps
* ❌ Real-time Servers

---

# 💡 Design Philosophy

StadiumBuddy intentionally separates decision making from language generation.

* The **Recommendation Engine** decides the correct recommendation using structured stadium data.
* The **Prompt Builder** grounds the AI with relevant context.
* **Google Gemini** rewrites the recommendation into natural, conversational language.
* Automatic fallback ensures the application remains fully functional even without an AI model.

This hybrid approach provides the reliability of deterministic software with the usability of Generative AI.

---

# 📄 License

This project is intended for educational, demonstration, and portfolio purposes.