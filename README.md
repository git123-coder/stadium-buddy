# 🏟️ StadiumBuddy – AI Stadium Companion for FIFA World Cup 2026

> A fast, zero-login, AI-enabled web application that helps FIFA World Cup 2026 fans navigate stadiums through intelligent recommendations for crowd management, accessibility, transportation, sustainability, and real-time operational guidance.

![StadiumBuddy](https://img.shields.io/badge/AI-Stadium%20Assistant-00A86B)
![Next.js](https://img.shields.io/badge/Next.js-TypeScript-black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

---

## 🌟 Overview

**StadiumBuddy** is an AI-powered stadium companion designed for FIFA World Cup 2026 fans.

It provides instant assistance for:

- Finding the best stadium entrance
- Managing crowd navigation
- Supporting accessibility needs
- Comparing transport options
- Reducing environmental impact
- Handling emergency situations

The application provides a ChatGPT-style conversational experience where users can ask questions naturally or use quick actions to receive context-aware recommendations.

---

# 🎯 Why StadiumBuddy?

StadiumBuddy directly addresses major stadium challenges:

✅ Navigation  
✅ Crowd Management  
✅ Accessibility  
✅ Transportation  
✅ Sustainability  
✅ Operational Intelligence  
✅ AI-powered Decision Support  
✅ Real-time Guidance  

---

# 👥 Target Users

- Stadium Fans
- International Visitors
- Families
- First-time Visitors
- Visitors with Accessibility Needs
- Stadium Volunteers

---

# 🚀 Core Features

## 1. 🤖 AI Stadium Assistant

The primary interface of StadiumBuddy.

Users can ask natural-language questions:

Examples:

- "Which gate should I use?"
- "Where is the nearest accessible entrance?"
- "Which exit has the lowest crowd?"
- "What's the fastest transport option?"
- "Where can I get emergency help?"

The assistant provides AI-style responses using:

```

User Question

↓

AI Assistant

↓

Local LLM (Ollama)

↓

Fallback Recommendation Engine

↓

Context-aware Response

```

---

# 2. 🚪 Smart Gate Recommendation

Helps fans find the best stadium entrance.

Inputs:

- Stadium Section
- Arrival Plaza
- Fan Priority

Priorities:

- Fastest Entry
- Least Crowded
- Closest Gate
- Accessible Route

Output:

- Recommended Gate
- Walking Time
- Estimated Waiting Time
- Alternative Gate
- Reasoning

Example:

```

Gate C is recommended.

Reason:

* Lowest current crowd level
* Shortest waiting time
* Suitable for your stadium section

```

---

# 3. 📊 Crowd Intelligence Dashboard

Provides simulated stadium crowd information.

Example:

```

Gate A

Heavy Crowd

12 minutes

Gate C

Low Crowd

2 minutes

Gate E

Medium Crowd

5 minutes

```

The assistant also uses crowd information while generating recommendations.

---

# 4. ♿ Accessibility Assistant

Supports visitors requiring accessibility assistance.

Provides information about:

- Accessible entrances
- Wheelchair routes
- Elevators
- Accessible restrooms
- Medical stations
- Assistance points

Example:

> Gate E is recommended because it provides wheelchair-friendly access, elevator availability, nearby assistance points, and low waiting time.

---

# 5. 🌱 Smart Transport & Sustainability

Compares transportation options:

- Metro
- Bus
- Taxi
- Walking

Provides:

- Travel Time
- Cost
- Crowd Level
- CO₂ Impact
- Sustainability Score

Example:

```

Recommended:

Express Metro Line 1

25 minutes

$2.50

Low Crowd

Green Score: 92/100

```

---

# 🆘 Additional Utilities

## Emergency Quick Actions

Provides quick access to:

- Medical Help
- Security
- Lost Child Assistance
- Emergency Exit Information

---

## 🌐 Multilingual Support

Supported languages:

- English
- Hindi

Implemented using local translation files without external translation APIs.

---

# 🧠 AI Architecture

```

```
            StadiumBuddy

                  │

      Next.js + TypeScript

                  │

   AI Chat Interface + Quick Actions

                  │

      AI Stadium Assistant Layer

                  │

    ┌───────────────────────┐
    │                       │

    ▼                       ▼
```

Local Ollama        Recommendation Engine

```
    │                       │

    └───────────┬───────────┘

                │

    Stadium Knowledge Base

                │

    Context-aware Response
```

```

---

# ⚙️ Recommendation Engine

The recommendation engine handles:

- Intent Detection
- Context Matching
- Recommendation Rules
- Response Formatting

Example:

```

Question:

Nearest wheelchair entrance?

↓

Intent:

Accessibility

↓

Knowledge Base:

Gate E

↓

Response:

Gate E is recommended because...

```

---

# 📚 Knowledge Base

Static JSON data powers recommendations.

Includes:

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

- No database dependency
- Instant responses
- Reliable demonstrations
- Zero API cost

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## AI Layer

- Chat Interface
- Ollama Integration
- Automatic Fallback Engine

## Logic

- Intent Detection
- Recommendation Engine
- Rule-based Decision System

## Data

- Static JSON Knowledge Base

## Deployment

- Vercel

---

# 📂 Project Structure

```

app/

components/

lib/

data/

types/

tests/

public/

README.md
package.json

````

---

# 🧪 Testing

Validated areas:

- Intent Detection
- Recommendation Engine
- Gate Recommendation
- Crowd Logic
- Accessibility Rules
- Transport Recommendation
- AI Fallback Behaviour
- Responsive UI

---

# ♿ Accessibility

Implemented:

- Keyboard Navigation
- ARIA Labels
- High Contrast Design
- Focus Indicators
- Responsive Layout
- Large Touch Targets

---

# 🔒 Security

Implemented:

- No exposed secrets
- No cloud API keys
- Input validation
- Type-safe code
- Safe fallback behaviour

---

# ⚡ Performance

Designed for:

- Static data loading
- No database overhead
- No cold starts
- Instant recommendations
- Fast page loading

---

# 🚀 Running Locally

Clone repository:

```bash
git clone <repository-url>
````

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🌍 Deployment

Deployed using:

* GitHub
* Vercel

No requirement for:

❌ Database
❌ Authentication
❌ Docker
❌ Cloud AI APIs
❌ External Maps
❌ Real-time servers