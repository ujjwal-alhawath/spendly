import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { NeumorphicCard } from '../ui/NeumorphicCard';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../store/useStore';

export function ExpenseDonutChart({ data = [] }) {
  const currency = useStore((state) => state.currency);
  const totalExpense = data.reduce((sum, item) => sum + (item.value || 0), 0);

  // Custom Neumorphic Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0;
      return (
        <div className="bg-surface neu-card p-3 border border-white/80 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.payload.color }}
            />
            <span className="text-xs font-bold text-textPrimary">
              {item.name}
            </span>
          </div>
          <p className="text-sm font-extrabold text-textPrimary">
            {formatCurrency(item.value, currency)}{' '}
            <span className="text-xs font-normal text-textSecondary">
              ({pct}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <NeumorphicCard className="h-[380px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/10 border border-secondary/20">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary tracking-tight">
              Expense Categories
            </h3>
            <p className="text-xs text-textSecondary">
              Distribution for current month
            </p>
          </div>
        </div>
      </div>

      {/* Chart Canvas & Legend */}
      {!data || data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center neu-inset rounded-2xl p-6 text-center text-textSecondary">
          <PieIcon className="w-10 h-10 text-textSecondary/40 mb-2" />
          <p className="text-sm font-semibold text-textPrimary">No category data</p>
          <p className="text-xs text-textSecondary mt-0.5">
            Add categorized expenses to see spending distribution.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between min-h-0 gap-3">
          {/* Donut Chart with Center Total */}
          <div className="w-full sm:w-1/2 h-[200px] sm:h-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all hover:opacity-85 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
                Total
              </span>
              <span className="text-sm sm:text-base font-extrabold text-textPrimary">
                {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </div>

          {/* Category List */}
          <div className="w-full sm:w-1/2 flex flex-col gap-2 overflow-y-auto max-h-[160px] sm:max-h-[240px] pr-1">
            {data.map((item) => {
              const pct =
                totalExpense > 0
                  ? Math.round((item.value / totalExpense) * 100)
                  : 0;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 rounded-xl neu-inset text-xs hover:bg-white/40 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-textPrimary truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[11px] font-bold text-textPrimary">
                      {formatCurrency(item.value, currency)}
                    </span>
                    <span className="text-[10px] font-medium text-textSecondary w-7 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </NeumorphicCard>
  );
}
