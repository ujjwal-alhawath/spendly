import React from 'react';
import { ExpenseRow } from './ExpenseRow';

export function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-card border border-border p-12 rounded-xl flex flex-col items-center justify-center text-center">
        <span className="text-4xl mb-4">📭</span>
        <h3 className="text-lg font-semibold text-textPrimary mb-1">No expenses found</h3>
        <p className="text-muted text-sm max-w-sm">
          No transactions match your current filters. Try adjusting them or add a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/5 border-b border-border">
              <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider w-32">Date</th>
              <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Title</th>
              <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider w-40">Category</th>
              <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider text-right w-32">Amount</th>
              <th className="p-4 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <ExpenseRow 
                key={exp.id} 
                expense={exp} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
