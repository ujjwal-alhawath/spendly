import React, { useState } from 'react';
import { Crown, Sparkles, Lock, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { NeumorphicCard } from '../ui/NeumorphicCard';
import { API_BASE } from '../../constants';

export function LockedPaywall() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, setPremium } = useStore();
  const [isInstantUnlocking, setIsInstantUnlocking] = useState(false);

  const handleQuickUnlock = async () => {
    setIsInstantUnlocking(true);
    try {
      if (token) {
        const res = await fetch(`${API_BASE}/auth/upgrade-premium`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPremium: true }),
        });
        if (res.ok) {
          const data = await res.json();
          setPremium(data.user.isPremium);
        } else {
          setPremium(true);
        }
      } else {
        setPremium(true);
      }
      toast.success('🎉 Spendly Pro unlocked! AI Advisor is ready.');
    } catch (err) {
      setPremium(true);
      toast.success('🎉 Spendly Pro unlocked!');
    } finally {
      setIsInstantUnlocking(false);
    }
  };

  return (
    <>
      <div className="relative w-full h-full min-h-[580px] flex items-center justify-center p-4 md:p-6">
        <NeumorphicCard className="relative w-full max-w-4xl p-6 md:p-10 flex flex-col items-center text-center border border-white/90">
          {/* Top Lock Badge */}
          <div className="relative mb-5">
            <div className="w-18 h-18 rounded-3xl neu-icon-box flex items-center justify-center text-primary bg-primary/10 border border-primary/25 shadow-neu-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-neu-sm">
              <Crown className="w-4 h-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spendly Pro Feature</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight mb-2">
            Unlock Gemini AI Financial Advisor
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary max-w-xl mb-6 leading-relaxed">
            Get instant financial intelligence tailored directly to your expenses, monthly targets, and category leaks.
          </p>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6 text-left">
            <div className="p-4 rounded-2xl neu-inset bg-surface flex flex-col gap-1.5">
              <span className="text-xl">📊</span>
              <h4 className="text-xs font-bold text-textPrimary">Spending Diagnostics</h4>
              <p className="text-[11px] text-textSecondary leading-relaxed">
                Pinpoint high-variance cost drivers, dining leaks, and recurring subscription burdens.
              </p>
            </div>

            <div className="p-4 rounded-2xl neu-inset bg-surface flex flex-col gap-1.5">
              <span className="text-xl">🎯</span>
              <h4 className="text-xs font-bold text-textPrimary">Actionable Budgeting</h4>
              <p className="text-[11px] text-textSecondary leading-relaxed">
                Personalized roadmap to reach your savings targets based on actual monthly cash flow.
              </p>
            </div>

            <div className="p-4 rounded-2xl neu-inset bg-surface flex flex-col gap-1.5">
              <span className="text-xl">⚡</span>
              <h4 className="text-xs font-bold text-textPrimary">Unlimited Queries</h4>
              <p className="text-[11px] text-textSecondary leading-relaxed">
                Real-time answers with Google Gemini 2.0 Flash and complete local data privacy.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto shadow-neu-accent"
            >
              <Sparkles className="w-4 h-4" />
              <span>Unlock Spendly Pro — From ₹299/mo</span>
            </Button>

            <Button
              variant="surface"
              size="lg"
              disabled={isInstantUnlocking}
              onClick={handleQuickUnlock}
              className="w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span>{isInstantUnlocking ? 'Unlocking...' : '1-Click Instant Upgrade (Demo)'}</span>
            </Button>
          </div>

          <p className="text-[11px] text-textSecondary mt-4 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Cancel anytime • Zero risk • Instant activation</span>
          </p>
        </NeumorphicCard>
      </div>

      <UpgradeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
