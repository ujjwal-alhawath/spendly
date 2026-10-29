import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryConfig } from '../../utils/categories';
import { useStore } from '../../store/useStore';

export function ExpenseRow({ expense, onEdit, onDelete, mode = 'table' }) {
  const currency = useStore((state) => state.currency);
  const isIncome = expense.type === 'income';
  const catConfig = getCategoryConfig(expense.category);

  if (mode === 'card') {
    return (
      <div className="p-4 rounded-2xl neu-card flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-base shrink-0"
              style={{
                backgroundColor: `${catConfig.color}15`,
                color: catConfig.color,
                borderColor: `${catConfig.color}30`,
              }}
            >
              {catConfig.emoji}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-textPrimary truncate">
                {expense.title}
              </h4>
              <p className="text-xs text-textSecondary">{formatDate(expense.date)}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p
              className={`text-sm font-extrabold ${
                isIncome ? 'text-primary' : 'text-danger'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(expense.amount, currency)}
            </p>
            <span
              className={`text-[10px] font-bold uppercase ${
                isIncome ? 'text-primary' : 'text-danger'
              }`}
            >
              {isIncome ? 'Income' : 'Expense'}
            </span>
          </div>
        </div>

        {expense.note && (
          <p className="text-xs text-textSecondary bg-black/5 p-2 rounded-xl">
            {expense.note}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <Badge category={expense.category} />

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(expense)}
              className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-textSecondary hover:text-primary flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(expense)}
              className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-danger hover:bg-danger/10 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Table Row
  return (
    <tr className="border-b border-border/40 hover:bg-white/40 transition-colors group">
      <td className="p-4 text-xs font-semibold text-textSecondary whitespace-nowrap">
        {formatDate(expense.date)}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl neu-icon-box flex items-center justify-center text-sm shrink-0"
            style={{
              backgroundColor: `${catConfig.color}15`,
              color: catConfig.color,
              borderColor: `${catConfig.color}30`,
            }}
          >
            {catConfig.emoji}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-textPrimary truncate group-hover:text-primary transition-colors">
              {expense.title}
            </p>
            {expense.note && (
              <p className="text-xs text-textSecondary truncate max-w-sm">
                {expense.note}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="p-4">
        <Badge category={expense.category} />
      </td>
      <td className="p-4 text-xs font-bold text-center">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
            isIncome
              ? 'bg-primary/15 text-primary border border-primary/20'
              : 'bg-danger/15 text-danger border border-danger/20'
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          ) : (
            <ArrowDownLeft className="w-3 h-3 stroke-[2.5]" />
          )}
          <span>{isIncome ? 'Income' : 'Expense'}</span>
        </span>
      </td>
      <td
        className={`p-4 text-sm font-extrabold text-right whitespace-nowrap ${
          isIncome ? 'text-primary' : 'text-danger'
        }`}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(expense.amount, currency)}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-textSecondary hover:text-primary transition-all cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-textSecondary hover:text-danger transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
