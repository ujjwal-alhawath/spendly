import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { NeumorphicCard } from '../ui/NeumorphicCard';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../store/useStore';

export function IncomeExpenseChart({ data = [] }) {
  const currency = useStore((state) => state.currency);
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'expense' | 'income'

  const hasData = data && data.some((d) => (d.expense || 0) > 0 || (d.income || 0) > 0 || (d.amount || 0) > 0);

  // Custom Neumorphic Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface neu-card p-3.5 border border-white/80 rounded-2xl shadow-xl min-w-[150px]">
          <p className="text-xs font-bold text-textPrimary mb-2 border-b border-border/40 pb-1">
            {label}
          </p>
          <div className="flex flex-col gap-1.5">
            {payload.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs gap-3">
                <span className="flex items-center gap-1.5 font-medium text-textSecondary">
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
    <NeumorphicCard className="h-[380px] flex flex-col justify-between">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary tracking-tight">
              Cash Flow Trend
            </h3>
            <p className="text-xs text-textSecondary">
              Daily income & expense flow for current month
            </p>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="neu-pill-inset p-1 flex items-center self-start sm:self-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'both'
                ? 'neu-pill text-textPrimary font-bold shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            All Flow
          </button>
          <button
            onClick={() => setViewMode('expense')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'expense'
                ? 'neu-pill text-danger font-bold shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setViewMode('income')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'income'
                ? 'neu-pill text-primary font-bold shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center neu-inset rounded-2xl p-6 text-center text-textSecondary">
          <TrendingUp className="w-10 h-10 text-textSecondary/40 mb-2" />
          <p className="text-sm font-semibold text-textPrimary">No transactions recorded yet</p>
          <p className="text-xs text-textSecondary mt-0.5">
            Add your income and expenses to see your daily cash flow trend.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="neuIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#51BFA2" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#51BFA2" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="neuExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E77F91" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#E77F91" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
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
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />

              {(viewMode === 'both' || viewMode === 'income') && (
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#51BFA2"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#neuIncomeGrad)"
                />
              )}

              {(viewMode === 'both' || viewMode === 'expense') && (
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expenses"
                  stroke="#E77F91"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#neuExpenseGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </NeumorphicCard>
  );
}
