"use client";

import React from "react";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex w-full items-start gap-3 my-4 justify-start">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/10">
        <Bot className="h-5 w-5 animate-pulse" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-1.5 py-1" aria-label="StadiumBuddy is typing">
          <span 
            className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" 
            style={{ animationDelay: "0ms", animationDuration: "1s" }} 
          />
          <span 
            className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" 
            style={{ animationDelay: "150ms", animationDuration: "1s" }} 
          />
          <span 
            className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" 
            style={{ animationDelay: "300ms", animationDuration: "1s" }} 
          />
        </div>
      </div>
    </div>
  );
}
