"use client";

import React, { useState } from "react";
import { getAccessibilityData } from "@/lib/knowledgeBase";
import { getRecommendation } from "@/lib/recommendationEngine";
import { RecommendationResponse } from "@/types/stadium";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accessibility, Navigation, Key, ShieldAlert } from "lucide-react";
import RecommendationCard from "./RecommendationCard";

export default function AccessibilityAssistant() {
  const [data] = useState(() => getAccessibilityData());
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
            <Accessibility className="h-6 w-6 text-emerald-400" />
            Accessibility Support Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Dedicated assistance, step-free paths, and first aid guidance for all tournament fans.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button
            variant="outline"
            onClick={() => handleAction("Which accessible entrances are available?")}
            className="h-20 flex flex-col gap-1 items-center justify-center border-border/40 hover:bg-secondary cursor-pointer"
          >
            <Key className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold">Accessible Entry</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("Where are the elevators located?")}
            className="h-20 flex flex-col gap-1 items-center justify-center border-border/40 hover:bg-secondary cursor-pointer"
          >
            <Navigation className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold">Elevator Info</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("What wheelchair routes are active?")}
            className="h-20 flex flex-col gap-1 items-center justify-center border-border/40 hover:bg-secondary cursor-pointer"
          >
            <Accessibility className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold">Wheelchair Paths</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("Where is the nearest first aid or medical center?")}
            className="h-20 flex flex-col gap-1 items-center justify-center border-border/40 hover:bg-secondary cursor-pointer"
          >
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <span className="text-xs font-semibold">Medical Help</span>
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

        {/* Facility Information Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Wheelchair Paths & Elevators */}
          <Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                ♿ Step-Free Pathways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-1 text-sm text-muted-foreground">
              {data.wheelchairRoutes.map((r, i) => (
                <div key={i} className="flex flex-col gap-0.5 border-b border-border/10 pb-2.5 last:border-b-0 last:pb-0">
                  <span className="font-semibold text-foreground">{r.fromLocation} to {r.toLocation}</span>
                  <span>{r.description}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Elevators location list */}
          <Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                🛗 Stand Elevators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-1 text-sm text-muted-foreground">
              {data.elevators.map((e, i) => (
                <div key={i} className="flex flex-col gap-0.5 border-b border-border/10 pb-2.5 last:border-b-0 last:pb-0">
                  <span className="font-semibold text-foreground uppercase text-xs text-emerald-400">{e.id}</span>
                  <span>Located at {e.location}</span>
                  <span className="text-xs">Serves: {e.servesSections.join(", ")}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Restrooms & Assistance Hubs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Restrooms */}
          <Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                🚻 Accessible Restrooms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1 text-sm text-muted-foreground">
              {data.accessibleRestrooms.map((r, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/10 pb-2 last:border-b-0 last:pb-0">
                  <span>{r.location}</span>
                  {r.hasChangingTable && (
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground">
                      Changing Table
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Assistance desks */}
          <Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                ℹ️ Assistance Service Desks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-1 text-sm text-muted-foreground">
              {data.assistancePoints.map((a, i) => (
                <div key={i} className="flex flex-col gap-0.5 border-b border-border/10 pb-2.5 last:border-b-0 last:pb-0">
                  <span className="font-semibold text-foreground">{a.location}</span>
                  <span className="text-xs">Services: {a.services.join(", ")}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
