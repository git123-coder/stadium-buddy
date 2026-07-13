"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageToggle from "./LanguageToggle";

interface HeaderProps {
  onTryDemo?: () => void;
}

export default function Header({ onTryDemo }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/70 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-xl font-extrabold tracking-tight text-foreground select-none transition-transform duration-300 group-hover:scale-103">
            🏟 <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{t("appTitle")}</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
          <Button
            variant="ghost"
            className="text-sm font-semibold text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-200 rounded-full px-4 cursor-pointer"
            id="nav-home"
          >

          </Button>
        </nav>

        {/* CTA Button & Switcher */}
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Button
            onClick={onTryDemo}
            className="bg-emerald-500 hover:bg-emerald-600 text-background font-semibold cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full px-5 h-9.5"
            id="header-try-demo"
          >
            {t("tryDemo")}
          </Button>
        </div>
      </div>
    </header>
  );
}
