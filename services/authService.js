const AuthService = {
  async register(name, email, password, phone = '', address = '') {
    const res = await fetch(`${App.BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, address })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
    // API returns 201: { success, data: { user, accessToken, refreshToken } }
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${App.BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login gagal');
    // API returns 200: { success, data: { user, accessToken, refreshToken } }
    return data;
  },

  async getProfile() {
    const res = await App.fetch(`${App.BASE_URL}/api/auth/me`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil profil');
    return data.data || data;
  },

  async refreshToken(refreshToken) {
    const res = await fetch(`${App.BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Token tidak valid');
    return data.data || data;
  },

  async logout() {
    const res = await App.fetch(`${App.BASE_URL}/api/auth/logout`, {
      method: 'POST'
    });
    if (!res) return;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Logout gagal');
    return data;
  },

  async updatePassword(currentPassword, newPassword) {
    const res = await App.fetch(`${App.BASE_URL}/api/auth/update-password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengganti password');
    return data;
  }
};

window.AuthService = AuthService;