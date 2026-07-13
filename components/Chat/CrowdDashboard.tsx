"use client";

import React, { useState } from "react";
import { getGates } from "@/lib/knowledgeBase";
import { getRecommendation } from "@/lib/recommendationEngine";
import { RecommendationResponse, Gate } from "@/types/stadium";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import RecommendationCard from "./RecommendationCard";

export default function CrowdDashboard() {
  const [gates, setGates] = useState<Gate[]>(() => getGates());
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  // Purely visual presentations of minimum/maximum boundaries for CSS badges
  const sortedGates = [...gates].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
  const minWaitGateId = sortedGates[0]?.id;
  const maxWaitGateId = sortedGates[sortedGates.length - 1]?.id;

  const handleGlobalRecommendation = () => {
    const response = getRecommendation("Which gate currently has the shortest queue?");
    setResult(response);
  };

  const handleGateRecommendation = (gateName: string) => {
    const response = getRecommendation(`How busy is ${gateName} right now?`);
    setResult(response);
  };

  const handleRefresh = () => {
    // Reload gates data (simulates telemetry sync)
    setGates(getGates());
    setResult(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between select-none">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-400" />
              Crowd Intelligence Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Live queue metrics and crowd density monitoring across all stadium gates.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-9 gap-1.5 cursor-pointer hover:bg-secondary border-border"
              aria-label="Refresh telemetry feed"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync Data
            </Button>
            <Button
              size="sm"
              onClick={handleGlobalRecommendation}
              className="h-9 bg-emerald-500 hover:bg-emerald-600 text-background font-semibold cursor-pointer shadow-lg shadow-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500"
              id="crowd-view-shortest"
            >
              Shortest Queue Info
            </Button>
          </div>
        </div>

        {/* Gates Grid list */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gates.map((gate) => {
            const isLeast = gate.id === minWaitGateId;
            const isHighest = gate.id === maxWaitGateId;

            return (
              <Card
                key={gate.id}
                id={`crowd-card-${gate.id}`}
                className={`border bg-card/60 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg ${
                  isLeast
                    ? "border-emerald-500/30 shadow-emerald-950/5"
                    : isHighest
                    ? "border-red-500/20 shadow-red-950/5"
                    : "border-border/40"
                }`}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg font-bold">{gate.name}</CardTitle>
                    <span className="text-[11px] text-muted-text">
                      {gate.stadiumSectionServed.split(",")[0]}
                    </span>
                  </div>
                  {/* Visually represent minimum and maximum status purely for UI rendering */}
                  {isLeast && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 select-none">
                      <CheckCircle className="h-3 w-3" />
                      Clear
                    </span>
                  )}
                  {isHighest && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-bold text-red-400 select-none">
                      <AlertTriangle className="h-3 w-3" />
                      Congested
                    </span>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-center py-2.5 rounded-lg bg-secondary/35 border border-border/20">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-text">
                        Wait Time
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {gate.estimatedWaitMinutes}m
                      </span>
                    </div>
                    <div className="flex flex-col border-l border-border/25">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-text">
                        Crowd Level
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          gate.crowdLevel === "High"
                            ? "text-red-400"
                            : gate.crowdLevel === "Medium"
                            ? "text-yellow-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {gate.crowdLevel}
                      </span>
                    </div>
                  </div>

                  {/* Operational recommendation button */}
                  <Button
                    variant="ghost"
                    onClick={() => handleGateRecommendation(gate.name)}
                    className="w-full text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 py-1.5 h-8 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg cursor-pointer"
                  >
                    Check Entry Advice
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Display recommendation result card */}
        {result && (
          <div className="space-y-4 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center select-none">
              Recommendation Outcome
            </p>
            <RecommendationCard response={result} />
          </div>
        )}
      </div>
    </div>
  );
}
