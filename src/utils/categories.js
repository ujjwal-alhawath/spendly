export const CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', color: '#E77F91', icon: 'Utensils', emoji: '🍔' },
  { id: 'Transport', label: 'Transport', color: '#8D91E8', icon: 'Car', emoji: '🚗' },
  { id: 'Shopping', label: 'Shopping', color: '#E7B35F', icon: 'ShoppingBag', emoji: '🛍️' },
  { id: 'Entertainment', label: 'Entertainment', color: '#E7A7CB', icon: 'Film', emoji: '🎟️' },
  { id: 'Health', label: 'Health & Fitness', color: '#51BFA2', icon: 'HeartPulse', emoji: '🏥' },
  { id: 'Bills', label: 'Bills & Utilities', color: '#5B9BD5', icon: 'Receipt', emoji: '📄' },
  { id: 'Salary', label: 'Salary & Income', color: '#51BFA2', icon: 'Coins', emoji: '💰', isIncome: true },
  { id: 'Investment', label: 'Investment & Dividends', color: '#8D91E8', icon: 'TrendingUp', emoji: '📈', isIncome: true },
  { id: 'Freelance', label: 'Freelance / Side Gig', color: '#60A5FA', icon: 'Laptop', emoji: '💻', isIncome: true },
  { id: 'Other', label: 'Other', color: '#94A3B8', icon: 'Package', emoji: '📦' },
];

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => !c.isIncome);
export const INCOME_CATEGORIES = CATEGORIES.filter(c => c.isIncome || c.id === 'Other');

export function getCategoryConfig(categoryLabel) {
  return (
    CATEGORIES.find((c) => c.id === categoryLabel || c.label === categoryLabel) ||
    CATEGORIES.find((c) => c.id === 'Other')
  );
}
