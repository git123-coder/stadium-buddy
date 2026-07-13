"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border/40 bg-background/90 p-4 backdrop-blur-md"
    >
      <div className="mx-auto max-w-3xl flex items-end gap-2 rounded-xl border border-emerald-500/60 bg-card/60 px-3 py-2.5 shadow-[0_0_8px_rgba(16,185,129,0.2)] focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-400 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask StadiumBuddy a question..."
          disabled={disabled}
          className="flex-1 max-h-40 min-h-[24px] resize-none bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Ask a question about stadium services"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || disabled}
          className="h-8 w-8 shrink-0 rounded-lg bg-emerald-500 text-background hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:bg-secondary disabled:text-muted-foreground/45 transition-colors cursor-pointer"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

    </form>
  );
}
