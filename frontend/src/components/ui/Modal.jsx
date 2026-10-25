import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#263449]/35 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-surface w-full ${maxWidth} rounded-3xl neu-card border border-white/80 flex flex-col overflow-hidden shadow-2xl transition-all transform scale-100 animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <div>
            <h2 className="text-lg font-bold text-textPrimary tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-textSecondary mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="neu-btn w-9 h-9 rounded-full flex items-center justify-center text-textSecondary hover:text-textPrimary transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[82vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
