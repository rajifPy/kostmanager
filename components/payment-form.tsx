import React, { useState } from 'react';

// Typewriter Loading Component
const TypewriterLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="typewriter">
        <div className="slide"><i /></div>
        <div className="paper" />
        <div className="keyboard" />
      </div>
      <style jsx>{`
        .typewriter {
          --blue: #5C86FF;
          --blue-dark: #275EFE;
          --key: #fff;
          --paper: #EEF0FD;
          --text: #D3D4EC;
          --tool: #FBC56C;
          --duration: 3s;
          position: relative;
          animation: bounce05 var(--duration) linear infinite;
        }

        .typewriter .slide {
          width: 92px;
          height: 20px;
          border-radius: 3px;
          margin-left: 14px;
          transform: translateX(14px);
          background: linear-gradient(var(--blue), var(--blue-dark));
          animation: slide05 var(--duration) ease infinite;
        }

        .typewriter .slide:before,
        .typewriter .slide:after,
        .typewriter .slide i:before {
          content: "";
          position: absolute;
          background: var(--tool);
        }

        .typewriter .slide:before {
          width: 2px;
          height: 8px;
          top: 6px;
          left: 100%;
        }

        .typewriter .slide:after {
          left: 94px;
          top: 3px;
          height: 14px;
          width: 6px;
          border-radius: 3px;
        }

        .typewriter .slide i {
          display: block;
          position: absolute;
          right: 100%;
          width: 6px;
          height: 4px;
          top: 4px;
          background: var(--tool);
        }

        .typewriter .slide i:before {
          right: 100%;
          top: -2px;
          width: 4px;
          border-radius: 2px;
          height: 14px;
        }

        .typewriter .paper {
          position: absolute;
          left: 24px;
          top: -26px;
          width: 40px;
          height: 46px;
          border-radius: 5px;
          background: var(--paper);
          transform: translateY(46px);
          animation: paper05 var(--duration) linear infinite;
        }

        .typewriter .paper:before {
          content: "";
          position: absolute;
          left: 6px;
          right: 6px;
          top: 7px;
          border-radius: 2px;
          height: 4px;
          transform: scaleY(0.8);
          background: var(--text);
          box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text);
        }

        .typewriter .keyboard {
          width: 120px;
          height: 56px;
          margin-top: -10px;
          z-index: 1;
          position: relative;
        }

        .typewriter .keyboard:before,
        .typewriter .keyboard:after {
          content: "";
          position: absolute;
        }

        .typewriter .keyboard:before {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 7px;
          background: linear-gradient(135deg, var(--blue), var(--blue-dark));
          transform: perspective(10px) rotateX(2deg);
          transform-origin: 50% 100%;
        }

        .typewriter .keyboard:after {
          left: 2px;
          top: 25px;
          width: 11px;
          height: 4px;
          border-radius: 2px;
          box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key),
            60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key),
            22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key),
            60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
          animation: keyboard05 var(--duration) linear infinite;
        }

        @keyframes bounce05 {
          85%, 92%, 100% {
            transform: translateY(0);
          }
          89% {
            transform: translateY(-4px);
          }
          95% {
            transform: translateY(2px);
          }
        }

        @keyframes slide05 {
          5% {
            transform: translateX(14px);
          }
          15%, 30% {
            transform: translateX(6px);
          }
          40%, 55% {
            transform: translateX(0);
          }
          65%, 70% {
            transform: translateX(-4px);
          }
          80%, 89% {
            transform: translateX(-12px);
          }
          100% {
            transform: translateX(14px);
          }
        }

        @keyframes paper05 {
          5% {
            transform: translateY(46px);
          }
          20%, 30% {
            transform: translateY(34px);
          }
          40%, 55% {
            transform: translateY(22px);
          }
          65%, 70% {
            transform: translateY(10px);
          }
          80%, 85% {
            transform: translateY(0);
          }
          92%, 100% {
            transform: translateY(46px);
          }
        }

        @keyframes keyboard05 {
          5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key),
              60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key),
              22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
          }
          9% {
            box-shadow: 15px 2px 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key),
              60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key),
              22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
          }
        }
      `}</style>
    </div>
  );
};

// Success Animation Component
const SuccessAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full">
          <div className="w-20 h-20 rounded-full bg-green-500 opacity-75"></div>
        </div>
        <div className="relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-green-600">Berhasil Dikirim!</h3>
        <p className="text-sm text-gray-600">
          Bukti pembayaran Anda sedang diproses
        </p>
        <p className="text-xs text-gray-500">
          Mohon tunggu verifikasi dari admin
        </p>
      </div>
    </div>
  );
};

// Loading Overlay Component
const LoadingOverlay = ({ message = "Mengirim bukti pembayaran..." }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <TypewriterLoader />
        <p className="text-center mt-8 text-base font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </p>
        <p className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          Mohon tunggu sebentar...
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TenantPaymentForm() {
  const [tenantId, setTenantId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Mock tenants data
  const tenants = [
    { id: "1", name: "Ahmad Yani", room: { room_number: "A1", price: 1500000 } },
    { id: "2", name: "Budi Santoso", room: { room_number: "A2", price: 1800000 } },
    { id: "3", name: "Citra Dewi", room: { room_number: "B1", price: 2000000 } },
  ]

  const selectedTenant = tenants.find((t) => t.id === tenantId)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File harus berupa gambar (JPG, PNG, WebP) atau PDF")
        return
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB")
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!tenantId || !amount || !file || !paymentDate) {
      setError("Mohon lengkapi semua field yang diperlukan")
      return
    }

    setIsLoading(true)
    setError(null)

    // Simulate upload delay (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Simulate success
    setIsLoading(false)
    setSuccess(true)
    
    // Reset form after showing success (3 seconds)
    setTimeout(() => {
      setSuccess(false)
      setTenantId("")
      setAmount("")
      setPaymentDate(new Date().toISOString().split('T')[0])
      setNotes("")
      setFile(null)
    }, 3000)
  }

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <SuccessAnimation />
      </div>
    )
  }

  return (
    <>
      {isLoading && <LoadingOverlay message="Mengunggah bukti pembayaran..." />}
      
      <div className="space-y-6 w-full max-w-2xl mx-auto p-6">
        {/* Tenant Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Nama Penyewa</label>
          <select 
            className="w-full p-3 border rounded-lg bg-white"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          >
            <option value="">Pilih penyewa</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name} - Kamar {tenant.room?.room_number || "-"}
              </option>
            ))}
          </select>
        </div>

        {/* Room Price Display */}
        {selectedTenant?.room && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-gray-600">Harga kamar per bulan:</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">
              Rp {selectedTenant.room.price.toLocaleString("id-ID")}
            </p>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nominal Pembayaran</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg"
            placeholder="Contoh: 1500000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Payment Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tanggal Pembayaran</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-gray-500">
            Pilih tanggal saat Anda melakukan pembayaran
          </p>
        </div>

        {/* QR Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Kode QR Pembayaran</label>
          <div className="rounded-lg border-2 border-dashed bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border-2 shadow-md">
              <div className="text-center text-sm text-gray-500 p-4">
                <svg className="w-32 h-32 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                QR Code Pembayaran
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold">BNI : 0797356663</p>
              <p className="text-xs text-gray-500">a.n Liestia Arfianti</p>
            </div>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={() => alert('Download QR')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh QR Code
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Bukti Pembayaran</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-lg cursor-pointer"
          />
          {file && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>File terpilih: {file.name}</span>
            </div>
          )}
          <p className="text-xs text-gray-500">
            Format: JPG, PNG, WebP, atau PDF. Maksimal 5MB.
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Catatan (Opsional)</label>
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            placeholder="Catatan tambahan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Kirim Bukti Pembayaran
        </button>
      </div>
    </>
  )
}
