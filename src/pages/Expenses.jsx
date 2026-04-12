import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { FilterBar } from '../components/expenses/FilterBar';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { AddModal } from '../components/expenses/AddModal';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { toast } from '../components/ui/Toast';

const ITEMS_PER_PAGE = 10;

export function Expenses() {
  const expenses = useStore(state => state.expenses);
  const deleteExpense = useStore(state => state.deleteExpense);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Derive filtered and sorted data
  const filteredAndSorted = useMemo(() => {
    let result = [...expenses];

    // Filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || (e.note || '').toLowerCase().includes(q));
    }
    if (filters.category !== 'All') {
      result = result.filter(e => e.category === filters.category);
    }
    if (filters.dateFrom) {
      result = result.filter(e => new Date(e.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter(e => new Date(e.date) <= new Date(filters.dateTo));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, filters, sortBy]);

  const runningTotal = filteredAndSorted.reduce((sum, e) => sum + e.amount, 0);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleEdit = (exp) => {
    setExpenseToEdit(exp);
    setIsAddModalOpen(true);
  };

  const handleDelete = (exp) => {
    if (window.confirm(`Are you sure you want to delete "${exp.title}"?`)) {
      deleteExpense(exp.id);
      toast.success('Expense deleted');
      
      // Fix pagination if deleting last item on page
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleOpenAdd = () => {
    setExpenseToEdit(null);
    setIsAddModalOpen(true);
  };

  // Reset page to 1 on filter/sort change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-textPrimary">All Transactions</h2>
        <Button onClick={handleOpenAdd} className="hidden md:flex">+ Add Expense</Button>
      </div>

      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />

      {expenses.length === 0 ? (
        // Absolute Empty State without filters
        <div className="bg-card border border-border p-16 rounded-xl flex flex-col items-center justify-center text-center mt-4">
          <span className="text-6xl mb-4">💳</span>
          <h3 className="text-xl font-bold text-textPrimary mb-2">No expenses yet</h3>
          <p className="text-muted text-sm max-w-sm mb-6">
            Track your spending to gain meaningful insights into your financial health.
          </p>
          <Button onClick={handleOpenAdd}>Add your first expense</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ExpenseTable 
            expenses={paginatedData} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />

          <div className="flex flex-col sm:flex-row items-center justify-between bg-card border border-border p-4 rounded-xl gap-4">
            <p className="text-sm font-medium text-textPrimary">
              Total exactly for these filters: <span className="text-primary font-bold ml-1">{formatCurrency(runningTotal)}</span>
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <span className="text-sm text-muted px-2">Page {currentPage} of {totalPages}</span>
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <AddModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        defaultExpense={expenseToEdit}
      />

      {/* Floating Add Expense button for Mobile & Global usage */}
      <button 
        onClick={handleOpenAdd}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-primary text-background rounded-full shadow-lg hover:bg-emerald-400 transition-colors flex items-center justify-center text-2xl"
      >
        +
      </button>

      {/* Adding a global floating button to Dashboard via portals would be messy. 
          The prompt asks for "Floating + Add Expense button (bottom right) → opens Add Modal" ON DASHBOARD too.
          Let's render it on the Layout if possible, or just keep it on both pages. */}
    </div>
  );
}
