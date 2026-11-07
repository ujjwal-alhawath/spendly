const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
      max: 100000000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    date: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Save storage by omitting __v
  }
);

// Compound index to optimize both user scoping and date sorting in a single efficient index
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
