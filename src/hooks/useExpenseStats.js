import { useMemo } from 'react';
import {
  isSameMonth,
  parseISO,
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import { CATEGORIES } from '../utils/categories';

export function useExpenseStats(expenses = [], monthlyBudget = 35000) {
  return useMemo(() => {
    const now = new Date();
    const prevMonthDate = subMonths(now, 1);

    // Filter current month transactions
    const currentMonthTx = expenses.filter((exp) => {
      try {
        return isSameMonth(parseISO(exp.date), now);
      } catch {
        return false;
      }
    });

    // Filter previous month transactions
    const prevMonthTx = expenses.filter((exp) => {
      try {
        return isSameMonth(parseISO(exp.date), prevMonthDate);
      } catch {
        return false;
      }
    });

    // Separate Income vs Expense
    const currentMonthExpenses = currentMonthTx.filter(
      (tx) => tx.type !== 'income'
    );
    const currentMonthIncome = currentMonthTx.filter(
      (tx) => tx.type === 'income'
    );

    const prevMonthExpenses = prevMonthTx.filter(
      (tx) => tx.type !== 'income'
    );
    const prevMonthIncome = prevMonthTx.filter(
      (tx) => tx.type === 'income'
    );

    // Sums
    const totalSpentThisMonth = currentMonthExpenses.reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0
    );
    const totalIncomeThisMonth = currentMonthIncome.reduce(
      (sum, inc) => sum + (Number(inc.amount) || 0),
      0
    );

    const totalSpentPrevMonth = prevMonthExpenses.reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0
    );
    const totalIncomePrevMonth = prevMonthIncome.reduce(
      (sum, inc) => sum + (Number(inc.amount) || 0),
      0
    );

    // All-time balance
    const totalAllTimeIncome = expenses
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const totalAllTimeExpense = expenses
      .filter((tx) => tx.type !== 'income')
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    const totalBalance =
      totalAllTimeIncome > 0
        ? totalAllTimeIncome - totalAllTimeExpense
        : Math.max(0, monthlyBudget - totalSpentThisMonth);

    // Savings Rate
    const effectiveIncome =
      totalIncomeThisMonth > 0 ? totalIncomeThisMonth : monthlyBudget;
    const savingsAmount = Math.max(0, effectiveIncome - totalSpentThisMonth);
    const savingsRate =
      effectiveIncome > 0 ? Math.round((savingsAmount / effectiveIncome) * 100) : 0;

    // Budget Calculations
    const budgetRemaining = Math.max(0, monthlyBudget - totalSpentThisMonth);
    const budgetUsedPercent =
      monthlyBudget > 0
        ? Math.min(100, (totalSpentThisMonth / monthlyBudget) * 100)
        : 0;

    // Previous period comparisons (trends)
    const expenseDiffPercent =
      totalSpentPrevMonth > 0
        ? (
            ((totalSpentThisMonth - totalSpentPrevMonth) / totalSpentPrevMonth) *
            100
          ).toFixed(1)
        : null;

    const incomeDiffPercent =
      totalIncomePrevMonth > 0
        ? (
            ((totalIncomeThisMonth - totalIncomePrevMonth) / totalIncomePrevMonth) *
            100
          ).toFixed(1)
        : null;

    // Build Category Map
    const categoryTotals = {};
    CATEGORIES.forEach((c) => {
      categoryTotals[c.id] = 0;
    });

    currentMonthExpenses.forEach((exp) => {
      const cat = exp.category;
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += Number(exp.amount) || 0;
      } else {
        categoryTotals['Other'] = (categoryTotals['Other'] || 0) + (Number(exp.amount) || 0);
      }
    });

    // Top Category
    let topCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topCategory = cat;
      }
    });

    // --- Donut Chart Data (Spending by Category) ---
    const donutData = CATEGORIES.filter((c) => !c.isIncome)
      .map((c) => ({
        name: c.label,
        id: c.id,
        value: categoryTotals[c.id] || 0,
        color: c.color,
        icon: c.icon,
        emoji: c.emoji,
      }))
      .filter((c) => c.value > 0);

    // --- Daily Trend Data (Current Month) ---
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(now),
      end: endOfMonth(now),
    });

    const dailyExpenseMap = {};
    const dailyIncomeMap = {};

    currentMonthExpenses.forEach((exp) => {
      try {
        const day = format(parseISO(exp.date), 'dd');
        dailyExpenseMap[day] =
          (dailyExpenseMap[day] || 0) + (Number(exp.amount) || 0);
      } catch {}
    });

    currentMonthIncome.forEach((inc) => {
      try {
        const day = format(parseISO(inc.date), 'dd');
        dailyIncomeMap[day] =
          (dailyIncomeMap[day] || 0) + (Number(inc.amount) || 0);
      } catch {}
    });

    const trendData = daysInMonth.map((date) => {
      const dayStr = format(date, 'dd');
      return {
        date: format(date, 'd MMM'),
        shortDate: format(date, 'd'),
        expense: dailyExpenseMap[dayStr] || 0,
        income: dailyIncomeMap[dayStr] || 0,
        amount: dailyExpenseMap[dayStr] || 0, // compatibility
      };
    });

    // --- Month Bar Chart Data (Last 6 Months) ---
    const monthBarData = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonth = subMonths(now, i);
      const targetExpenses = expenses.filter((exp) => {
        try {
          return (
            isSameMonth(parseISO(exp.date), targetMonth) &&
            exp.type !== 'income'
          );
        } catch {
          return false;
        }
      });
      const targetIncome = expenses.filter((exp) => {
        try {
          return (
            isSameMonth(parseISO(exp.date), targetMonth) &&
            exp.type === 'income'
          );
        } catch {
          return false;
        }
      });

      const expenseTotal = targetExpenses.reduce(
        (sum, exp) => sum + (Number(exp.amount) || 0),
        0
      );
      const incomeTotal = targetIncome.reduce(
        (sum, exp) => sum + (Number(exp.amount) || 0),
        0
      );

      monthBarData.push({
        month: format(targetMonth, 'MMM'),
        fullName: format(targetMonth, 'MMMM yyyy'),
        expense: expenseTotal,
        income: incomeTotal,
        amount: expenseTotal, // compatibility
      });
    }

    return {
      totalBalance,
      totalIncomeThisMonth,
      totalSpentThisMonth,
      savingsRate,
      savingsAmount,
      budgetRemaining,
      budgetUsedPercent,
      numTransactions: currentMonthTx.length,
      topCategory,
      topCategoryAmount,
      categoryTotals,
      expenseDiffPercent,
      incomeDiffPercent,
      donutData,
      trendData,
      monthBarData,
    };
  }, [expenses, monthlyBudget]);
}
