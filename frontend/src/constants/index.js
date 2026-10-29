export const DEFAULT_BUDGET = 35000;

export const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
  'http://localhost:5005/api';

export const CHART_COLORS = [
  '#F97316', // Food (orange)
  '#3B82F6', // Transport (blue)
  '#A855F7', // Entertainment (purple)
  '#EC4899', // Shopping (pink)
  '#10B981', // Health (emerald)
  '#EF4444', // Bills (red)
  '#6B7280', // Other (gray)
];
