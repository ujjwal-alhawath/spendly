import React, { useState } from 'react';
import { UpgradeModal } from './UpgradeModal';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';

export function LockedPaywall() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, setPremium } = useStore();
  const [isInstantUnlocking, setIsInstantUnlocking] = useState(false);

  const handleQuickUnlock = async () => {
    setIsInstantUnlocking(true);
    try {
      if (token) {
        const res = await fetch('http://localhost:5000/api/auth/upgrade-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isPremium: true })
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
      toast.success('🎉 Spendly Pro unlocked! AI Advisor is ready to chat.');
    } catch (err) {
      setPremium(true);
      toast.success('🎉 Spendly Pro unlocked!');
    } finally {
      setIsInstantUnlocking(false);
    }
  };

  return (
    <>
      <div className="relative w-full h-full min-h-[580px] flex items-center justify-center p-4 md:p-6 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Main locked showcase container */}
        <div className="relative w-full max-w-4xl bg-[#13141E]/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
          
          {/* Top lock badge */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-purple-500/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/10">
              <span className="relative z-10">🔒</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center shadow">
                💎
              </div>
            </div>
          </div>

          {/* Badges & Headers */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>✨</span>
            <span>Premium Exclusive Feature</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Unlock Spendly AI Advisor
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mb-8 leading-relaxed">
            Get instant financial intelligence tailored specifically to your expenses. Powered by Google Gemini 2.5 Flash with live spending context.
          </p>

          {/* Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8 text-left">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="text-sm font-semibold text-white mb-1">Deep Spending Insights</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Identify hidden money leaks, month-over-month variances, and high-frequency expense spikes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="text-sm font-semibold text-white mb-1">Custom Savings Strategy</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive step-by-step guidance to save for your goals based on your active monthly budget.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="text-sm font-semibold text-white mb-1">Unlimited 24/7 Queries</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Chat anytime with zero prompt limits, instant response speeds, and complete data privacy.
              </p>
            </div>
          </div>

          {/* Blurred preview teaser */}
          <div className="w-full max-w-2xl bg-black/40 border border-white/5 rounded-xl p-4 mb-8 relative overflow-hidden text-left select-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#13141E]/80 to-[#13141E] backdrop-blur-[3px] flex items-center justify-center z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 text-xs text-gray-300 shadow-md">
                <span>🔒</span>
                <span>Pro Member Access Only</span>
              </div>
            </div>

            <div className="space-y-3 opacity-60">
              <div className="flex items-start gap-2 max-w-[80%]">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">You</span>
                <p className="text-xs text-gray-300">Where am I overspending this month?</p>
              </div>
              <div className="flex items-start gap-2 max-w-[80%] pl-4 border-l border-emerald-500/30">
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Spendly AI</span>
                <p className="text-xs text-gray-400">
                  Looking at your ₹18,400 total spend, Dining & Food delivery accounted for 38% (₹7,000), which exceeds your recommended food allocation by ₹2,500...
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Unlock Spendly Pro — Starting at ₹299/mo</span>
              <span>✨</span>
            </button>

            <button
              onClick={handleQuickUnlock}
              disabled={isInstantUnlocking}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isInstantUnlocking ? (
                <span>Unlocking...</span>
              ) : (
                <>
                  <span>⚡ 1-Click Instant Upgrade (Demo)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
            <span>🛡️ Cancel anytime</span>
            <span>•</span>
            <span>Zero lock-in contract</span>
            <span>•</span>
            <span>Instant activation</span>
          </p>
        </div>
      </div>

      <UpgradeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
