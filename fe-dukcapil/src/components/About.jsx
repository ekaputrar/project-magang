import React from 'react'
import officeImage from '../assets/office_image.png'

const About = () => {
  const benefits = [
    'Pengalaman kerja di instansi pemerintahan',
    'Bimbingan dari pegawai berpengalaman',
    'Sertifikat resmi setelah selesai magang',
  ]

  return (
    <section id="tentang" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left - Image */}
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={officeImage}
                alt="Kantor Dinas Kependudukan dan Pencatatan Sipil Sidoarjo"
                className="w-full h-80 md:h-96 object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-800 via-transparent to-transparent opacity-30"></div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">
              Tentang Dinas Kependudukan <br className="hidden md:block" />
              dan Pencatatan Sipil Sidoarjo
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
              Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo berkomitmen untuk memberikan pelayanan terbaik kepada masyarakat. Melalui program magang ini, kami membuka kesempatan bagi mahasiswa dan pelajar untuk belajar dan berkontribusi dalam pelayanan publik.
            </p>

            {/* Benefits */}
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-800 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm md:text-base">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
