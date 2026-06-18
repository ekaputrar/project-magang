import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
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
  Filter,
  ExternalLink
} from 'lucide-react';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AdminAbsensi = () => {
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString()); // YYYY-MM-DD local time
  const [loading, setLoading] = useState(true);
  const [pesertaList, setPesertaList] = useState([]);
  const [absensiList, setAbsensiList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartemen, setSelectedDepartemen] = useState('Semua Departemen');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedLokasi, setSelectedLokasi] = useState('Semua Lokasi');
  const [isDepartemenOpen, setIsDepartemenOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isLokasiOpen, setIsLokasiOpen] = useState(false);
  const [selectedDetailRow, setSelectedDetailRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data dari database
  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch seluruh peserta aktif
      const { data: pesertas, error: pError } = await supabase
        .from('pesertas')
        .select('*')
        .eq('status', 'Aktif');

      if (pError) throw pError;

      // 2. Fetch data absensi pada tanggal yang dipilih
      const { data: absensis, error: aError } = await supabase
        .from('absensis')
        .select('*')
        .eq('tanggal', selectedDate);

      if (aError) throw aError;

      setPesertaList(pesertas || []);
      setAbsensiList(absensis || []);
    } catch (e) {
      console.error('Error fetching admin absensi data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Realtime subscription untuk sinkronisasi live
  useEffect(() => {
    const channel = supabase
      .channel('admin-absensi-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'absensis',
        filter: `tanggal=eq.${selectedDate}`
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Hadir':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
            Hadir
          </span>
        );
      case 'Terlambat':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>
            Terlambat
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
    if (time === 'Tidak absen' || time === 'Belum absen') {
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

  // Gabungkan dan petakan data peserta + absensi
  const tableRows = pesertaList.map((peserta, index) => {
    const absensi = absensiList.find(abs => abs.peserta_id === peserta.id);
    let status = 'Alpa';
    let checkIn = 'Tidak absen';
    let checkOut = null;
    let lokasi = null;
    let keterangan = '';

    if (absensi) {
      status = absensi.status;
      checkIn = absensi.check_in ? absensi.check_in.slice(0, 5) : null;
      checkOut = absensi.check_out ? absensi.check_out.slice(0, 5) : null;
      lokasi = absensi.lokasi;
      keterangan = absensi.keterangan || '';

      if (status === 'Hadir' && absensi.check_in && absensi.check_in > '08:00:00') {
        status = 'Terlambat';
      }
    } else {
      const todayStr = getLocalDateString();
      if (selectedDate === todayStr) {
        status = 'Alpa';
        checkIn = 'Belum absen';
      }
    }

    const initials = peserta.nama ? peserta.nama.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'P';

    return {
      dbId: absensi?.id,
      pesertaId: peserta.id,
      id: String(index + 1).padStart(2, '0'),
      name: peserta.nama,
      identifier: `Email: ${peserta.email || '-'}`,
      avatar: null,
      initials,
      color: index % 3 === 0 ? 'bg-rose-500' : index % 3 === 1 ? 'bg-blue-500' : 'bg-emerald-500',
      role: peserta.bidang_tujuan || 'Operator Plavon',
      instansi: peserta.asal_instansi || 'Dukcapil Sidoarjo',
      tanggal: new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      hari: new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' }),
      checkIn,
      checkOut,
      lokasi,
      status,
      keterangan
    };
  });

  // Ambil daftar departemen secara dinamis dari database
  const departemens = ['Semua Departemen', ...new Set(pesertaList.map(p => p.bidang_tujuan).filter(Boolean))];

  // Filtering data
  const filteredRows = tableRows.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.instansi.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDepartemen === 'Semua Departemen' || row.role === selectedDepartemen;
    
    let matchesStatus = true;
    if (selectedStatus !== 'Semua Status') {
      if (selectedStatus === 'Hadir') {
        matchesStatus = row.status === 'Hadir' || row.status === 'Terlambat';
      } else if (selectedStatus === 'Izin') {
        matchesStatus = row.status === 'Izin' || row.status === 'Sakit';
      } else {
        matchesStatus = row.status === selectedStatus;
      }
    }

    let matchesLokasi = true;
    if (selectedLokasi !== 'Semua Lokasi') {
      matchesLokasi = row.lokasi === selectedLokasi;
    }

    return matchesSearch && matchesDept && matchesStatus && matchesLokasi;
  });

  // Stats
  const totalPeserta = pesertaList.length;
  const hadirCount = tableRows.filter(r => r.status === 'Hadir' || r.status === 'Terlambat').length;
  const izinCount = tableRows.filter(r => r.status === 'Izin' || r.status === 'Sakit').length;
  const alpaCount = tableRows.filter(r => r.status === 'Alpa').length;
  const kehadiranPercent = totalPeserta > 0 ? ((hadirCount / totalPeserta) * 100).toFixed(1) : '0.0';

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartemen, selectedStatus, selectedLokasi, selectedDate]);

  // Sort: checked-in/active attendance (latest first) at the top, then special status (Izin/Sakit), then Alpa
  const sortedRows = [...filteredRows].sort((a, b) => {
    const hasA = a.checkIn && a.checkIn !== 'Tidak absen' && a.checkIn !== 'Belum absen';
    const hasB = b.checkIn && b.checkIn !== 'Tidak absen' && b.checkIn !== 'Belum absen';

    if (hasA && !hasB) return -1;
    if (!hasA && hasB) return 1;

    if (hasA && hasB) {
      return b.checkIn.localeCompare(a.checkIn);
    }

    const isSpecialA = a.status === 'Izin' || a.status === 'Sakit';
    const isSpecialB = b.status === 'Izin' || b.status === 'Sakit';

    if (isSpecialA && !isSpecialB) return -1;
    if (!isSpecialA && isSpecialB) return 1;

    return a.name.localeCompare(b.name);
  });

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / itemsPerPage) || 1;
  const paginatedRows = sortedRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper formats
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleExportCSV = () => {
    const headers = ['No', 'Nama Peserta', 'Departemen', 'Instansi', 'Tanggal', 'Check-In', 'Check-Out', 'Lokasi', 'Status', 'Keterangan'];
    const rows = sortedRows.map(r => [
      r.id,
      r.name,
      r.role,
      r.instansi,
      r.tanggal,
      r.checkIn || '-',
      r.checkOut || '-',
      r.lokasi || '-',
      r.status,
      r.keterangan || '-'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Absensi_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
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
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Laporan
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Hadir Hari Ini</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{hadirCount}</h3>
            <p className="text-[11px] font-semibold text-green-600">{kehadiranPercent}% kehadiran</p>
          </div>
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 relative z-10">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Izin / Sakit</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{izinCount}</h3>
            <p className="text-[11px] font-semibold text-yellow-600">{totalPeserta > 0 ? ((izinCount / totalPeserta) * 100).toFixed(1) : '0.0'}% dari total</p>
          </div>
          <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 relative z-10">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Alpa</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{alpaCount}</h3>
            <p className="text-[11px] font-semibold text-red-500">{totalPeserta > 0 ? ((alpaCount / totalPeserta) * 100).toFixed(1) : '0.0'}% dari total</p>
          </div>
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 relative z-10">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Peserta</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{totalPeserta}</h3>
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
            
            {/* Tanggal Picker */}
            <div className="relative w-48">
              <div className="flex items-center justify-between w-full bg-blue-50 border border-blue-100 text-sm text-blue-600 font-medium rounded-lg py-2 px-3 hover:bg-blue-100 transition-colors pointer-events-none">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDisplayDate(selectedDate)}
                </div>
                <ChevronDown className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {/* Departemen Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDepartemenOpen(!isDepartemenOpen)}
                className="flex items-center justify-between w-48 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center truncate">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                  <span className="truncate">{selectedDepartemen}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
              {isDepartemenOpen && (
                <div className="absolute top-full mt-1 left-0 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 overflow-y-auto max-h-60">
                  {departemens.map(dept => (
                    <button 
                      key={dept}
                      onClick={() => {
                        setSelectedDepartemen(dept);
                        setIsDepartemenOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 truncate"
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center justify-between w-40 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <CircleDot className="w-4 h-4 mr-2 text-gray-400" />
                  {selectedStatus}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full mt-1 left-0 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                  {['Semua Status', 'Hadir', 'Izin', 'Alpa'].map(st => (
                    <button 
                      key={st}
                      onClick={() => {
                        setSelectedStatus(st);
                        setIsStatusOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Lokasi Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLokasiOpen(!isLokasiOpen)}
                className="flex items-center justify-between w-40 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {selectedLokasi}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isLokasiOpen && (
                <div className="absolute top-full mt-1 left-0 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                  {['Semua Lokasi', 'WFO', 'WFH'].map(loc => (
                    <button 
                      key={loc}
                      onClick={() => {
                        setSelectedLokasi(loc);
                        setIsLokasiOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-400">Memuat data absensi...</td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-400">Tidak ada data absensi yang sesuai filter.</td>
                </tr>
              ) : paginatedRows.map((row) => (
                <tr key={row.pesertaId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-2 py-4 text-gray-500 font-medium">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3 ${row.color}`}>
                        {row.initials}
                      </div>
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
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => setSelectedDetailRow(row)}
                        className="p-1.5 w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                        title="Lihat Detail"
                      >
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
            Menampilkan <span className="font-semibold text-gray-700 mx-1">{paginatedRows.length}</span> dari <span className="font-semibold text-gray-700 mx-1">{sortedRows.length}</span> entri
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
            
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={() => setSelectedDetailRow(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden animate-[fadeInUp_0.25s_ease]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Detail Kehadiran</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Nama Peserta</span>
                <span className="font-semibold text-gray-800">{selectedDetailRow.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Instansi / Departemen</span>
                <span className="text-gray-700">{selectedDetailRow.instansi} · {selectedDetailRow.role}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block text-xs">Waktu Check In</span>
                  <span className="text-gray-700">{selectedDetailRow.checkIn || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Waktu Check Out</span>
                  <span className="text-gray-700">{selectedDetailRow.checkOut || '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Status Kehadiran</span>
                <div className="mt-1">{getStatusBadge(selectedDetailRow.status)}</div>
              </div>
              {selectedDetailRow.lokasi && (
                <div>
                  <span className="text-gray-400 block text-xs">Lokasi</span>
                  <span className="text-gray-700">{selectedDetailRow.lokasi}</span>
                </div>
              )}
              {selectedDetailRow.keterangan && (
                <div>
                  <span className="text-gray-400 block text-xs">Keterangan / Berkas</span>
                  <div className="text-gray-700 bg-gray-50 p-2.5 rounded-xl mt-1 text-xs whitespace-pre-wrap leading-relaxed">
                    {selectedDetailRow.keterangan.includes('[Unduh Berkas]') ? (
                      (() => {
                        const parts = selectedDetailRow.keterangan.split(/\[Unduh Berkas\]\((.*?)\)/);
                        return (
                          <>
                            <span>{parts[0]}</span>
                            <a 
                              href={parts[1]} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 font-bold hover:underline block mt-1.5 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Unduh Berkas Pendukung
                            </a>
                          </>
                        );
                      })()
                    ) : selectedDetailRow.keterangan}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSelectedDetailRow(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbsensi;
