const BookService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${App.BASE_URL}/api/books${query ? '?' + query : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil buku');
    return data;
  },

  async getById(id) {
    const res = await fetch(`${App.BASE_URL}/api/books/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Buku tidak ditemukan');
    return data;
  },

  async getCategories() {
    const res = await fetch(`${App.BASE_URL}/api/books/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil kategori');
    return data;
  },

  async create(bookData) {
    const res = await App.fetch(`${App.BASE_URL}/api/books`, {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menambah buku');
    return data;
  },

  async update(id, bookData) {
    const res = await App.fetch(`${App.BASE_URL}/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengupdate buku');
    return data;
  },

  async delete(id) {
    const res = await App.fetch(`${App.BASE_URL}/api/books/${id}`, {
      method: 'DELETE'
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menghapus buku');
    return data;
  }
};

const LoanService = {
  async getAll() {
    const res = await App.fetch(`${App.BASE_URL}/api/loans`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data peminjaman');
    return data;
  },

  async getHistory() {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/history`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil riwayat');
    return data;
  },

  async getOverdue() {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/overdue`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data terlambat');
    return data;
  },

  async borrow(bookId) {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/borrow`, {
      method: 'POST',
      body: JSON.stringify({ bookId })
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal meminjam buku');
    return data;
  },

  async returnBook(loanId) {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/${loanId}/return`, {
      method: 'PUT'
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengembalikan buku');
    return data;
  },

  async getById(loanId) {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/${loanId}`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil detail peminjaman');
    return data;
  }
};

const FineService = {
  async getAll() {
    const res = await App.fetch(`${App.BASE_URL}/api/fines`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data denda');
    return data;
  },

  async getStats() {
    const res = await App.fetch(`${App.BASE_URL}/api/fines/stats`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil statistik denda');
    return data;
  },

  async pay(fineId) {
    const res = await App.fetch(`${App.BASE_URL}/api/fines/${fineId}/pay`, {
      method: 'PUT'
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal membayar denda');
    return data;
  }
};

const MemberService = {
  async getDashboard() {
    const res = await App.fetch(`${App.BASE_URL}/api/members/dashboard`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil dashboard');
    return data;
  },

  async getAll() {
    const res = await App.fetch(`${App.BASE_URL}/api/members`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data anggota');
    return data;
  }
};

window.BookService = BookService;
window.LoanService = LoanService;
window.FineService = FineService;
window.MemberService = MemberService;