"use client";

import React, { useState } from "react";
import { getRecommendation } from "@/lib/recommendationEngine";
import { RecommendationResponse } from "@/types/stadium";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import RecommendationCard from "./RecommendationCard";

const SECTIONS = [
  { value: "Blocks 100-112", label: "North Stand (Blocks 100-112)" },
  { value: "Blocks 113-125", label: "East Stand (Blocks 113-125)" },
  { value: "Blocks 126-138", label: "South Stand (Blocks 126-138)" },
  { value: "Blocks 139-150", label: "West Stand (Blocks 139-150)" },
  { value: "Blocks 151-160", label: "North-West Stand (Blocks 151-160)" },
  { value: "VIP Club Lounge & Suites", label: "VIP Club Lounge & Suites" },
];

const ARRIVALS = [
  { value: "North", label: "North Plaza (Uber Drop-off / Parking 1)" },
  { value: "East", label: "East Plaza (Bus Terminal)" },
  { value: "South", label: "South Plaza (Metro Station Exit)" },
  { value: "West", label: "West Plaza (Bicycle Hub)" },
];

const PRIORITIES = [
  { value: "Fastest Entry", label: "Fastest Entry (Shortest Wait Queue)" },
  { value: "Least Crowded", label: "Least Crowded Gate" },
  { value: "Closest Gate", label: "Closest Gate (Minimal Walking)" },
  { value: "Accessible Route", label: "Accessible Route (Step-Free / Wheelchair Ramped)" },
];

export default function GateFinder() {
  const [section, setSection] = useState(SECTIONS[0].value);
  const [arrival, setArrival] = useState(ARRIVALS[0].value);
  const [priority, setPriority] = useState(PRIORITIES[0].value);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const handleFindGate = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the query naturally to feed the intent/recommendation engine
    let query = "";
    if (priority === "Accessible Route") {
      query = `I am in a wheelchair and need an accessible entrance to enter ${section} arriving from ${arrival} plaza.`;
    } else {
      query = `Which gate should I use for ${section} arriving from ${arrival} prioritizing ${priority}?`;
    }

    const response = getRecommendation(query);
    setResult(response);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center md:text-left select-none">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-2">
            <Compass className="h-6 w-6 text-emerald-400" />
            Smart Gate Finder
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Specify your seating block and arrival location to find the most efficient gate queue.
          </p>
        </div>

        <Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Search Parameters</CardTitle>
            <CardDescription className="text-xs">
              All recommendations are computed locally using live stadium crowd wait telemetry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFindGate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Section Select */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="section-select" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Stadium Section
                  </label>
                  <select
                    id="section-select"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Arrival Select */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="arrival-select" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Arrival Plaza
                  </label>
                  <select
                    id="arrival-select"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {ARRIVALS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Select */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="priority-select" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Fan Priority
                  </label>
                  <select
                    id="priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-background font-semibold cursor-pointer shadow-lg shadow-emerald-500/10 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
                  id="gate-finder-submit"
                >
                  Find Recommended Gate
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Display recommendation result card */}
        {result && (
          <div className="space-y-4">
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
