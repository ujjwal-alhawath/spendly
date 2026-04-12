import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAIChat } from '../../hooks/useAIChat';
import { MessageBubble } from './MessageBubble';
import { PromptChips } from './PromptChips';
import { TypingIndicator } from './TypingIndicator';

export function ChatWindow() {
  const chatHistory = useStore(state => state.chatHistory);
  const { sendMessage, isTyping } = useAIChat();
  const [inputValue, setInputValue] = useState('');
  
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
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
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden relative">
      
      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
        
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
            <span className="text-5xl mb-4">🤖</span>
            <h3 className="text-xl font-bold text-textPrimary mb-2">Spendly AI Advisor</h3>
            <p className="text-muted text-sm mb-8">
              I can analyze your spending patterns, compare months, and offer budgeting advice based on your exact data.
            </p>
            <PromptChips onSelect={handleChipClick} />
          </div>
        ) : (
          <>
            {chatHistory.map(msg => (
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

      {/* Input Bar */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 border-t border-border bg-card/50 backdrop-blur-sm"
      >
        <div className="relative max-w-3xl mx-auto flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Ask about your finances..."
            className="w-full bg-background border border-border rounded-full pl-6 pr-12 py-3.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-background rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors"
          >
            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
