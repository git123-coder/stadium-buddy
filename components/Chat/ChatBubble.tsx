"use client";

import React from "react";
import { Message } from "@/types/stadium";
import { Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === "user";

  const renderExplanation = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return (
      <div className="space-y-2.5 mt-2.5">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          // Check if it's a bullet point
          if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
            const cleanLine = trimmed.replace(/^[•\-*]\s*/, "");
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5">
                <li className="text-[15px] sm:text-base text-body leading-relaxed">
                  {cleanLine}
                </li>
              </ul>
            );
          }

          // Check if it's Semicolon-delimited lists
          if (trimmed.includes("; ")) {
            const subLines = trimmed.split("; ");
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 my-1.5">
                {subLines.map((sub, sidx) => (
                  <li key={sidx} className="text-[15px] sm:text-base text-body leading-relaxed">
                    {sub}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={idx} className="text-[15px] sm:text-base text-body leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex w-full items-start gap-3 my-4 animate-slide-in ${isUser ? "justify-end" : "justify-start"
        }`}
    >
      {/* Avatar for Assistant */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/10">
          <Bot className="h-5 w-5" />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md transition-all duration-300 ${isUser
          ? "rounded-tr-sm bg-emerald-500 text-background font-semibold"
          : "rounded-tl-sm border border-border/40 bg-card/60 backdrop-blur-sm"
          }`}
      >
        {isUser ? (
          <p className="text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        ) : (
          <div className="flex flex-col">
            {/* Header section with Title and Source Badge */}
            <div className="flex items-center justify-between gap-3 mb-1.5">
              {message.title ? (
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  ⚡ {message.title}
                </span>
              ) : (
                <span />
              )}
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0.5 font-semibold border-border/40 bg-secondary/30 text-muted-foreground select-none shrink-0"
              >
                {(message.source || "engine") === "gemini" ? (
                  <span className="flex items-center gap-1">
                    <span className="text-[8px] text-emerald-400">🟢</span> AI Powered
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span>⚙</span> Recommendation Engine
                  </span>
                )}
              </Badge>
            </div>

            {/* Main Recommendation Highlight Box */}
            {message.recommendation && (
              <div className="my-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-base sm:text-lg font-bold text-primary-text leading-relaxed shadow-inner">
                {message.recommendation}
              </div>
            )}

            {/* Explanation paragraph/list parsing */}
            {message.explanation
              ? renderExplanation(message.explanation)
              : renderExplanation(message.text)}

            {/* Timestamp */}
            <span className="mt-2 text-[10px] text-muted-text/75 text-right self-end select-none">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground shadow-sm">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
