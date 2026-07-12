"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  onBack: () => void;
}

export default function ChatHeader({ onBack }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 cursor-pointer hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Go back to landing page"
            id="chat-back-button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-xl font-bold tracking-tight text-foreground select-none">
            🏟 <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">StadiumBuddy</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Online
          </span>
        </div>
      </div>
    </header>
  );
}
