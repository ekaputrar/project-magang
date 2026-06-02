import React, { useState } from 'react';
import { 
  ChevronRight, 
  Users, 
  CheckCircle2, 
  Clock, 
  Flag,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';

// Mock Data
const tableData = [
  {
    id: '01',
    name: 'Siti Aminah',
    identifier: 'NIM: 19028374',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    instansi: 'Universitas Brawijaya',
    jurusan: 'Administrasi Publik',
    periode: '01 Nov 2023 - 31 Jan 2024',
    durasi: '3 Bulan',
    status: 'Aktif'
  },
  {
    id: '02',
    name: 'Rizky Aditya',
    identifier: 'NIM: 20193847',
    initials: 'RA',
    color: 'bg-blue-500',
    instansi: 'UIN Sunan Ampel',
    jurusan: 'Sistem Informasi',
    periode: '01 Des 2023 - 31 Jan 2024',
    durasi: '2 Bulan',
    status: 'Aktif'
  },
  {
    id: '03',
    name: 'Dewi Sartika',
    identifier: 'NIS: 18293',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    instansi: 'SMKN 1 Sidoarjo',
    jurusan: 'Otomatisasi Perkantoran',
    periode: '15 Jan 2024 - 15 Jun 2024',
    durasi: '6 Bulan',
    status: 'Pending'
  },
  {
    id: '04',
    name: 'Ahmad Farhan',
    identifier: 'NIM: 21048291',
    initials: 'AF',
    color: 'bg-gray-200',
    instansi: 'Universitas Airlangga',
    jurusan: 'Ilmu Hukum',
    periode: '01 Jul 2023 - 30 Sep 2023',
    durasi: '3 Bulan',
    status: 'Selesai'
  },
  {
    id: '05',
    name: 'Laila Nur Hidayah',
    identifier: 'NIM: 22031847',
    initials: 'LN',
    color: 'bg-gray-200',
    instansi: 'ITS Surabaya',
    jurusan: 'Teknik Informatika',
    periode: '01 Feb 2024 - 30 Apr 2024',
    durasi: '3 Bulan',
    status: 'Pending'
  },
  {
    id: '06',
    name: 'Bagas Prasetyo',
    identifier: 'NIS: 20481',
    initials: 'BP',
    color: 'bg-gray-200',
    instansi: 'SMKN 2 Sidoarjo',
    jurusan: 'Rekayasa Perangkat Lunak',
    periode: '01 Okt 2023 - 31 Mar 2024',
    durasi: '6 Bulan',
    status: 'Aktif'
  },
  {
    id: '07',
    name: 'Nadia Putri Kusuma',
    identifier: 'NIM: 20284751',
    initials: 'NP',
    color: 'bg-gray-200',
    instansi: 'Universitas Negeri Malang',
    jurusan: 'Manajemen',
    periode: '01 Ags 2023 - 31 Okt 2023',
    durasi: '3 Bulan',
    status: 'Selesai'
  }
];

const AdminPeserta = () => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isInstansiOpen, setIsInstansiOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Aktif':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
            Aktif
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 border border-yellow-100">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
            Pending
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-semibold text-blue-600">Peserta Magang</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Manajemen Peserta Magang</h2>
          <p className="text-sm text-gray-500">Kelola seluruh data peserta magang Dukcapil Sidoarjo</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Peserta
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Total Peserta</p>
            <h3 className="text-2xl font-bold text-gray-800">124</h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 mr-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Aktif</p>
            <h3 className="text-2xl font-bold text-gray-800">87</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Pending</p>
            <h3 className="text-2xl font-bold text-gray-800">22</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mr-4">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Selesai</p>
            <h3 className="text-2xl font-bold text-gray-800">15</h3>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari nama peserta..." 
                className="w-full bg-white border border-gray-200 text-sm rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center justify-between w-40 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  Semua Status
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full mt-1 left-0 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Aktif</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pending</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Selesai</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsInstansiOpen(!isInstansiOpen)}
                className="flex items-center justify-between w-48 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-gray-400 border border-gray-400 rounded-sm"></span>
                  Semua Instansi
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isInstansiOpen && (
                <div className="absolute top-full mt-1 left-0 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 text-center">
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Universitas Brawijaya</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">UIN Sunan Ampel</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Universitas Airlangga</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">ITS</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">SMKN 2 Sidoarjo</button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Peserta
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-2 py-4 font-semibold w-16">NO.</th>
                <th className="px-6 py-4 font-semibold">NAMA PESERTA</th>
                <th className="px-6 py-4 font-semibold">INSTANSI / SEKOLAH</th>
                <th className="px-6 py-4 font-semibold">PERIODE MAGANG</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-2 py-4 text-gray-500 font-medium">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {row.avatar ? (
                        <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover mr-3" />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3 ${row.color}`}>
                          {row.initials}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{row.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{row.identifier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-700">{row.instansi}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.jurusan}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700 mb-0.5">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      <span className="font-medium text-[13px]">{row.periode}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-5">{row.durasi}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="text-gray-500 flex items-center">
            Menampilkan 
            <select className="mx-2 border border-gray-200 rounded-md p-1 focus:outline-none focus:border-blue-300">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            dari <span className="font-semibold text-gray-700 mx-1">48</span> peserta
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[1, 2, 3].map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-[#0066FF] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            
            <button 
              onClick={() => setCurrentPage(5)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-colors ${
                currentPage === 5 
                  ? 'bg-[#0066FF] text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              5
            </button>
            
            <button 
              onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPeserta;
