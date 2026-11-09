import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/formatters.js';
import { API_BASE } from '../constants/index.js';

// Generate realistic seed transactions for DEMO / SAMPLE only - now clean empty slate by default
export const generateDemoTransactions = () => [];

// Seed notifications for Demo / Guest User
export const generateDemoNotifications = (user) => [
  {
    id: 'demo-notif-welcome',
    title: `Welcome, ${user?.name ? user.name.split(' ')[0] : 'friend'}!`,
    message: 'Your personal finance workspace is active and ready. Add your first transaction to get started.',
    type: 'success',
    time: 'Just now',
    read: false,
    link: '/expenses',
  },
];

// Seed notifications for a New User
export const generateInitialUserNotifications = (user) => [
  {
    id: 'welcome-' + Date.now(),
    title: `Welcome, ${user?.name ? user.name.split(' ')[0] : 'friend'}!`,
    message: 'Your personal finance workspace is ready. Add your first transaction to get started.',
    type: 'success',
    time: 'Just now',
    read: false,
    link: '/expenses',
  },
  {
    id: 'ai-ready-' + Date.now(),
    title: 'AI Financial Advisor (Coming Soon)',
    message: 'Intelligent AI financial forecasting and expense advisory are currently under development.',
    type: 'ai',
    time: 'Just now',
    read: false,
    link: '/chat',
  },
];

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
      isAuthModalOpen: false,
      authModalMessage: '',
      currency: 'INR',
      expenses: [],
      monthlyBudget: 0,
      categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
      chatHistory: [],
      notifications: generateDemoNotifications(null),

      openAuthModal: (message = '') => set({ isAuthModalOpen: true, authModalMessage: message }),
      closeAuthModal: () => set({ isAuthModalOpen: false, authModalMessage: '' }),

      // ==========================================
      // AUTHENTICATION & MULTI-USER ISOLATION
      // ==========================================

      login: async (userData, token) => {
        const userKey = getUserKey(userData);
        let userExpenses = [];
        let userBudget = 0;
        let userCatBudgets = DEFAULT_CATEGORY_BUDGETS;
        let userChat = [];
        let userNotifications = null;

        // 1. Try to load this user's isolated local preferences/cache
        const cached = loadScopedUserData(userKey);
        if (cached) {
          userExpenses = cached.expenses || [];
          userBudget = cached.monthlyBudget !== undefined ? cached.monthlyBudget : 0;
          userCatBudgets = cached.categoryBudgets || DEFAULT_CATEGORY_BUDGETS;
          userChat = cached.chatHistory || [];
          if (Array.isArray(cached.notifications)) {
            userNotifications = cached.notifications;
          }
          if (cached.isPremium !== undefined && userData && userData.isPremium === undefined) {
            userData.isPremium = cached.isPremium;
          }
        }

        // 2. Try to fetch real transactions from backend MongoDB
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

        // 3. Fallbacks for demo user (clean empty state)
        if (userData?.email === 'alex.morgan@spendly.app' || userKey === 'guest') {
          userExpenses = cached?.expenses || [];
        }

        // 4. Initialize notifications if not already saved for this user
        if (userNotifications === null) {
          if (userData?.email === 'alex.morgan@spendly.app' || userKey === 'guest') {
            userNotifications = generateDemoNotifications(userData);
          } else {
            userNotifications = generateInitialUserNotifications(userData);
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
          notifications: userNotifications,
        });

        // Save active state to user's scoped storage
        saveScopedUserData(userKey, {
          expenses: userExpenses,
          monthlyBudget: userBudget,
          categoryBudgets: userCatBudgets,
          chatHistory: userChat,
          notifications: userNotifications,
          isPremium: Boolean(userData?.isPremium),
        });
      },

      signup: async (userData, token) => {
        const userKey = getUserKey(userData);
        const userNotifs = generateInitialUserNotifications(userData);

        // A brand new user account starts with clean 0 transactions and 0 budget!
        const cleanState = {
          expenses: [],
          monthlyBudget: 0,
          categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
          chatHistory: [],
          notifications: userNotifs,
          isPremium: Boolean(userData?.isPremium),
        };

        saveScopedUserData(userKey, cleanState);

        set({
          user: userData,
          token,
          isAuthenticated: true,
          expenses: [],
          monthlyBudget: 0,
          categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
          chatHistory: [],
          notifications: userNotifs,
        });
      },

      logout: () => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        if (user) {
          // Persist current user's state before logout
          saveScopedUserData(getUserKey(user), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
            notifications,
            isPremium: Boolean(user.isPremium),
          });
        }

        // Switch to clean guest explore state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          expenses: [],
          monthlyBudget: 0,
          chatHistory: [],
          notifications: generateDemoNotifications(null),
        });
      },

      setPremium: (isPremium = true) => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const updatedUser = user ? { ...user, isPremium } : null;
        set({ user: updatedUser });
        if (updatedUser) {
          saveScopedUserData(getUserKey(updatedUser), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
            notifications,
            isPremium,
          });
        }
      },

      updateUser: (userData) =>
        set((state) => {
          const updated = state.user ? { ...state.user, ...userData } : userData;
          if (updated) {
            saveScopedUserData(getUserKey(updated), {
              expenses: state.expenses,
              monthlyBudget: state.monthlyBudget,
              categoryBudgets: state.categoryBudgets,
              chatHistory: state.chatHistory,
              notifications: state.notifications,
              isPremium: Boolean(updated.isPremium),
            });
          }
          return { user: updated };
        }),

      // ==========================================
      // TRANSACTIONS CRUD (USER-SCOPED & MONGO SYNC)
      // ==========================================

      addExpense: async (expenseData) => {
        if (!get().isAuthenticated) {
          get().openAuthModal('Please log in to add transactions and track your expenses.');
          return;
        }

        const { user, token, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const userKey = getUserKey(user);

        const newId = generateId();
        const localNewExpense = {
          ...expenseData,
          type: expenseData.type || 'expense',
          id: newId,
          _id: newId,
          createdAt: Date.now(),
        };

        const updatedExpenses = [localNewExpense, ...expenses];

        set({ expenses: updatedExpenses });
        saveScopedUserData(userKey, {
          expenses: updatedExpenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory,
          notifications,
          isPremium: Boolean(user?.isPremium),
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
              // Update id with MongoDB _id in BOTH Zustand store and localStorage!
              set((state) => {
                const synchronized = state.expenses.map((e) =>
                  e.id === newId ? { ...e, id: saved.id, _id: saved.id } : e
                );
                saveScopedUserData(userKey, {
                  expenses: synchronized,
                  monthlyBudget,
                  categoryBudgets,
                  chatHistory,
                  notifications,
                  isPremium: Boolean(user?.isPremium),
                });
                return { expenses: synchronized };
              });
            }
          } catch (e) {
            console.warn('Backend sync failed, saved locally:', e);
          }
        }
      },

      editExpense: async (id, updatedData) => {
        if (!get().isAuthenticated) {
          get().openAuthModal('Please log in to edit transactions.');
          return;
        }

        const { user, token, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
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
          notifications,
          isPremium: Boolean(user?.isPremium),
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
        if (!get().isAuthenticated) {
          get().openAuthModal('Please log in to delete transactions.');
          return;
        }

        const { user, token, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
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
          notifications,
          isPremium: Boolean(user?.isPremium),
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
        if (!get().isAuthenticated) {
          get().openAuthModal('Please log in to clear transactions.');
          return;
        }

        const { user, token, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const userKey = getUserKey(user);

        set({ expenses: [] });
        saveScopedUserData(userKey, {
          expenses: [],
          monthlyBudget,
          categoryBudgets,
          chatHistory,
          notifications,
          isPremium: Boolean(user?.isPremium),
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
        const { user, categoryBudgets, chatHistory } = get();
        const userKey = getUserKey(user);
        const demoData = [];
        const demoNotifs = generateDemoNotifications(user);

        set({ expenses: demoData, monthlyBudget: 0, notifications: demoNotifs });
        saveScopedUserData(userKey, {
          expenses: demoData,
          monthlyBudget: 0,
          categoryBudgets: categoryBudgets || DEFAULT_CATEGORY_BUDGETS,
          chatHistory: chatHistory || [],
          notifications: demoNotifs,
          isPremium: Boolean(user?.isPremium),
        });
      },

      // ==========================================
      // BUDGETS & PREFERENCES
      // ==========================================

      setBudget: (amount) => {
        if (!get().isAuthenticated) {
          get().openAuthModal('Please log in to set or modify your monthly budget.');
          return;
        }

        const { user, expenses, categoryBudgets, chatHistory, notifications } = get();
        const newBudget = Math.max(0, Number(amount) || 0);
        set({ monthlyBudget: newBudget });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget: newBudget,
          categoryBudgets: categoryBudgets || DEFAULT_CATEGORY_BUDGETS,
          chatHistory,
          notifications,
          isPremium: Boolean(user?.isPremium),
        });
      },

      setCategoryBudget: (category, amount) => {
        if (!get().isAuthenticated) {
          get().openAuthModal('Please log in to set category budgets.');
          return;
        }

        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const newCatBudgets = {
          ...(categoryBudgets || DEFAULT_CATEGORY_BUDGETS),
          [category]: Number(amount) || 0,
        };
        set({ categoryBudgets: newCatBudgets });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget,
          categoryBudgets: newCatBudgets,
          chatHistory,
          notifications,
          isPremium: Boolean(user?.isPremium),
        });
      },

      setCurrency: (currency) => set({ currency }),

      // ==========================================
      // CHAT HISTORY
      // ==========================================

      addMessage: (message) => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const newChat = [...chatHistory, message];
        set({ chatHistory: newChat });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory: newChat,
          notifications,
          isPremium: Boolean(user?.isPremium),
        });
      },

      clearChat: () => {
        const { user, expenses, monthlyBudget, categoryBudgets, notifications } = get();
        set({ chatHistory: [] });
        saveScopedUserData(getUserKey(user), {
          expenses,
          monthlyBudget,
          categoryBudgets,
          chatHistory: [],
          notifications,
          isPremium: Boolean(user?.isPremium),
        });
      },

      // ==========================================
      // NOTIFICATIONS (PERSISTED & USER-SCOPED)
      // ==========================================

      markNotificationAsRead: (id) => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const updated = (notifications || []).map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        set({ notifications: updated });
        if (user) {
          saveScopedUserData(getUserKey(user), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
            notifications: updated,
            isPremium: Boolean(user.isPremium),
          });
        }
      },

      markAllNotificationsAsRead: () => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const updated = (notifications || []).map((n) => ({ ...n, read: true }));
        set({ notifications: updated });
        if (user) {
          saveScopedUserData(getUserKey(user), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
            notifications: updated,
            isPremium: Boolean(user.isPremium),
          });
        }
      },

      clearNotifications: () => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory } = get();
        set({ notifications: [] });
        if (user) {
          saveScopedUserData(getUserKey(user), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
            notifications: [],
            isPremium: Boolean(user.isPremium),
          });
        }
      },

      deleteNotification: (id) => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const updated = (notifications || []).filter((n) => n.id !== id);
        set({ notifications: updated });
        if (user) {
          saveScopedUserData(getUserKey(user), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
            notifications: updated,
            isPremium: Boolean(user.isPremium),
          });
        }
      },

      addNotification: (notification) => {
        const { user, expenses, monthlyBudget, categoryBudgets, chatHistory, notifications } = get();
        const newNotif = {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          read: false,
          time: 'Just now',
          ...notification,
        };
        const updated = [newNotif, ...(notifications || [])];
        set({ notifications: updated });
        if (user) {
          saveScopedUserData(getUserKey(user), {
            expenses,
            monthlyBudget,
            categoryBudgets,
            chatHistory,
            notifications: updated,
            isPremium: Boolean(user.isPremium),
          });
        }
      },
    }),
    {
      name: 'spendly-session-v4',
    }
  )
);
