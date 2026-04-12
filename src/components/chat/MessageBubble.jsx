import React, { useState, useEffect } from 'react';
import { toast } from '../ui/Toast';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
  // Simple "typewriter" effect for new AI messages
  const [displayedContent, setDisplayedContent] = useState(message.isNew && !isUser ? '' : message.content);
  
  useEffect(() => {
    if (message.isNew && !isUser) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedContent(message.content.substring(0, i));
        i++;
        if (i > message.content.length) {
          clearInterval(interval);
          message.isNew = false; // Mutate to prevent re-running
        }
      }, 15); // ms per character
      return () => clearInterval(interval);
    }
  }, [message]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl mx-auto w-full group relative mb-4`}>
      <div className="flex items-end gap-2 max-w-[85%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm mb-1">
            ✨
          </div>
        )}
        
        <div 
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm
            ${isUser 
              ? 'bg-secondary text-white rounded-2xl rounded-tr-sm' 
              : 'bg-card border border-border text-textPrimary rounded-2xl rounded-tl-sm'}
          `}
        >
          {displayedContent}
          
          {/* Blinking cursor for typewriter */}
          {message.isNew && !isUser && displayedContent.length < message.content.length && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-textPrimary animate-pulse align-middle" />
          )}
        </div>
      </div>

      {/* Copy button for AI messages (shows on hover) */}
      {!isUser && (
        <button 
          onClick={handleCopy}
          className="absolute -right-8 top-2 p-1.5 text-muted hover:text-textPrimary hover:bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy response"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}
