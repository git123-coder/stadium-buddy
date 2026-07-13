"use client";

import React from "react";
import { RecommendationResponse } from "@/types/stadium";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface RecommendationCardProps {
  response: RecommendationResponse | null;
}

export default function RecommendationCard({ response }: RecommendationCardProps) {
  if (!response) return null;

  const renderExplanation = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return (
      <div className="space-y-2.5 mt-3">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          // Bullet points
          if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
            const cleanLine = trimmed.replace(/^[•\-*]\s*/, "");
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5">
                <li className="text-[15px] sm:text-base text-body leading-relaxed">
                  {cleanLine}
                </li>
              </ul>
            );
          }

          // Semicolon list
          if (trimmed.includes("; ")) {
            const subLines = trimmed.split("; ");
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 my-1.5">
                {subLines.map((sub, sidx) => (
                  <li key={sidx} className="text-[15px] sm:text-base text-body leading-relaxed">
                    {sub}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={idx} className="text-[15px] sm:text-base text-body leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="border border-emerald-500/20 bg-emerald-950/5 shadow-lg shadow-emerald-950/5 max-w-2xl w-full mx-auto overflow-hidden transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-2 pb-2 bg-emerald-500/5 border-b border-emerald-500/10">
        <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
        <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 select-none">
          {response.title || "AI Recommendation"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {response.recommendation && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-3 text-base sm:text-lg font-bold text-primary-text leading-relaxed">
            {response.recommendation}
          </div>
        )}
        
        {response.explanation
          ? renderExplanation(response.explanation)
          : renderExplanation(response.recommendation)}
      </CardContent>
    </Card>
  );
}
