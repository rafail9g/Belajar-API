const BASE_URL = 'https://library-api-lime.vercel.app';

const App = {
  BASE_URL,

  getToken: () => localStorage.getItem('token'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),

  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch { return null; }
  },

  setAuth: (accessToken, user, refreshToken = null) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
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
    setTimeout(() => { toast.className = 'toast'; }, 3000);
  },

  // Fetch wrapper — otomatis handle 401 dengan refresh token
  async fetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...(options.headers || {})
      }
    });

    // Coba refresh token jika 401
    if (res.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData.data?.accessToken || refreshData.accessToken;
            if (newToken) {
              localStorage.setItem('token', newToken);
              // Retry request dengan token baru
              const retryRes = await fetch(url, {
                ...options,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${newToken}`,
                  ...(options.headers || {})
                }
              });
              return retryRes;
            }
          }
        } catch (e) {
          console.warn('Refresh token gagal:', e);
        }
      }
      // Refresh gagal atau tidak ada → logout
      App.clearAuth();
      if (!window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
      }
      return null;
    }

    return res;
  }
};

window.App = App;