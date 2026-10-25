import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, User } from 'lucide-react';
import { toast } from '../ui/Toast';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  // Typewriter effect for AI message
  const [displayedContent, setDisplayedContent] = useState(
    message.isNew && !isUser ? '' : message.content
  );

  useEffect(() => {
    if (message.isNew && !isUser) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedContent(message.content.substring(0, i));
        i += 2;
        if (i > message.content.length) {
          clearInterval(interval);
          message.isNew = false;
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [message, isUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col ${
        isUser ? 'items-end' : 'items-start'
      } max-w-3xl mx-auto w-full group relative mb-4`}
    >
      <div className="flex items-end gap-2.5 max-w-[88%] sm:max-w-[80%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-2xl neu-icon-box flex items-center justify-center shrink-0 text-primary bg-primary/10 border border-primary/20 mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
        )}

        <div
          className={`px-5 py-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap transition-all
            ${
              isUser
                ? 'neu-btn-secondary text-white rounded-3xl rounded-br-sm shadow-neu-secondary'
                : 'bg-surface neu-card border border-white/90 text-textPrimary rounded-3xl rounded-bl-sm shadow-neu-sm'
            }
          `}
        >
          {displayedContent}

          {message.isNew &&
            !isUser &&
            displayedContent.length < message.content.length && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-primary animate-pulse align-middle" />
            )}
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-2xl neu-icon-box flex items-center justify-center shrink-0 text-secondary bg-secondary/10 border border-secondary/20 mb-1">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Copy button for AI responses */}
      {!isUser && (
        <button
          onClick={handleCopy}
          className="neu-btn px-2 py-1 rounded-lg text-[10px] text-textSecondary hover:text-textPrimary flex items-center gap-1 mt-1 ml-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Copy response"
        >
          {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      )}
    </div>
  );
}
