import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useExpenseStats } from '../hooks/useExpenseStats';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../utils/categories';

export function Analytics() {
  const expenses = useStore((state) => state.expenses);
  const monthlyBudget = useStore((state) => state.monthlyBudget);
  const currency = useStore((state) => state.currency);
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  const stats = useExpenseStats(expenses, monthlyBudget);
  const [timeRange, setTimeRange] = useState('month'); // 'month' | 'quarter' | 'half' | 'year'

  // Calculated metrics
  const avgDailySpend = useMemo(() => {
    const daysInMonth = new Date().getDate();
    return daysInMonth > 0 ? Math.round(stats.totalSpentThisMonth / daysInMonth) : 0;
  }, [stats.totalSpentThisMonth]);

  // Category comparison sorted by highest amount
  const sortedCategories = useMemo(() => {
    return [...stats.donutData].sort((a, b) => b.value - a.value);
  }, [stats.donutData]);

  // Custom Neumorphic Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface neu-card p-3.5 border border-white/80 rounded-2xl shadow-xl min-w-[150px]">
          <p className="text-xs font-bold text-textPrimary mb-1.5 border-b border-border/40 pb-1">
            {label}
          </p>
          <div className="flex flex-col gap-1">
            {payload.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs gap-3">
                <span className="flex items-center gap-1.5 text-textSecondary font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}:
                </span>
                <span className="font-bold text-textPrimary">
                  {formatCurrency(item.value, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Page Title & Time Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
            Financial Trends & Analytics
          </h2>
          <p className="text-xs text-textSecondary">
            Comparative analysis of your income, expenses, and category trends
          </p>
        </div>

        <div className="neu-pill-inset p-1.5 flex items-center self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              timeRange === 'month'
                ? 'neu-pill text-primary font-bold shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('half')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              timeRange === 'half'
                ? 'neu-pill text-primary font-bold shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Last 6 Months
          </button>
        </div>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeumorphicCard p="p-4" className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
              Avg. Daily Spend
            </span>
            <p className="text-xl font-extrabold text-textPrimary mt-0.5">
              {formatCurrency(avgDailySpend, currency)}
            </p>
            <span className="text-[11px] text-textSecondary font-medium">
              Based on {new Date().getDate()} elapsed days
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
            <Calendar className="w-5 h-5" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard p="p-4" className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
              Top Expense Driver
            </span>
            <p className="text-xl font-extrabold text-textPrimary mt-0.5 truncate max-w-[140px]">
              {stats.topCategory}
            </p>
            <span className="text-[11px] text-danger font-semibold">
              {formatCurrency(stats.topCategoryAmount, currency)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-danger bg-danger/10">
            <TrendingUp className="w-5 h-5" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard p="p-4" className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
              Savings Surplus
            </span>
            <p className="text-xl font-extrabold text-primary mt-0.5">
              {formatCurrency(stats.savingsAmount, currency)}
            </p>
            <span className="text-[11px] text-primary font-semibold">
              {stats.savingsRate}% of monthly inflow
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
            <Percent className="w-5 h-5" />
          </div>
        </NeumorphicCard>

        <NeumorphicCard p="p-4" className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
              Budget Utilization
            </span>
            <p className="text-xl font-extrabold text-secondary mt-0.5">
              {stats.budgetUsedPercent.toFixed(1)}%
            </p>
            <span className="text-[11px] text-textSecondary font-medium">
              Target: {formatCurrency(monthlyBudget, currency)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/10">
            <BarChart3 className="w-5 h-5" />
          </div>
        </NeumorphicCard>
      </div>

      {/* Main Income vs Expense Comparison Bar / Area */}
      <NeumorphicCard className="h-[400px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-textPrimary tracking-tight">
                Income vs Expenses Comparison (Last 6 Months)
              </h3>
              <p className="text-xs text-textSecondary">
                Historical monthly cash flow balance
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.monthBarData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                stroke="#7E8CA2"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#7E8CA2"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#51BFA2"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="expense"
                name="Expenses"
                fill="#E77F91"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </NeumorphicCard>

      {/* Category Breakdown & Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Budget Bars */}
        <NeumorphicCard className="flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/10">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-textPrimary tracking-tight">
                Category Spending Ranks
              </h3>
              <p className="text-xs text-textSecondary">
                Ranked by total expenditure this month
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {sortedCategories.length === 0 ? (
              <p className="text-xs text-textSecondary text-center py-8">
                No expense categories recorded yet.
              </p>
            ) : (
              sortedCategories.map((item, idx) => {
                const total = stats.totalSpentThisMonth || 1;
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={item.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-textPrimary">
                        <span className="text-textSecondary text-[10px]">#{idx + 1}</span>
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-textPrimary">
                          {formatCurrency(item.value, currency)}
                        </span>
                        <span className="text-textSecondary text-[11px] font-medium w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    {/* Inset Progress Well */}
                    <div className="w-full h-2 rounded-full neu-inset overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </NeumorphicCard>

        {/* AI Financial Insights Teaser */}
        <NeumorphicCard className="flex flex-col justify-between bg-gradient-to-br from-surface via-primary/5 to-secondary/5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-textPrimary tracking-tight">
                Spending Patterns & Insights
              </h3>
              <p className="text-xs text-textSecondary">
                Observed patterns from your financial log
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl neu-inset bg-surface flex items-start gap-3">
              <span className="text-lg">🎯</span>
              <div>
                <h4 className="text-xs font-bold text-textPrimary">Budget Adherence</h4>
                <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
                  You have utilized {stats.budgetUsedPercent.toFixed(1)}% of your monthly allocation.
                  {stats.budgetRemaining > 0
                    ? ` You have ${formatCurrency(stats.budgetRemaining, currency)} remaining to spend safely.`
                    : ' You have exceeded your planned monthly limit.'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl neu-inset bg-surface flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <h4 className="text-xs font-bold text-textPrimary">Savings Recommendation</h4>
                <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
                  Your current savings rate is {stats.savingsRate}%. Maintaining a 25%+ rate enables compound growth and builds a resilient emergency buffer.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl neu-inset bg-surface flex items-start gap-3">
              <span className="text-lg">🍔</span>
              <div>
                <h4 className="text-xs font-bold text-textPrimary">Primary Cost Center</h4>
                <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
                  {stats.topCategory} constitutes your largest expenditure this month. Review individual transactions to identify high-frequency recurring purchases.
                </p>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
}
