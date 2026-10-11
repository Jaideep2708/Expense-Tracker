import React, { useState, useMemo } from 'react';

const CATEGORY_COLORS = {
  'Food & Dining': '#f97316',
  'Transportation': '#3b82f6',
  'Housing & Rent': '#8b5cf6',
  'Utilities & Bills': '#06b6d4',
  'Entertainment & Leisure': '#ec4899',
  'Healthcare': '#10b981',
  'Shopping': '#eab308',
  'Education': '#6366f1',
  'Investments': '#14b8a6',
  'Miscellaneous': '#64748b',
};

const ExpenseList = ({ expenses, onEditExpense, onDeleteExpense, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const matchesCategory =
          selectedCategory === 'ALL' || expense.category === selectedCategory;
        const matchesSearch =
          expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (expense.description &&
            expense.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date || 0) - new Date(a.date || 0);
        if (sortBy === 'date-asc') return new Date(a.date || 0) - new Date(b.date || 0);
        if (sortBy === 'amount-desc') return Number(b.amount || 0) - Number(a.amount || 0);
        if (sortBy === 'amount-asc') return Number(a.amount || 0) - Number(b.amount || 0);
        return 0;
      });
  }, [expenses, searchTerm, selectedCategory, sortBy]);

  // Unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(expenses.map((e) => e.category).filter(Boolean));
    return ['ALL', ...Array.from(cats)];
  }, [expenses]);

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card list-card">
      <div className="card-header list-header">
        <h2 className="card-title">📋 Expense History ({filteredExpenses.length})</h2>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by title or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="form-control filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? '🏷️ All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            className="form-control sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">📅 Date: Newest First</option>
            <option value="date-asc">📅 Date: Oldest First</option>
            <option value="amount-desc">💰 Amount: High to Low</option>
            <option value="amount-asc">💰 Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Expenses Table / Cards */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading expenses...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No expenses found</h3>
          <p>
            {expenses.length === 0
              ? 'Start by adding your first expense above!'
              : 'No expenses match your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense Details</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => {
                const categoryColor =
                  CATEGORY_COLORS[expense.category] || '#6366f1';
                return (
                  <tr key={expense.id} className="expense-row">
                    <td className="expense-date">{formatDate(expense.date)}</td>
                    <td className="expense-main">
                      <div className="expense-title">{expense.title}</div>
                      {expense.description && (
                        <div className="expense-desc">{expense.description}</div>
                      )}
                    </td>
                    <td>
                      <span
                        className="badge-category"
                        style={{
                          backgroundColor: `${categoryColor}18`,
                          color: categoryColor,
                          border: `1px solid ${categoryColor}40`,
                        }}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge-payment">
                        {expense.paymentMethod || 'Credit Card'}
                      </span>
                    </td>
                    <td className="expense-amount">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => onEditExpense(expense)}
                          title="Edit Expense"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => onDeleteExpense(expense.id)}
                          title="Delete Expense"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
