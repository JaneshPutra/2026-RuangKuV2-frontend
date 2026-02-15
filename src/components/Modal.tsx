import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2, User, Calendar, MapPin, Trash2, Edit3, Clock } from 'lucide-react';

// Interface lokal agar aman dari error import path
export interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPinjam: string;
  tanggalSelesai: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'add' | 'edit' | 'detail';
  data: Peminjaman | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type, data }) => {
  const [selectedRoom, setSelectedRoom] = useState('');

  // Sinkronisasi pilihan ruangan jika dalam mode edit
  useEffect(() => {
    if (data && (type === 'edit' || type === 'detail')) {
      setSelectedRoom(data.ruangan);
    } else {
      setSelectedRoom('');
    }
  }, [data, type]);

  const rooms = [
    { id: 'l1', name: 'Lab Komputer 1' },
    { id: 'au', name: 'Aula Utama' },
    { id: 'r2', name: 'Ruang Rapat 2' },
    { id: 'lb', name: 'Lab Bahasa' },
    { id: 'st', name: 'Studio Audio' },
    { id: 'lb2', name: 'Lab Komputer 2' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      {/* Overlay Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Container Modal */}
      <div className="relative bg-[#1e1e1e] border border-[#333] w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* HEADER */}
        <div className="px-10 py-6 border-b border-[#333] flex justify-between items-center bg-[#252525]">
          <div>
            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em]">
              {type === 'detail' ? 'Reservation Detail' : type === 'edit' ? 'Update Booking' : 'New Booking'}
            </h3>
          </div>
          <button onClick={onClose} className="bg-[#121212] p-2.5 text-[#666] hover:text-white rounded-xl border border-[#333] transition-all">
            <X size={20}/>
          </button>
        </div>

        <div className="p-10">
          {type === 'detail' ? (
            /* ==========================================
               TAMPILAN DETAIL PEMINJAMAN
               ========================================== */
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center pb-4">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-4 border border-indigo-500/20">
                  <User size={40} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">{data?.namaPeminjam}</h2>
                <p className="text-[10px] font-bold text-[#555] mt-1 tracking-widest uppercase italic">Booking Ref: #RQ-{data?.id}2026</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] p-5 rounded-3xl border border-[#333] flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[9px] font-black text-[#555] uppercase tracking-wider">Ruangan</p>
                    <p className="font-bold text-white">{data?.ruangan}</p>
                  </div>
                </div>
                <div className="bg-[#121212] p-5 rounded-3xl border border-[#333] flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500"><Clock size={20}/></div>
                  <div>
                    <p className="text-[9px] font-black text-[#555] uppercase tracking-wider">Status</p>
                    <p className="font-bold text-white">{data?.status}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-[2rem] flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Calendar size={80}/></div>
                <div className="text-center flex-1">
                  <p className="text-[9px] font-black text-indigo-400/60 uppercase mb-2 tracking-widest">Waktu Mulai</p>
                  <p className="font-black text-white text-lg">{data?.tanggalPinjam}</p>
                </div>
                <div className="h-10 w-[2px] bg-indigo-500/20 rounded-full"></div>
                <div className="text-center flex-1">
                  <p className="text-[9px] font-black text-indigo-400/60 uppercase mb-2 tracking-widest">Waktu Selesai</p>
                  <p className="font-black text-white text-lg">{data?.tanggalSelesai}</p>
                </div>
              </div>

              {/* ACTION BUTTONS DALAM DETAIL */}
              <div className="flex gap-3 pt-6">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#252525] hover:bg-indigo-600 hover:text-white text-[#999] font-bold py-4 rounded-2xl transition-all border border-[#333] group">
                  <Edit3 size={18} className="text-indigo-500 group-hover:text-white transition-colors"/> Edit Reservation
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white font-bold py-4 rounded-2xl transition-all border border-rose-500/10">
                  <Trash2 size={18}/> Cancel Booking
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================
               FORM ADD / EDIT DATA
               ========================================== */
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Sisi Kiri: Data Peminjam */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-3 ml-1">Peminjam</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#121212] border border-[#333] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all" 
                      defaultValue={data?.namaPeminjam || ""} 
                      placeholder="Input nama lengkap..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-[#555] uppercase tracking-[0.3em] mb-3 ml-1">Tgl Mulai</label>
                      <input type="date" className="w-full bg-[#121212] border border-[#333] rounded-2xl px-5 py-4 text-xs text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#555] uppercase tracking-[0.3em] mb-3 ml-1">Tgl Selesai</label>
                      <input type="date" className="w-full bg-[#121212] border border-[#333] rounded-2xl px-5 py-4 text-xs text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" />
                    </div>
                  </div>
                </div>

                {/* Sisi Kanan: Ruangan Cards */}
                <div>
                  <label className="block text-[10px] font-black text-[#555] uppercase tracking-[0.3em] mb-3 ml-1">Pilih Ruangan</label>
                  <div className="grid grid-cols-2 gap-2">
                    {rooms.map((room) => (
                      <div 
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                          selectedRoom === room.id || data?.ruangan === room.name
                          ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                          : 'border-[#333] bg-[#121212] text-[#555] hover:border-[#444]'
                        }`}
                      >
                        <span className="text-[10px] font-bold truncate uppercase tracking-tighter">{room.name}</span>
                        {selectedRoom === room.id && <CheckCircle2 className="text-indigo-500 shrink-0" size={14} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg">
                  <Save size={20} />
                  {type === 'add' ? 'CONFIRM BOOKING' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;