import React, { useState } from 'react';
import { Sparkles, Trash2, Crown, Zap } from 'lucide-react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { UpgradeModal } from '../components/premium/UpgradeModal';

export function Chat() {
  const clearChat = useStore((state) => state.clearChat);
  const chatHistory = useStore((state) => state.chatHistory);
  const user = useStore((state) => state.user);
  const setPremium = useStore((state) => state.setPremium);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isPremium = Boolean(user?.isPremium);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto w-full pb-4">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
            AI Financial Advisor
          </h2>
          {isPremium ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-bold">
              <Crown className="w-3.5 h-3.5" />
              <span>Spendly Pro Active</span>
            </span>
          ) : (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/25 text-secondary text-xs font-bold hover:bg-secondary/25 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Free Preview • Upgrade to Pro</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {chatHistory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear your conversation history?')) {
                  clearChat();
                }
              }}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-textSecondary hover:text-danger flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 min-h-0">
        <ChatWindow />
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
