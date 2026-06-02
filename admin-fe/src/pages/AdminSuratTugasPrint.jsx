import React from 'react';
import { Printer, Shield, Building, User, FileText, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSuratTugasPrint = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col font-poppins relative">
      
      {/* TOP BAR (Hidden on Print) */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50 print:hidden mx-auto w-full max-w-[1000px] mt-4 rounded-xl">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center mr-4">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm">Preview Cetak — SPT</h1>
            <p className="text-xs text-gray-400">Nomor: 800/123/438.5.11/2023</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-full flex items-center border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
            Siap Cetak
          </span>
          <button 
            onClick={handlePrint}
            className="px-5 py-2 bg-[#1e293b] text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak PDF
          </button>
        </div>
      </div>

      {/* DOCUMENT AREA */}
      <div className="flex-1 overflow-y-auto py-8 print:p-0 print:overflow-visible">
        {/* A4 Paper */}
        <div className="w-full max-w-[800px] mx-auto bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200 px-14 py-16 relative min-h-[1100px] print:shadow-none print:border-none print:m-0 print:min-h-0 print:p-0">
          
          {/* KOP SURAT */}
          <div className="flex items-center justify-between border-b-[3px] border-black pb-5 mb-8">
            <div className="w-24 flex items-center justify-start">
              <img src="/logo-sidoarjo.png" alt="Logo Sidoarjo" className="w-[72px] h-[72px] object-contain" />
            </div>
            
            <div className="flex-1 text-center px-4">
              <h2 className="text-[16px] font-bold text-gray-800 tracking-widest uppercase">PEMERINTAH KABUPATEN SIDOARJO</h2>
              <h1 className="text-[20px] font-bold text-[#1e3a8a] tracking-widest my-1 uppercase">
                DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL
              </h1>
              <p className="text-[12px] text-gray-500 mt-2 font-serif leading-tight">
                Jl. Jaksa Agung Suprapto No. 5, Sidoarjo 61211<br/>
                Telp. (031) 8921234 — Fax. (031) 8921235 — Email: dukcapil@sidoarjokab.go.id
              </p>
            </div>

            <div className="w-24 flex items-center justify-end">
              <img src="/logo-disdukcapil.png" alt="Logo Disdukcapil" className="w-[80px] h-[72px] object-contain" />
            </div>
          </div>
          {/* Additional thin line under thick line for traditional Kop Surat */}
          <div className="border-b-[1px] border-black mb-10 -mt-7"></div>

          {/* SURAT TITLE */}
          <div className="text-center mb-10">
            <h3 className="font-bold text-[18px] underline underline-offset-4 tracking-widest text-gray-900">SURAT PERINTAH TUGAS</h3>
            <p className="text-[13px] text-gray-700 mt-3 font-serif">Nomor : <span className="font-bold">800/123/438.5.11/2025</span></p>
          </div>

          {/* DASAR */}
          <div className="grid grid-cols-[100px_20px_1fr] text-[14px] text-gray-800 mb-8 font-serif leading-relaxed">
            <div>Dasar</div>
            <div className="text-center">:</div>
            <div>
              <ol className="list-decimal pl-4 space-y-2 text-justify">
                <li>Peraturan Bupati Sidoarjo Nomor 23 Tahun 2023 tentang Pedoman Pelaksanaan Tugas Kedinasan di Lingkungan Pemerintah Kabupaten Sidoarjo;</li>
                <li>Program Kerja Tahunan Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo Tahun Anggaran 2025.</li>
              </ol>
            </div>
          </div>

          {/* MEMERINTAHKAN */}
          <div className="text-center font-bold text-[15px] tracking-[0.2em] text-gray-900 mb-8">
            MEMERINTAHKAN
          </div>

          {/* KEPADA */}
          <div className="grid grid-cols-[100px_20px_1fr] text-[14px] text-gray-800 mb-6 font-serif">
            <div className="font-bold">Kepada</div>
            <div className="text-center font-bold">:</div>
            <div></div>
          </div>

          <div className="grid grid-cols-[120px_20px_1fr] text-[14px] text-gray-800 mb-8 font-serif ml-4 space-y-3">
            <div className="text-gray-600">Nama</div>
            <div className="text-center">:</div>
            <div className="font-bold">Ahmad Fauzi, S.Kom.</div>

            <div className="text-gray-600">NIP</div>
            <div className="text-center">:</div>
            <div>19850101 201001 1 001</div>

            <div className="text-gray-600">Pangkat / Gol.</div>
            <div className="text-center">:</div>
            <div>Penata — III/c</div>

            <div className="text-gray-600">Jabatan</div>
            <div className="text-center">:</div>
            <div>Pranata Komputer Ahli Pertama</div>
          </div>

          {/* UNTUK */}
          <div className="grid grid-cols-[100px_20px_1fr] text-[14px] text-gray-800 mb-4 font-serif">
            <div className="font-bold">Untuk</div>
            <div className="text-center font-bold">:</div>
            <div></div>
          </div>

          <ol className="list-decimal pl-12 space-y-4 text-[14px] text-gray-800 font-serif mb-16">
            <li>Melaksanakan koordinasi teknis terkait integrasi data magang di instansi terkait.</li>
            <li>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-gray-600">Tujuan</div>
                <div className="text-center">:</div>
                <div>Kantor Kecamatan Sidoarjo</div>
              </div>
            </li>
            <li>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-gray-600">Tanggal</div>
                <div className="text-center">:</div>
                <div>13 Juni 2025 s/d 20 juni 2025</div>
              </div>
            </li>
            <li>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <div className="text-gray-600">Kendaraan</div>
                <div className="text-center">:</div>
                <div>Dinas (Mobil)</div>
              </div>
            </li>
          </ol>

          {/* PENUTUP */}
          <p className="text-[13.5px] text-gray-800 mb-16 font-serif text-justify leading-relaxed">
            Demikian Surat Perintah Tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab. Setelah selesai melaksanakan tugas, pegawai yang bersangkutan diwajibkan membuat laporan pelaksanaan tugas kepada Kepala Dinas.
          </p>

          {/* TANDA TANGAN */}
          <div className="flex justify-end text-[14px] text-gray-800 font-serif mb-20">
            <div className="w-[300px] text-center">
              <p className="mb-1">Sidoarjo, 12 Juni 2025</p>
              <p className="mb-6">
                Kepala Dinas Kependudukan dan<br/>Pencatatan Sipil Kabupaten Sidoarjo,
              </p>
              
              {/* Stamp/Signature placeholder */}
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center opacity-50 border border-gray-200">
                <User className="w-8 h-8 text-gray-300" />
              </div>
              
              <div className="border-b-2 border-gray-400 mb-1 inline-block pb-0.5">
                <p className="font-bold tracking-wide">DRS. REDI KUSUMA, M.SI.</p>
              </div>
              <p className="text-[13px] text-gray-600 mt-1">Pembina Utama Muda</p>
              <p className="text-[13px] text-gray-600">NIP. 19700101 199501 1 001</p>
            </div>
          </div>

          {/* WATERMARK/FOOTER */}
          <div className="absolute bottom-8 left-14 right-14 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-200 pt-4 print:fixed print:bottom-8 print:border-none">
            <div className="flex items-center">
              <div className="w-3.5 h-3.5 flex items-center justify-center mr-1.5 opacity-60">
                <FileText className="w-full h-full" />
              </div>
              Dicetak melalui SIPPMIT — Dinas Dukcapil Kabupaten Sidoarjo
            </div>
            <div>Halaman 1 dari 1</div>
          </div>
        </div>
      </div>

      {/* BOTTOM INSTRUCTION (Hidden on Print) */}
      <div className="bg-gray-200/50 text-center py-4 text-xs font-medium text-gray-500 print:hidden mt-auto">
        <div className="flex items-center justify-center">
          <Info className="w-4 h-4 mr-1.5 opacity-70" />
          Gunakan browser print dialog (Ctrl+P) untuk mencetak — atur kertas A4, margin Normal.
        </div>
      </div>

    </div>
  );
};

export default AdminSuratTugasPrint;
