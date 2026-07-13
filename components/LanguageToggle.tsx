"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex rounded-full bg-secondary/80 p-0.5 border border-border/40 select-none shrink-0"
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-emerald-500 ${
          language === "en"
            ? "bg-emerald-500 text-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-emerald-500 ${
          language === "hi"
            ? "bg-emerald-500 text-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={language === "hi"}
        aria-label="हिंदी में स्विच करें"
      >
        हिन्दी
      </button>
    </div>
  );
}
