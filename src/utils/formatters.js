import { format, parseISO } from 'date-fns';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // as specified ₹1,500
  }).format(amount);
}

export function formatDate(isoString) {
  try {
    return format(parseISO(isoString), 'MMM d');
  } catch (error) {
    return isoString;
  }
}

export function generateId() {
  return crypto.randomUUID();
}
