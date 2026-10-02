import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/formatters';



export const useStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      expenses: [],
      monthlyBudget: 15000,
      chatHistory: [],

      login: (userData) => set({ user: userData, isAuthenticated: true }),
      signup: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      addExpense: (expenseData) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expenseData, id: generateId(), createdAt: Date.now() },
          ],
        })),

      editExpense: (id, updatedData) =>
        set((state) => ({
          expenses: state.expenses.map((exp) =>
            exp.id === id ? { ...exp, ...updatedData } : exp
          ),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        })),

      setBudget: (amount) =>
        set(() => ({
          monthlyBudget: amount > 0 ? amount : 15000,
        })),

      addMessage: (message) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, message],
        })),

      clearChat: () =>
        set(() => ({
          chatHistory: [],
        })),
    }),
    {
      name: 'spendly-storage-v2', // bumped to clear old seed data
    }
  )
);
