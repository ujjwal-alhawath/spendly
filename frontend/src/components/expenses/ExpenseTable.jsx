import React from 'react';
import { SearchX } from 'lucide-react';
import { ExpenseRow } from './ExpenseRow';
import { NeumorphicCard } from '../ui/NeumorphicCard';

export function ExpenseTable({ expenses = [], onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <NeumorphicCard className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-3xl neu-icon-box flex items-center justify-center text-textSecondary/50 mb-3 bg-surface">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-textPrimary mb-1">
          No transactions match your filters
        </h3>
        <p className="text-xs text-textSecondary max-w-sm">
          Try clearing search queries, expanding date ranges, or adding a new transaction.
        </p>
      </NeumorphicCard>
    );
  }

  return (
    <NeumorphicCard p="p-0" className="overflow-hidden">
      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="border-b border-border/40 bg-surface/50">
              <th className="p-4 text-[10px] font-bold text-textSecondary uppercase tracking-wider w-28">
                Date
              </th>
              <th className="p-4 text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                Title / Merchant
              </th>
              <th className="p-4 text-[10px] font-bold text-textSecondary uppercase tracking-wider w-40">
                Category
              </th>
              <th className="p-4 text-[10px] font-bold text-textSecondary uppercase tracking-wider text-center w-28">
                Type
              </th>
              <th className="p-4 text-[10px] font-bold text-textSecondary uppercase tracking-wider text-right w-36">
                Amount
              </th>
              <th className="p-4 text-[10px] font-bold text-textSecondary uppercase tracking-wider text-right w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <ExpenseRow
                key={`row-${exp.id}`}
                expense={exp}
                mode="table"
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack */}
      <div className="md:hidden flex flex-col gap-3 p-4">
        {expenses.map((exp) => (
          <ExpenseRow
            key={`card-${exp.id}`}
            expense={exp}
            mode="card"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </NeumorphicCard>
  );
}
