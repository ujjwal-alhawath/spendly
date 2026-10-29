import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Receipt, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FilterBar } from '../components/expenses/FilterBar';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { AddModal } from '../components/expenses/AddModal';
import { Button } from '../components/ui/Button';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { formatCurrency } from '../utils/formatters';
import { toast } from '../components/ui/Toast';

const ITEMS_PER_PAGE = 8;

export function Expenses() {
  const expenses = useStore((state) => state.expenses);
  const deleteExpense = useStore((state) => state.deleteExpense);
  const currency = useStore((state) => state.currency);
  const loadDemoData = useStore((state) => state.loadDemoData);
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: 'All',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setFilters((prev) => ({ ...prev, search: q }));
    }
  }, [searchParams]);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Derive filtered and sorted data
  const filteredAndSorted = useMemo(() => {
    let result = [...expenses];

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter((e) => (e.type || 'expense') === typeFilter);
    }

    // Filter by search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.note || '').toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (filters.category !== 'All') {
      result = result.filter((e) => e.category === filters.category);
    }

    // Filter by date range
    if (filters.dateFrom) {
      result = result.filter(
        (e) => new Date(e.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      result = result.filter(
        (e) => new Date(e.date) <= new Date(filters.dateTo)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest')
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, filters, typeFilter, sortBy]);

  // Totals for filtered data
  const filteredIncome = filteredAndSorted
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const filteredExpense = filteredAndSorted
    .filter((e) => e.type !== 'income')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netTotal = filteredIncome - filteredExpense;

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (exp) => {
    setExpenseToEdit(exp);
    setIsAddModalOpen(true);
  };

  const handleDelete = (exp) => {
    if (window.confirm(`Are you sure you want to delete "${exp.title}"?`)) {
      deleteExpense(exp.id);
      toast.success('Transaction deleted');
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    }
  };

  const handleOpenAdd = () => {
    setExpenseToEdit(null);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, typeFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative pb-16">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
            Transaction History
          </h2>
          <p className="text-xs text-textSecondary">
            Showing {filteredAndSorted.length} of {expenses.length} total entries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="neu-btn-primary shadow-neu-accent"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {expenses.length === 0 ? (
        <NeumorphicCard className="p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl neu-icon-box flex items-center justify-center text-primary bg-primary/10 mb-4">
            <Receipt className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-textPrimary mb-1">
            No transactions yet
          </h3>
          <p className="text-xs text-textSecondary max-w-sm mb-5 leading-relaxed">
            Start tracking your daily expenses and income to unlock intelligent financial analytics.
          </p>
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <Button variant="primary" onClick={handleOpenAdd}>
              Add Transaction
            </Button>
            <Button variant="surface" onClick={loadDemoData}>
              Load Sample Data
            </Button>
          </div>
        </NeumorphicCard>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Filtered Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <NeumorphicCard p="p-3.5" className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
                  Filtered Income
                </span>
                <p className="text-base font-extrabold text-primary">
                  +{formatCurrency(filteredIncome, currency)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </NeumorphicCard>

            <NeumorphicCard p="p-3.5" className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
                  Filtered Expenses
                </span>
                <p className="text-base font-extrabold text-danger">
                  -{formatCurrency(filteredExpense, currency)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-danger bg-danger/10">
                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
              </div>
            </NeumorphicCard>

            <NeumorphicCard p="p-3.5" className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
                  Net Cash Difference
                </span>
                <p
                  className={`text-base font-extrabold ${
                    netTotal >= 0 ? 'text-primary' : 'text-danger'
                  }`}
                >
                  {netTotal >= 0 ? '+' : ''}
                  {formatCurrency(netTotal, currency)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/10">
                <Receipt className="w-4 h-4" />
              </div>
            </NeumorphicCard>
          </div>

          {/* Transaction Table / Cards */}
          <ExpenseTable
            expenses={paginatedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <NeumorphicCard p="p-3 sm:p-4" className="flex items-center justify-between">
              <p className="text-xs font-semibold text-textSecondary">
                Showing{' '}
                <span className="text-textPrimary font-bold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSorted.length)}
                </span>{' '}
                of {filteredAndSorted.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-textPrimary disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-primary">
                  {currentPage} / {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-textPrimary disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </NeumorphicCard>
          )}
        </div>
      )}

      {/* Add / Edit Transaction Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultExpense={expenseToEdit}
      />
    </div>
  );
}
