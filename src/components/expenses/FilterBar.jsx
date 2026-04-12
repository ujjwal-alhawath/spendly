import React from 'react';
import { Input } from '../ui/Input';
import { CATEGORIES } from '../../utils/categories';

export function FilterBar({ filters, setFilters, sortBy, setSortBy }) {
  return (
    <div className="bg-card border border-border p-4 rounded-xl flex flex-col lg:flex-row gap-4 lg:items-end">
      <Input 
        label="Search"
        placeholder="Search by title..."
        value={filters.search}
        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
        className="flex-1"
      />
      
      <div className="flex-1 flex flex-col gap-1.5 min-w-[200px]">
        <label className="text-sm font-medium text-muted">Category</label>
        <select 
          value={filters.category}
          onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <Input 
          label="From Date"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
        />
        <Input 
          label="To Date"
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
        />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-w-[150px]">
        <label className="text-sm font-medium text-muted">Sort By</label>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>
    </div>
  );
}
