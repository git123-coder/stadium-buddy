"use client";

import React, { useState } from "react";
import { Message } from "@/types/stadium";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const INITIAL_MESSAGE: Message = {
  id: "welcome-message",
  sender: "assistant",
  timestamp: new Date(),
  text: "👋 Welcome to StadiumBuddy.\n\nI'm your AI Stadium Companion.\n\nAsk me about:\n\n• Best gate\n• Crowd status\n• Accessibility\n• Transport\n• Sustainability\n• Emergency assistance",
  source: "engine"
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    // 1. Add user message
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      timestamp: new Date(),
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const startTime = Date.now();
    const minDelay = Math.floor(Math.random() * 200) + 500; // 500 to 700ms

    (async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: text }),
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch from API chat endpoint: ${res.status}`);
        }
        const result = await res.json();

        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          const assistantMsg: Message = {
            id: `msg-${Date.now()}-assistant`,
            sender: "assistant",
            timestamp: new Date(),
            text: result.source === "gemini" ? result.explanation : (result.recommendation || result.explanation),
            title: result.title,
            recommendation: result.recommendation,
            explanation: result.explanation,
            source: result.source
          };

          setMessages((prev) => [...prev, assistantMsg]);
          setIsTyping(false);
        }, remainingDelay);
      } catch (error) {
        console.error("AI Service Error:", error);

        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          // Graceful fallback display
          const errorMsg: Message = {
            id: `msg-${Date.now()}-error`,
            sender: "assistant",
            timestamp: new Date(),
            text: "I encountered an error resolving your request. Please try again.",
            title: "System Error",
            recommendation: "System error occurred.",
            explanation: "Please check your network and try again.",
            source: "engine"
          };
          setMessages((prev) => [...prev, errorMsg]);
          setIsTyping(false);
        }, remainingDelay);
      }
    })();
  };

  return (
    <div className="flex flex-col h-full w-full bg-background border-x border-border/10 max-w-7xl mx-auto">
      {/* Messages viewport */}
      <ChatMessages
        messages={messages}
        isTyping={isTyping}
        onSelectPrompt={handleSendMessage}
        onSelectAction={handleSendMessage}
      />

      {/* Message input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
