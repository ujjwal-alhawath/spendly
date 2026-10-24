import { format, parseISO } from 'date-fns';

export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  
  const currencyConfigs = {
    INR: { locale: 'en-IN', currency: 'INR' },
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
  };

  const config = currencyConfigs[currency] || currencyConfigs.INR;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(isoString, formatStr = 'MMM d, yyyy') {
  if (!isoString) return '';
  try {
    return format(parseISO(isoString), formatStr);
  } catch (error) {
    return isoString;
  }
}

export function formatRelativeDate(isoString) {
  if (!isoString) return '';
  try {
    return format(parseISO(isoString), 'MMM d');
  } catch (error) {
    return isoString;
  }
}

export function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Math.random().toString(36).substring(2, 9);
}
