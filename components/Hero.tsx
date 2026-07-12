"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section 
      className="relative flex flex-col items-center justify-center overflow-hidden py-20 text-center px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-title"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute top-1/3 left-1/3 -z-10 h-[250px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/5 blur-[100px]" />

      <div className="mx-auto max-w-4xl">
        {/* Modern Accent Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-sm animate-fade-in select-none">
          ⚽ FIFA World Cup 2026 Edition
        </div>

        {/* Hero Title */}
        <h1 
          id="hero-title"
          className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
        >
          StadiumBuddy
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-emerald-400/90">
          AI Stadium Companion for FIFA World Cup 2026
        </p>

        {/* Short description */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          A fast, zero-login, AI-enabled assistant helping fans navigate stadiums through intelligent recommendations for crowd management, accessibility, transportation, sustainability, and real-time operational guidance.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-background font-semibold shadow-lg shadow-emerald-500/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            id="hero-try-demo"
          >
            Try Demo
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 border-border hover:bg-secondary/50 text-foreground transition-all cursor-pointer"
            id="hero-learn-more"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
