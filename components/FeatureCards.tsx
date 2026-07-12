"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, DoorOpen, Users, Accessibility, Leaf } from "lucide-react";

const features = [
  {
    id: "feature-ai-assistant",
    title: "AI Stadium Assistant",
    description: "Natural language stadium assistant for all your tournament questions.",
    icon: MessageSquare,
    badge: "AI Powered",
    color: "from-emerald-500/10 to-teal-500/5",
    iconColor: "text-emerald-400",
    borderColor: "group-hover:border-emerald-500/30",
  },
  {
    id: "feature-gate-rec",
    title: "Gate Recommendation",
    description: "Find the best stadium entrance based on your ticket and real-time transit data.",
    icon: DoorOpen,
    badge: "Smart Routing",
    color: "from-blue-500/10 to-cyan-500/5",
    iconColor: "text-blue-400",
    borderColor: "group-hover:border-blue-500/30",
  },
  {
    id: "feature-crowd-intel",
    title: "Crowd Intelligence",
    description: "Live crowd density and visualization to avoid congestion before and after matches.",
    icon: Users,
    badge: "Live Telemetry",
    color: "from-purple-500/10 to-pink-500/5",
    iconColor: "text-purple-400",
    borderColor: "group-hover:border-purple-500/30",
  },
  {
    id: "feature-accessibility",
    title: "Accessibility",
    description: "Dedicated wheelchair routes, elevator access locations, and customized support facilities.",
    icon: Accessibility,
    badge: "Inclusive Design",
    color: "from-amber-500/10 to-orange-500/5",
    iconColor: "text-amber-400",
    borderColor: "group-hover:border-amber-500/30",
  },
  {
    id: "feature-sustainability",
    title: "Transport & Sustainability",
    description: "Eco-friendly transit alternatives paired with live carbon-saving tracking stats.",
    icon: Leaf,
    badge: "Green Travel",
    color: "from-green-500/10 to-emerald-500/5",
    iconColor: "text-green-400",
    borderColor: "group-hover:border-green-500/30",
  },
];

export default function FeatureCards() {
  return (
    <section 
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="features-title"
    >
      <div className="text-center mb-12">
        <h2 
          id="features-title"
          className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
        >
          Explore Companion Features
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Tailored tools to elevate your tournament experience, ensuring seamless navigation, operations, and support throughout the game.
        </p>
      </div>

      {/* Grid Layout: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              id={feature.id}
              className={`group relative overflow-hidden border border-border bg-card/40 transition-all duration-300 hover:-translate-y-1 hover:bg-card/70 hover:shadow-xl hover:shadow-emerald-950/20`}
            >
              {/* Decorative subtle background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className={`rounded-xl bg-secondary p-3 ${feature.iconColor} ring-1 ring-border/50 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-medium tracking-wider uppercase bg-secondary px-2.5 py-1 rounded-full text-muted-foreground border border-border/50">
                  {feature.badge}
                </span>
              </CardHeader>

              <CardContent className="pt-4">
                <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300 mb-2">
                  {feature.title}
                </CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
