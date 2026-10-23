import React, { useState } from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { LockedPaywall } from '../components/premium/LockedPaywall';
import { UpgradeModal } from '../components/premium/UpgradeModal';

export function Chat() {
  const clearChat = useStore(state => state.clearChat);
  const chatHistory = useStore(state => state.chatHistory);
  const user = useStore(state => state.user);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isPremium = Boolean(user?.isPremium);

  // If user has not purchased premium, display the locked paywall showcase
  if (!isPremium) {
    return <LockedPaywall />;
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full relative">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-textPrimary">AI Advisor</h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span>💎</span>
            <span>Spendly Pro Active</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => setIsUpgradeModalOpen(true)}
            className="text-xs text-muted hover:text-textPrimary"
          >
            Manage Plan
          </Button>

          {chatHistory.length > 0 && (
            <Button 
              variant="ghost" 
              onClick={() => {
                if (window.confirm("Are you sure you want to clear the chat history?")) {
                  clearChat();
                }
              }}
              className="text-muted hover:text-red-500"
            >
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatWindow />
      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
}
