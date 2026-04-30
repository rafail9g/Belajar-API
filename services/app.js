const BASE_URL = 'https://library-api-lime.vercel.app';

const App = {
  BASE_URL,
  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch { return null; }
  },
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isLoggedIn: () => !!localStorage.getItem('token'),
  isAdmin: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user && user.role === 'admin';
    } catch { return false; }
  },
  redirect: (page) => {
    window.location.href = page;
  },
  authHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }),
  showToast: (message, type = 'success') => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.className = 'toast', 3000);
  },

  // Fetch wrapper — otomatis logout kalau token expired (401)
  async fetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...(options.headers || {})
      }
    });

    if (res.status === 401) {
      App.clearAuth();
      window.location.href = 'login.html';
      return null;
    }

    return res;
  }
};

window.App = App;