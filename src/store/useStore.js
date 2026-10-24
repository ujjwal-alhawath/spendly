import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/formatters';

// Generate realistic seed transactions centered around current date
const generateInitialTransactions = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // Helper to format date string YYYY-MM-DD
  const d = (day) => `${year}-${month}-${String(day).padStart(2, '0')}`;
  
  // Previous months
  const prevMonthDate = new Date(year, now.getMonth() - 1, 15);
  const pYear = prevMonthDate.getFullYear();
  const pMonth = String(prevMonthDate.getMonth() + 1).padStart(2, '0');
  const pd = (day) => `${pYear}-${pMonth}-${String(day).padStart(2, '0')}`;

  const twoMonthsAgoDate = new Date(year, now.getMonth() - 2, 15);
  const p2Year = twoMonthsAgoDate.getFullYear();
  const p2Month = String(twoMonthsAgoDate.getMonth() + 1).padStart(2, '0');
  const p2d = (day) => `${p2Year}-${p2Month}-${String(day).padStart(2, '0')}`;

  return [
    // Current Month Income
    { id: generateId(), title: 'Tech Corp Monthly Salary', amount: 85000, category: 'Salary', type: 'income', date: d(1), note: 'Direct deposit', createdAt: Date.now() - 1000000 },
    { id: generateId(), title: 'Freelance UI/UX Project', amount: 24000, category: 'Freelance', type: 'income', date: d(12), note: 'Client milestone delivery', createdAt: Date.now() - 850000 },
    { id: generateId(), title: 'Stock Dividend Payout', amount: 6500, category: 'Investment', type: 'income', date: d(18), note: 'Quarterly payout', createdAt: Date.now() - 650000 },

    // Current Month Expenses
    { id: generateId(), title: 'Organic Market Groceries', amount: 4850, category: 'Food', type: 'expense', date: d(3), note: 'Weekly produce & groceries', createdAt: Date.now() - 950000 },
    { id: generateId(), title: 'Apartment Fiber Internet', amount: 1499, category: 'Bills', type: 'expense', date: d(5), note: '1 Gbps plan', createdAt: Date.now() - 900000 },
    { id: generateId(), title: 'Fuel & Highway Tolls', amount: 3200, category: 'Transport', type: 'expense', date: d(7), note: 'Shell gas station', createdAt: Date.now() - 880000 },
    { id: generateId(), title: 'Artisan Cafe & Bakery', amount: 1250, category: 'Food', type: 'expense', date: d(9), note: 'Team breakfast', createdAt: Date.now() - 820000 },
    { id: generateId(), title: 'Premium Gym & Spa Membership', amount: 3500, category: 'Health', type: 'expense', date: d(11), note: 'Monthly membership', createdAt: Date.now() - 780000 },
    { id: generateId(), title: 'Noise-Cancelling Headphones', amount: 8999, category: 'Shopping', type: 'expense', date: d(14), note: 'Workspace audio upgrade', createdAt: Date.now() - 720000 },
    { id: generateId(), title: 'IMAX Cinema & Concessions', amount: 1850, category: 'Entertainment', type: 'expense', date: d(16), note: 'Weekend movie', createdAt: Date.now() - 680000 },
    { id: generateId(), title: 'Electricity & Utility Bill', amount: 3800, category: 'Bills', type: 'expense', date: d(19), note: 'Power & water', createdAt: Date.now() - 500000 },
    { id: generateId(), title: 'Gourmet Bistro Dinner', amount: 2600, category: 'Food', type: 'expense', date: d(21), note: 'Dinner with family', createdAt: Date.now() - 400000 },

    // Previous Month (1 month ago)
    { id: generateId(), title: 'Tech Corp Monthly Salary', amount: 85000, category: 'Salary', type: 'income', date: pd(1), note: 'Salary', createdAt: Date.now() - 3000000 },
    { id: generateId(), title: 'Supermarket Groceries', amount: 7200, category: 'Food', type: 'expense', date: pd(5), note: '', createdAt: Date.now() - 2900000 },
    { id: generateId(), title: 'Utilities & Power', amount: 3600, category: 'Bills', type: 'expense', date: pd(10), note: '', createdAt: Date.now() - 2800000 },
    { id: generateId(), title: 'Apparel & Footwear', amount: 6400, category: 'Shopping', type: 'expense', date: pd(15), note: '', createdAt: Date.now() - 2700000 },
    { id: generateId(), title: 'Car Maintenance & Service', amount: 4500, category: 'Transport', type: 'expense', date: pd(22), note: '', createdAt: Date.now() - 2600000 },

    // 2 Months ago
    { id: generateId(), title: 'Tech Corp Monthly Salary', amount: 82000, category: 'Salary', type: 'income', date: p2d(1), note: 'Salary', createdAt: Date.now() - 6000000 },
    { id: generateId(), title: 'Groceries & Household', amount: 6900, category: 'Food', type: 'expense', date: p2d(6), note: '', createdAt: Date.now() - 5900000 },
    { id: generateId(), title: 'Online Electronics Store', amount: 11200, category: 'Shopping', type: 'expense', date: p2d(14), note: '', createdAt: Date.now() - 5800000 },
    { id: generateId(), title: 'Health Insurance Premium', amount: 4200, category: 'Health', type: 'expense', date: p2d(20), note: '', createdAt: Date.now() - 5700000 },
  ];
};

export const useStore = create(
  persist(
    (set, get) => ({
      user: {
        name: 'Alex Morgan',
        email: 'alex.morgan@spendly.app',
        isPremium: true,
      },
      token: 'demo-token-active',
      isAuthenticated: true,
      currency: 'INR', // 'INR' | 'USD' | 'EUR' | 'GBP'
      expenses: generateInitialTransactions(),
      monthlyBudget: 35000,
      categoryBudgets: {
        Food: 8000,
        Shopping: 10000,
        Transport: 5000,
        Bills: 6000,
        Entertainment: 3000,
        Health: 4000,
        Other: 2000,
      },
      chatHistory: [],

      // Auth actions
      login: (userData, token) =>
        set({ user: userData, token, isAuthenticated: true }),
      signup: (userData, token) =>
        set({ user: userData, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
      setPremium: (isPremium = true) =>
        set((state) => ({
          user: state.user ? { ...state.user, isPremium } : null,
        })),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : userData,
        })),

      // Preferences
      setCurrency: (currency) => set({ currency }),

      // Transaction CRUD
      addExpense: (expenseData) =>
        set((state) => ({
          expenses: [
            {
              ...expenseData,
              type: expenseData.type || 'expense',
              id: generateId(),
              createdAt: Date.now(),
            },
            ...state.expenses,
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

      // Budget actions
      setBudget: (amount) =>
        set(() => ({
          monthlyBudget: amount > 0 ? Number(amount) : 35000,
        })),

      setCategoryBudget: (category, amount) =>
        set((state) => ({
          categoryBudgets: {
            ...state.categoryBudgets,
            [category]: Number(amount) || 0,
          },
        })),

      // Reset / Demo actions
      loadDemoData: () =>
        set(() => ({
          expenses: generateInitialTransactions(),
          monthlyBudget: 35000,
        })),

      clearAllExpenses: () =>
        set(() => ({
          expenses: [],
        })),

      // Chat history
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
      name: 'spendly-storage-neu-v1',
    }
  )
);
