"use client";

import React from "react";
import { Navigation, Users, Accessibility, Bus, Leaf, ShieldAlert } from "lucide-react";

interface QuickActionChipsProps {
  onSelectAction: (question: string) => void;
  disabled: boolean;
}

const chips = [
  {
    label: "Best Gate",
    question: "Which gate should I use to enter the stadium?",
    icon: Navigation,
    color: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30",
  },
  {
    label: "Crowd Status",
    question: "Is there a long queue anywhere?",
    icon: Users,
    color: "hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30",
  },
  {
    label: "Accessibility",
    question: "Tell me about accessibility features at the stadium",
    icon: Accessibility,
    color: "hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30",
  },
  {
    label: "Transport",
    question: "How can I get to the stadium or transport hubs?",
    icon: Bus,
    color: "hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30",
  },
  {
    label: "Sustainability",
    question: "Which transit option is most sustainable?",
    icon: Leaf,
    color: "hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30",
  },
  {
    label: "Emergency",
    question: "Where do I go in case of an emergency?",
    icon: ShieldAlert,
    color: "hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30",
  },
];

export default function QuickActionChips({ onSelectAction, disabled }: QuickActionChipsProps) {
  return (
    <div className="w-full max-w-2xl px-4 py-2 select-none">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {chips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectAction(chip.question)}
              className={`flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed ${chip.color}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
