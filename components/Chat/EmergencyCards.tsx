"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, ShieldAlert, UserMinus, LogOut } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface EmergencyCardsProps {
  onSelectEmergency: (question: string) => void;
  disabled?: boolean;
}

export default function EmergencyCards({ onSelectEmergency, disabled }: EmergencyCardsProps) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "medical",
      category: "Medical Help",
      description: "Find nearest medical station",
      question: "Where is the nearest medical station?",
      icon: HeartPulse,
      color: "text-red-400 border-red-500/20 bg-red-950/5 hover:bg-red-950/10",
      buttonText: "Find Medical Station",
    },
    {
      id: "security",
      category: "Security Assistance",
      description: "Contact stadium security assistance",
      question: "Where can I get security assistance?",
      icon: ShieldAlert,
      color: "text-amber-400 border-amber-500/20 bg-amber-950/5 hover:bg-amber-950/10",
      buttonText: "Contact Security",
    },
    {
      id: "lostchild",
      category: "Lost Child Help",
      description: "Find lost child assistance point",
      question: "Where is the lost child assistance point?",
      icon: UserMinus,
      color: "text-blue-400 border-blue-500/20 bg-blue-950/5 hover:bg-blue-950/10",
      buttonText: "Locate Point",
    },
    {
      id: "exit",
      category: "Emergency Exit",
      description: "Locate nearest emergency exit",
      question: "Where is the nearest emergency exit?",
      icon: LogOut,
      color: "text-rose-400 border-rose-500/20 bg-rose-950/5 hover:bg-rose-950/10",
      buttonText: "Find Exit Way",
    },
  ];

  return (
    <div className="w-full space-y-3.5 select-none">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4.5 w-4.5 text-red-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {t("emergency")} Assistance
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className={`border transition-all duration-300 flex flex-col justify-between p-4 hover:-translate-y-1 hover:shadow-md ${card.color}`}
            >
              <CardHeader className="p-0 flex flex-row items-start gap-2.5 space-y-0">
                <div className="rounded-lg bg-background/50 p-2 border border-border/20">
                  <Icon className="h-5 w-5 shrink-0" />
                </div>
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-bold text-foreground">
                    {card.category}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {card.description}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <Button
                  onClick={() => onSelectEmergency(card.question)}
                  disabled={disabled}
                  variant="outline"
                  className="w-full text-xs font-bold border-border/40 hover:bg-secondary hover:text-foreground cursor-pointer h-11 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 rounded-lg"
                  id={`emergency-btn-${card.id}`}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
