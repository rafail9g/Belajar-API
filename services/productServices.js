const BookService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${App.BASE_URL}/api/books${query ? '?' + query : '?limit=100'}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil buku');
    // Handle response structure { success, data }
    return data.data || data;
  },

  async getById(id) {
    const res = await fetch(`${App.BASE_URL}/api/books/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Buku tidak ditemukan');
    return data.data || data;
  },

  async getCategories() {
    const res = await fetch(`${App.BASE_URL}/api/books/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil kategori');
    return data.data || data;
  },

  async create(bookData) {
    const res = await App.fetch(`${App.BASE_URL}/api/books`, {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menambah buku');
    return data.data || data;
  },

  async update(id, bookData) {
    const res = await App.fetch(`${App.BASE_URL}/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengupdate buku');
    return data.data || data;
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
    const res = await App.fetch(`${App.BASE_URL}/api/loans?limit=100`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data peminjaman');
    // Extract data dari response { success, data }
    const loans = data.data || data.loans || data || [];
    return { data: Array.isArray(loans) ? loans : [] };
  },

  async getMyLoans() {
    try {
      const currentUser = App.getUser();
      if (!currentUser?._id) {
        console.warn('User tidak ditemukan');
        return { data: [] };
      }
      
      // Coba endpoint dengan query parameter
      const res = await App.fetch(`${App.BASE_URL}/api/loans?limit=100`);
      if (!res) return { data: [] };
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengambil data peminjaman');
      
      // Extract data dari response
      let allLoans = [];
      if (data.data && Array.isArray(data.data)) {
        allLoans = data.data;
      } else if (Array.isArray(data)) {
        allLoans = data;
      } else if (data.loans && Array.isArray(data.loans)) {
        allLoans = data.loans;
      } else {
        allLoans = [];
      }
      
      // Filter berdasarkan user yang login
      const myLoans = allLoans.filter(loan => {
        const loanUserId = loan.user?._id || loan.userId || loan.user;
        return loanUserId === currentUser._id;
      });
      
      return { data: myLoans };
    } catch (err) {
      console.error('Error in getMyLoans:', err);
      return { data: [] };
    }
  },

  async getHistory() {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/history`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil riwayat');
    return data.data || data;
  },

  async getOverdue() {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/overdue`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data terlambat');
    return data.data || data;
  },

  async borrow(bookId) {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/borrow`, {
      method: 'POST',
      body: JSON.stringify({ bookId })
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal meminjam buku');
    return data.data || data;
  },

  async returnBook(loanId) {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/${loanId}/return`, {
      method: 'PUT'
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengembalikan buku');
    return data.data || data;
  },

  async getById(loanId) {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/${loanId}`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil detail peminjaman');
    return data.data || data;
  }
};

const FineService = {
  async getAll() {
    const res = await App.fetch(`${App.BASE_URL}/api/fines`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data denda');
    return data.data || data;
  },

  async getStats() {
    const res = await App.fetch(`${App.BASE_URL}/api/fines/stats`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil statistik denda');
    return data.data || data;
  },

  async pay(fineId) {
    const res = await App.fetch(`${App.BASE_URL}/api/fines/${fineId}/pay`, {
      method: 'PUT'
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal membayar denda');
    return data.data || data;
  }
};

const MemberService = {
  async getDashboard() {
    const res = await App.fetch(`${App.BASE_URL}/api/members/dashboard`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil dashboard');
    return data.data || data;
  },

  async getAll() {
    const res = await App.fetch(`${App.BASE_URL}/api/members`);
    if (!res) return [];
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data anggota');
    return data.data || data;
  }
};

window.BookService = BookService;
window.LoanService = LoanService;
window.FineService = FineService;
window.MemberService = MemberService;