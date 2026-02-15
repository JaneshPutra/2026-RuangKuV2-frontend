import React, { useState } from 'react';
import { User, LayoutGrid, Plus, Check, X as CloseI, Info, DoorOpen, Users } from 'lucide-react';
import Modal from './components/Modal';

export interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPinjam: string;
  tanggalSelesai: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail'>('add');
  const [selectedData, setSelectedData] = useState<Peminjaman | null>(null);

  const statsRooms = [
    { name: "Lab Komputer 1", cap: 30, status: "Available", color: "text-emerald-500" },
    { name: "Aula Utama", cap: 200, status: "Maintenance", color: "text-amber-500" },
    { name: "Ruang Rapat 2", cap: 12, status: "Available", color: "text-emerald-500" },
    { name: "Ruang Rapat 2", cap: 12, status: "Available", color: "text-emerald-500" },
    { name: "Ruang Rapat 2", cap: 12, status: "Available", color: "text-emerald-500" },
  ];

  const dataPeminjaman: Peminjaman[] = [
    { id: 1, namaPeminjam: "Janesh Admin", ruangan: "Lab Komputer 1", tanggalPinjam: "16 Feb 2026", tanggalSelesai: "18 Feb 2026", status: "Menunggu" },
  ];

  const openModal = (type: 'add' | 'edit' | 'detail', data?: Peminjaman) => {
    setModalType(type);
    setSelectedData(data || null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e3e3e3] font-sans">
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-40">
        <div className="bg-[#1e1e1e]/90 backdrop-blur-xl border border-[#333] px-6 py-3 rounded-2xl flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl"><LayoutGrid size={20} className="text-white" /></div>
            <span className="text-xl font-bold text-white">RuangKu</span>
          </div>
          <div className="flex items-center gap-4 border-l border-[#333] pl-4">
             <div className="text-right"><p className="text-sm font-bold text-white leading-none">Janesh</p></div>
             <div className="w-10 h-10 bg-[#2d2d2d] rounded-full flex items-center justify-center text-indigo-400 border border-[#444]"><User size={20} /></div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-white italic tracking-tighter">DASHBOARD</h1>
          <button onClick={() => openModal('add')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            + New Booking
          </button>
        </div>

        {/* --- ROOM STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {statsRooms.map((room, idx) => (
            <div key={idx} className="bg-[#1e1e1e] border border-[#333] p-5 rounded-3xl flex items-center gap-4 hover:border-indigo-500/50 transition-all cursor-default">
              <div className={`p-3 rounded-2xl ${room.bg} ${room.color}`}>
                <DoorOpen size={20}/>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{room.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[#666] font-medium">{room.cap} Seats</p>
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${room.color}`}>
                    ● {room.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- TABLE --- */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-[2.5rem] shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#252525] text-[#666] text-[10px] uppercase tracking-[0.2em] border-b border-[#333]">
              <tr>
                <th className="px-10 py-6">Peminjam</th>
                <th className="px-10 py-6">Ruangan</th>
                <th className="px-10 py-6">Periode</th>
                <th className="px-10 py-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {dataPeminjaman.map((item) => (
                <tr key={item.id} className="hover:bg-[#252525]/50 transition-colors">
                  <td className="px-10 py-7 font-bold text-white text-lg">{item.namaPeminjam}</td>
                  <td className="px-10 py-7"><span className="bg-[#2d2d2d] px-4 py-1.5 rounded-full text-indigo-400 text-sm font-semibold border border-[#444]">{item.ruangan}</span></td>
                  <td className="px-10 py-7">
                    <div className="flex flex-col"><span className="text-base text-[#eee] font-bold">{item.tanggalPinjam}</span><span className="text-xs text-[#777] italic">s/d {item.tanggalSelesai}</span></div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex justify-center gap-3">
                      <button className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 transition-all"><Check size={18}/></button>
                      <button onClick={() => openModal('edit', item)} className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 transition-all"><Plus size={18} className="rotate-45"/></button>
                      <button onClick={() => openModal('detail', item)} className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"><Info size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={modalType} data={selectedData} />
    </div>
  );
};

export default App;