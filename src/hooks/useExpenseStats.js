import { useMemo } from 'react';
import { isSameMonth, parseISO, format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { CATEGORIES } from '../utils/categories';

export function useExpenseStats(expenses, monthlyBudget) {
  return useMemo(() => {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(exp => isSameMonth(parseISO(exp.date), now));

    // --- Cards Stats ---
    const totalSpentThisMonth = currentMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const budgetRemaining = Math.max(0, monthlyBudget - totalSpentThisMonth);
    const budgetUsedPercent = Math.min(100, (totalSpentThisMonth / monthlyBudget) * 100);
    const numTransactions = currentMonthExpenses.length;

    // Build category map
    const categoryTotals = {};
    CATEGORIES.forEach(c => { categoryTotals[c.id] = 0; });
    currentMonthExpenses.forEach(exp => {
      if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += Number(exp.amount);
      } else {
        categoryTotals['Other'] += Number(exp.amount);
      }
    });

    // Top category
    let topCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topCategory = cat;
      }
    });

    // --- Donut Chart Data (Spending by Category) ---
    const donutData = CATEGORIES.map(c => ({
      name: c.label,
      value: categoryTotals[c.id],
      color: c.color,
      icon: c.icon
    })).filter(c => c.value > 0);

    // --- Trend Chart Data (Daily for Current Month) ---
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(now),
      end: endOfMonth(now)
    });
    
    // Create map for fast lookup
    const dailyMap = {};
    currentMonthExpenses.forEach(exp => {
      const day = format(parseISO(exp.date), 'dd');
      dailyMap[day] = (dailyMap[day] || 0) + Number(exp.amount);
    });

    const trendData = daysInMonth.map(date => {
      const dayStr = format(date, 'dd');
      return {
        date: format(date, 'MMM dd'),
        amount: dailyMap[dayStr] || 0
      };
    });

    // --- Month Bar Chart Data (Last 6 Months) ---
    const monthBarData = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonth = subMonths(now, i);
      const targetMonthExpenses = expenses.filter(exp => isSameMonth(parseISO(exp.date), targetMonth));
      const total = targetMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      
      monthBarData.push({
        month: format(targetMonth, 'MMM'),
        amount: total
      });
    }

    return {
      totalSpentThisMonth,
      budgetRemaining,
      budgetUsedPercent,
      numTransactions,
      topCategory,
      donutData,
      trendData,
      monthBarData
    };
  }, [expenses, monthlyBudget]);
}
