"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import DashboardLayout from "@/components/Chat/DashboardLayout";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return <DashboardLayout onBack={() => setShowDemo(false)} />;
  }

  return (
    <>
      <Header onTryDemo={() => setShowDemo(true)} />
      <main className="flex-1">
        <Hero onTryDemo={() => setShowDemo(true)} />
        <FeatureCards />
      </main>
      <Footer />
    </>
  );
}
