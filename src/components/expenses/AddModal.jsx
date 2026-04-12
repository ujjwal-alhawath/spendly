import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CATEGORIES } from '../../utils/categories';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';

export function AddModal({ isOpen, onClose, defaultExpense = null }) {
  const addExpense = useStore(state => state.addExpense);
  const editExpense = useStore(state => state.editExpense);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (defaultExpense) {
        setTitle(defaultExpense.title);
        setAmount(defaultExpense.amount.toString());
        setCategory(defaultExpense.category);
        setDate(defaultExpense.date);
        setNote(defaultExpense.note || '');
      } else {
        setTitle('');
        setAmount('');
        setCategory('Other');
        setDate(new Date().toISOString().split('T')[0]);
        setNote('');
      }
      setErrors({});
    }
  }, [isOpen, defaultExpense]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount) errs.amount = 'Amount is required';
    else if (isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = 'Must be a valid positive number';
    if (!category) errs.category = 'Category is required';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const expenseData = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      note: note.trim()
    };

    if (defaultExpense) {
      editExpense(defaultExpense.id, expenseData);
      toast.success('Expense updated');
    } else {
      addExpense(expenseData);
      toast.success('Expense added');
    }
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={defaultExpense ? "Edit Expense" : "Add Expense"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input 
          label="Title *"
          placeholder="e.g. Starbucks Coffee"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />
        
        <div className="flex gap-4">
          <Input 
            label="Amount (₹) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            className="flex-1"
          />
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted">Category *</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary w-full"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
            {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
          </div>
        </div>

        <Input 
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">Note (Optional)</label>
          <textarea 
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary resize-none w-full"
            placeholder="Additional details..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">
            {defaultExpense ? "Save Changes" : "Save Expense"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
