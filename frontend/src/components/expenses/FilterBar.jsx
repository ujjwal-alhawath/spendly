import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../../utils/categories';
import { NeumorphicCard } from '../ui/NeumorphicCard';

export function FilterBar({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  typeFilter = 'all',
  setTypeFilter,
}) {
  const handleReset = () => {
    setFilters({
      search: '',
      category: 'All',
      dateFrom: '',
      dateTo: '',
    });
    setSortBy('newest');
    if (setTypeFilter) setTypeFilter('all');
  };

  return (
    <NeumorphicCard p="p-4 sm:p-5" className="flex flex-col gap-4">
      {/* Top Filter Row: Search & Type Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Inset Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, note, or merchant..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full bg-surface neu-inset text-textPrimary placeholder:text-textSecondary/60 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        {/* Type Toggle: All / Expense / Income */}
        {setTypeFilter && (
          <div className="neu-pill-inset p-1 flex items-center self-start md:self-auto shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'neu-pill text-textPrimary shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                typeFilter === 'expense'
                  ? 'neu-pill text-danger shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                typeFilter === 'income'
                  ? 'neu-pill text-primary shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Income
            </button>
          </div>
        )}
      </div>

      {/* Bottom Filter Controls: Category, Dates, Sort, Reset */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-border/30">
        {/* Category Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="bg-surface neu-inset text-textPrimary rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
            className="bg-surface neu-inset text-textPrimary rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
            }
            className="bg-surface neu-inset text-textPrimary rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          />
        </div>

        {/* Sort & Reset Actions */}
        <div className="flex items-end gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface neu-inset text-textPrimary rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="newest">Date: Newest First</option>
              <option value="oldest">Date: Oldest First</option>
              <option value="highest">Amount: High to Low</option>
              <option value="lowest">Amount: Low to High</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="neu-btn h-[34px] px-3 rounded-xl flex items-center justify-center text-textSecondary hover:text-textPrimary transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </NeumorphicCard>
  );
}
