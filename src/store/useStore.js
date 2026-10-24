import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/formatters';

const API_BASE = 'http://localhost:5000/api';

// Generate realistic seed transactions for DEMO / SAMPLE only
export const generateDemoTransactions = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const d = (day) => `${year}-${month}-${String(day).padStart(2, '0')}`;

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

    // Previous Months
    { id: generateId(), title: 'Tech Corp Monthly Salary', amount: 85000, category: 'Salary', type: 'income', date: pd(1), note: 'Salary', createdAt: Date.now() - 3000000 },
    { id: generateId(), title: 'Supermarket Groceries', amount: 7200, category: 'Food', type: 'expense', date: pd(5), note: '', createdAt: Date.now() - 2900000 },
    { id: generateId(), title: 'Utilities & Power', amount: 3600, category: 'Bills', type: 'expense', date: pd(10), note: '', createdAt: Date.now() - 2800000 },
    { id: generateId(), title: 'Apparel & Footwear', amount: 6400, category: 'Shopping', type: 'expense', date: pd(15), note: '', createdAt: Date.now() - 2700000 },

    { id: generateId(), title: 'Tech Corp Monthly Salary', amount: 82000, category: 'Salary', type: 'income', date: p2d(1), note: 'Salary', createdAt: Date.now() - 6000000 },
    { id: generateId(), title: 'Groceries & Household', amount: 6900, category: 'Food', type: 'expense', date: p2d(6), note: '', createdAt: Date.now() - 5900000 },
  ];
};

// Helper to get local storage key for a user
const getUserKey = (user) => {
  if (!user) return 'guest';
  return user.id || user._id || user.email || 'guest';
};

// Helper to load isolated user data from localStorage
const loadScopedUserData = (userKey) => {
  try {
    const raw = localStorage.getItem(`spendly_user_${userKey}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading scoped user data:', e);
  }
  return null;
};

// Helper to save isolated user data into localStorage
const saveScopedUserData = (userKey, data) => {
  try {
    localStorage.setItem(`spendly_user_${userKey}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving scoped user data:', e);
  }
};

const DEFAULT_CATEGORY_BUDGETS = {
  Food: 8000,
  Shopping: 10000,
  Transport: 5000,
  Bills: 6000,
  Entertainment: 3000,
  Health: 4000,
  Other: 2000,
};

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      currency: 'INR',
      expenses: [],
      monthlyBudget: 35000,
      categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
      chatHistory: [],
      notifications: [],

      // ==========================================
      // AUTHENTICATION & MULTI-USER ISOLATION
      // ==========================================

      login: async (userData, token) => {
        const userKey = getUserKey(userData);
        let userExpenses = [];
        let userBudget = 35000;
        let userCatBudgets = DEFAULT_CATEGORY_BUDGETS;
        let userChat = [];

        // 1. Try to fetch this user's real transactions from backend MongoDB
        if (token && token !== 'demo-token-12345') {
          try {
            const res = await fetch(`${API_BASE}/expenses`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                userExpenses = data;
              }
            }
          } catch (e) {
            console.warn('Backend expenses fetch failed, loading local cached data:', e);
          }
        }

        // 2. If backend had no records or was offline, check user's isolated local storage
        if (userExpenses.length === 0) {
          const cached = loadScopedUserData(userKey);
          if (cached) {
            userExpenses = cached.expenses || [];
            userBudget = cached.monthlyBudget || 35000;
            userCatBudgets = cached.categoryBudgets || DEFAULT_CATEGORY_BUDGETS;
            userChat = cached.chatHistory || [];
          } else if (userData.email === 'alex.morgan@spendly.app' || userKey === 'guest') {
            // Only demo account gets pre-populated demo data
            userExpenses = generateDemoTransactions();
          }
        }

        set({
          user: userData,
          token,
          isAuthenticated: true,
          expenses: userExpenses,
          monthlyBudget: userBudget,
          categoryBudgets: userCatBudgets,
          chatHistory: userChat,
        });

        // Save active state to user's scoped storage
        saveScopedUserData(userKey, {
          expenses: userExpenses,
          monthlyBudget: userBudget,
          categoryBudgets: userCatBudgets,
          chatHistory: userChat,
        });
      },

      signup: async (userData, token) => {
        const userKey = getUserKey(userData);

        // A brand new user account starts with clean 0 transactions!
        const cleanState = {
          expenses: [],
          monthlyBudget: 35000,
          categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
          chatHistory: [],
        };

        saveScopedUserData(userKey, cleanState);

        set({
          user: userData,
          token,
          isAuthenticated: true,
          expenses: [],
          monthlyBudget: 35000,
          categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
          chatHistory: [],
          notifications: [
            {
              id: 'welcome-' + Date.now(),
              title: `Welcome, ${userData.name}!`,
              message: 'Your clean personal finance workspace is ready. Add your first transaction to get started.',
              type: 'success',
              time: 'Just now',
              read: false,
              link: '/expenses',
            },
          ],
        });
      },

      logout: () => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory } = get();
        if (user) {
          // Persist current user's state before logout
          saveScopedUserData(getUserKey(user), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
          });
        }

        // Clear active session completely so next user doesn't see old data
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          expenses: [],
          chatHistory: [],
          notifications: [],
        });
      },

      setPremium: (isPremium = true) =>
        set((state) => ({
          user: state.user ? { ...state.user, isPremium } : null,
        })),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : userData,
        })),

      // ==========================================
      // TRANSACTIONS CRUD (USER-SCOPED & MONGO SYNC)
      // ==========================================

      addExpense: async (expenseData) => {
        const { user, token, expenses, monthlyBudget, categoryBudgets, chatHistory } = get();
        const userKey = getUserKey(user);

        const newId = generateId();
        const localNewExpense = {
          ...expenseData,
          type: expenseData.type || 'expense',
          id: newId,
          createdAt: Date.now(),
        };

        const updatedExpenses = [localNewExpense, ...expenses];

        set({ expenses: updatedExpenses });
        saveScopedUserData(userKey, {
          expenses: updatedExpenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory,
        });

        // Sync with MongoDB backend if authenticated
        if (token && token !== 'demo-token-12345') {
          try {
            const res = await fetch(`${API_BASE}/expenses`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(expenseData),
            });
            if (res.ok) {
              const saved = await res.json();
              // Update id with MongoDB _id
              set((state) => ({
                expenses: state.expenses.map((e) =>
                  e.id === newId ? { ...e, id: saved.id, _id: saved.id } : e
                ),
              }));
            }
          } catch (e) {
            console.warn('Backend sync failed, saved locally:', e);
          }
        }
      },

      editExpense: async (id, updatedData) => {
        const { user, token, expenses, monthlyBudget, categoryBudgets, chatHistory } = get();
        const userKey = getUserKey(user);

        const updatedExpenses = expenses.map((exp) =>
          exp.id === id || exp._id === id ? { ...exp, ...updatedData } : exp
        );

        set({ expenses: updatedExpenses });
        saveScopedUserData(userKey, {
          expenses: updatedExpenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory,
        });

        if (token && token !== 'demo-token-12345') {
          try {
            await fetch(`${API_BASE}/expenses/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(updatedData),
            });
          } catch (e) {
            console.warn('Backend update failed:', e);
          }
        }
      },

      deleteExpense: async (id) => {
        const { user, token, expenses, monthlyBudget, categoryBudgets, chatHistory } = get();
        const userKey = getUserKey(user);

        const updatedExpenses = expenses.filter(
          (exp) => exp.id !== id && exp._id !== id
        );

        set({ expenses: updatedExpenses });
        saveScopedUserData(userKey, {
          expenses: updatedExpenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory,
        });

        if (token && token !== 'demo-token-12345') {
          try {
            await fetch(`${API_BASE}/expenses/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (e) {
            console.warn('Backend delete failed:', e);
          }
        }
      },

      clearAllExpenses: async () => {
        const { user, token, monthlyBudget, categoryBudgets, chatHistory } = get();
        const userKey = getUserKey(user);

        set({ expenses: [] });
        saveScopedUserData(userKey, {
          expenses: [],
          monthlyBudget,
          categoryBudgets,
          chatHistory,
        });

        if (token && token !== 'demo-token-12345') {
          try {
            await fetch(`${API_BASE}/expenses`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (e) {
            console.warn('Backend clear failed:', e);
          }
        }
      },

      loadDemoData: () => {
        const { user, monthlyBudget, categoryBudgets, chatHistory } = get();
        const userKey = getUserKey(user);
        const demoData = generateDemoTransactions();

        set({ expenses: demoData, monthlyBudget: 35000 });
        saveScopedUserData(userKey, {
          expenses: demoData,
          monthlyBudget: 35000,
          categoryBudgets,
          chatHistory,
        });
      },

      // ==========================================
      // BUDGETS & PREFERENCES
      // ==========================================

      setBudget: (amount) => {
        const { user, expenses, categoryBudgets, chatHistory } = get();
        const newBudget = amount > 0 ? Number(amount) : 35000;
        set({ monthlyBudget: newBudget });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget: newBudget,
          categoryBudgets,
          chatHistory,
        });
      },

      setCategoryBudget: (category, amount) => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory } = get();
        const newCatBudgets = {
          ...categoryBudgets,
          [category]: Number(amount) || 0,
        };
        set({ categoryBudgets: newCatBudgets });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget,
          categoryBudgets: newCatBudgets,
          chatHistory,
        });
      },

      setCurrency: (currency) => set({ currency }),

      // ==========================================
      // CHAT HISTORY
      // ==========================================

      addMessage: (message) => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory } = get();
        const newChat = [...chatHistory, message];
        set({ chatHistory: newChat });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory: newChat,
        });
      },

      clearChat: () => {
        const { user, expenses, monthlyBudget, categoryBudgets } = get();
        set({ chatHistory: [] });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory: [],
        });
      },

      // ==========================================
      // NOTIFICATIONS
      // ==========================================

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearNotifications: () =>
        set(() => ({
          notifications: [],
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            { id: 'notif-' + Date.now(), read: false, time: 'Just now', ...notification },
            ...state.notifications,
          ],
        })),
    }),
    {
      name: 'spendly-session-v3',
    }
  )
);
