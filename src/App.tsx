import React, { useState, useEffect } from 'react';
import { User, LayoutGrid, Check, Info, Calendar, Users, Search, X as CloseIcon } from 'lucide-react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5205/api/Peminjaman`, {
        params: { search: searchTerm, status: filterStatus }
      });
      setDataPeminjaman(response.data);
    } catch (error) { console.error("Gagal ambil data", error); }
  };

  const fetchRuangan = async () => {
    try {
      const response = await axios.get(`http://localhost:5205/api/Ruangan`);
      setDataRuangan(response.data);
    } catch (error) { console.error("Gagal ambil data ruangan", error); }
  };

  useEffect(() => { fetchData(); }, [searchTerm, filterStatus]);
  useEffect(() => { fetchRuangan(); }, []);

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
        <div className="bg-[#1e1e1e]/90 backdrop-blur-xl border border-[#333] px-10 py-4 rounded-full flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase italic">RuangKu</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right pr-4 border-r border-[#333]">
              <p className="text-sm font-bold text-white uppercase leading-none">Janesh</p>
              <p className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-[#252525] border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-500 font-bold shadow-inner">
              J
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Dashboard</h1>
          <button onClick={() => openModal('add')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-xs uppercase tracking-widest">
            + New Booking
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {dataRuangan.map((room) => (
            <div key={room.id} onClick={() => openModal('detail_room', room)} className="bg-[#1e1e1e] border border-[#333] p-5 rounded-xl flex items-center justify-between group hover:border-indigo-500/50 transition-all cursor-pointer active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className={`w-1.5 h-10 rounded-full ${room.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`} />
                <div>
                  <h3 className="text-base font-black text-white tracking-tighter uppercase italic leading-none">{room.namaRuangan}</h3>
                  <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mt-1.5">{room.lokasi} • {room.kapasitas} Pax</p>
                </div>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-md bg-[#121212] border ${room.status === 'Available' ? 'border-emerald-500/20 text-emerald-500' : 'border-amber-500/20 text-amber-500'} uppercase tracking-widest`}>{room.status}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or room..."
              className="w-full bg-[#1e1e1e]/50 border border-[#333] rounded-xl px-14 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-[#1e1e1e]/50 border border-[#333] p-1.5 rounded-xl gap-1">
            {['All', 'Menunggu', 'Disetujui', 'Ditolak'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-[#555] hover:text-[#888]'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#252525] text-[#555] text-[9px] uppercase font-black tracking-widest border-b border-[#333]">
              <tr>
                <th className="px-8 py-5">Peminjam</th>
                <th className="px-8 py-5">Ruangan</th>
                <th className="px-8 py-5 text-center">Waktu Peminjaman</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {dataPeminjaman.map((item) => (
                <tr key={item.id} className="hover:bg-[#252525]/30 transition-colors">
                  <td className="px-8 py-6 font-bold text-white text-lg tracking-tight italic">{item.namaPeminjam}</td>
                  <td className="px-8 py-6"><span className="text-indigo-400 font-black uppercase text-xs tracking-widest">{item.ruangan}</span></td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Calendar size={14} className="text-indigo-500" />
                        <span>{new Date(item.tanggalPinjam).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="text-[10px] font-black text-[#444] tracking-widest">s/d</div>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                        <span>{new Date(item.tanggalKembali).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${item.status === 'Disetujui' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : item.status === 'Ditolak' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{item.status}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      {item.status === 'Menunggu' && (
                        <>
                          <button onClick={() => handleUpdateStatus(item, 'Disetujui')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"><Check size={16} /></button>
                          <button onClick={() => handleUpdateStatus(item, 'Ditolak')} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"><CloseIcon size={16} /></button>
                        </>
                      )}
                      <button onClick={() => openModal('detail', item)} className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all"><Info size={16} /></button>
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
        setModalType={setModalType}
        roomsData={dataRuangan}
        allPeminjamanData={dataPeminjaman}
      />
    </div>
  );
};

export default App;