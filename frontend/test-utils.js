import { buildContext } from './src/utils/buildContext.js';
import { formatCurrency, formatDate, formatRelativeDate, generateId } from './src/utils/formatters.js';
import { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryConfig } from './src/utils/categories.js';
import { generateDemoTransactions } from './src/store/useStore.js';

let passed = 0;
let failed = 0;

function assert(condition, name, detail = '') {
  if (condition) {
    console.log(`✓ PASS: ${name}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${name} ${detail}`);
    failed++;
  }
}

console.log('--- Testing Frontend Utilities & Data Logic ---');

// 1. generateId
const id1 = generateId();
const id2 = generateId();
assert(typeof id1 === 'string' && id1.length > 5 && id1 !== id2, 'generateId produces unique strings');

// 2. formatCurrency
assert(formatCurrency(1000, 'INR').includes('1,000'), 'formatCurrency INR 1000');
assert(formatCurrency(1000, 'USD').includes('1,000'), 'formatCurrency USD 1000');
assert(formatCurrency(1000, 'EUR').includes('1.000') || formatCurrency(1000, 'EUR').includes('1,000'), 'formatCurrency EUR 1000');
assert(formatCurrency(1000, 'GBP').includes('1,000'), 'formatCurrency GBP 1000');
assert(formatCurrency(0, 'INR').includes('0'), 'formatCurrency 0');
assert(formatCurrency(null, 'INR').includes('0'), 'formatCurrency null defaults to 0');
assert(formatCurrency(-500, 'INR').includes('500'), 'formatCurrency negative handles cleanly');

// 3. formatDate & formatRelativeDate
assert(formatDate('2026-10-15') === 'Oct 15, 2026', 'formatDate ISO date');
assert(formatDate('') === '', 'formatDate empty string');
assert(formatDate('invalid-date') === 'invalid-date', 'formatDate invalid string fallback');
assert(formatRelativeDate('2026-10-15') === 'Oct 15', 'formatRelativeDate ISO date');
assert(formatRelativeDate('') === '', 'formatRelativeDate empty string');

// 4. getCategoryConfig
assert(getCategoryConfig('Food').id === 'Food', 'getCategoryConfig Food');
assert(getCategoryConfig('Salary').isIncome === true, 'getCategoryConfig Salary isIncome');
assert(getCategoryConfig('UnknownCategory').id === 'Other', 'getCategoryConfig fallback to Other');
assert(EXPENSE_CATEGORIES.length > 0 && !EXPENSE_CATEGORIES.some(c => c.isIncome), 'EXPENSE_CATEGORIES excludes income');
assert(INCOME_CATEGORIES.length > 0 && INCOME_CATEGORIES.some(c => c.isIncome), 'INCOME_CATEGORIES includes income');

// 5. buildContext tests
const sampleExpenses = [
  { id: '1', title: 'Salary', amount: 50000, category: 'Salary', type: 'income', date: '2026-10-01' },
  { id: '2', title: 'Groceries', amount: 3000, category: 'Food', type: 'expense', date: '2026-10-05' },
  { id: '3', title: 'Dinner', amount: 1500, category: 'Food', type: 'expense', date: '2026-10-10' },
];

const ctx = buildContext(sampleExpenses, 25000, 'INR');

// Does Spent this month incorrectly include Salary (50,000)?
const includesSalaryInSpend = ctx.includes('Spent This Month: ₹54,500') || ctx.includes('54,500');
assert(!includesSalaryInSpend, 'buildContext does not count income in Spent This Month');

// Does Total Income This Month correctly show Salary?
assert(ctx.includes('Total Income This Month: ₹50,000') || ctx.includes('50,000'), 'buildContext tracks Income This Month');

// Does Highest expense overall show Groceries (3000) instead of Salary (50000)?
const highestExpenseIsSalary = ctx.includes('HIGHEST EXPENSE OVERALL\n- Salary');
assert(!highestExpenseIsSalary, 'buildContext does not mark Income as Highest Expense');
assert(ctx.includes('Groceries (Food): ₹3,000'), 'buildContext identifies Groceries as Highest Expense');

// Test empty expenses in buildContext
try {
  const emptyCtx = buildContext([], 30000);
  assert(emptyCtx.includes('No transactions yet'), 'buildContext handles empty expenses');
} catch (e) {
  assert(false, 'buildContext throws on empty expenses', e.message);
}

// Test undefined expenses in buildContext
try {
  const nullCtx = buildContext(undefined, 30000);
  assert(typeof nullCtx === 'string', 'buildContext handles undefined expenses');
} catch (e) {
  assert(false, 'buildContext throws on undefined expenses', e.message);
}

// Test zero budget
try {
  const zeroBudgetCtx = buildContext(sampleExpenses, 0);
  assert(!zeroBudgetCtx.includes('Infinity%') && !zeroBudgetCtx.includes('NaN%'), 'buildContext handles 0 budget without Infinity/NaN');
} catch (e) {
  assert(false, 'buildContext throws on 0 budget', e.message);
}

// 6. generateDemoTransactions
const demoData = generateDemoTransactions();
assert(Array.isArray(demoData) && demoData.length > 10, 'generateDemoTransactions creates seed data');
const demoIncome = demoData.filter(d => d.type === 'income');
const demoExpense = demoData.filter(d => d.type !== 'income');
assert(demoIncome.length > 0 && demoExpense.length > 0, 'demoData contains both income and expenses');

console.log(`\nFrontend Utility Tests: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
