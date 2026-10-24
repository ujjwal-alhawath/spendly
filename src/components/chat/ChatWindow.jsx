import React, { useRef, useEffect, useState } from 'react';
import { Send, Sparkles, Bot, ShieldAlert } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAIChat } from '../../hooks/useAIChat';
import { MessageBubble } from './MessageBubble';
import { PromptChips } from './PromptChips';
import { TypingIndicator } from './TypingIndicator';
import { NeumorphicCard } from '../ui/NeumorphicCard';

export function ChatWindow() {
  const chatHistory = useStore((state) => state.chatHistory);
  const { sendMessage, isTyping } = useAIChat();
  const [inputValue, setInputValue] = useState('');

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleChipClick = (text) => {
    sendMessage(text);
  };

  return (
    <NeumorphicCard p="p-0" className="flex flex-col h-full overflow-hidden border border-white/80">
      {/* Scrollable Message History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto py-8">
            <div className="w-16 h-16 rounded-3xl neu-icon-box flex items-center justify-center text-primary bg-primary/10 border border-primary/20 mb-4 shadow-neu-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-textPrimary tracking-tight mb-2">
              Gemini AI Financial Advisor
            </h3>
            <p className="text-xs sm:text-sm text-textSecondary mb-8 leading-relaxed max-w-md">
              Ask questions about your transactions, spending habits, category breakdowns, or request personalized budgeting recommendations.
            </p>
            <PromptChips onSelect={handleChipClick} />
          </div>
        ) : (
          <>
            {chatHistory.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="max-w-3xl mx-auto w-full">
                <TypingIndicator />
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </>
        )}
      </div>

      {/* Input Bar & Disclaimer */}
      <div className="p-4 border-t border-border/40 bg-surface/70 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              placeholder="Ask anything about your spending or budget..."
              className="w-full bg-surface neu-inset text-textPrimary placeholder:text-textSecondary/60 rounded-full pl-6 pr-14 py-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 neu-btn-primary rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-neu-accent active:scale-95 transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] text-textSecondary/70 text-center">
            <ShieldAlert className="w-3 h-3" />
            <span>
              Spendly AI provides informational guidance based on your records. Not financial guarantees.
            </span>
          </div>
        </form>
      </div>
    </NeumorphicCard>
  );
}
