import React from 'react';

const ExpenseSummary = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalCount = expenses.length;
  const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
  
  const highestExpense = expenses.length > 0 
    ? Math.max(...expenses.map(e => Number(e.amount || 0))) 
    : 0;

  // Category breakdown
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="summary-section">
      <div className="summary-cards-grid">
        <div className="summary-card total-card">
          <div className="summary-icon">💳</div>
          <div className="summary-info">
            <span className="summary-label">Total Expenditure</span>
            <h3 className="summary-value">{formatCurrency(totalAmount)}</h3>
          </div>
        </div>

        <div className="summary-card count-card">
          <div className="summary-icon">📝</div>
          <div className="summary-info">
            <span className="summary-label">Total Transactions</span>
            <h3 className="summary-value">{totalCount}</h3>
          </div>
        </div>

        <div className="summary-card avg-card">
          <div className="summary-icon">📊</div>
          <div className="summary-info">
            <span className="summary-label">Average / Expense</span>
            <h3 className="summary-value">{formatCurrency(averageAmount)}</h3>
          </div>
        </div>

        <div className="summary-card max-card">
          <div className="summary-icon">🔥</div>
          <div className="summary-info">
            <span className="summary-label">Highest Expense</span>
            <h3 className="summary-value">{formatCurrency(highestExpense)}</h3>
          </div>
        </div>
      </div>

      {Object.keys(categoryTotals).length > 0 && (
        <div className="category-pill-container">
          <span className="category-pill-title">Category Spending:</span>
          <div className="category-pills">
            {Object.entries(categoryTotals).map(([cat, amt]) => (
              <span key={cat} className="category-pill">
                <strong>{cat}:</strong> {formatCurrency(amt)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;
