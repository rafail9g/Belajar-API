const AuthService = {
  async register(name, email, password) {
    const res = await fetch(`${App.BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
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
    return data;  // ← ini mengembalikan { success, data }
  },

  async getProfile() {
    const res = await fetch(`${App.BASE_URL}/api/auth/profile`, {
      headers: App.authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil profil');
    return data;
  }
};

window.AuthService = AuthService;
