import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useExpenseStats } from '../hooks/useExpenseStats';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart';
import { ExpenseDonutChart } from '../components/dashboard/ExpenseDonutChart';
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { formatCurrency } from '../utils/formatters';
import { AddModal } from '../components/expenses/AddModal';
import { BudgetModal } from '../components/dashboard/BudgetModal';

export function Dashboard() {
  const expenses = useStore((state) => state.expenses);
  const monthlyBudget = useStore((state) => state.monthlyBudget);
  const currency = useStore((state) => state.currency);

  const stats = useExpenseStats(expenses, monthlyBudget);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative pb-20 md:pb-6">
      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance, currency)}
          icon={Wallet}
          accentColor="#51BFA2"
          trend="+12.5%"
          trendDirection="up"
          isPositiveGood={true}
          subLabel="Total estimated liquidity"
        />

        <SummaryCard
          title="Monthly Income"
          value={formatCurrency(stats.totalIncomeThisMonth, currency)}
          icon={TrendingUp}
          accentColor="#51BFA2"
          trend={stats.incomeDiffPercent ? `${stats.incomeDiffPercent > 0 ? '+' : ''}${stats.incomeDiffPercent}%` : '+5.0%'}
          trendDirection={stats.incomeDiffPercent && Number(stats.incomeDiffPercent) < 0 ? 'down' : 'up'}
          isPositiveGood={true}
          subLabel="Gross revenue this month"
        />

        <SummaryCard
          title="Monthly Expenses"
          value={formatCurrency(stats.totalSpentThisMonth, currency)}
          icon={CreditCard}
          accentColor="#E77F91"
          trend={stats.expenseDiffPercent ? `${stats.expenseDiffPercent > 0 ? '+' : ''}${stats.expenseDiffPercent}%` : '-2.4%'}
          trendDirection={stats.expenseDiffPercent && Number(stats.expenseDiffPercent) > 0 ? 'up' : 'down'}
          isPositiveGood={false}
          subLabel={`${stats.numTransactions} transactions recorded`}
        />

        <SummaryCard
          title="Savings Rate"
          value={`${stats.savingsRate}%`}
          icon={PiggyBank}
          accentColor="#8D91E8"
          trend={`${stats.budgetUsedPercent.toFixed(0)}% Budget`}
          trendDirection={stats.budgetUsedPercent > 80 ? 'down' : 'up'}
          isPositiveGood={true}
          subLabel="Click to adjust monthly budget"
          onClick={() => setIsBudgetModalOpen(true)}
        />
      </div>

      {/* Main Charts Row: Area Cash Flow + Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={stats.trendData} />
        </div>
        <div className="lg:col-span-1">
          <ExpenseDonutChart data={stats.donutData} />
        </div>
      </div>

      {/* Secondary Row: 6-Month Bar Comparison + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyBarChart data={stats.monthBarData} />
        <RecentTransactions expenses={expenses} />
      </div>

      {/* Modals */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 neu-btn-primary rounded-full shadow-2xl flex items-center justify-center text-white z-40 active:scale-95 transition-all cursor-pointer"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>
    </div>
  );
}
