"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "@/data/translations/en.json";
import hi from "@/data/translations/hi.json";

export type LanguageType = "en" | "hi";

export type TranslationKey = keyof typeof en;

interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations = {
  en,
  hi,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>("en");

  const t = (key: TranslationKey, fallback?: string): string => {
    // Falls back to key name or provided fallback if dictionary has no match
    return translations[language][key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
