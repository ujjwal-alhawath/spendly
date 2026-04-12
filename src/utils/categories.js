export const CATEGORIES = [
  { id: 'Food', label: 'Food', color: '#F97316', icon: '🍔' },
  { id: 'Transport', label: 'Transport', color: '#3B82F6', icon: '🚗' },
  { id: 'Entertainment', label: 'Entertainment', color: '#A855F7', icon: '🎟️' },
  { id: 'Shopping', label: 'Shopping', color: '#EC4899', icon: '🛍️' },
  { id: 'Health', label: 'Health', color: '#10B981', icon: '🏥' },
  { id: 'Bills', label: 'Bills', color: '#EF4444', icon: '📄' },
  { id: 'Other', label: 'Other', color: '#6B7280', icon: '📦' },
];

export function getCategoryConfig(categoryLabel) {
  return CATEGORIES.find((c) => c.id === categoryLabel) || CATEGORIES.find(c => c.id === 'Other');
}
