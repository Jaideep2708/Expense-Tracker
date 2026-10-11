/**
 * API Service for communicating with the Spring Boot Backend.
 * Automatically adapts whether running on unified port (e.g. 8080) or separate dev ports.
 */

// If served from unified port (e.g. :8080), use relative path '/api/expenses'
// If running from separate dev port (e.g. :3000 or :5500), target backend at :8080
const getInitialBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.port === '8080') {
    return '/api/expenses';
  }
  return 'http://localhost:8080/api/expenses';
};

const BASE_URLS = [
  getInitialBaseUrl(),
  '/api/expenses',
  'http://localhost:8080/api/expenses',
  'http://127.0.0.1:8080/api/expenses'
];

let activeBaseUrl = BASE_URLS[0];

const requestWithFallback = async (endpoint = '', options = {}) => {
  try {
    const url = `${activeBaseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } catch (err) {
    for (const fallback of BASE_URLS) {
      if (fallback === activeBaseUrl) continue;
      try {
        const url = `${fallback}${endpoint}`;
        const response = await fetch(url, {
          ...options,
          headers: {
            'Accept': 'application/json',
            ...(options.headers || {}),
          },
        });
        activeBaseUrl = fallback;
        return response;
      } catch {
        // Try next fallback
      }
    }
    throw err;
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData) {
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map(e => e.defaultMessage || e).join(', ');
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
    } catch {
      // Non-JSON response
    }
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const expenseService = {
  // GET all expenses
  getAllExpenses: async () => {
    const response = await requestWithFallback();
    return handleResponse(response);
  },

  // GET single expense by ID
  getExpenseById: async (id) => {
    const response = await requestWithFallback(`/${id}`);
    return handleResponse(response);
  },

  // POST create new expense
  createExpense: async (expenseData) => {
    const response = await requestWithFallback('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    return handleResponse(response);
  },

  // PUT update existing expense
  updateExpense: async (id, expenseData) => {
    const response = await requestWithFallback(`/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    return handleResponse(response);
  },

  // DELETE expense by ID
  deleteExpense: async (id) => {
    const response = await requestWithFallback(`/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // GET expenses by category
  getExpensesByCategory: async (category) => {
    const response = await requestWithFallback(`/category/${encodeURIComponent(category)}`);
    return handleResponse(response);
  },
};
