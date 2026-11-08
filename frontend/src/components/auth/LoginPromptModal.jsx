import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, UserPlus, ArrowRight, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function LoginPromptModal() {
  const isAuthModalOpen = useStore((state) => state.isAuthModalOpen);
  const authModalMessage = useStore((state) => state.authModalMessage);
  const closeAuthModal = useStore((state) => state.closeAuthModal);
  const navigate = useNavigate();

  if (!isAuthModalOpen) return null;

  const handleLogin = () => {
    closeAuthModal();
    navigate('/login');
  };

  const handleSignup = () => {
    closeAuthModal();
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263449]/40 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-surface neu-card rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative shadow-neu-lg border border-white/80 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full neu-btn flex items-center justify-center text-textSecondary hover:text-textPrimary transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="w-14 h-14 rounded-3xl neu-icon-box bg-primary/10 text-primary border border-primary/25 flex items-center justify-center shadow-neu-sm">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
              Sign In to Continue
            </h3>
            <p className="text-xs sm:text-sm text-textSecondary mt-2 leading-relaxed">
              {authModalMessage ||
                'You are currently exploring Spendly in Guest Mode. Please log in or sign up to add transactions, customize your budget, and securely save your financial records.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="neu-btn-primary w-full py-3.5 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-neu-accent"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In to Your Account</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          <button
            onClick={handleSignup}
            className="neu-btn w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-textPrimary hover:text-primary flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account</span>
          </button>

          <button
            onClick={closeAuthModal}
            className="text-xs font-semibold text-textSecondary hover:text-textPrimary py-1 cursor-pointer transition-colors text-center mt-1"
          >
            Continue exploring in Guest Mode
          </button>
        </div>
      </div>
    </div>
  );
}

