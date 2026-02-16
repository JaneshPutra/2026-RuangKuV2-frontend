import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Trash2, CheckCircle2, Edit3 } from 'lucide-react';
import axios from 'axios';

const Modal = ({ isOpen, onClose, type, data, refreshData, setModalType }: any) => {
  const [form, setForm] = useState({ 
    id: 0, 
    namaPeminjam: '', 
    ruangan: '', 
    tanggalPinjam: '', 
    tanggalKembali: '', 
    status: 'Menunggu' 
  });
  
  const rooms = ["Lab Komp 1", "Aula Utama", "R. Rapat 2", "Studio", "Lab Bahasa", "R. Musik"];

  // Helper untuk format tanggal agar muncul di input type="date"
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  useEffect(() => {
    if (isOpen && data) {
      setForm({ 
        id: data.id || 0,
        namaPeminjam: data.namaPeminjam || '',
        ruangan: data.ruangan || '',
        tanggalPinjam: formatDateForInput(data.tanggalPinjam),
        tanggalKembali: formatDateForInput(data.tanggalKembali || data.tanggalSelesai),
        status: data.status || 'Menunggu'
      });
    } else if (isOpen && type === 'add') {
      setForm({ id: 0, namaPeminjam: '', ruangan: '', tanggalPinjam: '', tanggalKembali: '', status: 'Menunggu' });
    }
  }, [data, isOpen, type]);

  // FUNGSI HANDLE SUBMIT (EDIT & ADD)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === 'add') {
        await axios.post('http://localhost:5205/api/Peminjaman', form);
      } else {
        await axios.put(`http://localhost:5205/api/Peminjaman/${form.id}`, form);
      }
      refreshData();
      onClose();
    } catch (err) { 
      console.error(err);
      alert("Terjadi kesalahan saat simpan data."); 
    }
  };

  // FUNGSI HANDLE DELETE (YANG TADI ERROR)
  const handleDelete = async () => {
    if (window.confirm(`Hapus data peminjaman ${form.namaPeminjam}?`)) {
      try {
        await axios.delete(`http://localhost:5205/api/Peminjaman/${form.id}`);
        refreshData();
        onClose();
      } catch (err) { 
        console.error(err);
        alert("Gagal menghapus data."); 
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#1e1e1e] border border-[#333] w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        <div className="px-10 py-6 border-b border-[#333] flex justify-between items-center bg-[#252525]">
          <div>
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">{type} Mode</h3>
            <p className="text-white font-bold text-lg mt-0.5 tracking-tight uppercase italic">
                {type === 'detail' ? 'Detail Peminjaman' : type === 'edit' ? 'Edit Peminjaman' : 'Tambah Peminjaman'}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-[#121212] text-[#666] hover:text-white rounded-2xl border border-[#333] transition-all"><X size={20}/></button>
        </div>

        <div className="p-10">
          {type === 'detail' ? (
            <div className="space-y-8">
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
                        <p className="text-[10px] font-black text-[#555] uppercase tracking-widest">Lokasi</p>
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
                <button onClick={() => setModalType('edit')} className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xs transition-all tracking-[0.2em] uppercase">
                  <Edit3 size={18}/> Edit Data
                </button>
                <button onClick={handleDelete} className="flex items-center justify-center gap-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-5 rounded-2xl font-black text-xs transition-all border border-rose-500/20 tracking-[0.2em] uppercase">
                  <Trash2 size={18}/> Hapus Data
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1 mb-3 block">Nama Peminjam</label>
                    <input 
                      required 
                      readOnly={type === 'edit'} 
                      className={`w-full border border-[#333] rounded-2xl p-4 font-bold outline-none transition-all ${type === 'edit' ? 'bg-[#252525] text-[#666] cursor-not-allowed' : 'bg-[#121212] text-white focus:border-indigo-500'}`}
                      value={form.namaPeminjam} 
                      onChange={e => setForm({...form, namaPeminjam: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#555] uppercase ml-1 mb-3 block">Tgl Mulai</label>
                      <input 
                        required 
                        type="date" 
                        className="w-full bg-[#121212] border border-[#333] rounded-2xl p-4 text-xs text-white [color-scheme:dark] outline-none" 
                        value={form.tanggalPinjam} 
                        onChange={e => setForm({...form, tanggalPinjam: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#555] uppercase ml-1 mb-3 block">Tgl Kembali</label>
                      <input 
                        required 
                        type="date" 
                        className="w-full bg-[#121212] border border-[#333] rounded-2xl p-4 text-xs text-white [color-scheme:dark] outline-none" 
                        value={form.tanggalKembali} 
                        onChange={e => setForm({...form, tanggalKembali: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#555] uppercase tracking-widest ml-1 mb-4 block">Pilih Ruangan</label>
                  <div className="grid grid-cols-2 gap-3">
                    {rooms.map(r => (
                      <div key={r} onClick={() => setForm({...form, ruangan: r})} 
                        className={`px-4 py-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${form.ruangan === r ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-600/10' : 'border-[#333] bg-[#121212] text-[#555] hover:border-[#444]'}`}>
                        <span className="text-[10px] font-black uppercase truncate tracking-tighter">{r}</span>
                        {form.ruangan === r && <CheckCircle2 className="text-indigo-500" size={16} />}
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
        </div>
      </div>
    </div>
  );
};

export default Modal;