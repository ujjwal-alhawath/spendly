import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';

export function BudgetModal({ isOpen, onClose }) {
  const monthlyBudget = useStore(state => state.monthlyBudget);
  const setBudget = useStore(state => state.setBudget);

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
    toast.success('Monthly budget updated');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Monthly Budget">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input 
          label="Total Monthly Budget (₹) *"
          type="number"
          step="0.01"
          placeholder="15000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Budget</Button>
        </div>
      </form>
    </Modal>
  );
}
