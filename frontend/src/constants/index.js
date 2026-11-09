export const DEFAULT_BUDGET = 0;

// Auto-detect production backend when hosted on Vercel, fallback to localhost for local dev
const defaultApiUrl =
  typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.includes('vercel.app')
    ? 'https://spendly-ba2z.vercel.app/api'
    : 'http://localhost:5005/api';

const rawApiUrl =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
  defaultApiUrl;

// Normalize URL: remove any trailing slashes, and ensure it ends with /api
const trimmedUrl = String(rawApiUrl).replace(/\/+$/, '');
export const API_BASE = trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;

export const CHART_COLORS = [
  '#F97316', // Food (orange)
  '#3B82F6', // Transport (blue)
  '#A855F7', // Entertainment (purple)
  '#EC4899', // Shopping (pink)
  '#10B981', // Health (emerald)
  '#EF4444', // Bills (red)
  '#6B7280', // Other (gray)
];
