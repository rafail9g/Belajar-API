const BookService = {
  async getAll(params = {}) {
    const defaultParams = { limit: 100, ...params };
    const query = new URLSearchParams(defaultParams).toString();
    const res = await fetch(`${App.BASE_URL}/api/books?${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil buku');
    return data.data?.books || data.data || data;
  },

  async getById(id) {
    const res = await fetch(`${App.BASE_URL}/api/books/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Buku tidak ditemukan');
    return data.data?.book || data.data || data;
  },

  async getCategories() {
    const res = await fetch(`${App.BASE_URL}/api/books/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil kategori');
    return data.data || data;
  },

  async create(bookData) {
    const payload = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn || '',
      publisher: bookData.publisher || '',
      publishYear: bookData.publishYear || bookData.publishedYear || null,
      category: bookData.category || 'lainnya',
      description: bookData.description || '',
      pages: bookData.pages || null,
      totalCopies: bookData.totalCopies ?? bookData.stock ?? 1,
      location: bookData.location || '',
      coverImage: bookData.coverImage || bookData.cover || ''
    };
    const res = await App.fetch(`${App.BASE_URL}/api/books`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menambah buku');
    return data.data?.book || data.data || data;
  },

  async update(id, bookData) {
    const payload = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn || '',
      publisher: bookData.publisher || '',
      publishYear: bookData.publishYear || bookData.publishedYear || null,
      category: bookData.category || 'lainnya',
      description: bookData.description || '',
      pages: bookData.pages || null,
      totalCopies: bookData.totalCopies ?? bookData.stock ?? 1,
      location: bookData.location || '',
      coverImage: bookData.coverImage || bookData.cover || ''
    };
    const res = await App.fetch(`${App.BASE_URL}/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengupdate buku');
    return data.data?.book || data.data || data;
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
  async getAll(params = {}) {
    const query = new URLSearchParams({ limit: 100, ...params }).toString();
    const res = await App.fetch(`${App.BASE_URL}/api/loans?${query}`);
    if (!res) return { data: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data peminjaman');
    const loans = data.data?.loans || data.data || data || [];
    return { data: Array.isArray(loans) ? loans : [] };
  },

  async getMyLoans() {
    try {
      const res = await App.fetch(`${App.BASE_URL}/api/loans?limit=100`);
      if (!res) return { data: [] };
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengambil data peminjaman');
      const loans = data.data?.loans || data.data || data || [];
      return { data: Array.isArray(loans) ? loans : [] };
    } catch (err) {
      console.error('Error in getMyLoans:', err);
      return { data: [] };
    }
  },

  async getHistory(params = {}) {
    const query = new URLSearchParams({ limit: 100, ...params }).toString();
    const res = await App.fetch(`${App.BASE_URL}/api/loans/history?${query}`);
    if (!res) return { data: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil riwayat');
    const loans = data.data?.loans || data.data || data || [];
    return { data: Array.isArray(loans) ? loans : [] };
  },

  async getOverdue(params = {}) {
    const query = new URLSearchParams({ limit: 100, ...params }).toString();
    const res = await App.fetch(`${App.BASE_URL}/api/loans/overdue?${query}`);
    if (!res) return { data: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data terlambat');
    const loans = data.data?.loans || data.data || data || [];
    return { data: Array.isArray(loans) ? loans : [] };
  },

  async getById(loanId) {
    const res = await App.fetch(`${App.BASE_URL}/api/loans/${loanId}`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil detail peminjaman');
    // API returns: { data: { loan: {} } }
    return data.data?.loan || data.data || data;
  },

  async borrow(bookId, memberId = null, notes = '') {
    const payload = { bookId };
    if (memberId) payload.memberId = memberId;
    if (notes) payload.notes = notes;

    const res = await App.fetch(`${App.BASE_URL}/api/loans/borrow`, {
      method: 'POST',
      body: JSON.stringify(payload)
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
  }
};

const FineService = {
  async getAll(params = {}) {
    const query = new URLSearchParams({ limit: 100, ...params }).toString();
    const res = await App.fetch(`${App.BASE_URL}/api/fines?${query}`);
    if (!res) return { data: [] };
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

  async getById(fineId) {
    const res = await App.fetch(`${App.BASE_URL}/api/fines/${fineId}`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil detail denda');
    return data.data?.fine || data.data || data;
  },

  async pay(fineId, paymentMethod = 'tunai', notes = '') {
    const res = await App.fetch(`${App.BASE_URL}/api/fines/${fineId}/pay`, {
      method: 'PUT',
      body: JSON.stringify({ paymentMethod, notes })
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal membayar denda');
    return data.data || data;
  },

  async create(loanId, amount, reason, notes = '') {
    const res = await App.fetch(`${App.BASE_URL}/api/fines`, {
      method: 'POST',
      body: JSON.stringify({ loanId, amount, reason, notes })
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal membuat denda');
    return data.data || data;
  }
};

const MemberService = {
  async getDashboard() {
    const res = await App.fetch(`${App.BASE_URL}/api/members/dashboard`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil dashboard');
    // API returns: { data: { stats: {} } }
    return data.data?.stats || data.data || data;
  },

  async getAll(params = {}) {
    const query = new URLSearchParams({ limit: 100, ...params }).toString();
    const res = await App.fetch(`${App.BASE_URL}/api/members?${query}`);
    if (!res) return { data: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil data anggota');
    return data.data || data;
  },

  async getById(id) {
    const res = await App.fetch(`${App.BASE_URL}/api/members/${id}`);
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil detail anggota');
    return data.data || data;
  },

  async updateProfile(profileData) {
    const res = await App.fetch(`${App.BASE_URL}/api/members/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memperbarui profil');
    return data.data || data;
  },

  async update(id, memberData) {
    const res = await App.fetch(`${App.BASE_URL}/api/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData)
    });
    if (!res) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memperbarui anggota');
    return data.data || data;
  }
};

window.BookService = BookService;
window.LoanService = LoanService;
window.FineService = FineService;
window.MemberService = MemberService;