import React, { useState } from 'react';
import { 
  ChevronRight, 
  CheckCircle2, 
  History, 
  XCircle, 
  Users,
  Search,
  Printer,
  Download,
  Calendar,
  Building2,
  CircleDot,
  MapPin,
  Clock,
  Eye,
  ChevronLeft,
  ChevronDown,
  Building,
  Home,
  Minus,
  Filter
} from 'lucide-react';

// Mock Data for Attendance
const tableData = [
  {
    id: '01',
    name: 'Siti Aminah',
    identifier: 'NIM: 19028374',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Operator Plavon',
    instansi: 'Univ. Negeri Surabaya',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: '07:58',
    checkOut: '16:05',
    lokasi: 'WFO',
    status: 'Hadir'
  },
  {
    id: '02',
    name: 'Rizky Aditya',
    identifier: 'NIM: 20193847',
    initials: 'RA',
    color: 'bg-blue-500',
    role: 'Operator Plavon',
    instansi: 'UIN Sunan Ampel',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: '08:12',
    checkOut: '16:30',
    lokasi: 'WFH',
    status: 'Hadir'
  },
  {
    id: '03',
    name: 'Dewi Sartika',
    identifier: 'NIS: 18293',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Operator Plavon',
    instansi: 'SMKN 1 Sidoarjo',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: null,
    checkOut: null,
    lokasi: null,
    status: 'Izin'
  },
  {
    id: '04',
    name: 'Ahmad Farhan',
    identifier: 'NIM: 21048291',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Programmer',
    instansi: 'Univ. Airlangga',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: '07:45',
    checkOut: '15:58',
    lokasi: 'WFO',
    status: 'Hadir'
  },
  {
    id: '05',
    name: 'Laila Nur Hidayah',
    identifier: 'NIM: 22031847',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    role: 'Programmer',
    instansi: 'ITS Surabaya',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: 'Tidak absen',
    checkOut: null,
    lokasi: null,
    status: 'Alpa'
  },
  {
    id: '06',
    name: 'Bagas Prasetyo',
    identifier: 'NIS: 20481',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    role: 'Branding Development',
    instansi: 'SMKN 2 Sidoarjo',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: '08:02',
    checkOut: '16:10',
    lokasi: 'WFO',
    status: 'Hadir'
  },
  {
    id: '07',
    name: 'Nadia Putri Kusuma',
    identifier: 'NIM: 20294751',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    role: 'Operator Plavon',
    instansi: 'Univ. Negeri Malang',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: '08:30',
    checkOut: '16:00',
    lokasi: 'WFH',
    status: 'Hadir'
  },
  {
    id: '08',
    name: 'Eko Wahyudi',
    identifier: 'NIM: 21103849',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    role: 'Operator Plavon',
    instansi: 'Univ. Brawijaya',
    tanggal: '24 Okt 2024',
    hari: 'Kamis',
    checkIn: null,
    checkOut: null,
    lokasi: null,
    status: 'Izin'
  }
];

const AdminAbsensi = () => {
  const [isDepartemenOpen, setIsDepartemenOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('10/24/2024');
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Hadir':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
            Hadir
          </span>
        );
      case 'Izin':
      case 'Sakit':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 border border-yellow-100">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
            {status}
          </span>
        );
      case 'Alpa':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
            Alpa
          </span>
        );
      default:
        return null;
    }
  };

  const getLokasiBadge = (lokasi) => {
    if (lokasi === 'WFO') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-600">
          <Building className="w-3 h-3 mr-1" />
          WFO
        </span>
      );
    } else if (lokasi === 'WFH') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-600">
          <Home className="w-3 h-3 mr-1" />
          WFH
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-gray-50 text-gray-400">
        <Minus className="w-3 h-3 mr-1" />
        N/A
      </span>
    );
  };

  const getTimeDisplay = (time, isError = false) => {
    if (time === 'Tidak absen') {
      return <span className="text-red-500 font-medium text-[13px]">{time}</span>;
    }
    if (!time) {
      return (
        <div className="flex items-center text-gray-400">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          <span className="font-medium text-[13px]">—</span>
        </div>
      );
    }
    return (
      <div className={`flex items-center ${isError ? 'text-red-500' : 'text-green-600'}`}>
        <Clock className="w-3.5 h-3.5 mr-1.5" />
        <span className="font-semibold text-[13px]">{time}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-semibold text-blue-600">Absensi</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Monitoring Absensi Peserta</h2>
          <p className="text-sm text-gray-500">Pantau kehadiran seluruh peserta magang Dukcapil Sidoarjo</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Printer className="w-4 h-4 mr-2" />
            Cetak Laporan
          </button>
          <button className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Hadir Hari Ini</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">45</h3>
            <p className="text-[11px] font-semibold text-green-600">93.8% kehadiran</p>
          </div>
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 relative z-10">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Izin</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">2</h3>
            <p className="text-[11px] font-semibold text-yellow-600">4.2% dari total</p>
          </div>
          <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 relative z-10">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Alpa</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">1</h3>
            <p className="text-[11px] font-semibold text-red-500">2.1% dari total</p>
          </div>
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 relative z-10">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Peserta</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">48</h3>
            <p className="text-[11px] font-medium text-gray-500">Aktif hari ini</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 relative z-10">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="text-sm font-semibold text-gray-600 mr-2 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter:
            </span>
            
            <div className="relative w-40">
              <button 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center justify-between w-full bg-blue-50 border border-blue-100 text-sm text-blue-600 font-medium rounded-lg py-2 px-3 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {selectedDate}
                </div>
                <Calendar className="w-4 h-4" />
              </button>
              
              {/* Custom Calendar Dropdown */}
              {isCalendarOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 z-20 w-80">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">April 2026</h3>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
                    {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map(day => (
                      <div key={day} className="text-[11px] font-bold text-gray-400">{day}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-y-2 gap-x-2 text-center">
                    {/* Empty cells for Wed start */}
                    <div className="w-8 h-8"></div><div className="w-8 h-8"></div><div className="w-8 h-8"></div>
                    
                    {[
                      { d: 1, t: 'green' }, { d: 2, t: 'green' }, { d: 3, t: 'green' }, { d: 4, t: 'gray' },
                      { d: 5, t: 'gray' }, { d: 6, t: 'green' }, { d: 7, t: 'green' }, { d: 8, t: 'green' }, { d: 9, t: 'green' }, { d: 10, t: 'green' }, { d: 11, t: 'gray' },
                      { d: 12, t: 'gray' }, { d: 13, t: 'green' }, { d: 14, t: 'green' }, { d: 15, t: 'green' }, { d: 16, t: 'orange' }, { d: 17, t: 'green' }, { d: 18, t: 'gray' },
                      { d: 19, t: 'gray' }, { d: 20, t: 'orange', sel: true }, { d: 21, t: 'gray' }, { d: 22, t: 'gray' }, { d: 23, t: 'gray' }, { d: 24, t: 'gray' }, { d: 25, t: 'gray' },
                      { d: 26, t: 'gray' }, { d: 27, t: 'gray' }, { d: 28, t: 'gray' }, { d: 29, t: 'gray' }, { d: 30, t: 'gray' }
                    ].map((day) => (
                      <div key={day.d} className="flex flex-col items-center justify-center h-12">
                        <button 
                          onClick={() => {
                            setSelectedDate(`04/${day.d < 10 ? '0'+day.d : day.d}/2026`);
                            setIsCalendarOpen(false);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            day.sel ? 'bg-[#0066FF] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {day.d}
                        </button>
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          day.t === 'green' ? 'bg-green-500' :
                          day.t === 'orange' ? 'bg-orange-500' : 'bg-gray-200'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsDepartemenOpen(!isDepartemenOpen)}
                className="flex items-center justify-between w-48 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  Semua Departemen
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isDepartemenOpen && (
                <div className="absolute top-full mt-1 left-0 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 text-center">
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Operator Plavon</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Branding Development</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Programmer</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center justify-between w-40 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <CircleDot className="w-4 h-4 mr-2 text-gray-400" />
                  Semua Status
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full mt-1 left-0 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 text-center">
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Hadir</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Izin</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sakit</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Alpa</button>
                </div>
              )}
            </div>
            
            <button className="flex items-center justify-between w-36 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                WFH & WFO
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama peserta..." 
              className="w-full bg-white border border-gray-200 text-sm rounded-lg py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
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
                <th className="px-2 py-4 font-semibold w-12">NO.</th>
                <th className="px-6 py-4 font-semibold">NAMA PESERTA</th>
                <th className="px-6 py-4 font-semibold">DEPARTEMEN</th>
                <th className="px-6 py-4 font-semibold">TANGGAL</th>
                <th className="px-6 py-4 font-semibold">CHECK-IN</th>
                <th className="px-6 py-4 font-semibold">CHECK-OUT</th>
                <th className="px-6 py-4 font-semibold">LOKASI</th>
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
                    <p className="font-semibold text-gray-700 text-[13px]">{row.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.instansi}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-700 text-[13px]">{row.tanggal}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.hari}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getTimeDisplay(row.checkIn, row.checkIn === 'Tidak absen')}
                  </td>
                  <td className="px-6 py-4">
                    {getTimeDisplay(row.checkOut)}
                  </td>
                  <td className="px-6 py-4">
                    {getLokasiBadge(row.lokasi)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-1.5 w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors">
                        <Eye className="w-4 h-4" />
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

export default AdminAbsensi;
