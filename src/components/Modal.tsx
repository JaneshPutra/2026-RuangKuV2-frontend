import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Trash2, CheckCircle2, Edit3, DoorOpen, Calendar, Clock, Info } from 'lucide-react';
import axios from 'axios';

const Modal = ({ isOpen, onClose, type, data, refreshData, setModalType, roomsData, allPeminjamanData }: any) => {
  const [form, setForm] = useState({ 
    id: 0, 
    namaPeminjam: '', 
    ruangan: '', 
    tanggalPinjam: '', 
    tanggalKembali: '', 
    status: 'Menunggu' 
  });

  const [formRoom, setFormRoom] = useState({
    id: 0,
    namaRuangan: '',
    kapasitas: 0,
    lokasi: '',
    status: 'Available'
  });

  const formatDateTimeLocal = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen && data) {
      if (type === 'detail_room' || type === 'edit_room') {
        setFormRoom({
          id: data.id || 0,
          namaRuangan: data.namaRuangan || '',
          kapasitas: data.kapasitas || 0,
          lokasi: data.lokasi || '',
          status: data.status || 'Available'
        });
      } else {
        setForm({ 
          id: data.id || 0,
          namaPeminjam: data.namaPeminjam || '',
          ruangan: data.ruangan || '',
          tanggalPinjam: formatDateTimeLocal(data.tanggalPinjam),
          tanggalKembali: formatDateTimeLocal(data.tanggalKembali),
          status: data.status || 'Menunggu'
        });
      }
    } else if (isOpen && type === 'add') {
      setForm({ id: 0, namaPeminjam: '', ruangan: '', tanggalPinjam: '', tanggalKembali: '', status: 'Menunggu' });
    }
  }, [data, isOpen, type]);

  const handleSubmitPeminjaman = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:5205/api/Peminjaman';
      if (type === 'add') await axios.post(url, form);
      else await axios.put(`${url}/${form.id}`, form);
      refreshData();
      onClose();
    } catch (err: any) { 
      alert(err.response?.data?.message || "Gagal simpan peminjaman."); 
    }
  };

  const listBookingRuangan = allPeminjamanData?.filter(
    (b: any) => b.ruangan === formRoom.namaRuangan && b.status === 'Disetujui'
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative bg-[#1e1e1e] border border-[#333] w-full ${type === 'add' || type === 'edit' ? 'max-w-4xl' : 'max-w-xl'} rounded-xl overflow-hidden shadow-2xl`}>
        
        {/* HEADER */}
        <div className="px-8 py-5 border-b border-[#333] flex justify-between items-center bg-[#252525]">
          <p className="text-white font-bold text-lg uppercase italic tracking-tight">
            {type.includes('room') ? 'Master Data Ruangan' : 'Booking Management'}
          </p>
          <button onClick={onClose} className="p-2 text-[#666] hover:text-white transition-all"><X size={20}/></button>
        </div>

        <div className="p-8">
          {type === 'detail_room' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#121212] p-6 rounded-xl border border-[#333]">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-indigo-600 rounded-xl text-white"><DoorOpen size={24}/></div>
                   <div>
                      <h2 className="text-2xl font-black text-white italic uppercase leading-none">{formRoom.namaRuangan}</h2>
                      <p className="text-indigo-500 font-bold uppercase tracking-widest text-[10px] mt-1.5">{formRoom.lokasi}</p>
                   </div>
                </div>
                <button onClick={() => setModalType('edit_room')} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-all flex items-center gap-2 border border-white/10">
                  <Edit3 size={12} /> Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] p-5 rounded-xl border border-[#333]">
                   <p className="text-[10px] font-black text-[#555] uppercase mb-1">Capacity</p>
                   <p className="text-xl font-black text-white italic">{formRoom.kapasitas} Kursi</p>
                </div>
                <div className="bg-[#121212] p-5 rounded-xl border border-[#333]">
                   <p className="text-[10px] font-black text-[#555] uppercase mb-1">Status</p>
                   <p className={`text-xl font-black italic ${formRoom.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`}>{formRoom.status}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#555] uppercase tracking-widest px-1">Room Schedule</h4>
                <div className="max-h-[180px] overflow-y-auto space-y-2 pr-2">
                  {listBookingRuangan.length > 0 ? listBookingRuangan.map((b: any) => (
                    <div key={b.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold italic uppercase text-xs">{b.namaPeminjam}</p>
                        <p className="text-[10px] text-[#555] font-bold mt-1 uppercase">
                          {new Date(b.tanggalPinjam).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    </div>
                  )) : (
                    <div className="py-8 text-center border border-dashed border-[#333] rounded-xl text-[10px] font-black text-[#333] uppercase">No active bookings</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {type === 'edit_room' && (
            <div className="space-y-6">
               <div className="bg-[#121212] p-6 rounded-xl border border-[#333] mb-6">
                  <h2 className="text-xl font-black text-white italic uppercase">Edit {formRoom.namaRuangan}</h2>
               </div>
               <div>
                  <label className="text-xs font-bold text-[#555] uppercase tracking-widest ml-1 mb-2 block">Update Capacity</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#121212] border border-[#333] rounded-xl p-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                    value={formRoom.kapasitas}
                    onChange={e => setFormRoom({...formRoom, kapasitas: parseInt(e.target.value)})}
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-[#555] uppercase tracking-widest ml-1 mb-2 block">Room Availability</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Available', 'Maintenance'].map(s => (
                      <button 
                        key={s}
                        onClick={() => setFormRoom({...formRoom, status: s as any})}
                        className={`py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${formRoom.status === s ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-[#333] bg-[#121212] text-[#555]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
               </div>
               <button onClick={() => {
                  axios.put(`http://localhost:5205/api/Ruangan/${formRoom.id}`, formRoom)
                  .then(() => { window.location.reload(); })
                  .catch(() => alert("Gagal update."));
               }} className="w-full bg-indigo-600 text-white py-5 rounded-xl font-black text-xs uppercase italic tracking-[0.2em] hover:bg-indigo-500 transition-all">
                  <Save size={18} className="inline mr-2"/> Update Room Data
               </button>
            </div>
          )}

          {(type === 'add' || type === 'edit') && (
            <form onSubmit={handleSubmitPeminjaman} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-indigo-500 uppercase mb-2 block">Nama Peminjam</label>
                    <input required className="w-full bg-[#121212] border border-[#333] rounded-xl p-4 text-white outline-none focus:border-indigo-500" value={form.namaPeminjam} onChange={e => setForm({...form, namaPeminjam: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#555] uppercase mb-2 block">Waktu Mulai</label>
                    <input required type="datetime-local" className="w-full bg-[#121212] border border-[#333] rounded-xl p-3 text-white [color-scheme:dark]" value={form.tanggalPinjam} onChange={e => setForm({...form, tanggalPinjam: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#555] uppercase mb-2 block">Waktu Selesai</label>
                    <input required type="datetime-local" className="w-full bg-[#121212] border border-[#333] rounded-xl p-3 text-white [color-scheme:dark]" value={form.tanggalKembali} onChange={e => setForm({...form, tanggalKembali: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-500 uppercase mb-3 block">Pilih Ruangan</label>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {roomsData?.map((r: any) => {
                      const isMaintenance = r.status === 'Maintenance';
                      return (
                        <div 
                          key={r.id} 
                          onClick={() => !isMaintenance && setForm({...form, ruangan: r.namaRuangan})} 
                          className={`px-4 py-2.5 rounded-xl border transition-all flex justify-between items-center ${
                            isMaintenance 
                              ? 'opacity-40 cursor-not-allowed bg-[#0d0d0d] border-[#222]' 
                              : form.ruangan === r.namaRuangan 
                                ? 'border-indigo-500 bg-indigo-500/10 text-white cursor-pointer' 
                                : 'border-[#333] bg-[#121212] text-[#555] hover:border-[#444] cursor-pointer'
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase">{r.namaRuangan}</span>
                              {isMaintenance && (
                                <span className="text-[8px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase font-black">
                                  Maintenance
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#444] font-bold">{r.lokasi}</span>
                          </div>
                          {form.ruangan === r.namaRuangan && !isMaintenance && (
                            <CheckCircle2 size={16} className="text-indigo-500" />
                          )}
                          {isMaintenance && <X size={14} className="text-rose-500/50" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#333] flex justify-end">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Save size={18}/> Save Booking
                </button>
              </div>
            </form>
          )}

          {type === 'detail' && (
            <div className="space-y-6">
              <div className="bg-[#121212] p-6 rounded-xl border border-[#333] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-xl text-white"><User size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-[#555] uppercase">Peminjam</p>
                    <p className="text-lg font-bold text-white italic leading-none">{form.namaPeminjam}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-500"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-[#555] uppercase">Ruangan</p>
                    <p className="text-sm font-bold text-white uppercase leading-none">{form.ruangan}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#121212] p-6 rounded-xl border border-[#333] space-y-4">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Jadwal Penggunaan</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] text-[#444] font-bold uppercase">Mulai</p>
                    <p className="text-xs text-white font-bold">{new Date(form.tanggalPinjam).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#444] font-bold uppercase">Selesai</p>
                    <p className="text-xs text-white font-bold">{new Date(form.tanggalKembali).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setModalType('edit')} className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase text-xs transition-all"><Edit3 size={14}/> Edit</button>
                <button onClick={() => {
                   if(window.confirm("Hapus?")) axios.delete(`http://localhost:5205/api/Peminjaman/${form.id}`).then(() => { refreshData(); onClose(); });
                }} className="flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 py-4 rounded-xl font-bold uppercase text-xs border border-rose-500/20 transition-all"><Trash2 size={14}/> Hapus</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Modal;