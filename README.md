# StadiumBuddy – AI Stadium Companion for FIFA World Cup 2026

StadiumBuddy is a fast, zero-login, AI-enabled stadium companion designed to help fans navigate stadium venues during the FIFA World Cup 2026. This repository hosts the Phase 1 static UI scaffolding.

## 🚀 Tech Stack
- **Framework:** Next.js 16.2 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 & shadcn/ui
- **Icons:** Lucide Icons

## 📁 Folder Structure
The repository is structured as follows:
```text
app/          # App router pages, global styles, and layout config
components/   # Reusable layouts, UI elements, and feature previews
lib/          # Shared helper utilities (e.g. cn for tailwind classes)
data/         # Static tournament data and local information
types/        # Custom TypeScript type definitions
tests/        # Automated tests suite
public/       # Public-facing assets and images
```

## 🏟 Design System & Aesthetics
StadiumBuddy is styled with a custom dark-mode aesthetic utilizing modern OKLCH color definitions:
- **Pitch Green Accent:** Highlighting major components, tags, and interactive buttons.
- **Obsidian / Slate Gray Base:** Providing an elegant dark backdrop that mimics premium AI platforms.
- **Glassmorphism:** Navigation menus and overlays utilize backdrop filters and soft borders.

## ⚙️ Development & Deployment

### Run the Dev Server
To start the local development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the page.

### Linting Checks
To perform static analysis checks:
```bash
npm run lint
```

### Production Build
To verify type checks and compile the static bundle for Vercel/GitHub pages:
```bash
npm run build
```
The output will be created inside the `.next/` directory. This project is prepared for immediate deployment to Vercel or GitHub Pages.

---
