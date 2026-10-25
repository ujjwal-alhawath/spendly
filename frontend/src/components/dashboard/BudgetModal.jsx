import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';
import { formatCurrency } from '../../utils/formatters';

export function BudgetModal({ isOpen, onClose }) {
  const monthlyBudget = useStore((state) => state.monthlyBudget);
  const setBudget = useStore((state) => state.setBudget);
  const currency = useStore((state) => state.currency);

  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(monthlyBudget.toString());
    }
  }, [isOpen, monthlyBudget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    setBudget(num);
    toast.success('Monthly budget updated successfully');
    onClose();
  };

  const presets = [25000, 35000, 50000, 75000, 100000];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Monthly Budget Target"
      subtitle="Define your target spending limit to track savings efficiency"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="p-4 rounded-2xl neu-inset bg-surface flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-primary bg-primary/10 border border-primary/20 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-textSecondary uppercase">
              Current Target
            </p>
            <p className="text-base font-extrabold text-textPrimary">
              {formatCurrency(monthlyBudget, currency)} / month
            </p>
          </div>
        </div>

        <Input
          label={`Target Amount (${currency}) *`}
          type="number"
          step="100"
          placeholder="35000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />

        {/* Quick Presets */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={`neu-pill px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  Number(amount) === preset
                    ? 'neu-pill-inset text-primary border-primary/30'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                {formatCurrency(preset, currency)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-border/40">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Target
          </Button>
        </div>
      </form>
    </Modal>
  );
}
