"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import DashboardLayout from "@/components/Chat/DashboardLayout";
import { LanguageProvider } from "@/lib/LanguageContext";

type TabType = "chat" | "gate" | "crowd" | "access" | "transit";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);

  if (activeTab !== null) {
    return (
      <LanguageProvider>
        <DashboardLayout
          initialTab={activeTab}
          onBack={() => setActiveTab(null)}
        />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Header onTryDemo={() => setActiveTab("chat")} />
      <main className="flex-1">
        <Hero onTryDemo={() => setActiveTab("chat")} />
        <FeatureCards onSelectFeature={(tab) => setActiveTab(tab)} />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
