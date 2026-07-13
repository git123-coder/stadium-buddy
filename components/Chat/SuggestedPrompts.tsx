"use client";

import React from "react";
import { MessageSquare, Accessibility, ShieldAlert, Navigation, HelpCircle } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    text: "Which gate should I use to enter the stadium?",
    label: "Gate Entrance",
    icon: Navigation,
    color: "text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40",
  },
  {
    text: "How busy is Gate C right now?",
    label: "Crowd Status",
    icon: MessageSquare,
    color: "text-purple-400 border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40",
  },
  {
    text: "Where is the nearest wheelchair entrance and elevator?",
    label: "Accessibility Info",
    icon: Accessibility,
    color: "text-amber-400 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40",
  },
  {
    text: "Which transport option is most sustainable?",
    label: "Green Transit",
    icon: HelpCircle,
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40",
  },
  {
    text: "I need medical help. Where is first aid?",
    label: "Emergency First Aid",
    icon: ShieldAlert,
    color: "text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/40",
  },
];

export default function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="w-full max-w-2xl px-4 py-2 select-none">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center sm:text-left">
        Suggested Prompts
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(p.text)}
              className={`flex items-start gap-3 rounded-xl border p-3.5 text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${p.color}`}
            >
              <div className="mt-0.5 rounded-lg bg-background/55 p-1.5 ring-1 ring-border/50 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {p.label}
                </span>
                <span className="text-sm font-medium text-foreground leading-tight">
                  {p.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
