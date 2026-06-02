import React, { useState } from 'react';
import { 
  ChevronRight, 
  Calendar, 
  Save, 
  Printer, 
  X, 
  Shield, 
  Building, 
  User, 
  FileText,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  Maximize2,
  Search,
  MapPin,
  Car,
  Coins,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSuratTugasCreate = () => {
  const navigate = useNavigate();
  
  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [nomorSurat, setNomorSurat] = useState('052');
  const [tanggalSurat, setTanggalSurat] = useState('2026-06-20');
  const [dasarPenugasan, setDasarPenugasan] = useState('1. Peraturan Bupati Sidoarjo Nomor 23 Tahun 2024 tentang Pengelolaan Peserta Magang;\n2. Surat Keputusan Kepala Dinas Nomor 01/SK/DUKCAPIL/2026 tentang Program Magang Terintegrasi.');
  
  const [tujuanTugas, setTujuanTugas] = useState('Pendampingan dan Monitoring Peserta Magang Batch II Tahun 2026');
  const [tanggalMulai, setTanggalMulai] = useState('2026-06-21');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-06-28');
  const [tempatTugas, setTempatTugas] = useState('Kantor Dinas Dukcapil Sidoarjo');
  const [kendaraanDinas, setKendaraanDinas] = useState('Kendaraan Roda 4 — W 1234 AB');
  const [sumberBiaya, setSumberBiaya] = useState('Dibebankan pada DPA Dinas Dukcapil Sidoarjo Tahun 2026');

  // Helper to format date for preview
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStepStatusClass = (step) => {
    if (currentStep === step) return 'bg-[#1e3a8a] text-white shadow-md';
    if (currentStep > step) return 'bg-[#1e3a8a] text-white opacity-50';
    return 'bg-gray-100 text-gray-500 border border-gray-200';
  };

  const getStepTextClass = (step) => {
    if (currentStep === step) return 'text-[#1e3a8a] font-bold';
    if (currentStep > step) return 'text-[#1e3a8a] font-bold opacity-50';
    return 'text-gray-500 font-bold';
  };

  return (
    <div className="flex flex-col lg:flex-row h-full font-poppins gap-6">
      
      {/* LEFT PANEL: Form Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Breadcrumbs & Title */}
        <div className="mb-6">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin')}>Home</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin/surat-tugas')}>Surat Tugas</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="font-semibold text-blue-600">Buat Baru</span>
          </div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800 mr-3">Form Pembuatan Surat Perintah Tugas</h2>
            <span className="px-2.5 py-1 text-[11px] font-semibold text-green-700 bg-green-100 rounded-full border border-green-200">Baru</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gray-100 -translate-y-1/2 z-0"></div>
          
          <div className="flex items-center bg-white px-2 z-10 cursor-pointer" onClick={() => setCurrentStep(1)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${getStepStatusClass(1)}`}>1</div>
            <div className="ml-3">
              <p className={`text-xs transition-all ${getStepTextClass(1)}`}>Informasi Dasar</p>
              <p className="text-[10px] text-gray-400">Nomor & tanggal</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white px-2 z-10 cursor-pointer" onClick={() => setCurrentStep(2)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${getStepStatusClass(2)}`}>2</div>
            <div className="ml-3">
              <p className={`text-xs transition-all ${getStepTextClass(2)}`}>Detail Pegawai</p>
              <p className="text-[10px] text-gray-400">Data penugasan</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white px-2 z-10 cursor-pointer" onClick={() => setCurrentStep(3)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${getStepStatusClass(3)}`}>3</div>
            <div className="ml-3">
              <p className={`text-xs transition-all ${getStepTextClass(3)}`}>Detail Tugas</p>
              <p className="text-[10px] text-gray-400">Tujuan & jadwal</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white px-2 z-10 cursor-pointer" onClick={() => setCurrentStep(4)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${getStepStatusClass(4)}`}>4</div>
            <div className="ml-3">
              <p className={`text-xs transition-all ${getStepTextClass(4)}`}>Pengesahan</p>
              <p className="text-[10px] text-gray-400">Penandatangan</p>
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
          
          {/* SEKSI 1: Informasi Dasar */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#1e3a8a] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">1</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 1: Informasi Dasar</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Isi data identitas surat perintah tugas</p>
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-medium text-green-300">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                  Lengkap
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Nomor Surat <span className="text-red-500">*</span></label>
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-colors bg-gray-50">
                      <div className="px-4 py-3 text-sm text-gray-500 font-medium border-r border-gray-300 bg-gray-100/50">SPT/</div>
                      <input 
                        type="text" 
                        value={nomorSurat}
                        onChange={(e) => setNomorSurat(e.target.value)}
                        className="flex-1 px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none min-w-0"
                      />
                      <div className="px-4 py-3 text-sm text-gray-500 font-medium border-l border-gray-300 bg-gray-100/50">/VI/2026</div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Format: SPT/[No]/[Bulan Romawi]/[Tahun]</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tanggal Surat <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <input 
                        type="date" 
                        value={tanggalSurat}
                        onChange={(e) => setTanggalSurat(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Dasar Penugasan <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={5}
                    value={dasarPenugasan}
                    onChange={(e) => setDasarPenugasan(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700 leading-relaxed"
                  ></textarea>
                  <p className="text-[10px] text-gray-400 mt-2">Pisahkan setiap dasar hukum dengan baris baru. Mulai tiap baris dengan angka.</p>
                </div>
              </div>
            </div>
          )}

          {/* SEKSI 2: Detail Pegawai */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#2546a3] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">2</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 2: Detail Pegawai</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Tambahkan pegawai yang ditugaskan</p>
                  </div>
                </div>
                <button className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-white/20">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Pegawai
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Cari & Pilih Pegawai</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Ketik nama atau NIP pegawai..." className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
                    <ChevronRight className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                </div>

                {/* Pegawai Card 1 */}
                <div className="border border-gray-200 rounded-xl p-5 relative bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <button className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold mr-2">1</div>
                    <span className="text-xs font-bold text-gray-500 tracking-wider">PEGAWAI PERTAMA</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">Nama Pegawai</label>
                      <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                            <User className="w-full h-full text-gray-400 mt-1" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">Drs. Ahmad Fauzi, M.Si</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">NIP</label>
                      <input type="text" value="19780512 200501 1 003" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">Pangkat / Golongan</label>
                      <input type="text" value="Pembina / IV-a" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">Jabatan</label>
                      <input type="text" value="Kabid Pelayanan Pendaftaran" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Pegawai Card 2 */}
                <div className="border border-gray-200 rounded-xl p-5 relative bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <button className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold mr-2">2</div>
                    <span className="text-xs font-bold text-gray-500 tracking-wider">PEGAWAI KEDUA</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">Nama Pegawai</label>
                      <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                            <User className="w-full h-full text-gray-400 mt-1" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">Ir. Dewi Kusuma, M.T</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">NIP</label>
                      <input type="text" value="19830721 201001 2 007" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">Pangkat / Golongan</label>
                      <input type="text" value="Penata Tk. I / III-d" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1.5">Jabatan</label>
                      <input type="text" value="Staf Pendampingan Magang" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Add More Button */}
                <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500 transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Klik "Tambah Pegawai" untuk menambah lebih banyak
                </button>
              </div>
            </div>
          )}

          {/* SEKSI 3: Detail Penugasan */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#1e4ed8] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">3</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 3: Detail Penugasan</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Tujuan, jadwal, dan kendaraan dinas</p>
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-medium text-yellow-300">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
                  Diisi sebagian
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Tujuan / Maksud Tugas <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={3}
                    value={tujuanTugas}
                    onChange={(e) => setTujuanTugas(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-green-500" />
                      </div>
                      <input 
                        type="date" 
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-red-400" />
                      </div>
                      <input 
                        type="date" 
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Durasi Banner */}
                <div className="bg-[#f0f5ff] rounded-xl p-4 flex items-center justify-between border border-blue-100">
                  <div className="flex items-center text-sm font-bold text-blue-700">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Durasi tugas: 7 Hari Kerja
                  </div>
                  <span className="text-xs text-blue-500 font-medium bg-blue-100/50 px-3 py-1 rounded-full">
                    21 Jun — 28 Jun 2026
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tempat Tugas <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={tempatTugas}
                        onChange={(e) => setTempatTugas(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Kendaraan Dinas</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Car className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={kendaraanDinas}
                        onChange={(e) => setKendaraanDinas(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Sumber Biaya Perjalanan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Coins className="h-4 w-4 text-yellow-500" />
                    </div>
                    <input 
                      type="text" 
                      value={sumberBiaya}
                      onChange={(e) => setSumberBiaya(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEKSI 4: Pengesahan */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#2563eb] px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-3">4</div>
                  <div>
                    <h3 className="font-bold text-sm">Seksi 4: Pengesahan</h3>
                    <p className="text-[11px] text-blue-100 opacity-90">Pilih pejabat penandatangan surat</p>
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-medium text-white/80">
                  <div className="w-2 h-2 rounded-full bg-white/50 mr-1.5"></div>
                  Belum diisi
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Penandatangan Utama */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Penandatangan Utama <span className="text-red-500">*</span></label>
                    <p className="text-[10px] text-gray-400 mb-3">Kepala Dinas / Pejabat Berwenang</p>
                    
                    <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4 relative mb-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                            <User className="w-full h-full text-gray-400 mt-2" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">Siti Rahayu, S.STP., M.Si</p>
                            <p className="text-[10px] text-gray-500">NIP. 19750620 199603 2 001</p>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center text-[11px] text-gray-600">
                          <Building className="w-3.5 h-3.5 mr-2 opacity-50" />
                          Kepala Dinas Dukcapil Kab. Sidoarjo
                        </div>
                        <div className="flex items-center text-[11px] text-gray-600">
                          <Shield className="w-3.5 h-3.5 mr-2 opacity-50" />
                          Pembina Utama Muda / IV-c
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors bg-white shadow-sm">
                      <RefreshCw className="w-3 h-3 mr-1.5" /> Ganti Penandatangan
                    </button>
                  </div>

                  {/* Mengetahui */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Mengetahui / Atasan Langsung</label>
                    <p className="text-[10px] text-gray-400 mb-3">Sekretaris Dinas (opsional)</p>
                    
                    <div className="border border-green-200 bg-green-50/30 rounded-xl p-4 relative mb-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                            <User className="w-full h-full text-gray-400 mt-2" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">Drs. Hendra Wijaya, M.M</p>
                            <p className="text-[10px] text-gray-500">NIP. 19720815 199803 1 004</p>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center text-[11px] text-gray-600">
                          <Building className="w-3.5 h-3.5 mr-2 opacity-50" />
                          Sekretaris Dinas Dukcapil
                        </div>
                        <div className="flex items-center text-[11px] text-gray-600">
                          <Shield className="w-3.5 h-3.5 mr-2 opacity-50" />
                          Pembina Tk. I / IV-b
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                      <RefreshCw className="w-3 h-3 mr-1.5" /> Ganti Mengetahui
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tempat Penandatanganan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value="Sidoarjo"
                        readOnly
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tanggal Penandatanganan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <input 
                        type="date" 
                        value={tanggalSurat}
                        onChange={(e) => setTanggalSurat(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-400 font-bold">i</div>
            Semua field bertanda <span className="text-red-500 mx-1">*</span> wajib diisi sebelum menyimpan
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/admin/surat-tugas')}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </button>
            <button className="px-5 py-2.5 bg-yellow-50 border border-yellow-400 text-yellow-700 text-sm font-semibold rounded-xl hover:bg-yellow-100 transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Simpan Draft
            </button>
            <button className="px-6 py-2.5 bg-[#1e3a8a] text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-colors flex items-center shadow-md">
              <Printer className="w-4 h-4 mr-2" />
              Simpan & Cetak
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview & Validation */}
      <div className="w-[420px] flex-shrink-0 flex flex-col gap-6">
        
        {/* Live Preview Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col h-[620px]">
          {/* Mac-style Header */}
          <div className="bg-[#1e293b] px-4 py-3 flex items-center justify-between">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center text-gray-300 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Preview Dokumen (Live)
            </div>
            <div className="flex items-center text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
              Realtime
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-gray-300 border-b border-slate-700">
            <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-1">
              <button className="p-1 hover:bg-slate-700 rounded-md"><Minus className="w-3.5 h-3.5" /></button>
              <span className="px-2 font-mono">75%</span>
              <button className="p-1 hover:bg-slate-700 rounded-md"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <span className="font-medium text-slate-400">A4 — Portrait</span>
            <button className="flex items-center hover:text-white transition-colors">
              <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
              Perbesar
            </button>
          </div>

          {/* Preview Container */}
          <div className="flex-1 bg-[#eef1f6] overflow-hidden flex items-center justify-center p-4 relative h-[480px]">
            
            {/* The scaled A4 Paper */}
            {/* Using transform scale to fit the 800px A4 design into a ~380px container (scale roughly 0.45) */}
            <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[800px] h-[1131px] origin-top scale-[0.45] bg-white shadow-xl border border-gray-200 px-12 py-14 rounded">
              
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
              <div className="border-b-[1px] border-black mb-10 -mt-7"></div>

              {/* SURAT TITLE */}
              <div className="text-center mb-10">
                <h3 className="font-bold text-[18px] underline underline-offset-4 tracking-widest text-gray-900">SURAT PERINTAH TUGAS</h3>
                <p className="text-[13px] text-gray-700 mt-3 font-serif">
                  Nomor : <span className="font-bold">SPT/{nomorSurat || '...'}/VI/2026</span>
                </p>
              </div>

              {/* DASAR */}
              <div className="grid grid-cols-[100px_20px_1fr] text-[14px] text-gray-800 mb-8 font-serif leading-relaxed">
                <div>Tanggal Surat</div>
                <div className="text-center">:</div>
                <div>{formatDate(tanggalSurat)}</div>
                
                <div className="mt-2">Dasar</div>
                <div className="text-center mt-2">:</div>
                <div className="mt-2">
                  <div className="pl-4 whitespace-pre-wrap text-justify">{dasarPenugasan}</div>
                </div>
              </div>

              {/* MEMERINTAHKAN */}
              <div className="text-[13px] font-bold text-gray-800 mb-3 font-serif tracking-wide mt-12">
                MENUGASKAN KEPADA:
              </div>

              <table className="w-full border-collapse text-[12px] font-serif mb-12">
                <thead>
                  <tr className="bg-[#1e3a8a] text-white">
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Nama</th>
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Pangkat</th>
                    <th className="border border-gray-300 py-2 px-3 font-semibold text-left">Jabatan</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  <tr>
                    <td className="border border-gray-300 py-3 px-3 font-semibold">Drs. Ahmad F., M.Si</td>
                    <td className="border border-gray-300 py-3 px-3">Pembina IV-a</td>
                    <td className="border border-gray-300 py-3 px-3">Kabid Pendaftaran</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 py-3 px-3 font-semibold bg-gray-50">Ir. Dewi K., M.T</td>
                    <td className="border border-gray-300 py-3 px-3 bg-gray-50">Penata Tk.I/III-d</td>
                    <td className="border border-gray-300 py-3 px-3 bg-gray-50">Staf Magang</td>
                  </tr>
                </tbody>
              </table>

              {/* TUGAS DETAILS */}
              <div className="mb-10">
                <p className="text-[13px] font-bold text-gray-800 mb-3 font-serif tracking-wide">DETAIL PENUGASAN:</p>
                <div className="grid grid-cols-[100px_20px_1fr] text-[13px] text-gray-800 gap-y-3 font-serif">
                  <div>Tujuan</div>
                  <div className="text-center">:</div>
                  <div>{tujuanTugas || '...'}</div>

                  <div>Tempat</div>
                  <div className="text-center">:</div>
                  <div>{tempatTugas || '...'}</div>

                  <div>Tanggal</div>
                  <div className="text-center">:</div>
                  <div>{formatDate(tanggalMulai)} — {formatDate(tanggalSelesai)}</div>

                  <div>Kendaraan</div>
                  <div className="text-center">:</div>
                  <div>{kendaraanDinas || '-'}</div>
                </div>
              </div>

              {/* TANDA TANGAN */}
              <div className="flex justify-between text-[13px] text-gray-800 font-serif mt-16">
                <div className="w-[250px] text-center pt-8">
                  <p className="mb-1">Mengetahui,</p>
                  <p className="font-bold mb-20">Sekretaris Dinas</p>
                  <div className="border-b border-gray-400 mb-1">
                    <p className="font-bold">Drs. Hendra W, M.M</p>
                  </div>
                  <p className="text-[11px] text-gray-600">NIP. 19720815 ...</p>
                </div>

                <div className="w-[280px] text-center">
                  <p className="mb-1">Sidoarjo, {formatDate(tanggalSurat) || '20 Juni 2026'}</p>
                  <p className="font-bold mb-4">Kepala Dinas Dukcapil<br/>Kabupaten Sidoarjo,</p>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center opacity-50 border border-gray-200">
                    <User className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="border-b border-gray-400 mb-1">
                    <p className="font-bold">Siti Rahayu, S.STP., M.Si</p>
                  </div>
                  <p className="text-[11px] text-gray-600">NIP. 19750620 199603 2 001</p>
                </div>
              </div>

              {/* WATERMARK */}
              <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-4">
                <div className="flex items-center">
                  <FileText className="w-3 h-3 text-blue-400 mr-2" />
                  SIPPMIT Dukcapil Sidoarjo
                </div>
                <div>Hal. 1/1</div>
              </div>
            </div>
            
          </div>
          
          {/* Footer of Preview Card */}
          <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center z-10 mt-auto">
            <div className="flex items-center text-xs font-medium text-yellow-600">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div>
              Dokumen belum final
            </div>
            <button className="px-4 py-1.5 bg-[#1e3a8a] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center hover:bg-blue-900 transition-colors">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Cetak PDF
            </button>
          </div>
        </div>

        {/* Validation Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-sm font-bold text-gray-800 mb-4">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />
            Ringkasan Validasi
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Informasi Dasar lengkap</span>
            </div>
            <div className="flex items-start text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>2 pegawai telah ditambahkan</span>
            </div>
            <div className="flex items-start text-xs text-gray-600">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
              <span className="text-yellow-700 font-medium">Tempat tugas perlu dilengkapi</span>
            </div>
            <div className="flex items-start text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Penandatangan telah dipilih</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
              <span>Kelengkapan Form</span>
              <span className="text-blue-600">75%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[75%]"></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminSuratTugasCreate;
