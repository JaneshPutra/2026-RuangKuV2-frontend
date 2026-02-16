import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Trash2, CheckCircle2, Edit3, Users, DoorOpen } from 'lucide-react';
import axios from 'axios';

const Modal = ({ isOpen, onClose, type, data, refreshData, setModalType, roomsData, allPeminjamanData }: any) => {
  // State untuk Form Peminjaman
  const [form, setForm] = useState({ 
    id: 0, 
    namaPeminjam: '', 
    ruangan: '', 
    tanggalPinjam: '', 
    tanggalKembali: '', 
    status: 'Menunggu' 
  });

  // State untuk Form Ruangan (Master Data)
  const [formRoom, setFormRoom] = useState({
    id: 0,
    namaRuangan: '',
    kapasitas: 0,
    lokasi: '',
    status: 'Available'
  });

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  useEffect(() => {
    if (isOpen && data) {
      if (type === 'detail_room' || type === 'edit_room') {
        // Jika yang dibuka adalah modal terkait Ruangan
        setFormRoom({
          id: data.id || 0,
          namaRuangan: data.namaRuangan || '',
          kapasitas: data.kapasitas || 0,
          lokasi: data.lokasi || '',
          status: data.status || 'Available'
        });
      } else {
        // Jika yang dibuka adalah modal terkait Peminjaman
        setForm({ 
          id: data.id || 0,
          namaPeminjam: data.namaPeminjam || '',
          ruangan: data.ruangan || '',
          tanggalPinjam: formatDateForInput(data.tanggalPinjam),
          tanggalKembali: formatDateForInput(data.tanggalKembali),
          status: data.status || 'Menunggu'
        });
      }
    } else if (isOpen && type === 'add') {
      setForm({ id: 0, namaPeminjam: '', ruangan: '', tanggalPinjam: '', tanggalKembali: '', status: 'Menunggu' });
    }
  }, [data, isOpen, type]);

  // HANDLE SIMPAN PEMINJAMAN
  const handleSubmitPeminjaman = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:5205/api/Peminjaman';
      if (type === 'add') await axios.post(url, form);
      else await axios.put(`${url}/${form.id}`, form);
      refreshData();
      onClose();
    } catch (err) { alert("Gagal simpan peminjaman."); }
  };

  // HANDLE SIMPAN RUANGAN (MASTER DATA)
  const handleSaveRoom = async () => {
    try {
      await axios.put(`http://localhost:5205/api/Ruangan/${formRoom.id}`, formRoom);
      refreshData(); // Ini akan memicu fetchRuangan di App.tsx jika fungsinya digabung
      window.location.reload(); // Force reload agar data ruangan terbaru muncul
      onClose();
    } catch (err) { alert("Gagal update data ruangan."); }
  };

  const handleDeletePeminjaman = async () => {
    if (window.confirm(`Hapus data peminjaman ${form.namaPeminjam}?`)) {
      try {
        await axios.delete(`http://localhost:5205/api/Peminjaman/${form.id}`);
        refreshData();
        onClose();
      } catch (err) { alert("Gagal menghapus data."); }
    }
  };

  // Filter list booking yang ada di ruangan ini (Hanya yang disetujui)
  const listBookingRuangan = allPeminjamanData?.filter(
    (b: any) => b.ruangan === formRoom.namaRuangan && b.status === 'Disetujui'
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#1e1e1e] border border-[#333] w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="px-10 py-6 border-b border-[#333] flex justify-between items-center bg-[#252525]">
          <div>
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">System Manager</h3>
            <p className="text-white font-bold text-lg mt-0.5 tracking-tight uppercase italic">
                {type.includes('room') ? 'Master Data Ruangan' : 'Peminjaman Manager'}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-[#121212] text-[#666] hover:text-white rounded-2xl border border-[#333] transition-all"><X size={20}/></button>
        </div>

        <div className="p-10">
          
          {/* 1. DETAIL RUANGAN (Menampilkan info & list booking) */}
          {type === 'detail_room' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                   <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-600/20"><DoorOpen size={32}/></div>
                   <div>
                      <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{formRoom.namaRuangan}</h2>
                      <p className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">{formRoom.lokasi}</p>
                   </div>
                </div>
                <button onClick={() => setModalType('edit_room')} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center gap-2 border border-white/10">
                  <Edit3 size={14} /> Edit Room
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] p-6 rounded-3xl border border-[#333]">
                   <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1">Max Capacity</p>
                   <p className="text-2xl font-black text-white italic">{formRoom.kapasitas} <span className="text-xs text-[#555] not-italic">Seats</span></p>
                </div>
                <div className="bg-[#121212] p-6 rounded-3xl border border-[#333]">
                   <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1">Current Status</p>
                   <p className={`text-2xl font-black italic ${formRoom.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`}>{formRoom.status}</p>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] mb-4">Upcoming Schedule</h4>
                <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {listBookingRuangan.length > 0 ? listBookingRuangan.map((b: any) => (
                    <div key={b.id} className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold italic uppercase text-sm">{b.namaPeminjam}</p>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1 tracking-tighter">{b.tanggalPinjam} — {b.tanggalKembali}</p>
                      </div>
                      <div className="bg-emerald-500/20 px-3 py-1 rounded-full"><p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Reserved</p></div>
                    </div>
                  )) : (
                    <div className="py-10 text-center border-2 border-dashed border-[#252525] rounded-3xl">
                      <p className="text-[10px] font-black text-[#444] uppercase tracking-widest">No active bookings found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. EDIT RUANGAN (Hanya Kapasitas & Status) */}
          {type === 'edit_room' && (
            <div className="space-y-8">
               <div className="bg-indigo-600/5 p-6 rounded-3xl border border-indigo-500/10">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Editing Master Data</p>
                  <p className="text-white font-bold text-xl italic uppercase tracking-tighter">{formRoom.namaRuangan}</p>
               </div>
               
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-[#555] uppercase tracking-widest ml-1 mb-3 block">Update Capacity</label>
                    <div className="relative">
                      <Users size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#444]"/>
                      <input 
                        type="number" 
                        className="w-full bg-[#121212] border border-[#333] rounded-2xl p-5 pl-14 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                        value={formRoom.kapasitas}
                        onChange={e => setFormRoom({...formRoom, kapasitas: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-[#555] uppercase tracking-widest ml-1 mb-3 block">Update Status</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Available', 'Maintenance'].map(s => (
                        <button 
                          key={s}
                          onClick={() => setFormRoom({...formRoom, status: s as any})}
                          className={`py-5 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${formRoom.status === s ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-600/10' : 'border-[#333] bg-[#121212] text-[#555]'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

               <button onClick={handleSaveRoom} className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-xs shadow-xl transition-all uppercase italic tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-500 hover:text-white">
                  <Save size={20}/> Update Data
               </button>
            </div>
          )}

          {/* 3. CRUD PEMINJAMAN (Lama - Tetap Dipertahankan) */}
          {(type === 'add' || type === 'edit' || type === 'detail') && (
             <>
                {type === 'detail' ? (
                   <div className="space-y-8">
                      {/* ... (Konten Detail Peminjaman Lama) ... */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#121212] p-6 rounded-3xl border border-[#333] flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white"><User size={24}/></div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">Peminjam</p>
                                <p className="text-lg font-bold text-white tracking-tight truncate">{form.namaPeminjam}</p>
                            </div>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-3xl border border-[#333] flex items-center gap-4">
                            <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-500"><MapPin size={24}/></div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">Ruangan</p>
                                <p className="text-lg font-bold text-white tracking-tight truncate">{form.ruangan}</p>
                            </div>
                        </div>
                      </div>

                      <div className="bg-indigo-600/5 p-8 rounded-[2rem] border border-indigo-500/10 flex justify-around items-center">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-indigo-400/50 uppercase mb-2 tracking-widest">Waktu Mulai</p>
                            <p className="text-xl font-black text-white italic">{form.tanggalPinjam}</p>
                        </div>
                        <div className="h-12 w-px bg-indigo-500/20"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-indigo-400/50 uppercase mb-2 tracking-widest">Waktu Kembali</p>
                            <p className="text-xl font-black text-white italic">{form.tanggalKembali}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button onClick={() => setModalType('edit')} className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xs transition-all tracking-[0.2em] uppercase"><Edit3 size={18}/> Edit Data</button>
                        <button onClick={handleDeletePeminjaman} className="flex items-center justify-center gap-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-5 rounded-2xl font-black text-xs transition-all border border-rose-500/20 tracking-[0.2em] uppercase"><Trash2 size={18}/> Hapus Data</button>
                      </div>
                   </div>
                ) : (
                   <form onSubmit={handleSubmitPeminjaman} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-8">
                            <div>
                               <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1 mb-3 block">Nama Peminjam</label>
                               <input required readOnly={type === 'edit'} className={`w-full border border-[#333] rounded-2xl p-4 font-bold outline-none transition-all ${type === 'edit' ? 'bg-[#252525] text-[#666] cursor-not-allowed' : 'bg-[#121212] text-white focus:border-indigo-500'}`} value={form.namaPeminjam} onChange={e => setForm({...form, namaPeminjam: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[10px] font-black text-[#555] uppercase ml-1 mb-3 block">Tgl Mulai</label>
                                  <input required type="date" className="w-full bg-[#121212] border border-[#333] rounded-2xl p-4 text-xs text-white [color-scheme:dark] outline-none" value={form.tanggalPinjam} onChange={e => setForm({...form, tanggalPinjam: e.target.value})} />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-[#555] uppercase ml-1 mb-3 block">Tgl Kembali</label>
                                  <input required type="date" className="w-full bg-[#121212] border border-[#333] rounded-2xl p-4 text-xs text-white [color-scheme:dark] outline-none" value={form.tanggalKembali} onChange={e => setForm({...form, tanggalKembali: e.target.value})} />
                               </div>
                            </div>
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-[#555] uppercase tracking-widest ml-1 mb-4 block">Pilih Ruangan</label>
                            <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                               {roomsData?.map((r: any) => (
                                 <div key={r.id} onClick={() => setForm({...form, ruangan: r.namaRuangan})} 
                                   className={`px-4 py-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${form.ruangan === r.namaRuangan ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-600/10' : 'border-[#333] bg-[#121212] text-[#555] hover:border-[#444]'}`}>
                                   <span className="text-[10px] font-black uppercase truncate tracking-tighter">{r.namaRuangan}</span>
                                   {form.ruangan === r.namaRuangan && <CheckCircle2 className="text-indigo-500" size={16} />}
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-[2rem] font-black text-white text-sm shadow-xl shadow-indigo-600/20 transition-all uppercase italic tracking-[0.3em] flex items-center justify-center gap-4">
                         <Save size={20}/> {type === 'add' ? 'Tambah Pinjaman' : 'Simpan Perubahan'}
                      </button>
                   </form>
                )}
             </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;