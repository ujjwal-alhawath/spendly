import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function ExpenseRow({ expense, onEdit, onDelete }) {
  return (
    <tr className="border-b border-border hover:bg-white/5 transition-colors group">
      <td className="p-4 text-sm text-muted">
        {formatDate(expense.date)}
      </td>
      <td className="p-4">
        <p className="text-sm font-medium text-textPrimary">{expense.title}</p>
        {expense.note && (
          <p className="text-xs text-muted mt-0.5 truncate max-w-xs">{expense.note}</p>
        )}
      </td>
      <td className="p-4">
        <Badge category={expense.category} />
      </td>
      <td className="p-4 text-sm font-medium text-textPrimary text-right">
        {formatCurrency(expense.amount)}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" className="!p-2" onClick={() => onEdit(expense)} title="Edit">
            ✏️
          </Button>
          <Button variant="danger" className="!p-2" onClick={() => onDelete(expense)} title="Delete">
            🗑️
          </Button>
        </div>
      </td>
    </tr>
  );
}
