import { create } from 'zustand';
import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },
}));

export const toast = {
  success: (msg) => useToastStore.getState().addToast(msg, 'success'),
  error: (msg) => useToastStore.getState().addToast(msg, 'error'),
  info: (msg) => useToastStore.getState().addToast(msg, 'info'),
};

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const isError = t.type === 'error';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl neu-card border border-white/80 text-sm font-semibold transition-all transform animate-in slide-in-from-top-2 duration-200
              ${isError ? 'text-danger' : 'text-primary'}`}
          >
            {isError ? (
              <AlertCircle className="w-5 h-5 shrink-0 text-danger" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-primary" />
            )}
            <span className="text-textPrimary font-medium text-xs sm:text-sm">{t.message}</span>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
