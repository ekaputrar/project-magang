import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Printer, 
  Plus, 
  FileText, 
  Maximize2, 
  Shield, 
  Building, 
  User,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const suratList = [
  {
    id: 1,
    nomor: 'SPT/045/VI/2025',
    judul: 'Pendampingan Peserta Magang',
    pj: 'Drs. Ahmad Fauzi, M.Si',
    tanggal: '12 Jun 2025',
    status: 'Aktif'
  },
  {
    id: 2,
    nomor: 'SPT/039/VI/2025',
    judul: 'Koordinasi Database Kependudukan',
    pj: 'Ir. Dewi Kusuma, M.T',
    tanggal: '05 Jun 2025',
    status: 'Selesai'
  },
  {
    id: 3,
    nomor: 'SPT/051/VI/2025',
    judul: 'Evaluasi Program Magang 2025',
    pj: 'Siti Rahayu, S.STP',
    tanggal: '18 Jun 2025',
    status: 'Draft'
  },
  {
    id: 4,
    nomor: 'SPT/033/V/2025',
    judul: 'Pelatihan Sistem e-KTP Daerah',
    pj: 'Budi Santoso, S.Kom',
    tanggal: '28 Mei 2025',
    status: 'Selesai'
  },
  {
    id: 5,
    nomor: 'SPT/029/V/2025',
    judul: 'Rapat Koordinasi Disdukcapil',
    pj: 'Novi Arisandi, S.H',
    tanggal: '20 Mei 2025',
    status: 'Dibatalkan'
  },
  {
    id: 6,
    nomor: 'SPT/052/VII/2025',
    judul: 'Penyusunan Laporan Tahunan',
    pj: 'Dr. Rina Sari, M.PA',
    tanggal: '10 Jul 2025',
    status: 'Aktif'
  }
];

const AdminSuratTugas = () => {
  const [activeSurat, setActiveSurat] = useState(suratList[0]);
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aktif':
        return <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-md border border-blue-100">Aktif</span>;
      case 'Selesai':
        return <span className="px-2 py-0.5 text-[10px] font-semibold text-green-600 bg-green-50 rounded-md border border-green-100">Selesai</span>;
      case 'Draft':
        return <span className="px-2 py-0.5 text-[10px] font-semibold text-yellow-600 bg-yellow-50 rounded-md border border-yellow-100">Draft</span>;
      case 'Dibatalkan':
        return <span className="px-2 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-md border border-gray-200">Dibatalkan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] -m-6 bg-[#f8f9fb] font-poppins">
      
      {/* LEFT PANEL: Surat List */}
      <div className="w-[360px] bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        
        {/* Search & Filter */}
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari surat tugas..." 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
          <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>

        {/* List Header */}
        <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
          <h3 className="text-[11px] font-bold text-gray-400 tracking-wider">DAFTAR SURAT TUGAS</h3>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {suratList.map((surat) => (
            <div 
              key={surat.id}
              onClick={() => setActiveSurat(surat)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeSurat.id === surat.id 
                  ? 'border-blue-500 bg-white shadow-sm ring-1 ring-blue-500/20' 
                  : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                {getStatusBadge(surat.status)}
                <span className="text-[11px] text-gray-400 font-medium">{surat.tanggal}</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">{surat.nomor}</h4>
              <p className="text-[12px] text-gray-500 mb-3 truncate">{surat.judul}</p>
              <div className="flex items-center text-gray-400">
                <User className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-[11px] font-medium">{surat.pj}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: Document Preview */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Actions Bar */}
        <div className="h-16 px-6 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center text-blue-600">
            <FileText className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm">Preview Dokumen: {activeSurat.nomor}</span>
            <div className="ml-4 pl-4 border-l border-gray-200">
              <span className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-md">Aktif</span>
            </div>
            <button className="ml-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Data
            </button>
            <button 
              onClick={() => navigate('/print-spt')}
              className="px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Cetak PDF
            </button>
            <button 
              onClick={() => navigate('/admin/surat-tugas/create')}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat SPT Baru
            </button>
          </div>
        </div>

        {/* Document Area */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          {/* A4 Paper Wrapper */}
          <div className="max-w-[800px] mx-auto bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200 px-12 py-14 relative min-h-[1000px]">
            
            {/* KOP SURAT */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
              {/* Left Logo (Shield) */}
              <div className="w-20 h-24 flex items-center justify-center">
                <img src="/logo-sidoarjo.png" alt="Logo Sidoarjo" className="w-[72px] h-[72px] object-contain" />
              </div>
              
              {/* Header Text */}
              <div className="flex-1 text-center px-4">
                <h2 className="text-[17px] font-bold text-gray-800 tracking-wide">PEMERINTAH KABUPATEN SIDOARJO</h2>
                <h1 className="text-[22px] font-bold text-[#1e3a8a] tracking-wider my-1">
                  DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL
                </h1>
                <p className="text-[11px] text-gray-600 mt-2 font-serif">
                  Jl. Jaksa Agung Suprapto No. 5, Sidoarjo 61218 — Telp. (031) 8921234 — Fax. (031) 8921235<br/>
                  Website: dukcapil.sidoarjokab.go.id — Email: dukcapil@sidoarjokab.go.id
                </p>
              </div>

              {/* Right Logo (Building) */}
              <div className="w-20 h-24 flex items-center justify-center">
                <img src="/logo-disdukcapil.png" alt="Logo Disdukcapil" className="w-[80px] h-[72px] object-contain" />
              </div>
            </div>

            {/* SURAT TITLE */}
            <div className="text-center mb-8">
              <h3 className="font-bold text-[17px] underline underline-offset-4 tracking-widest text-gray-900">SURAT PERINTAH TUGAS</h3>
              <p className="text-[13px] text-gray-700 mt-2">Nomor: <span className="font-bold">045/DUKCAPIL-SDJ/SPT/VI/2025</span></p>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-[150px_20px_1fr] text-[13px] text-gray-800 mb-8 gap-y-3 font-serif">
              <div>Tanggal Surat</div>
              <div className="text-center">:</div>
              <div>12 Juni 2025</div>

              <div>Dasar Penugasan</div>
              <div className="text-center">:</div>
              <div>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Peraturan Bupati Sidoarjo Nomor 23 Tahun 2024 tentang Pengelolaan Peserta Magang;</li>
                  <li>Surat Keputusan Kepala Dinas Nomor 01/SK/DUKCAPIL/2025 tentang Program Magang Terintegrasi.</li>
                </ol>
              </div>
            </div>

            {/* PEGAWAI TABLE */}
            <div className="mb-8">
              <p className="text-[13px] font-bold text-gray-800 mb-3 font-serif tracking-wide">MENUGASKAN KEPADA:</p>
              <table className="w-full border-collapse text-[12px] font-serif">
                <thead>
                  <tr className="bg-[#1e3a8a] text-white">
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-center w-12">No.</th>
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Nama Pegawai</th>
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-left">NIP</th>
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Pangkat/Gol</th>
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Jabatan</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  <tr>
                    <td className="border border-gray-300 py-3 px-3 text-center">1</td>
                    <td className="border border-gray-300 py-3 px-3 font-semibold">Drs. Ahmad Fauzi, M.Si</td>
                    <td className="border border-gray-300 py-3 px-3">19780512 200501 1 003</td>
                    <td className="border border-gray-300 py-3 px-3">Pembina / IV-a</td>
                    <td className="border border-gray-300 py-3 px-3">Kabid Pelayanan Pendaftaran</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 py-3 px-3 text-center bg-gray-50">2</td>
                    <td className="border border-gray-300 py-3 px-3 font-semibold bg-gray-50">Ir. Dewi Kusuma, M.T</td>
                    <td className="border border-gray-300 py-3 px-3 bg-gray-50">19830721 201001 2 007</td>
                    <td className="border border-gray-300 py-3 px-3 bg-gray-50">Penata Tk. I / III-d</td>
                    <td className="border border-gray-300 py-3 px-3 bg-gray-50">Staf Pendampingan Magang</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 py-3 px-3 text-center">3</td>
                    <td className="border border-gray-300 py-3 px-3 font-semibold">Budi Santoso, S.Kom</td>
                    <td className="border border-gray-300 py-3 px-3">19900315 201503 1 002</td>
                    <td className="border border-gray-300 py-3 px-3">Penata Muda / III-a</td>
                    <td className="border border-gray-300 py-3 px-3">Staf Teknis IT</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TUGAS DETAILS */}
            <div className="mb-10">
              <p className="text-[13px] font-bold text-gray-800 mb-3 font-serif tracking-wide">UNTUK MELAKSANAKAN TUGAS:</p>
              <div className="grid grid-cols-[150px_20px_1fr] text-[13px] text-gray-800 gap-y-3 font-serif">
                <div>Tujuan Tugas</div>
                <div className="text-center">:</div>
                <div>Pendampingan dan Monitoring Peserta Magang Batch II Tahun 2025</div>

                <div>Tempat Tugas</div>
                <div className="text-center">:</div>
                <div>Kantor Dinas Dukcapil Sidoarjo & Lokasi Magang Terkait</div>

                <div>Tanggal Mulai</div>
                <div className="text-center">:</div>
                <div>13 Juni 2025</div>

                <div>Tanggal Selesai</div>
                <div className="text-center">:</div>
                <div>20 Juni 2025 <span className="text-gray-500">(7 Hari Kerja)</span></div>

                <div>Kendaraan</div>
                <div className="text-center">:</div>
                <div>Kendaraan Dinas Roda 4 — W 1234 AB</div>

                <div>Biaya Perjalanan</div>
                <div className="text-center">:</div>
                <div>Dibebankan pada DPA Dinas Dukcapil Sidoarjo Tahun 2025</div>
              </div>
            </div>

            {/* PENUTUP */}
            <p className="text-[13px] text-gray-800 mb-12 font-serif text-justify leading-relaxed">
              Demikian Surat Perintah Tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab. Setelah selesai melaksanakan tugas, pegawai yang bersangkutan diwajibkan membuat laporan pelaksanaan tugas kepada Kepala Dinas.
            </p>

            {/* TANDA TANGAN */}
            <div className="flex justify-between text-[13px] text-gray-800 font-serif">
              <div className="w-[250px] text-center pt-8">
                <p className="mb-1">Mengetahui,</p>
                <p className="font-bold mb-20">Sekretaris Dinas</p>
                <div className="border-b border-gray-400 mb-1">
                  <p className="font-bold">Drs. Hendra Wijaya, M.M</p>
                </div>
                <p className="text-[11px] text-gray-600">NIP. 19720815 199803 1 004</p>
              </div>

              <div className="w-[280px] text-center">
                <p className="mb-1">Sidoarjo, 12 Juni 2025</p>
                <p className="font-bold mb-4">Kepala Dinas Kependudukan<br/>dan Pencatatan Sipil<br/>Kabupaten Sidoarjo,</p>
                {/* Stamp/Signature placeholder */}
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center opacity-50 border border-gray-200">
                  <User className="w-8 h-8 text-gray-300" />
                </div>
                <div className="border-b border-gray-400 mb-1">
                  <p className="font-bold">Siti Rahayu, S.STP., M.Si</p>
                </div>
                <p className="text-[11px] text-gray-600">NIP. 19750620 199603 2 001</p>
                <p className="text-[11px] text-gray-600">Pembina Utama Muda / IV-c</p>
              </div>
            </div>

            {/* WATERMARK/FOOTER */}
            <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-50 rounded flex items-center justify-center mr-2">
                  <FileText className="w-2.5 h-2.5 text-blue-400" />
                </div>
                Dokumen ini dicetak melalui SIPPMIT Dukcapil Sidoarjo
              </div>
              <div>Halaman 1 dari 1</div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR (Sticky) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Dokumen telah diverifikasi sistem
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm">
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Data
            </button>
            <button 
              onClick={() => navigate('/print-spt')}
              className="px-5 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Cetak PDF
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminSuratTugas;
