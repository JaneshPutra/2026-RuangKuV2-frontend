import React, { useState, useEffect } from 'react';
import { User, LayoutGrid, Check, Info, DoorOpen, X as CloseIcon, Calendar, Users, Search } from 'lucide-react';
import axios from 'axios';
import Modal from './components/Modal';

// --- Interfaces ---
export interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

export interface Ruangan {
  id: number;
  namaRuangan: string;
  kapasitas: number;
  lokasi: string;
  status: 'Available' | 'Maintenance';
}

const App: React.FC = () => {
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);
  const [dataRuangan, setDataRuangan] = useState<Ruangan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail' | 'detail_room' | 'edit_room'>('add');
  const [selectedData, setSelectedData] = useState<any>(null);

  // --- STATE UNTUK SEARCH & FILTER ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // --- FETCH DATA DENGAN PARAMETER (FULLSTACK) ---
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5205/api/Peminjaman`, {
        params: {
          search: searchTerm,
          status: filterStatus
        }
      });
      setDataPeminjaman(response.data);
    } catch (error) { console.error("Gagal ambil data peminjaman", error); }
  };

  const fetchRuangan = async () => {
    try {
      const response = await axios.get(`http://localhost:5205/api/Ruangan`);
      setDataRuangan(response.data);
    } catch (error) { console.error("Gagal ambil data ruangan", error); }
  };

  // Trigger fetch setiap kali search atau filter berubah
  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchRuangan();
  }, []);

  const openModal = (type: any, data?: any) => {
    setModalType(type);
    setSelectedData(data || null);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (item: Peminjaman, newStatus: string) => {
    try {
      await axios.put(`http://localhost:5205/api/Peminjaman/${item.id}`, { ...item, status: newStatus });
      fetchData();
    } catch (error) { alert("Gagal update status"); }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e3e3e3] font-sans">
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-40">
        <div className="bg-[#1e1e1e]/90 backdrop-blur-xl border border-[#333] px-6 py-3 rounded-2xl flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl"><LayoutGrid size={20} className="text-white" /></div>
            <span className="text-xl font-bold text-white tracking-tight italic uppercase">RuangKu</span>
          </div>
          <div className="flex items-center gap-4 text-right pr-4 border-r border-[#333]">
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Janesh Admin</p>
              <p className="text-[10px] text-indigo-500 font-black uppercase mt-0.5 tracking-widest">Active Now</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/30"><User size={20} /></div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Dashboard</h1>
          <button onClick={() => openModal('add')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">+ New Booking</button>
        </div>

        {/* CARD RUANGAN - COMPACT HORIZONTAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {dataRuangan.map((room) => (
            <div key={room.id} onClick={() => openModal('detail_room', room)} className="bg-[#1e1e1e] border border-[#333] p-5 rounded-[1.5rem] flex items-center justify-between group hover:border-indigo-500/50 hover:bg-[#222] transition-all cursor-pointer active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${room.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`} />
                <div>
                  <h3 className="text-base font-black text-white tracking-tighter uppercase italic leading-none group-hover:text-indigo-400 transition-colors">{room.namaRuangan}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">{room.lokasi}</p>
                    <span className="text-[10px] text-[#444]">•</span>
                    <div className="flex items-center gap-1 text-[#555]"><Users size={12} /><span className="text-[10px] font-bold">{room.kapasitas} Pax</span></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[8px] font-black px-2 py-1 rounded-md bg-[#121212] border ${room.status === 'Available' ? 'border-emerald-500/20 text-emerald-500' : 'border-amber-500/20 text-amber-500'} uppercase tracking-widest`}>{room.status}</span>
                <div className="text-[#333] group-hover:text-indigo-500 transition-colors"><Info size={16} /></div>
              </div>
            </div>
          ))}
        </div>

        {/* --- SECTION PENCARIAN & FILTER --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar yang lebih ramping */}
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or room..."
              className="w-full bg-[#1e1e1e]/50 border border-[#333] rounded-2xl px-14 py-4 text-sm text-white focus:border-indigo-500/50 focus:bg-[#1e1e1e] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Chips - Desain Minimalis & Modern */}
          <div className="flex bg-[#1e1e1e]/50 border border-[#333] p-1.5 rounded-2xl gap-1">
            {['All', 'Menunggu', 'Disetujui', 'Ditolak'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filterStatus === s
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-[#555] hover:text-[#888] hover:bg-white/5'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-[2.5rem] shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#252525] text-[#555] text-[10px] uppercase font-black tracking-[0.2em] border-b border-[#333]">
              <tr>
                <th className="px-8 py-6">Peminjam</th>
                <th className="px-8 py-6">Ruangan</th>
                <th className="px-8 py-6 text-center">Periote Peminjaman</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {dataPeminjaman.map((item) => (
                <tr key={item.id} className="hover:bg-[#252525]/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-white text-lg tracking-tight italic">{item.namaPeminjam}</td>
                  <td className="px-8 py-6"><span className="text-indigo-400 font-black uppercase text-xs tracking-widest">{item.ruangan}</span></td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-[#eee] font-black flex items-center gap-2"><Calendar size={14} className="text-indigo-500" /> {item.tanggalPinjam}</span>
                      <span className="text-[10px] text-[#555] font-bold uppercase tracking-widest mt-1 border-t border-[#333] pt-1 w-full text-center">Sampai {item.tanggalKembali}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${item.status === 'Disetujui' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : item.status === 'Ditolak' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{item.status}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleUpdateStatus(item, 'Disetujui')} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"><Check size={18} /></button>
                      <button onClick={() => handleUpdateStatus(item, 'Ditolak')} className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"><CloseIcon size={18} /></button>
                      <button onClick={() => openModal('detail', item)} className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20"><Info size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dataPeminjaman.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[10px] font-black text-[#444] uppercase tracking-[0.4em]">No matching data found</p>
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        data={selectedData}
        refreshData={fetchData}
        setModalType={setModalType}
        roomsData={dataRuangan}
        allPeminjamanData={dataPeminjaman}
      />
    </div>
  );
};

export default App;