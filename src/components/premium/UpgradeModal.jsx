import React, { useState } from 'react';
import { Crown, Sparkles, Check, X, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';
import { Button } from '../ui/Button';

export function UpgradeModal({ isOpen, onClose }) {
  const { user, token, setPremium } = useStore();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (targetPremiumStatus = true) => {
    setIsProcessing(true);
    try {
      if (token) {
        const response = await fetch('http://localhost:5000/api/auth/upgrade-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPremium: targetPremiumStatus }),
        });

        if (response.ok) {
          const data = await response.json();
          setPremium(data.user.isPremium);
        } else {
          setPremium(targetPremiumStatus);
        }
      } else {
        setPremium(targetPremiumStatus);
      }

      if (targetPremiumStatus) {
        toast.success('🎉 Welcome to Spendly Pro! AI Advisor is now unlocked.');
      } else {
        toast.success('Switched to Free tier for testing.');
      }
      onClose();
    } catch (err) {
      setPremium(targetPremiumStatus);
      toast.success(targetPremiumStatus ? '🎉 Spendly Pro unlocked!' : 'Plan updated');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const isCurrentPremium = Boolean(user?.isPremium);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#263449]/35 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-lg rounded-3xl neu-card border border-white/90 flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border/40 relative">
          <button
            onClick={onClose}
            className="neu-btn absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-textSecondary hover:text-textPrimary transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>SPENDLY PRO</span>
          </div>

          <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">
            {isCurrentPremium
              ? 'Spendly Pro Membership'
              : 'Upgrade to Spendly Pro'}
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary mt-1">
            {isCurrentPremium
              ? 'You have unlimited access to our AI Financial Advisor and deep analytics.'
              : 'Unlock full conversational AI advisor, predictive trend insights, and unlimited queries.'}
          </p>

          {/* Billing Switcher */}
          {!isCurrentPremium && (
            <div className="mt-4 flex items-center justify-center">
              <div className="neu-pill-inset p-1 flex items-center">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'neu-pill text-textPrimary shadow-sm'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'neu-pill text-textPrimary shadow-sm'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <span>Annual billing</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                    Save 30%
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Details & Perks */}
        <div className="p-6 space-y-4">
          {!isCurrentPremium && (
            <div className="neu-inset p-5 rounded-2xl flex items-center justify-between border border-primary/20 bg-surface">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Pro Plan
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-textPrimary">
                    {billingCycle === 'monthly' ? '₹299' : '₹2,499'}
                  </span>
                  <span className="text-xs text-textSecondary font-medium">
                    {billingCycle === 'monthly' ? '/month' : '/year (₹208/mo)'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="neu-pill px-3 py-1 text-xs font-bold text-primary bg-primary/10 border border-primary/25">
                  Instant Activation
                </span>
                <p className="text-[11px] text-textSecondary mt-1">Cancel anytime</p>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider">
              Included with Pro:
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-textPrimary">
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>
                  <strong className="font-bold">Gemini 2.0 Flash Integration:</strong> Full contextual chat based on your actual income and expenses.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>
                  <strong className="font-bold">Actionable Budget Recommendations:</strong> Personalized guidance to reduce leaks and boost savings rate.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>
                  <strong className="font-bold">Zero Query Quotas:</strong> Unlimited advisor questions, budgeting audits, and trend forecasts.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-6 border-t border-border/40 bg-surface/50 flex flex-col gap-3">
          {!isCurrentPremium ? (
            <Button
              variant="primary"
              size="lg"
              disabled={isProcessing}
              onClick={() => handleUpgrade(true)}
              className="w-full neu-btn-primary shadow-neu-accent"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Upgrade...' : 'Unlock Spendly Pro Now'}</span>
            </Button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-2xl neu-inset text-center text-xs text-primary font-bold">
                💎 Spendly Pro is active on your account
              </div>
              <button
                onClick={() => handleUpgrade(false)}
                disabled={isProcessing}
                className="neu-btn w-full py-2.5 rounded-xl text-xs font-semibold text-textSecondary hover:text-danger cursor-pointer"
              >
                Downgrade to Free Tier (for testing)
              </button>
            </div>
          )}

          <p className="text-[11px] text-center text-textSecondary flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Instant sandbox checkout • 30-day money-back guarantee</span>
          </p>
        </div>
      </div>
    </div>
  );
}
