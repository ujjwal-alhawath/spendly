import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';

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
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isPremium: targetPremiumStatus })
        });
        
        if (response.ok) {
          const data = await response.json();
          setPremium(data.user.isPremium);
        } else {
          // Fallback local update if network issue
          setPremium(targetPremiumStatus);
        }
      } else {
        setPremium(targetPremiumStatus);
      }

      if (targetPremiumStatus) {
        toast.success('🎉 Welcome to Spendly Pro! AI Advisor is now unlocked.');
      } else {
        toast.success('Switched back to Free plan for testing.');
      }
      onClose();
    } catch (err) {
      console.error(err);
      // Fallback local update
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#12131A] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decorative gradients */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
            aria-label="Close"
          >
            ✕
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span>✨</span>
            <span>SPENDLY PRO</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isCurrentPremium ? 'Your Spendly Pro Membership' : 'Upgrade to Spendly Pro'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isCurrentPremium 
              ? 'You have unlimited access to our AI Financial Advisor and premium features.' 
              : 'Unlock full AI Advisor chat, deep expense intelligence, and custom financial forecasting.'}
          </p>

          {/* Billing Switcher (if not premium) */}
          {!isCurrentPremium && (
            <div className="mt-5 flex items-center justify-center">
              <div className="bg-[#1A1B26] p-1 rounded-xl border border-white/5 flex items-center">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-emerald-500 text-black font-semibold shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-emerald-500 text-black font-semibold shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Annual billing
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">
                    Save 30%
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plan card / details */}
        <div className="p-6 space-y-5">
          {!isCurrentPremium && (
            <div className="bg-gradient-to-br from-emerald-500/10 via-purple-500/5 to-transparent p-5 rounded-xl border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Pro Plan</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '₹299' : '₹2,499'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {billingCycle === 'monthly' ? '/month' : '/year (₹208/mo)'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant Access
                </span>
                <p className="text-[11px] text-gray-400 mt-1">Cancel anytime</p>
              </div>
            </div>
          )}

          {/* Perks list */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Everything in Pro:
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 shrink-0 text-base">✓</span>
                <span>
                  <strong className="text-white">AI Financial Advisor:</strong> Unlimited real-time chats with Google Gemini 2.5 Flash trained on your financial data.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 shrink-0 text-base">✓</span>
                <span>
                  <strong className="text-white">Deep Context Analysis:</strong> Analyzes expense history, monthly budgets, and identifies unnecessary spending leaks.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 shrink-0 text-base">✓</span>
                <span>
                  <strong className="text-white">Custom Savings Plans:</strong> Get actionable steps to reach your targeted savings goals faster.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 shrink-0 text-base">✓</span>
                <span>
                  <strong className="text-white">Zero Request Limits:</strong> No cooldowns or daily query quotas.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex flex-col gap-3">
          {!isCurrentPremium ? (
            <button
              onClick={() => handleUpgrade(true)}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Processing Upgrade...</span>
                </>
              ) : (
                <>
                  <span>Unlock Spendly Pro Now</span>
                  <span>✨</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-medium">
                💎 Spendly Pro is active on your account
              </div>
              <button
                onClick={() => handleUpgrade(false)}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
              >
                Downgrade to Free (for testing)
              </button>
            </div>
          )}

          <p className="text-[11px] text-center text-gray-500">
            🔒 Secure 256-bit simulated checkout • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
