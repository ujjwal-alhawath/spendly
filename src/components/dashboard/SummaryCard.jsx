import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { NeumorphicCard } from '../ui/NeumorphicCard';

export function SummaryCard({
  title,
  value,
  icon: Icon,
  accentColor = '#51BFA2',
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'neutral'
  isPositiveGood = true,
  subLabel,
  onClick,
}) {
  const isUp = trendDirection === 'up';
  const isDown = trendDirection === 'down';

  // Determine trend color:
  // If isPositiveGood: up is green, down is red
  // If !isPositiveGood (like expenses): down is green (saving money), up is red
  let trendColorClass = 'text-textSecondary bg-black/5';
  if (isUp) {
    trendColorClass = isPositiveGood
      ? 'text-primary bg-primary/15 border-primary/25'
      : 'text-danger bg-danger/15 border-danger/25';
  } else if (isDown) {
    trendColorClass = isPositiveGood
      ? 'text-danger bg-danger/15 border-danger/25'
      : 'text-primary bg-primary/15 border-primary/25';
  }

  return (
    <NeumorphicCard
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={`flex flex-col justify-between relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-primary/40' : ''
      }`}
    >
      {/* Top Row: Icon + Trend Badge */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-11 h-11 rounded-2xl neu-icon-box flex items-center justify-center transition-transform hover:scale-105"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            borderColor: `${accentColor}30`,
          }}
        >
          {Icon && <Icon className="w-5 h-5 stroke-[2.2]" />}
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${trendColorClass}`}
          >
            {isUp && <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />}
            {isDown && <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
            {!isUp && !isDown && <Minus className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Value & Label */}
      <div className="mt-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-textPrimary tracking-tight">
          {value}
        </h3>
        {subLabel && (
          <p className="text-xs text-textSecondary mt-1.5 flex items-center gap-1 font-medium">
            {subLabel}
          </p>
        )}
      </div>
    </NeumorphicCard>
  );
}
