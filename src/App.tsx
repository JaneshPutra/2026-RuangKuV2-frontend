import React, { useState, useEffect } from 'react';
import { User, LayoutGrid, Plus, Check, Info, DoorOpen, X as CloseIcon, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import Modal from './components/Modal';

export interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

const API_URL = 'http://localhost:5205/api/Peminjaman';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail'>('add');
  const [selectedData, setSelectedData] = useState<Peminjaman | null>(null);
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get<Peminjaman[]>(API_URL);
      setDataPeminjaman(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (type: 'add' | 'edit' | 'detail', data?: Peminjaman) => {
    setModalType(type);
    setSelectedData(data || null);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (item: Peminjaman, newStatus: 'Disetujui' | 'Ditolak') => {
    try {
      // Kita kirim seluruh object tapi statusnya diganti
      await axios.put(`${API_URL}/${item.id}`, { ...item, status: newStatus });
      fetchData(); // Refresh data biar tabel berubah
    } catch (error) {
      alert("Gagal memperbarui status!");
      console.error(error);
    }
  };

  const statsRooms = [
    { name: "Lab Komp 1", cap: 30, status: "Available", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Aula Utama", cap: 200, status: "Maintenance", color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "R. Rapat 2", cap: 12, status: "Available", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Studio", cap: 10, status: "Available", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-[#e3e3e3] font-sans">
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-40">
        <div className="bg-[#1e1e1e]/90 backdrop-blur-xl border border-[#333] px-6 py-3 rounded-2xl flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl"><LayoutGrid size={20} className="text-white" /></div>
            <span className="text-xl font-bold text-white tracking-tight italic uppercase">RuangKu</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right leading-none border-r border-[#333] pr-4 mr-1">
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
          <button onClick={() => openModal('add')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            + New Booking
          </button>
        </div>

        {/* REVISI CARD RUANGAN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsRooms.map((room, idx) => (
            <div key={idx} className="bg-[#1e1e1e] border border-[#333] p-6 rounded-[2rem] relative overflow-hidden group hover:border-indigo-500/50 transition-all">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${room.color} border-current opacity-70`}>{room.status}</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white tracking-tight uppercase leading-none">{room.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-[#555]">
                  <Users size={14} />
                  <p className="text-xs font-bold uppercase tracking-widest">{room.cap} Seats Capacity</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* REVISI TABEL */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-[2.5rem] shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#252525] text-[#555] text-[10px] uppercase font-black tracking-[0.2em] border-b border-[#333]">
              <tr>
                <th className="px-8 py-6">Peminjam</th>
                <th className="px-8 py-6">Ruangan</th>
                <th className="px-8 py-6 text-center">Periode Peminjaman</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {dataPeminjaman.map((item) => (
                <tr key={item.id} className="hover:bg-[#252525]/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-white text-lg tracking-tight italic">{item.namaPeminjam}</td>
                  <td className="px-8 py-6">
                    <span className="text-indigo-400 font-black uppercase text-xs tracking-widest">{item.ruangan}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-[#eee] font-black flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500" /> {item.tanggalPinjam}
                      </span>
                      <span className="text-[10px] text-[#555] font-bold uppercase tracking-widest mt-1 border-t border-[#333] pt-1 w-full text-center">
                        Sampai {item.tanggalKembali}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${item.status === 'Disetujui' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                      item.status === 'Ditolak' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      {/* BUTTON ACC (Ganti Status ke Disetujui) */}
                      <button
                        onClick={() => handleUpdateStatus(item, 'Disetujui')}
                        className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                      >
                        <Check size={18} />
                      </button>

                      {/* BUTTON REJECT (Ganti Status ke Ditolak) */}
                      <button
                        onClick={() => handleUpdateStatus(item, 'Ditolak')}
                        className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-lg shadow-rose-500/5"
                      >
                        <CloseIcon size={18} />
                      </button>

                      {/* BUTTON DETAIL (Buka Modal) */}
                      <button
                        onClick={() => openModal('detail', item)}
                        className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                      >
                        <Info size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        data={selectedData}
        refreshData={fetchData}
        setModalType={setModalType} // Tambahkan ini
      />
    </div>
  );
};

export default App;