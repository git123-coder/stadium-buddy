"use client";

import React, { useState } from "react";
import ChatContainer from "./ChatContainer";
import GateFinder from "./GateFinder";
import CrowdDashboard from "./CrowdDashboard";
import AccessibilityAssistant from "./AccessibilityAssistant";
import TransitSustainability from "./TransitSustainability";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Compass, Users, Accessibility, Leaf } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageToggle from "../LanguageToggle";

interface DashboardLayoutProps {
  onBack: () => void;
  initialTab?: TabType;
}

type TabType = "chat" | "gate" | "crowd" | "access" | "transit";

export default function DashboardLayout({ onBack, initialTab }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || "chat");
  const { t } = useLanguage();

  const navItems = [
    { id: "chat", label: "AI Assistant", icon: Bot },
    { id: "gate", label: "Gate Finder", icon: Compass },
    { id: "crowd", label: "Crowd Status", icon: Users },
    { id: "access", label: "Accessibility", icon: Accessibility },
    { id: "transit", label: "Green Transit", icon: Leaf },
  ] as const;

  const getNavLabel = (id: TabType, defaultLabel: string) => {
    switch (id) {
      case "chat":
        return "AI Assistant";
      case "gate":
        return t("bestGate");
      case "crowd":
        return t("crowdStatus");
      case "access":
        return t("accessibility");
      case "transit":
        return t("transport");
      default:
        return defaultLabel;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* 1. Desktop Sidebar Navigation */}
      <aside
        className="hidden md:flex flex-col w-64 border-r border-border/40 bg-card/40 backdrop-blur-sm p-4 select-none shrink-0"
        aria-label="Dashboard Sidebar"
      >
        {/* Brand logo */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            🏟 <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">{t("appTitle")}</span>
          </span>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = getNavLabel(item.id, item.label);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer transition-colors ${isActive
                    ? "bg-emerald-500 text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Back control & Language Switcher */}
        <div className="border-t border-border/40 pt-4 space-y-4">
          <div className="flex justify-center">
            <LanguageToggle />
          </div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full flex items-center justify-start gap-3 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Home
          </Button>
        </div>
      </aside>

      {/* 2. Main content block */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Mobile Header navigation */}
        <header className="flex md:hidden h-16 border-b border-border/40 bg-card/80 backdrop-blur-md items-center justify-between px-4 select-none animate-fade-in">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 cursor-pointer hover:bg-secondary text-muted-foreground"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-lg font-bold tracking-tight text-foreground">
              🏟 <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">{t("appTitle")}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>
        </header>

        {/* Swap views depending on tab selection */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative pb-20 md:pb-0">
          {activeTab === "chat" && <ChatContainer />}
          {activeTab === "gate" && <GateFinder />}
          {activeTab === "crowd" && <CrowdDashboard />}
          {activeTab === "access" && <AccessibilityAssistant />}
          {activeTab === "transit" && <TransitSustainability />}
        </main>

        {/* 3. Mobile Bottom navigation bar */}
        <nav
          className="flex md:hidden fixed bottom-0 left-0 right-0 h-20 pb-3 border-t border-border/40 bg-background/90 backdrop-blur-md items-center justify-around px-2 z-40 select-none"
          aria-label="Dashboard Bottom Tabs"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = getNavLabel(item.id, item.label);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 w-12 cursor-pointer transition-colors ${isActive ? "text-emerald-400" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-bold tracking-tight">{label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
