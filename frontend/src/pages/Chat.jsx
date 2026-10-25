import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  Crown,
  Lock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Brain,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { UpgradeModal } from '../components/premium/UpgradeModal';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { toast } from '../components/ui/Toast';

export function Chat() {
  const clearChat = useStore((state) => state.clearChat);
  const chatHistory = useStore((state) => state.chatHistory);
  const user = useStore((state) => state.user);
  const setPremium = useStore((state) => state.setPremium);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isPremium = Boolean(user?.isPremium);

  // If user is NOT premium, render the full locked view
  if (!isPremium) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto w-full pb-4">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
              AI Financial Advisor
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Pro Plan Required • Locked</span>
            </span>
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="neu-btn px-3.5 py-1.5 rounded-xl text-xs font-bold text-secondary hover:text-primary flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-secondary" />
            <span>View Pro Plans</span>
          </button>
        </div>

        {/* Main Locked Showcase View */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <NeumorphicCard className="p-6 sm:p-10 border border-white/90 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center shadow-xl">
            {/* Background Decorative Soft Gradients */}
            <div className="w-72 h-72 rounded-full bg-secondary/10 absolute -top-16 -right-16 blur-3xl pointer-events-none" />
            <div className="w-72 h-72 rounded-full bg-primary/10 absolute -bottom-16 -left-16 blur-3xl pointer-events-none" />

            {/* Lock / Sparkles Hero Emblem */}
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-3xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/15 border border-secondary/30 shadow-neu-sm">
                <Brain className="w-10 h-10 stroke-[1.75]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center absolute -top-1.5 -right-1.5 ring-4 ring-surface shadow-md">
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Badge & Headlines */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold mb-3">
              <Crown className="w-3.5 h-3.5" />
              <span>SPENDLY PRO EXCLUSIVE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-textPrimary tracking-tight mb-3 max-w-xl">
              AI Financial Advisor is Locked
            </h3>

            <p className="text-xs sm:text-sm text-textSecondary max-w-xl mb-8 leading-relaxed">
              Unlock conversational financial intelligence powered by{' '}
              <strong className="text-textPrimary font-bold">Google Gemini 2.0 Flash</strong>.
              Connect your actual transactions and budgets for tailored money-saving audits,
              spending forecasts, and unlimited 1-on-1 financial advice.
            </p>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl mb-8 text-left">
              <div className="p-4 rounded-2xl neu-inset border border-white/70 bg-surface/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/15 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-textPrimary mb-0.5">
                    Real Context Intelligence
                  </h4>
                  <p className="text-[11px] text-textSecondary leading-snug">
                    Answers questions referencing your actual incomes, top categories, and monthly targets.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl neu-inset border border-white/70 bg-surface/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/15 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-textPrimary mb-0.5">
                    Leak & Waste Detection
                  </h4>
                  <p className="text-[11px] text-textSecondary leading-snug">
                    Identifies repetitive subscriptions and high dine-out frequency to boost savings by 20%+.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl neu-inset border border-white/70 bg-surface/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-blue-500 bg-blue-500/15 shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-textPrimary mb-0.5">
                    Smart Budget Forecasts
                  </h4>
                  <p className="text-[11px] text-textSecondary leading-snug">
                    Predictive alerts that warn you before you exceed specific category targets.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl neu-inset border border-white/70 bg-surface/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-amber-500 bg-amber-500/15 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-textPrimary mb-0.5">
                    Unlimited Conversations
                  </h4>
                  <p className="text-[11px] text-textSecondary leading-snug">
                    Zero query limits. Ask as many questions, debt payoff plans, or scenario models as you wish.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="neu-btn-primary px-8 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 shadow-neu-accent hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Unlock Spendly Pro Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <button
                onClick={() => {
                  setPremium(true);
                  toast.success('🎉 Spendly Pro preview unlocked for testing!');
                }}
                className="neu-btn px-4 py-3 rounded-2xl text-xs font-bold text-textSecondary hover:text-primary transition-all cursor-pointer"
                title="Quick activation for developer / sandbox review"
              >
                Instant Test Unlock
              </button>
            </div>

            {/* Security Assurance */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-textSecondary">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Instant activation • Cancel anytime • 30-day money-back guarantee</span>
            </div>
          </NeumorphicCard>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
        />
      </div>
    );
  }

  // Premium User View: Full Interactive AI Advisor
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto w-full pb-4">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
            AI Financial Advisor
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>Spendly Pro Active</span>
          </span>
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

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-textSecondary hover:text-textPrimary transition-all cursor-pointer"
          >
            Manage Pro
          </button>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 min-h-0">
        <ChatWindow />
      </div>

      {/* Upgrade / Manage Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
