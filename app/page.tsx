"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function SyncnindoARC() {
  const [isAdminSet, setIsAdminSet] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pass, setPass] = useState("");
  const [storedPass, setStoredPass] = useState("");
  
  const [formData, setFormData] = useState({ name: '', phone: '', hours: 0 });
  const [image, setImage] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem("arc_admin_pass");
    if (p) { setIsAdminSet(true); setStoredPass(p); }
    
    // Set Canvas Size on Load & Resize
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const parentWidth = canvas.parentElement?.clientWidth || 360;
      canvas.width = parentWidth; // Dynamic Width
      canvas.height = 180; // Optimized Height
      ctx.strokeStyle = '#2563EB'; // Blue Line
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (pass === storedPass) setIsLoggedIn(true);
    else alert("Password Salah!");
  };

  const handleSetAdmin = () => {
    if (pass.length < 4) return alert("Min 4 Karakter!");
    localStorage.setItem("arc_admin_pass", pass);
    setIsAdminSet(true); setStoredPass(pass); setIsLoggedIn(true);
  };

  // FUNGSI DOWNLOAD FOTO KE HP ADMIN (LOKAL & RINGAN)
  const downloadPhotoToAdminDevice = (file: File, renterName: string) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARC_KTP_${renterName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveAll = async () => {
    if (!formData.name || !image) return alert("Nama & Foto wajib ada!");

    // 1. Download Foto ke HP Admin (Lokal)
    downloadPhotoToAdminDevice(image, formData.name);

    // 2. Data Teks & Tanda Tangan ke Firebase
    const signatureData = canvasRef.current?.toDataURL();
    const finalData = {
      ...formData,
      signature: signatureData,
      timestamp: new Date().toISOString(),
      version: "v1.0.1-PRO"
    };

    console.log("Kirim ke Firebase:", finalData);
    
    alert("BERHASIL!\n1. Foto KTP terunduh ke HP Admin\n2. Data sewa siap dikirim ke Firebase");
  };

  // --- LOGIC CANVAS TANDA TANGAN (RESPONSIVE) ---
  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    return { x, y };
  };

  const startDrawing = (e: any) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="bg-slate-900 p-8 rounded-2xl border border-blue-950 w-full max-w-sm shadow-2xl">
          <h2 className="text-2xl font-black mb-2 text-center tracking-tighter">SYNC<span className="text-blue-500">NINDO</span> ARC</h2>
          <p className="text-[10px] text-slate-600 mb-6 text-center italic tracking-wider">Local-Client Processing v1.0.1-PRO</p>
          <input type="password" placeholder="Pass Admin" className="w-full p-4 bg-slate-800 rounded-lg mb-4 border border-slate-700 outline-none" onChange={e => setPass(e.target.value)} />
          <button onClick={isAdminSet ? handleLogin : handleSetAdmin} className="w-full bg-blue-600 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-blue-500 transition">Enter System</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-3 font-sans antialiased">
      <div className="max-w-sm mx-auto space-y-4">
        {/* HEADER COMPACT */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h1 className="text-xl font-extrabold tracking-tighter">ARC <span className="text-blue-500">SYSTEM</span></h1>
          <span className="text-[9px] bg-slate-800 text-blue-400 px-2 py-1 rounded-full uppercase tracking-widest font-bold">OFFLINE PHOTO MODE</span>
        </div>

        {/* INPUT DATA */}
        <div className="space-y-3">
          <input type="text" placeholder="Nama Lengkap Penyewa" className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 focus:border-blue-600 outline-none text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="number" placeholder="Lama Sewa (Jam)" className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 focus:border-blue-600 outline-none text-sm" onChange={e => setFormData({...formData, hours: parseInt(e.target.value)})} />
          
          {/* UPLOAD PHOTO MODE CAMERA */}
          <div className="p-4 bg-slate-900 rounded-xl border border-dashed border-slate-700">
            <label className="block text-[11px] font-extrabold mb-3 text-blue-400 tracking-wider">AMBIL FOTO KTP (OTOMATIS DOWNLOAD)</label>
            <input type="file" accept="image/*" capture="environment" className="text-xs text-slate-500 file:bg-blue-600 file:border-0 file:rounded-full file:text-white file:px-4 file:py-1 file:text-xs file:font-bold" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} />
          </div>

          {/* CANVAS TANDA TANGAN RESPONSIVE */}
          <div className="bg-white rounded-xl overflow-hidden border border-slate-800">
            <p className="text-[10px] text-slate-500 px-3 py-1.5 bg-slate-100 font-medium">Area Tanda Tangan Penyewa:</p>
            <div className="w-full h-[180px] bg-white">
              <canvas ref={canvasRef} className="touch-none w-full h-full cursor-crosshair" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)} />
            </div>
            <button onClick={() => {
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext('2d');
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }} className="text-[10px] text-slate-400 p-2 underline active:text-blue-500">Hapus Tanda Tangan</button>
          </div>

          <button onClick={handleSaveAll} className="w-full bg-blue-600 py-5 rounded-2xl font-extrabold text-white shadow-xl active:scale-95 transition-all uppercase tracking-tight text-base shadow-blue-900/40">
            Simpan Data & Download Foto
          </button>
        </div>
      </div>
    </main>
  );
}
