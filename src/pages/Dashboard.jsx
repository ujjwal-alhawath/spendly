import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useExpenseStats } from '../hooks/useExpenseStats';
import { StatCard } from '../components/dashboard/StatCard';
import { DonutChart } from '../components/dashboard/DonutChart';
import { TrendChart } from '../components/dashboard/TrendChart';
import { MonthBarChart } from '../components/dashboard/MonthBarChart';
import { RecentList } from '../components/dashboard/RecentList';
import { formatCurrency } from '../utils/formatters';
import { AddModal } from '../components/expenses/AddModal';
import { BudgetModal } from '../components/dashboard/BudgetModal';

export function Dashboard() {
  const expenses = useStore(state => state.expenses);
  const monthlyBudget = useStore(state => state.monthlyBudget);
  
  const stats = useExpenseStats(expenses, monthlyBudget);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative pb-16 md:pb-0">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Spent This Month" 
          value={formatCurrency(stats.totalSpentThisMonth)}
          icon="💸"
        />
        <div 
          className="relative group cursor-pointer transition-transform hover:scale-[1.02] ring-primary hover:ring-2 hover:ring-offset-2 hover:ring-offset-background rounded-xl"
          onClick={() => setIsBudgetModalOpen(true)}
          title="Click to edit budget"
        >
          <StatCard 
            title="Budget (Click to edit)" 
            value={formatCurrency(stats.budgetRemaining)}
            subValue={`${stats.budgetUsedPercent.toFixed(1)}% Used`}
            icon="🎯"
          />
        </div>
        <StatCard 
          title="Top Category" 
          value={stats.topCategory}
          icon="🥇"
        />
        <StatCard 
          title="Monthly Transactions" 
          value={stats.numTransactions}
          icon="🔢"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 text-[#6B7280]">
          <TrendChart data={stats.trendData} />
        </div>
        <div className="lg:col-span-1">
          <DonutChart data={stats.donutData} />
        </div>
      </div>

      {/* Secondary Charts / List Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthBarChart data={stats.monthBarData} />
        <RecentList expenses={expenses} />
      </div>

      <AddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} />

      {/* Floating Add Expense button (bottom right) */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-background rounded-full shadow-lg hover:bg-emerald-400 transition-colors flex items-center justify-center text-3xl font-light z-40"
      >
        +
      </button>
    </div>
  );
}
