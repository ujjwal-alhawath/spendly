import { isSameMonth, parseISO } from 'date-fns';
import { CATEGORIES } from './categories.js';
import { formatCurrency, formatDate } from './formatters.js';

export function buildContext(expenses = [], monthlyBudget = 35000, currency = 'INR') {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeBudget = Number(monthlyBudget) > 0 ? Number(monthlyBudget) : 35000;
  const now = new Date();
  
  // Last month date comparison helper
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let currentMonthSpent = 0;
  let currentMonthIncome = 0;
  let lastMonthSpent = 0;
  let lastMonthIncome = 0;
  
  const categoryTotals = {};
  const lastMonthCategoryTotals = {};
  
  // Initialize category trackers for expense categories
  CATEGORIES.forEach(c => {
    categoryTotals[c.id] = { total: 0, count: 0 };
    lastMonthCategoryTotals[c.id] = { total: 0, count: 0 };
  });

  const frequencyMap = {};
  let topExpense = null;

  safeExpenses.forEach(exp => {
    if (!exp) return;
    let expDate;
    try {
      expDate = parseISO(exp.date);
    } catch {
      expDate = new Date();
    }
    const amount = Number(exp.amount) || 0;
    const isIncome = exp.type === 'income';

    // Track highest single expense (expenses only, ignore income)
    if (!isIncome) {
      if (!topExpense || amount > topExpense.amount) {
        topExpense = exp;
      }
    }

    // Frequent merchant tracking
    if (exp.title) {
      frequencyMap[exp.title] = (frequencyMap[exp.title] || 0) + 1;
    }

    if (isSameMonth(expDate, now)) {
      if (isIncome) {
        currentMonthIncome += amount;
      } else {
        currentMonthSpent += amount;
        if (categoryTotals[exp.category]) {
          categoryTotals[exp.category].total += amount;
          categoryTotals[exp.category].count += 1;
        }
      }
    } else if (isSameMonth(expDate, lastMonthDate)) {
      if (isIncome) {
        lastMonthIncome += amount;
      } else {
        lastMonthSpent += amount;
        if (lastMonthCategoryTotals[exp.category]) {
          lastMonthCategoryTotals[exp.category].total += amount;
          lastMonthCategoryTotals[exp.category].count += 1;
        }
      }
    }
  });

  // Calculate most frequent merchant
  let frequentMerchant = null;
  let maxFreq = 0;
  for (const [title, freq] of Object.entries(frequencyMap)) {
    if (freq > maxFreq) {
      maxFreq = freq;
      frequentMerchant = title;
    }
  }

  const budgetUsedPercent = safeBudget > 0 ? ((currentMonthSpent / safeBudget) * 100).toFixed(1) : '0.0';
  const budgetRemaining = safeBudget - currentMonthSpent;
  const netSavings = currentMonthIncome - currentMonthSpent;

  // Recent transactions (last 10 sorted desc)
  const recent10 = [...safeExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  let context = `--- USER FINANCIAL DATA CONTEXT ---\n\n`;
  context += `1. BUDGET & CASH FLOW STATUS\n`;
  context += `- Monthly Budget Target: ${formatCurrency(safeBudget, currency)}\n`;
  context += `- Total Income This Month: ${formatCurrency(currentMonthIncome, currency)}\n`;
  context += `- Total Spent This Month: ${formatCurrency(currentMonthSpent, currency)}\n`;
  context += `- Net Cash Difference This Month: ${netSavings >= 0 ? '+' : ''}${formatCurrency(netSavings, currency)}\n`;
  context += `- Budget Remaining: ${formatCurrency(budgetRemaining, currency)}\n`;
  context += `- Budget Used: ${budgetUsedPercent}%\n\n`;

  context += `2. CATEGORY BREAKDOWN (THIS MONTH)\n`;
  CATEGORIES.filter(c => !c.isIncome).forEach(c => {
    const data = categoryTotals[c.id];
    if (data && data.total > 0) {
      const pct = currentMonthSpent > 0 ? ((data.total / currentMonthSpent) * 100).toFixed(1) : 0;
      context += `- ${c.label}: ${formatCurrency(data.total, currency)} (${data.count} txns) - ${pct}%\n`;
    }
  });
  context += `\n`;

  context += `3. MONTH-OVER-MONTH DELTA (THIS VS LAST MONTH)\n`;
  CATEGORIES.filter(c => !c.isIncome).forEach(c => {
    const thisMonth = categoryTotals[c.id]?.total || 0;
    const lastMonth = lastMonthCategoryTotals[c.id]?.total || 0;
    const delta = thisMonth - lastMonth;
    if (thisMonth > 0 || lastMonth > 0) {
      const sign = delta > 0 ? "+" : "";
      context += `- ${c.label}: ${sign}${formatCurrency(delta, currency)} (Last month: ${formatCurrency(lastMonth, currency)})\n`;
    }
  });
  context += `\n`;

  if (topExpense) {
    context += `4. HIGHEST EXPENSE OVERALL\n`;
    context += `- ${topExpense.title} (${topExpense.category}): ${formatCurrency(topExpense.amount, currency)} on ${formatDate(topExpense.date)}\n\n`;
  }

  if (frequentMerchant) {
    context += `5. MOST FREQUENT TRANSACTION TITLE\n`;
    context += `- ${frequentMerchant} (${maxFreq} transactions)\n\n`;
  }

  context += `6. LAST 10 TRANSACTIONS\n`;
  if (recent10.length === 0) {
    context += `- No transactions yet.\n`;
  } else {
    recent10.forEach(t => {
      const prefix = t.type === 'income' ? '[INCOME] +' : '[EXPENSE] -';
      context += `- ${formatDate(t.date)} | ${prefix}${formatCurrency(t.amount, currency)} | ${t.title} (${t.category})\n`;
    });
  }
  
  context += `\n--- END OF CONTEXT ---`;
  return context;
}
