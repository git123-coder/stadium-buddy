"use client";

import React, { useState } from "react";
import { getTransportOptions, getSustainabilityData } from "@/lib/knowledgeBase";
import { getRecommendation } from "@/lib/recommendationEngine";
import { RecommendationResponse, TransportOption, SustainabilityOption } from "@/types/stadium";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Clock, DollarSign, Award, ShieldCheck } from "lucide-react";
import RecommendationCard from "./RecommendationCard";

export default function TransitSustainability() {
  const [transports] = useState<TransportOption[]>(() => getTransportOptions());
  const [sustainabilities] = useState<SustainabilityOption[]>(() => getSustainabilityData());
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const handleAction = (question: string) => {
    const response = getRecommendation(question);
    setResult(response);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header Section */}
        <div className="text-center md:text-left select-none">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-2">
            <Leaf className="h-6 w-6 text-emerald-400" />
            Smart Transit & Sustainability
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compare public transport speeds, costs, carbon savings, and green score rankings.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => handleAction("How can I get to the stadium fastest?")}
            className="flex flex-col gap-1 items-center justify-center h-16 border-border/40 hover:bg-secondary text-xs font-semibold cursor-pointer"
          >
            <Clock className="h-4 w-4 text-emerald-400" />
            Fastest Route
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("What is the cheapest way to travel?")}
            className="flex flex-col gap-1 items-center justify-center h-16 border-border/40 hover:bg-secondary text-xs font-semibold cursor-pointer"
          >
            <DollarSign className="h-4 w-4 text-emerald-400" />
            Cheapest Option
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("Which transport option is most sustainable?")}
            className="flex flex-col gap-1 items-center justify-center h-16 border-border/40 hover:bg-secondary text-xs font-semibold cursor-pointer"
            id="sustain-greenest-btn"
          >
            <Leaf className="h-4 w-4 text-emerald-400" />
            Most Sustainable
          </Button>
        </div>

        {/* Display recommendation result card */}
        {result && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center select-none">
              Recommendation Outcome
            </p>
            <RecommendationCard response={result} />
          </div>
        )}

        {/* Comparison List/Cards */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            Transport Options Comparison
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {transports.map((t) => {
              const sustain = sustainabilities.find((s) => s.transportType === t.name);
              // Metro is marked as recommended option in static rules
              const isRecommended = t.name.toLowerCase().includes("metro");

              return (
                <Card
                  key={t.name}
                  className={`border bg-card/60 backdrop-blur-sm shadow-md transition-all duration-300 ${
                    isRecommended
                      ? "border-emerald-500/35 shadow-emerald-950/5"
                      : "border-border/40"
                  }`}
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Mode name and recommendation tag */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-foreground">{t.name}</span>
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 select-none">
                            <ShieldCheck className="h-3 w-3" />
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-body leading-relaxed">
                        {t.recommendedFor}
                      </p>
                    </div>

                    {/* Stats columns */}
                    <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6 shrink-0 border-t border-border/20 pt-3 sm:border-t-0 sm:pt-0">
                      {/* Time */}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-text" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase text-muted-text">Time</span>
                          <span className="text-sm font-bold text-foreground">{t.estimatedTimeMinutes}m</span>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-text" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase text-muted-text">Cost</span>
                          <span className="text-sm font-bold text-foreground">{t.estimatedCost}</span>
                        </div>
                      </div>

                      {/* CO2 Saved */}
                      {sustain && (
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-emerald-400" />
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-muted-text">CO₂ Saved</span>
                            <span className="text-sm font-bold text-emerald-400">+{sustain.co2SavedKg}kg</span>
                          </div>
                        </div>
                      )}

                      {/* Green Score */}
                      {sustain && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-emerald-400" />
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-muted-text">Green Score</span>
                            <span className="text-sm font-bold text-foreground">{sustain.greenScore}/100</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
