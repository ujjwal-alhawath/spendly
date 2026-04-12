import { create } from 'zustand';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
}));

export const toast = {
  success: (msg) => useToastStore.getState().addToast(msg, 'success'),
  error: (msg) => useToastStore.getState().addToast(msg, 'error'),
};

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transform transition-all duration-300 animate-fade-in-down
            ${t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-primary/10 border-primary/20 text-primary'}
          `}
        >
          {t.message}
        </div>
      ))}
    </div>,
    document.body
  );
}
