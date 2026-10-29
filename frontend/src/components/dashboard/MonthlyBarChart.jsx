import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { NeumorphicCard } from '../ui/NeumorphicCard';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../store/useStore';

export function MonthlyBarChart({ data = [] }) {
  const currency = useStore((state) => state.currency);
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface neu-card p-3 border border-white/80 rounded-2xl shadow-xl min-w-[140px]">
          <p className="text-xs font-bold text-textPrimary mb-1.5 border-b border-border/40 pb-1">
            {payload[0]?.payload?.fullName || label}
          </p>
          <div className="flex flex-col gap-1">
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
    <NeumorphicCard className="h-[360px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/10 border border-secondary/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary tracking-tight">
              Monthly Comparison
            </h3>
            <p className="text-xs text-textSecondary">
              Spending trend across the past 6 months
            </p>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-0 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
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
            <Bar
              dataKey="expense"
              name="Expenses"
              fill="#8D91E8"
              radius={[8, 8, 0, 0]}
              maxBarSize={38}
            >
              {data.map((entry, index) => {
                // Highlight current month
                const isCurrent = index === data.length - 1;
                return (
                  <Cell
                    key={`bar-${index}`}
                    fill={isCurrent ? '#51BFA2' : '#8D91E8'}
                    opacity={isCurrent ? 1 : 0.8}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-semibold text-textSecondary pt-2 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary opacity-80" />
          <span>Past Months</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>Current Month</span>
        </div>
      </div>
    </NeumorphicCard>
  );
}
