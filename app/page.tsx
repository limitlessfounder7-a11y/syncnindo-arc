'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [nama, setNama] = useState('');
  const [noWa, setNoWa] = useState('');
  const [waktuSeharusnya, setWaktuSeharusnya] = useState('');
  const [waktuAktual, setWaktuAktual] = useState('');
  const [bensinKeluar, setBensinKeluar] = useState(6);
  const [bensinMasuk, setBensinMasuk] = useState(6);
  const [tagihan, setTagihan] = useState<any>(null);

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const formattedTime = now.toISOString().slice(0, 16);
    setWaktuSeharusnya(formattedTime);
    setWaktuAktual(formattedTime);
  }, []);

  const hitungDenda = () => {
    const tSeharusnya = new Date(waktuSeharusnya).getTime();
    const tAktual = new Date(waktuAktual).getTime();
    let jamTelat = Math.ceil((tAktual - tSeharusnya) / (1000 * 60 * 60));
    jamTelat = jamTelat > 0 ? jamTelat : 0;
    
    let selisihBar = bensinKeluar - bensinMasuk;
    selisihBar = selisihBar > 0 ? selisihBar : 0;

    setTagihan({
      jamTelat,
      dendaWaktu: jamTelat * 25000,
      selisihBar,
      dendaBensin: selisihBar * 20000,
      total: (jamTelat * 25000) + (selisihBar * 20000)
    });
  };

  const kirimWA = () => {
    let formatWa = noWa.startsWith('0') ? '62' + noWa.substring(1) : noWa;
    const pesan = `*INVOICE SYNCNINDO*\nNama: ${nama}\nTotal: Rp ${tagihan.total.toLocaleString('id-ID')}\n\n*Peringatan:* Tindakan penggelapan/gadai unit diproses Pasal 372 KUHP & ganti rugi 100%.`;
    window.open(`https://api.whatsapp.com/send?phone=${formatWa}&text=${encodeURIComponent(pesan)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-black text-slate-800 mb-6 text-center tracking-tight">SYNCNINDO <span className="text-blue-600">ARC</span></h1>
        
        <div className="space-y-4">
          <input type="text" placeholder="Nama Penyewa" className="w-full p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={nama} onChange={e => setNama(e.target.value)} />
          <input type="number" placeholder="No WhatsApp (62...)" className="w-full p-3 bg-slate-100 rounded-xl outline-none" value={noWa} onChange={e => setNoWa(e.target.value)} />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Seharusnya</label>
              <input type="datetime-local" className="w-full p-2 bg-slate-100 rounded-lg text-sm" value={waktuSeharusnya} onChange={e => setWaktuSeharusnya(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Aktual</label>
              <input type="datetime-local" className="w-full p-2 bg-slate-100 rounded-lg text-sm" value={waktuAktual} onChange={e => setWaktuAktual(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Bar Keluar" className="w-full p-3 bg-slate-100 rounded-xl" value={bensinKeluar} onChange={e => setBensinKeluar(Number(e.target.value))} />
            <input type="number" placeholder="Bar Masuk" className="w-full p-3 bg-slate-100 rounded-xl" value={bensinMasuk} onChange={e => setBensinMasuk(Number(e.target.value))} />
          </div>

          <button onClick={hitungDenda} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            HITUNG TAGIHAN
          </button>
        </div>

        {tagihan && (
          <div className="mt-8 border-t-2 border-dashed pt-6 animate-in fade-in duration-500">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">Denda Telat ({tagihan.jamTelat}j)</span>
              <span className="font-bold">Rp {tagihan.dendaWaktu.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-slate-500">Bensin ({tagihan.selisihBar} bar)</span>
              <span className="font-bold">Rp {tagihan.dendaBensin.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl mb-4">
              <div className="text-center text-red-600 font-black text-xl">TOTAL: Rp {tagihan.total.toLocaleString('id-ID')}</div>
            </div>
            <button onClick={kirimWA} className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600">
              KIRIM KE WHATSAPP
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

