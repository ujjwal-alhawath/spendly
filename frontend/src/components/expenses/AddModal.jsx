import React, { useState, useEffect } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Tag,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../utils/categories';
import { useStore } from '../../store/useStore';
import { toast } from '../ui/Toast';

export function AddModal({ isOpen, onClose, defaultExpense = null }) {
  const addExpense = useStore((state) => state.addExpense);
  const editExpense = useStore((state) => state.editExpense);
  const currency = useStore((state) => state.currency);

  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (defaultExpense) {
        setType(defaultExpense.type || 'expense');
        setTitle(defaultExpense.title || '');
        setAmount(defaultExpense.amount ? defaultExpense.amount.toString() : '');
        setCategory(defaultExpense.category || 'Other');
        setDate(
          defaultExpense.date || new Date().toISOString().split('T')[0]
        );
        setNote(defaultExpense.note || '');
      } else {
        setType('expense');
        setTitle('');
        setAmount('');
        setCategory('Food');
        setDate(new Date().toISOString().split('T')[0]);
        setNote('');
      }
      setErrors({});
    }
  }, [isOpen, defaultExpense]);

  // When type changes, adjust default category if incompatible
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('Salary');
    } else {
      setCategory('Food');
    }
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount) errs.amount = 'Amount is required';
    else if (isNaN(Number(amount)) || Number(amount) <= 0)
      errs.amount = 'Must be a valid positive number';
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
      type,
      date,
      note: note.trim(),
    };

    if (defaultExpense) {
      editExpense(defaultExpense.id, expenseData);
      toast.success('Transaction updated');
    } else {
      addExpense(expenseData);
      toast.success(
        type === 'income' ? 'Income added' : 'Expense recorded'
      );
    }
    onClose();
  };

  const categoryList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultExpense ? 'Edit Transaction' : 'Record Transaction'}
      subtitle={
        defaultExpense
          ? 'Modify existing transaction details'
          : 'Add a new expense or income item'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Type Toggle: Expense vs Income */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
            Transaction Type
          </label>
          <div className="neu-pill-inset p-1.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                type === 'expense'
                  ? 'neu-pill text-danger bg-surface shadow-sm border border-danger/30'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Expense</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                type === 'income'
                  ? 'neu-pill text-primary bg-surface shadow-sm border border-primary/30'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Title Input */}
        <Input
          label="Title *"
          placeholder={
            type === 'income'
              ? 'e.g. Freelance Client Payment'
              : 'e.g. Organic Groceries'
          }
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Amount (${currency}) *`}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-surface neu-inset rounded-xl px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all cursor-pointer"
            >
              {categoryList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-xs text-danger font-medium mt-0.5">
                {errors.category}
              </span>
            )}
          </div>
        </div>

        {/* Date */}
        <Input
          label="Transaction Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Note / Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
            Note or Payment Method (Optional)
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-surface neu-inset text-textPrimary placeholder:text-textSecondary/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all resize-none"
            placeholder="e.g. Paid via Credit Card / UPI..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-3 pt-4 border-t border-border/40">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={type === 'income' ? 'primary' : 'primary'}
          >
            {defaultExpense ? 'Save Changes' : type === 'income' ? 'Save Income' : 'Save Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
