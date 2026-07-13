"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "@/types/stadium";
import ChatBubble from "./ChatBubble";
import SuggestedPrompts from "./SuggestedPrompts";
import QuickActionChips from "./QuickActionChips";
import TypingIndicator from "./TypingIndicator";
import EmergencyCards from "./EmergencyCards";
import { useLanguage } from "@/lib/LanguageContext";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  onSelectPrompt: (prompt: string) => void;
  onSelectAction: (question: string) => void;
}

export default function ChatMessages({
  messages,
  isTyping,
  onSelectPrompt,
  onSelectAction,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto scroll to bottom when new messages are added or when typing state changes
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const hasUserMessages = messages.some((m) => m.sender === "user");

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-background">
      <div className="mx-auto max-w-3xl flex flex-col min-h-full">
        {/* Render empty state with welcome, prompts, and chips */}
        {!hasUserMessages ? (
          <div className="flex flex-col flex-1 items-center justify-center py-6 space-y-6">
            {/* Welcome banner */}
            <div className="text-center max-w-lg space-y-2 select-none">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                🏟
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome to {t("appTitle")}
              </h2>
              <p className="text-[15px] text-body leading-relaxed">
                {"I'm your AI Stadium Companion for the FIFA World Cup 2026. Ask me about stadium gates, crowd queue wait times, accessibility facilities, eco-friendly transit, or emergency help."}
              </p>
            </div>

            {/* Suggested prompts card grid */}
            <SuggestedPrompts onSelectPrompt={onSelectPrompt} />

            {/* Quick Action Chips list */}
            <QuickActionChips
              onSelectAction={onSelectAction}
              disabled={isTyping}
            />

            {/* Emergency Quick Action Cards */}
            <EmergencyCards
              onSelectEmergency={onSelectAction}
              disabled={isTyping}
            />
          </div>
        ) : (
          <div className="flex-1 space-y-2">
            {/* Render Quick Action Chips at the top of the chat thread for convenience */}
            <div className="sticky top-0 z-20 pb-4 pt-1 bg-background/95 backdrop-blur-sm border-b border-border/10 flex justify-center">
              <QuickActionChips
                onSelectAction={onSelectAction}
                disabled={isTyping}
              />
            </div>

            {/* Chat Bubble log */}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}

            {/* Anchor for auto scroll */}
            <div ref={scrollRef} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
}
