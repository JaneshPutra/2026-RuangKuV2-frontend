#  RuangKu - Frontend (React TypeScript + Tailwind)

Antarmuka modern untuk sistem reservasi ruangan dengan tema Dark Mode yang elegan.

## Fitur Utama
- **Floating Pill Navbar**: Navigasi modern berbentuk kapsul (Pill-shaped).
- **Dashboard Interactive**: Tampilan kartu ruangan dan tabel reservasi.
- **Advanced Form**: Reservasi dengan rentang waktu (Mulai & Selesai) menggunakan `datetime-local`.
- **Business Logic**:
  - Validasi status ruangan (Ruangan *Maintenance* tidak bisa dipilih).
  - Feedback error real-time dari API.
  - Sembunyi otomatis tombol aksi jika status sudah diproses.

## Tech Stack
- **Framework**: React.js (Vite)
- **Langguage**: TypeScript
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **HTTP Client**: Axios

## cara Menjalankan
1. Pastikan Node.js sudah terinstall.
2. Clone repository.
3. Install dependencies:
   ```bash
   npm install
4. Jalankan aplikasi dalam mode development:
  ```bash
  npm run dev

Aplikasi akan berjalan di http://localhost:5173.