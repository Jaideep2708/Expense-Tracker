import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { expenseService } from './services/expenseService';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to show temporary notification toasts
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch all expenses from Spring Boot Backend
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getAllExpenses();
      setExpenses(data || []);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      setError('Could not connect to the backend server. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handle Save (Create or Update)
  const handleSaveExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        // Update existing expense
        const updated = await expenseService.updateExpense(editingExpense.id, expenseData);
        setExpenses((prev) =>
          prev.map((item) => (item.id === editingExpense.id ? updated : item))
        );
        setEditingExpense(null);
        showToast('Expense updated successfully! ✨');
      } else {
        // Create new expense
        const created = await expenseService.createExpense(expenseData);
        setExpenses((prev) => [created, ...prev]);
        showToast('Expense added successfully! 🎉');
      }
    } catch (err) {
      console.error('Failed to save expense:', err);
      showToast(err.message || 'Error saving expense. Please try again.', 'error');
    }
  };

  // Handle Edit selection
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Handle Delete
  const handleDeleteExpense = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expense record?');
    if (!confirmDelete) return;

    try {
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null);
      }
      showToast('Expense deleted successfully. 🗑️');
    } catch (err) {
      console.error('Failed to delete expense:', err);
      showToast('Failed to delete expense. Please check backend connection.', 'error');
    }
  };

  // Optional: Seed Sample Data for instant testing
  const handleSeedSampleData = async () => {
    const samples = [
      {
        title: 'Weekly Grocery & Vegetables',
        amount: 2450.00,
        category: 'Food & Dining',
        date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
        paymentMethod: 'UPI / Net Banking',
        description: 'Fresh vegetables, dairy, fruits, and groceries',
      },
      {
        title: 'High-Speed Fiber Internet Bill',
        amount: 999.00,
        category: 'Utilities & Bills',
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
        description: 'Monthly broadband wifi recharge',
      },
      {
        title: 'Petrol / Fuel Refill',
        amount: 1800.00,
        category: 'Transportation',
        date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
        paymentMethod: 'Debit Card',
        description: 'Full tank vehicle fuel',
      },
      {
        title: 'Movie Tickets & Snacks',
        amount: 650.00,
        category: 'Entertainment & Leisure',
        date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
        paymentMethod: 'UPI / Net Banking',
        description: 'Weekend cinema with friends',
      },
    ];

    try {
      setLoading(true);
      for (const sample of samples) {
        await expenseService.createExpense(sample);
      }
      await fetchExpenses();
      showToast('Sample expenses added! 🚀');
    } catch (err) {
      showToast('Failed to seed sample data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification toast-${toastMessage.type}`}>
          {toastMessage.message}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">💰</div>
          <div>
            <h1 className="brand-title">Expense Tracker 2.0</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span className="brand-subtitle">Spring Boot + React + H2</span>
              <span className={`status-pill ${error ? 'status-pill-offline' : 'status-pill-online'}`}>
                {error ? '🔴 Offline' : '🟢 Backend Connected'}
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          {expenses.length === 0 && !error && (
            <button className="btn btn-outline" onClick={handleSeedSampleData} disabled={loading}>
              ✨ Load Sample Data
            </button>
          )}
          <button className="btn btn-outline" onClick={fetchExpenses} title="Refresh Expenses">
            🔄 Refresh
          </button>
        </div>
      </header>

      {/* Error Alert Banner */}
      {error && (
        <div className="alert alert-danger error-banner">
          <div className="error-icon">⚠️</div>
          <div>
            <strong>Backend Connection Error:</strong>
            <p>{error}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchExpenses}>
            Retry
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="app-main">
        {/* Top Summary Statistics */}
        <ExpenseSummary expenses={expenses} />

        {/* Form and List Grid */}
        <div className="content-grid">
          {/* Left Column: Form */}
          <div className="content-col-form">
            <ExpenseForm
              onSaveExpense={handleSaveExpense}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Right Column: List & History */}
          <div className="content-col-list">
            <ExpenseList
              expenses={expenses}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              isLoading={loading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Expense Tracker 2.0 &bull; Built with Java Spring Boot, React, and Pure CSS</p>
      </footer>
    </div>
  );
}

export default App;
