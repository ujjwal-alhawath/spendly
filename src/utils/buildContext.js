import { isSameMonth, parseISO } from 'date-fns';
import { CATEGORIES } from './categories';
import { formatCurrency, formatDate } from './formatters';

export function buildContext(expenses, monthlyBudget) {
  const now = new Date();
  
  // Last month date comparison helper
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let currentMonthTotal = 0;
  let lastMonthTotal = 0;
  
  const categoryTotals = {};
  const lastMonthCategoryTotals = {};
  
  // Initialize category trackers
  CATEGORIES.forEach(c => {
    categoryTotals[c.id] = { total: 0, count: 0 };
    lastMonthCategoryTotals[c.id] = { total: 0, count: 0 };
  });

  const frequencyMap = {};
  let topExpense = null;

  expenses.forEach(exp => {
    const expDate = parseISO(exp.date);
    const amount = Number(exp.amount) || 0;

    // Highest single expense tracking
    if (!topExpense || amount > topExpense.amount) {
      topExpense = exp;
    }

    // Frequent merchant tracking
    frequencyMap[exp.title] = (frequencyMap[exp.title] || 0) + 1;

    if (isSameMonth(expDate, now)) {
      currentMonthTotal += amount;
      if (categoryTotals[exp.category]) {
        categoryTotals[exp.category].total += amount;
        categoryTotals[exp.category].count += 1;
      }
    } else if (isSameMonth(expDate, lastMonthDate)) {
      lastMonthTotal += amount;
      if (lastMonthCategoryTotals[exp.category]) {
        lastMonthCategoryTotals[exp.category].total += amount;
        lastMonthCategoryTotals[exp.category].count += 1;
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

  const budgetUsedPercent = ((currentMonthTotal / monthlyBudget) * 100).toFixed(1);
  const budgetRemaining = monthlyBudget - currentMonthTotal;

  // Recent transactions (last 10 sorted desc)
  const recent10 = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  let context = `--- USER FINANCIAL DATA CONTEXT ---\n\n`;
  context += `1. BUDGET STATUS\n`;
  context += `- Monthly Budget: ${formatCurrency(monthlyBudget)}\n`;
  context += `- Spent This Month: ${formatCurrency(currentMonthTotal)}\n`;
  context += `- Budget Remaining: ${formatCurrency(budgetRemaining)}\n`;
  context += `- Budget Used: ${budgetUsedPercent}%\n\n`;

  context += `2. CATEGORY BREAKDOWN (THIS MONTH)\n`;
  CATEGORIES.forEach(c => {
    const data = categoryTotals[c.id];
    if (data.total > 0) {
      const pct = currentMonthTotal > 0 ? ((data.total / currentMonthTotal) * 100).toFixed(1) : 0;
      context += `- ${c.label}: ${formatCurrency(data.total)} (${data.count} txns) - ${pct}%\n`;
    }
  });
  context += `\n`;

  context += `3. MONTH-OVER-MONTH DELTA (THIS VS LAST MONTH)\n`;
  CATEGORIES.forEach(c => {
    const thisMonth = categoryTotals[c.id].total;
    const lastMonth = lastMonthCategoryTotals[c.id].total;
    const delta = thisMonth - lastMonth;
    if (thisMonth > 0 || lastMonth > 0) {
      const sign = delta > 0 ? "+" : "";
      context += `- ${c.label}: ${sign}${formatCurrency(delta)} (Last month: ${formatCurrency(lastMonth)})\n`;
    }
  });
  context += `\n`;

  if (topExpense) {
    context += `4. HIGHEST EXPENSE OVERALL\n`;
    context += `- ${topExpense.title} (${topExpense.category}): ${formatCurrency(topExpense.amount)} on ${formatDate(topExpense.date)}\n\n`;
  }

  if (frequentMerchant) {
    context += `5. MOST FREQUENT MERCHANT\n`;
    context += `- ${frequentMerchant} (${maxFreq} transactions)\n\n`;
  }

  context += `6. LAST 10 TRANSACTIONS\n`;
  if (recent10.length === 0) {
    context += `- No transactions yet.\n`;
  } else {
    recent10.forEach(t => {
      context += `- ${formatDate(t.date)} | ${t.title} | ${t.category} | ${formatCurrency(t.amount)}\n`;
    });
  }
  
  context += `\n--- END OF CONTEXT ---`;
  return context;
}
