import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/formatters';



export const useStore = create(
  persist(
    (set) => ({
      expenses: [],
      monthlyBudget: 15000,
      chatHistory: [],

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
