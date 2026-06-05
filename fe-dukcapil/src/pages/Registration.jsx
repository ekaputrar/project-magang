import React, { useState, useRef } from 'react'

const Registration = ({ onBack }) => {
  const [step, setStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeUploadField, setActiveUploadField] = useState(null)
  
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    surat_pengantar: [],
    proposal: [],
    portofolio: [],
    cv: []
  })

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset value so same file can be selected again
    e.target.value = null;

    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);

    // Calculate file size in MB or KB
    let sizeText = '';
    if (file.size < 1024 * 1024) {
      sizeText = Math.max(1, Math.round(file.size / 1024)) + ' KB';
    } else {
      sizeText = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress > 100) progress = 100;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadedFiles(prev => ({
            ...prev,
            [activeUploadField]: [...prev[activeUploadField], { name: file.name, size: sizeText }]
          }));
        }, 400);
      }
    }, 300);
  }

  const openUploadModal = (field) => {
    setActiveUploadField(field)
  }

  const closeUploadModal = () => {
    setActiveUploadField(null)
    setIsUploading(false)
  }

  const removeFile = (indexToRemove) => {
    setUploadedFiles(prev => ({
      ...prev,
      [activeUploadField]: prev[activeUploadField].filter((_, i) => i !== indexToRemove)
    }))
  }

  const renderUploadInput = (field, label, defaultText) => {
    const files = uploadedFiles[field] || [];
    const hasFiles = files.length > 0;
    const displayText = hasFiles ? files[files.length - 1].name : defaultText;
    const textColor = hasFiles ? "text-gray-800 font-bold" : "text-gray-600";

    return (
      <div className="flex flex-col gap-1 mt-1">
        <label className="text-white text-[11px] font-bold ml-1">{label}</label>
        <div onClick={() => openUploadModal(field)} className="relative w-full h-9 bg-white rounded-md flex items-center px-3 cursor-pointer hover:bg-gray-50 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-2 shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span className={`${textColor} text-[11px] truncate`}>{displayText}</span>
        </div>
      </div>
    )
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (step < 3) setStep(step + 1)
  }

  const handleSimpan = (e) => {
    e.preventDefault()
    setShowSuccess(true)
  }

  const handleBackStep = (e) => {
    e.preventDefault()
    if (step > 1) {
      setStep(step - 1)
    } else {
      if (onBack) onBack()
    }
  }

  const renderStepIndicator = (stepNumber, label) => {
    const isActive = step >= stepNumber;
    return (
      <div className="flex flex-col items-center z-10 relative">
        <div className={`w-10 h-10 rounded-full ${isActive ? 'bg-[#2445a6] text-white' : 'bg-white text-[#2445a6]'} flex items-center justify-center font-bold text-lg transition-colors duration-300`}>
          {stepNumber}
        </div>
        <div className="text-[10px] font-extrabold text-center mt-2 text-black leading-tight" dangerouslySetInnerHTML={{ __html: label }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d1dff6] to-[#7398d5] flex flex-col items-center py-10 px-4 font-sans">
      
      {/* Stepper */}
      <div className="relative flex justify-between w-52 mx-auto mb-6">
        <div className="absolute top-5 left-0 w-full h-[1px] bg-black z-0"></div>
        {renderStepIndicator(1, 'Data Diri<br/>Peserta')}
        {renderStepIndicator(2, 'Upload<br/>Berkas')}
        {renderStepIndicator(3, 'Review')}
      </div>

      {/* Title */}
      <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#2445a6] mb-6 text-center">
        {step === 1 ? 'Data Diri Peserta Magang' : step === 2 ? 'Upload Berkas Peserta Magang' : 'Review Data Diri & Berkas'}
      </h1>

      {/* Form Card */}
      <div className="bg-[#2445a6] w-full max-w-[480px] rounded-[16px] p-6 sm:p-8 shadow-xl">
        <form className="flex flex-col gap-3">

          {(step === 1 || step === 3) && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] font-bold ml-1">Nama</label>
                <input type="text" className="w-full h-9 px-3 rounded-md border-none outline-none text-sm text-gray-800" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] font-bold ml-1">Nomor Handphone</label>
                <input type="text" className="w-full h-9 px-3 rounded-md border-none outline-none text-sm text-gray-800" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] font-bold ml-1">Email</label>
                <input type="email" className="w-full h-9 px-3 rounded-md border-none outline-none text-sm text-gray-800" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] font-bold ml-1">Asal Instansi</label>
                <input type="text" className="w-full h-9 px-3 rounded-md border-none outline-none text-sm text-gray-800" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] font-bold ml-1">Bidang Tujuan</label>
                <input type="text" className="w-full h-9 px-3 rounded-md border-none outline-none text-sm text-gray-800" />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-white text-[11px] font-bold ml-1">Tanggal Mulai</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    </div>
                    <input type="date" className="w-full h-9 pl-8 pr-3 rounded-md border-none outline-none text-sm text-black bg-white cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-white text-[11px] font-bold ml-1">Tanggal Selesai</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    </div>
                    <input type="date" className="w-full h-9 pl-8 pr-3 rounded-md border-none outline-none text-sm text-black bg-white cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:left-0" />
                  </div>
                </div>
              </div>
            </>
          )}

          {(step === 2 || step === 3) && (
            <>
              {renderUploadInput('surat_pengantar', 'Surat Pengantar Magang', 'File Surat Pengantar Magang')}
              {renderUploadInput('proposal', 'Proposal Magang', 'File Proposal Magang')}
              {renderUploadInput('portofolio', 'Portofolio Peserta Magang', 'File Portofolio Peserta Magang')}
              {renderUploadInput('cv', 'CV Peserta Magang', 'File CV Peserta Magang')}
            </>
          )}

        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={handleBackStep}
          type="button"
          className="bg-[#b91c1c] text-white font-bold py-2 px-8 rounded-md hover:bg-red-800 transition-colors shadow-sm text-sm"
        >
          Kembali
        </button>
        <button
          onClick={step === 3 ? handleSimpan : handleNext}
          type="button"
          className="bg-[#3b82f6] text-white font-bold py-2 px-8 rounded-md hover:bg-blue-600 transition-colors shadow-sm text-sm"
        >
          {step === 3 ? 'Simpan' : 'Lanjutkan'}
        </button>
      </div>

      {/* Success Notification Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] px-4">
          <div className="bg-white rounded-[28px] p-8 max-w-[360px] w-full flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative">
            <div className="w-[46px] h-[46px] rounded-full bg-[#3fe329] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[#104baf] text-[18px] font-extrabold mb-3">
              Data Telah Disimpan
            </h2>
            <p className="text-black text-[11px] leading-relaxed mb-6 font-medium">
              Data diri peserta magang berhasil disimpan. Silahkan <span className="font-bold">Lanjut</span> dan menunggu konfirmasi dari admin.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="bg-[#0b5cce] hover:bg-blue-800 transition-colors text-white font-bold py-2.5 w-[75%] rounded-[10px] text-sm shadow-sm"
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {!!activeUploadField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] px-4">
          <div className="bg-white rounded-[16px] p-6 max-w-[360px] w-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#333] text-[16px] font-bold">Upload File</h2>
              <button onClick={closeUploadModal} className="text-gray-400 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div onClick={() => fileInputRef.current?.click()} className="border-dashed border-[1.5px] border-gray-300 rounded-[10px] h-[86px] flex items-center justify-center mb-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <div className="flex items-center text-gray-500 gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="text-[11px]">Drag and Drop or <span className="text-[#104baf] font-bold">Browse</span> to upload</span>
              </div>
            </div>

            {/* File List */}
            <div className="flex flex-col gap-5 mb-8">
              
              {/* Active Upload */}
              {isUploading && (
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 w-full pr-4">
                    <div className="w-10 h-10 rounded-[8px] bg-[#fdf3e7] flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#e88f28" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full mt-0.5">
                      <span className="text-[11px] text-[#6b7280] font-medium tracking-wide">Uploading File... {uploadProgress}%</span>
                      <div className="w-full h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4680f5] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsUploading(false)} className="text-[#9ca3af] hover:text-gray-700 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              {/* Completed Files */}
              {uploadedFiles[activeUploadField].map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[8px] bg-[#fca5a5] flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#b91c1c" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-[12px] text-[#4b5563] font-semibold leading-tight truncate max-w-[150px]" title={file.name}>{file.name}</span>
                      <span className="text-[10px] text-[#9ca3af] mt-0.5 font-medium">{file.size}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-[#cbd5e1] hover:text-red-500 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                  </button>
                </div>
              ))}

            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 mt-4">
              <button 
                onClick={closeUploadModal}
                className="bg-[#b91c1c] hover:bg-red-800 transition-colors text-white font-bold py-2 w-[100px] rounded-md text-[11px]"
              >
                Cancel
              </button>
              <button 
                onClick={closeUploadModal}
                className="bg-[#3b82f6] hover:bg-blue-600 transition-colors text-white font-bold py-2 w-[100px] rounded-md text-[11px]"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Registration
