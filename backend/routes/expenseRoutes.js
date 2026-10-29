const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/expenses
// @desc    Get all transactions for the authenticated user
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 });
    // Normalize id to match frontend expectations
    const formatted = expenses.map((exp) => ({
      id: exp._id.toString(),
      _id: exp._id.toString(),
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      type: exp.type || 'expense',
      date: exp.date,
      note: exp.note || '',
      createdAt: exp.createdAt ? new Date(exp.createdAt).getTime() : Date.now(),
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
});

// @route   POST /api/expenses
// @desc    Add a new transaction for the authenticated user
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, type = 'expense', date, note = '' } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const numAmount = Number(amount);
    if (amount === undefined || amount === null || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid positive amount' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const newExpense = new Expense({
      user: req.user.id,
      title: title.trim(),
      amount: numAmount,
      category: category.trim(),
      type: type === 'income' ? 'income' : 'expense',
      date: date || new Date().toISOString().split('T')[0],
      note: typeof note === 'string' ? note.trim() : '',
    });

    const saved = await newExpense.save();
    res.status(201).json({
      id: saved._id.toString(),
      _id: saved._id.toString(),
      title: saved.title,
      amount: saved.amount,
      category: saved.category,
      type: saved.type,
      date: saved.date,
      note: saved.note,
      createdAt: new Date(saved.createdAt).getTime(),
    });
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ message: 'Server error creating expense' });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure transaction belongs to user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, amount, category, type, date, note } = req.body;
    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ message: 'Title cannot be empty' });
      expense.title = title.trim();
    }
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
      expense.amount = numAmount;
    }
    if (category !== undefined) {
      if (!category.trim()) return res.status(400).json({ message: 'Category cannot be empty' });
      expense.category = category.trim();
    }
    if (type !== undefined) {
      expense.type = type === 'income' ? 'income' : 'expense';
    }
    if (date !== undefined) expense.date = date;
    if (note !== undefined) expense.note = typeof note === 'string' ? note.trim() : '';

    const updated = await expense.save();
    res.json({
      id: updated._id.toString(),
      _id: updated._id.toString(),
      title: updated.title,
      amount: updated.amount,
      category: updated.category,
      type: updated.type,
      date: updated.date,
      note: updated.note,
      createdAt: new Date(updated.createdAt).getTime(),
    });
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ message: 'Server error updating expense' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Transaction deleted', id });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ message: 'Server error deleting expense' });
  }
});

// @route   DELETE /api/expenses
// @desc    Clear all transactions for authenticated user
router.delete('/', async (req, res) => {
  try {
    await Expense.deleteMany({ user: req.user.id });
    res.json({ message: 'All transactions cleared for user' });
  } catch (err) {
    console.error('Error clearing expenses:', err);
    res.status(500).json({ message: 'Server error clearing expenses' });
  }
});

module.exports = router;
