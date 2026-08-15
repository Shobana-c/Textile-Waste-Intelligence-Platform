const getBackendUrl = () => {
  // If an environment variable is defined (e.g. for cloud production deployment)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Otherwise default to current host on port 8000 for local development
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:8000/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

export const BACKEND_URL = getBackendUrl();
// Helper to strip /api/v1 to get static file server root
export const FILE_SERVER_URL = BACKEND_URL.replace('/api/v1', '');

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('textile_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

  register: async (email, password, fullName, role) => {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, full_name: fullName, role }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Session expired');
    }
    return response.json();
  },

  // Inventory
  getBatches: async () => {
    const response = await fetch(`${BACKEND_URL}/inventory/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch waste batches');
    return response.json();
  },

  createBatch: async (batchData) => {
    const response = await fetch(`${BACKEND_URL}/inventory/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(batchData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to create waste batch');
    }
    return response.json();
  },

  deleteBatch: async (id) => {
    const response = await fetch(`${BACKEND_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete batch');
    return true;
  },

  // Image Upload and Analysis
  uploadImage: async (batchId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/analysis/upload/${batchId}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to upload and analyze image');
    }
    return response.json();
  },

  // Stats / Dashboard
  getStats: async () => {
    const response = await fetch(`${BACKEND_URL}/dashboard/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard statistics');
    return response.json();
  },

  // Notifications
  getNotifications: async () => {
    const response = await fetch(`${BACKEND_URL}/notifications/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  // Exports URLs (these are loaded direct via window.open, but we provide functions for completeness)
  getExcelExportUrl: () => `${BACKEND_URL}/reports/excel`,
  getPdfExportUrl: () => `${BACKEND_URL}/reports/pdf`,
};
