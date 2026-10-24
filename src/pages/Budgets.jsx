import React, { useState } from 'react';
import {
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Plus,
  TrendingDown,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useExpenseStats } from '../hooks/useExpenseStats';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';
import { BudgetModal } from '../components/dashboard/BudgetModal';
import { toast } from '../components/ui/Toast';

export function Budgets() {
  const expenses = useStore((state) => state.expenses);
  const monthlyBudget = useStore((state) => state.monthlyBudget);
  const categoryBudgets = useStore((state) => state.categoryBudgets || {});
  const setCategoryBudget = useStore((state) => state.setCategoryBudget);
  const currency = useStore((state) => state.currency);

  const stats = useExpenseStats(expenses, monthlyBudget);

  const [isOverallBudgetModalOpen, setIsOverallBudgetModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCatBudget, setNewCatBudget] = useState('');

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setNewCatBudget((categoryBudgets[cat.id] || 5000).toString());
  };

  const handleSaveCategoryBudget = (e) => {
    e.preventDefault();
    const num = Number(newCatBudget);
    if (!num || num < 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setCategoryBudget(editingCategory.id, num);
    toast.success(`Budget for ${editingCategory.label} updated`);
    setEditingCategory(null);
  };

  // Determine overall status
  const isOverBudget = stats.totalSpentThisMonth > monthlyBudget;
  const isWarning = !isOverBudget && stats.budgetUsedPercent > 80;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
            Budget Management
          </h2>
          <p className="text-xs text-textSecondary">
            Set spending targets by category and prevent overspending
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsOverallBudgetModalOpen(true)}
          className="neu-btn-primary shadow-neu-accent"
        >
          <Target className="w-4 h-4" />
          <span>Edit Overall Budget</span>
        </Button>
      </div>

      {/* Main Budget Progress Card */}
      <NeumorphicCard className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div
            className={`w-16 h-16 rounded-3xl neu-icon-box flex items-center justify-center shrink-0 ${
              isOverBudget
                ? 'text-danger bg-danger/10 border-danger/30'
                : isWarning
                ? 'text-warning bg-warning/10 border-warning/30'
                : 'text-primary bg-primary/10 border-primary/30'
            }`}
          >
            {isOverBudget ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <CheckCircle2 className="w-8 h-8" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                Monthly Target
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  isOverBudget
                    ? 'bg-danger/20 text-danger border border-danger/30'
                    : isWarning
                    ? 'bg-warning/20 text-warning border border-warning/30'
                    : 'bg-primary/20 text-primary border border-primary/30'
                }`}
              >
                {isOverBudget
                  ? 'Over Budget'
                  : isWarning
                  ? 'Approaching Limit'
                  : 'On Track'}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-textPrimary mt-0.5">
              {formatCurrency(stats.totalSpentThisMonth, currency)}{' '}
              <span className="text-sm sm:text-base font-normal text-textSecondary">
                / {formatCurrency(monthlyBudget, currency)}
              </span>
            </h3>
            <p className="text-xs text-textSecondary mt-1">
              {stats.budgetRemaining > 0
                ? `${formatCurrency(stats.budgetRemaining, currency)} remaining to spend safely this month`
                : `Exceeded target by ${formatCurrency(stats.totalSpentThisMonth - monthlyBudget, currency)}`}
            </p>
          </div>
        </div>

        {/* Inset Overall Progress Well */}
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-textSecondary">Total Consumption</span>
            <span
              className={
                isOverBudget
                  ? 'text-danger'
                  : isWarning
                  ? 'text-warning'
                  : 'text-primary'
              }
            >
              {stats.budgetUsedPercent.toFixed(1)}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full neu-inset overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-danger'
                  : isWarning
                  ? 'bg-warning'
                  : 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, stats.budgetUsedPercent)}%` }}
            />
          </div>
        </div>
      </NeumorphicCard>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-textPrimary tracking-tight">
            Category Allocations
          </h3>
          <span className="text-xs text-textSecondary">
            Click any category card to edit its spending target
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPENSE_CATEGORIES.map((cat) => {
            const spent = stats.categoryTotals[cat.id] || 0;
            const target = categoryBudgets[cat.id] || 5000;
            const pct = target > 0 ? Math.round((spent / target) * 100) : 0;
            const catOver = spent > target;
            const catWarn = !catOver && pct > 80;

            return (
              <NeumorphicCard
                key={cat.id}
                interactive={true}
                onClick={() => handleEditCategory(cat)}
                className="flex flex-col justify-between gap-4 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl neu-icon-box flex items-center justify-center text-lg"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                        borderColor: `${cat.color}30`,
                      }}
                    >
                      {cat.emoji}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors">
                        {cat.label}
                      </h4>
                      <p className="text-xs text-textSecondary">
                        Target: {formatCurrency(target, currency)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(cat);
                    }}
                    className="w-7 h-7 rounded-xl neu-btn flex items-center justify-center text-textSecondary hover:text-primary transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Progress & Numbers */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-textSecondary font-medium">
                      Spent: <strong className="text-textPrimary">{formatCurrency(spent, currency)}</strong>
                    </span>
                    <span
                      className={`font-bold ${
                        catOver
                          ? 'text-danger'
                          : catWarn
                          ? 'text-warning'
                          : 'text-primary'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full neu-inset overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        catOver
                          ? 'bg-danger'
                          : catWarn
                          ? 'bg-warning'
                          : 'bg-primary'
                      }`}
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: !catOver && !catWarn ? cat.color : undefined,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-textSecondary pt-1">
                    <span>
                      {catOver
                        ? `Over by ${formatCurrency(spent - target, currency)}`
                        : `${formatCurrency(Math.max(0, target - spent), currency)} left`}
                    </span>
                    <span className="font-semibold">
                      {catOver ? '⚠️ Alert' : '✓ Normal'}
                    </span>
                  </div>
                </div>
              </NeumorphicCard>
            );
          })}
        </div>
      </div>

      {/* Edit Category Budget Modal */}
      {editingCategory && (
        <Modal
          isOpen={Boolean(editingCategory)}
          onClose={() => setEditingCategory(null)}
          title={`Edit ${editingCategory.label} Budget`}
          subtitle="Set maximum target spend for this specific category"
        >
          <form onSubmit={handleSaveCategoryBudget} className="flex flex-col gap-4">
            <Input
              label={`Monthly Limit (${currency}) *`}
              type="number"
              step="100"
              value={newCatBudget}
              onChange={(e) => setNewCatBudget(e.target.value)}
              autoFocus
            />

            <div className="flex items-center justify-end gap-3 mt-3 pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Target
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Overall Budget Modal */}
      <BudgetModal
        isOpen={isOverallBudgetModalOpen}
        onClose={() => setIsOverallBudgetModalOpen(false)}
      />
    </div>
  );
}
