
export interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPinjam: string;
  tanggalSelesai: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}