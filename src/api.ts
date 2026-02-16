import axios from 'axios';
import { Peminjaman } from './App'; // Ambil interface yang tadi kita buat

const API_URL = 'http://localhost:5205/api/Peminjaman'; // Sesuaikan port ASP.NET kamu

export const getPeminjaman = () => axios.get<Peminjaman[]>(API_URL);
export const createPeminjaman = (data: Omit<Peminjaman, 'id'>) => axios.post(API_URL, data);
export const updatePeminjaman = (id: number, data: Peminjaman) => axios.put(`${API_URL}/${id}`, data);
export const deletePeminjaman = (id: number) => axios.delete(`${API_URL}/${id}`);