"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/50 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 StadiumBuddy. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-1.5 md:items-end">
            <span className="text-xs font-semibold text-emerald-400 select-none">
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground select-none">
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
