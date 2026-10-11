import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing & Rent',
  'Utilities & Bills',
  'Entertainment & Leisure',
  'Healthcare',
  'Shopping',
  'Education',
  'Investments',
  'Miscellaneous',
];

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'UPI / Net Banking',
  'Bank Transfer',
  'Other',
];

const ExpenseForm = ({ onSaveExpense, editingExpense, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    description: '',
  });

  const [formError, setFormError] = useState('');

  // Update form if editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || 'Food & Dining',
        date: editingExpense.date || new Date().toISOString().split('T')[0],
        paymentMethod: editingExpense.paymentMethod || 'Credit Card',
        description: editingExpense.description || '',
      });
      setFormError('');
    } else {
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
        description: '',
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.title.trim()) {
      setFormError('Please provide a title for the expense.');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!formData.date) {
      setFormError('Please select a date.');
      return;
    }

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    onSaveExpense(payload);
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2 className="card-title">
          {editingExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}
        </h2>
        {editingExpense && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>

      {formError && <div className="alert alert-danger">{formError}</div>}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-grid">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Expense Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="e.g. Grocery Shopping, Electric Bill"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount">Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              className="form-control"
              placeholder="₹ 0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="form-control"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label htmlFor="description">Notes / Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              rows="2"
              className="form-control"
              placeholder="Add any extra notes or receipt details..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
