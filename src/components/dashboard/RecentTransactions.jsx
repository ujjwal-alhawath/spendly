import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Receipt,
} from 'lucide-react';
import { NeumorphicCard } from '../ui/NeumorphicCard';
import { formatCurrency, formatRelativeDate } from '../../utils/formatters';
import { getCategoryConfig } from '../../utils/categories';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';
import { AddModal } from '../expenses/AddModal';

export function RecentTransactions({ expenses = [] }) {
  const currency = useStore((state) => state.currency);
  const deleteExpense = useStore((state) => state.deleteExpense);

  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Take most recent 5 transactions
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleEdit = (exp, e) => {
    e.stopPropagation();
    setExpenseToEdit(exp);
    setIsEditModalOpen(true);
  };

  const handleDelete = (exp, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete transaction "${exp.title}"?`)) {
      deleteExpense(exp.id);
      toast.success('Transaction removed');
    }
  };

  return (
    <>
      <NeumorphicCard className="h-[360px] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-textPrimary tracking-tight">
                Recent Transactions
              </h3>
              <p className="text-xs text-textSecondary">
                Latest cash flow movements
              </p>
            </div>
          </div>

          <Link
            to="/expenses"
            className="neu-pill px-3 py-1.5 text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Transactions List */}
        {!recent || recent.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center neu-inset rounded-2xl p-6 text-center text-textSecondary">
            <Receipt className="w-10 h-10 text-textSecondary/40 mb-2" />
            <p className="text-sm font-semibold text-textPrimary">No transactions found</p>
            <p className="text-xs text-textSecondary mt-0.5">
              Add your first transaction to see it listed here.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
            {recent.map((exp) => {
              const catConfig = getCategoryConfig(exp.category);
              const isIncome = exp.type === 'income';

              return (
                <div
                  key={exp.id}
                  className="group flex items-center justify-between p-3 rounded-2xl neu-inset hover:bg-white/50 transition-all cursor-pointer"
                  onClick={(e) => handleEdit(exp, e)}
                >
                  {/* Left: Icon + Title & Category */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-lg shrink-0"
                      style={{
                        backgroundColor: `${catConfig.color}15`,
                        color: catConfig.color,
                        borderColor: `${catConfig.color}30`,
                      }}
                    >
                      {catConfig.emoji}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold text-textPrimary truncate group-hover:text-primary transition-colors">
                        {exp.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                        <span className="font-medium">{catConfig.label}</span>
                        <span>•</span>
                        <span>{formatRelativeDate(exp.date)}</span>
                        {exp.note && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[100px]">{exp.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Quick Actions */}
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <p
                        className={`text-sm font-extrabold flex items-center justify-end gap-0.5 ${
                          isIncome ? 'text-primary' : 'text-danger'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                        <span>
                          {isIncome ? '+' : '-'}
                          {formatCurrency(exp.amount, currency)}
                        </span>
                      </p>
                      <span className="text-[10px] font-semibold uppercase text-textSecondary">
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                    </div>

                    {/* Action buttons (revealed on hover) */}
                    <div className="hidden group-hover:flex items-center gap-1.5 transition-all">
                      <button
                        onClick={(e) => handleEdit(exp, e)}
                        className="w-7 h-7 rounded-xl neu-btn flex items-center justify-center text-textSecondary hover:text-primary cursor-pointer"
                        title="Edit transaction"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(exp, e)}
                        className="w-7 h-7 rounded-xl neu-btn flex items-center justify-center text-textSecondary hover:text-danger cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </NeumorphicCard>

      <AddModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        defaultExpense={expenseToEdit}
      />
    </>
  );
}
