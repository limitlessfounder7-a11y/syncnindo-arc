'use client';
import { useState } from 'react';

export default function Home() {
  const [nama, setNama] = useState('');
  const [total, setTotal] = useState(0);

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-white text-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Syncnindo ARC</h1>
        <input 
          className="w-full p-3 mb-4 bg-slate-100 rounded-xl outline-none"
          placeholder="Nama Penyewa"
          onChange={(e) => setNama(e.target.value)} 
        />
        <button 
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl"
          onClick={() => setTotal(25000)}
        >
          CEK TAGIHAN
        </button>
        {total > 0 && <p className="mt-4 text-center font-bold text-red-600 text-xl">Total: Rp {total.toLocaleString()}</p>}
      </div>
    </main>
  );
}
