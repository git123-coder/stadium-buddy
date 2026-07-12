"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground select-none">
            🏟 <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">StadiumBuddy</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          <Button
            variant="ghost"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            id="nav-home"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            id="nav-features"
          >
            Features
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            id="nav-about"
          >
            About
          </Button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-background font-semibold cursor-pointer shadow-lg shadow-emerald-500/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
            id="header-try-demo"
          >
            Try Demo
          </Button>
        </div>
      </div>
    </header>
  );
}
