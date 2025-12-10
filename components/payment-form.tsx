import React, { useState, useEffect, useRef } from 'react';

// Typewriter Loading Component
const TypewriterLoader = () => {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'resetting'>('idle');
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timer, setTimer] = useState(15);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  
  const startSoundRef = useRef<HTMLAudioElement>(null);
  const stopSoundRef = useRef<HTMLAudioElement>(null);
  const successSoundRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize audio elements
  useEffect(() => {
    // Sound effect URLs
    const startSound = 'https://assets.mixkit.co/sfx/preview/mixkit-typewriter-loop-1121.mp3';
    const stopSound = 'https://assets.mixkit.co/sfx/preview/mixkit-completion-of-a-level-2063.mp3';
    const successSound = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
    
    startSoundRef.current = new Audio(startSound);
    stopSoundRef.current = new Audio(stopSound);
    successSoundRef.current = new Audio(successSound);
    
    if (startSoundRef.current) {
      startSoundRef.current.loop = true;
    }

    return () => {
      clearInterval(progressIntervalRef.current);
      [startSoundRef, stopSoundRef, successSoundRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file && status !== 'success') {
      alert('Pilih file terlebih dahulu!');
      return;
    }

    // Step 1: User klik "Kirim Bukti Pembayaran"
    setStatus('uploading');
    setProgress(0);
    setTimer(15);
    
    // Step 2: Sound effect MULAI diputar
    if (startSoundRef.current) {
      try {
        await startSoundRef.current.play();
      } catch (err) {
        console.log('Audio autoplay prevented:', err);
      }
    }

    // Step 3: Animasi typewriter loading (15 detik)
    let elapsed = 0;
    progressIntervalRef.current = setInterval(() => {
      elapsed += 0.1;
      const newProgress = (elapsed / 15) * 100;
      setProgress(newProgress);
      setTimer(15 - Math.floor(elapsed));

      if (elapsed >= 15) {
        clearInterval(progressIntervalRef.current);
        
        // Step 4: Upload selesai → Sound STOP
        if (startSoundRef.current) {
          startSoundRef.current.pause();
          startSoundRef.current.currentTime = 0;
        }
        
        if (stopSoundRef.current) {
          stopSoundRef.current.play();
        }
        
        // Step 5: Animasi sukses muncul
        setStatus('success');
        setShowSuccess(true);
        
        // Play success sound
        setTimeout(() => {
          if (successSoundRef.current) {
            successSoundRef.current.play();
          }
        }, 500);
        
        // Step 6: Form reset otomatis (5 detik)
        setTimeout(() => {
          setStatus('resetting');
          setTimeout(() => {
            setFile(null);
            setNote('');
            setProgress(0);
            setShowSuccess(false);
            setStatus('idle');
          }, 1000);
        }, 5000);
      }
    }, 100);
  };

  const handleCancel = () => {
    clearInterval(progressIntervalRef.current);
    setStatus('idle');
    setProgress(0);
    
    if (startSoundRef.current) {
      startSoundRef.current.pause();
      startSoundRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        /* Typewriter Animation */
        .typewriter {
          --blue: #5C86FF;
          --blue-dark: #275EFE;
          --key: #fff;
          --paper: #EEF0FD;
          --text: #D3D4EC;
          --tool: #FBC56C;
          --duration: 1s;
          position: relative;
          width: 180px;
          height: 120px;
          margin: 0 auto;
          animation: ${status === 'uploading' ? 'bounce05 var(--duration) linear infinite' : 'none'};
        }

        .typewriter:before {
          content: '';
          width: 60px;
          height: 10px;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.1);
          position: absolute;
          top: 66px;
          left: 50%;
          transform: translateX(-50%);
        }

        .typewriter .slide {
          width: 170px;
          height: 10px;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.13);
          position: absolute;
          top: 52px;
          left: 50%;
          transform: translateX(-50%);
        }

        .typewriter .slide:before,
        .typewriter .slide:after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--tool);
          position: absolute;
          top: 2px;
        }

        .typewriter .slide:before {
          left: 10px;
        }

        .typewriter .slide:after {
          right: 10px;
        }

        .typewriter .paper {
          width: 132px;
          height: 62px;
          background: var(--paper);
          border-radius: 1px;
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
          opacity: ${status === 'uploading' ? 1 : 0.6};
          transition: opacity 0.3s;
        }

        .typewriter .paper:before {
          content: '';
          width: 126px;
          height: 56px;
          background: linear-gradient(90deg, var(--paper) 0px, var(--paper) 40px, transparent 40px, transparent 44px, var(--paper) 44px, var(--paper) 48px, transparent 48px, transparent 52px, var(--paper) 52px, var(--paper) 56px, transparent 56px, transparent 60px, var(--paper) 60px, var(--paper) 100%);
          position: absolute;
          top: 3px;
          left: 3px;
        }

        .typewriter .paper .lines {
          width: 100%;
          height: 100%;
          opacity: ${status === 'uploading' ? 1 : 0};
          position: absolute;
          top: 0;
          left: 0;
          animation: ${status === 'uploading' ? 'lines05 3s linear infinite' : 'none'};
          transition: opacity 0.3s;
        }

        .typewriter .paper .lines:before,
        .typewriter .paper .lines:after {
          content: '';
          width: 2px;
          height: 100%;
          background: var(--text);
          position: absolute;
          top: 0;
          opacity: 0.8;
        }

        .typewriter .paper .lines:before {
          left: 40px;
        }

        .typewriter .paper .lines:after {
          right: 40px;
        }

        .typewriter .paper .lines div {
          width: 100%;
          height: 16px;
          border-bottom: 2px solid var(--text);
          position: absolute;
          left: 0;
          opacity: 0.3;
        }

        .typewriter .paper .lines div:nth-child(1) {
          top: 6px;
        }

        .typewriter .paper .lines div:nth-child(2) {
          top: 22px;
        }

        .typewriter .paper .lines div:nth-child(3) {
          top: 38px;
        }

        .typewriter .paper .text {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          line-height: 16px;
          color: var(--blue-dark);
          position: absolute;
          top: 6px;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 0 42px;
          opacity: ${status === 'uploading' ? 1 : 0};
          animation: ${status === 'uploading' ? 'text05 3s linear infinite' : 'none'};
          transition: opacity 0.3s;
        }

        .typewriter .paper .text p {
          margin: 0;
        }

        .typewriter .keyboard {
          width: 144px;
          height: 28px;
          background: linear-gradient(90deg, var(--blue) 0%, var(--blue) 25%, var(--blue-dark) 25%, var(--blue-dark) 100%);
          border-radius: 3px;
          position: absolute;
          top: 82px;
          left: 50%;
          transform: translateX(-50%);
          opacity: ${status === 'uploading' ? 1 : 0.6};
          transition: opacity 0.3s;
        }

        .typewriter .keyboard:before {
          content: '';
          width: 140px;
          height: 6px;
          background: var(--key);
          border-radius: 2px;
          position: absolute;
          top: -4px;
          left: 2px;
        }

        .typewriter .keyboard .key {
          width: 10px;
          height: 10px;
          background: var(--key);
          border-radius: 2px;
          position: absolute;
          top: 8px;
        }

        .typewriter .keyboard .key:nth-child(1) { left: 14px; }
        .typewriter .keyboard .key:nth-child(2) { left: 32px; }
        .typewriter .keyboard .key:nth-child(3) { 
          left: 50px; 
          animation: ${status === 'uploading' ? 'key05_1 1s linear infinite' : 'none'};
        }
        .typewriter .keyboard .key:nth-child(4) { left: 68px; }
        .typewriter .keyboard .key:nth-child(5) { 
          left: 86px; 
          animation: ${status === 'uploading' ? 'key05_2 1.5s linear infinite' : 'none'};
        }
        .typewriter .keyboard .key:nth-child(6) { left: 104px; }
        .typewriter .keyboard .key:nth-child(7) { 
          left: 122px; 
          animation: ${status === 'uploading' ? 'key05_3 2s linear infinite' : 'none'};
        }

        /* Animations */
        @keyframes bounce05 {
          75% { transform: translateY(0); }
          80% { transform: translateY(-4px); }
          90% { transform: translateY(2px); }
          95% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }

        @keyframes lines05 {
          0%, 20% { opacity: 0; }
          25% { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes text05 {
          0%, 20% { opacity: 0; }
          25% { opacity: 1; }
          95% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes key05_1 {
          0%, 5% { transform: translateY(0); }
          10% { transform: translateY(4px); }
          15%, 100% { transform: translateY(0); }
        }

        @keyframes key05_2 {
          0%, 25% { transform: translateY(0); }
          30% { transform: translateY(4px); }
          35%, 100% { transform: translateY(0); }
        }

        @keyframes key05_3 {
          0%, 45% { transform: translateY(0); }
          50% { transform: translateY(4px); }
          55%, 100% { transform: translateY(0); }
        }

        /* Confetti Animation */
        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
        }

        .confetti {
          position: fixed;
          width: 15px;
          height: 15px;
          background: #ff0000;
          top: -20px;
          opacity: 0;
        }

        /* Progress Bar */
        .progress-container {
          width: 100%;
          max-width: 400px;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin: 20px auto;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #5C86FF, #275EFE);
          border-radius: 4px;
          transition: width 0.3s ease;
          width: ${progress}%;
        }

        /* Success Animation */
        .success-checkmark {
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }

        .check-icon {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 50%;
          box-sizing: content-box;
          border: 4px solid #10B981;
        }

        .check-icon::before {
          top: 3px;
          left: -2px;
          width: 30px;
          transform-origin: 100% 50%;
          border-radius: 100px 0 0 100px;
        }

        .check-icon::after {
          top: 0;
          left: 30px;
          width: 60px;
          transform-origin: 0 50%;
          border-radius: 0 100px 100px 0;
          animation: rotate-circle 4.25s ease-in;
        }

        .check-icon .icon-line {
          height: 5px;
          background-color: #10B981;
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
        }

        .check-icon .icon-line.line-tip {
          top: 46px;
          left: 14px;
          width: 25px;
          transform: rotate(45deg);
          animation: icon-line-tip 0.75s;
        }

        .check-icon .icon-line.line-long {
          top: 38px;
          right: 8px;
          width: 47px;
          transform: rotate(-45deg);
          animation: icon-line-long 0.75s;
        }

        @keyframes rotate-circle {
          0% { transform: rotate(-45deg); }
          5% { transform: rotate(-45deg); }
          12% { transform: rotate(-405deg); }
          100% { transform: rotate(-405deg); }
        }

        @keyframes icon-line-tip {
          0% { width: 0; left: 1px; top: 19px; }
          54% { width: 0; left: 1px; top: 19px; }
          70% { width: 50px; left: -8px; top: 37px; }
          84% { width: 17px; left: 21px; top: 48px; }
          100% { width: 25px; left: 14px; top: 45px; }
        }

        @keyframes icon-line-long {
          0% { width: 0; right: 46px; top: 54px; }
          65% { width: 0; right: 46px; top: 54px; }
          84% { width: 55px; right: 0px; top: 35px; }
          100% { width: 47px; right: 8px; top: 38px; }
        }

        /* Reset Animation */
        .reset-animation {
          animation: resetScale 1s ease;
        }

        @keyframes resetScale {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />

      {/* Confetti Effect */}
      {showSuccess && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={i}
              className="confetti absolute"
              style={{
                left: `${Math.random() * 100}vw`,
                background: `hsl(${Math.random() * 360}, 100%, 60%)`,
                animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
                width: `${10 + Math.random() * 10}px`,
                height: `${10 + Math.random() * 10}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Kirim Bukti Pembayaran
          </h1>
          <p className="text-gray-600">
            Upload bukti pembayaran untuk memproses transaksi Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className={`bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 ${
            status === 'resetting' ? 'reset-animation' : ''
          }`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Form Upload</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Bukti Pembayaran
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {file ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600 mb-2">Format: JPG, PNG, PDF (max 5MB)</p>
                    </>
                  )}
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    disabled={status === 'uploading' || status === 'success'}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-block px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                      status === 'uploading' || status === 'success'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {file ? 'Ganti File' : 'Pilih File'}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  rows={3}
                  placeholder="Tambahkan catatan jika perlu..."
                  disabled={status === 'uploading' || status === 'success'}
                />
              </div>

              <div className="pt-4">
                {status === 'idle' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!file}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      file
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {file ? '📤 Kirim Bukti Pembayaran' : 'Pilih file terlebih dahulu'}
                  </button>
                ) : status === 'uploading' ? (
                  <button
                    onClick={handleCancel}
                    className="w-full py-4 bg-red-500 text-white rounded-xl font-semibold text-lg hover:bg-red-600 active:scale-95 transition-all"
                  >
                    ⏹️ Batalkan Upload ({timer}s)
                  </button>
                ) : status === 'success' ? (
                  <div className="text-center py-4">
                    <div className="text-green-600 font-semibold">
                      ✅ Upload Berhasil!
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Form akan reset dalam {status === 'success' ? '5' : '0'} detik...
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Status & Animation */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Upload</h2>
            
            {/* Typewriter Animation */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="typewriter mb-6">
                <div className="slide"></div>
                <div className="paper">
                  <div className="lines">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div className="text">
                    <p>{status === 'uploading' ? 'Uploading...' : 'Ready to upload'}</p>
                    <p>Please wait {timer}s</p>
                    <p>Do not close</p>
                  </div>
                </div>
                <div className="keyboard">
                  <div className="key"></div>
                  <div className="key"></div>
                  <div className="key"></div>
                  <div className="key"></div>
                  <div className="key"></div>
                  <div className="key"></div>
                  <div className="key"></div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-container mb-6">
                <div className="progress-bar"></div>
              </div>

              {/* Status Indicator */}
              <div className="flex justify-between w-full max-w-md mb-8 px-4">
                {['idle', 'uploading', 'success', 'resetting'].map((s, i) => (
                  <div key={s} className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mb-2 ${
                      status === s 
                        ? 'bg-blue-600 scale-125' 
                        : i <= ['idle', 'uploading', 'success', 'resetting'].indexOf(status)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    } transition-all`} />
                    <span className="text-xs font-medium text-gray-600 capitalize">{s}</span>
                  </div>
                ))}
              </div>

              {/* Success Checkmark */}
              {showSuccess && (
                <div className="success-checkmark my-6">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
              )}

              {/* Status Text */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {status === 'idle' && '📁 Siap Upload'}
                  {status === 'uploading' && `⏳ Mengupload... ${progress.toFixed(1)}%`}
                  {status === 'success' && '✅ Upload Berhasil!'}
                  {status === 'resetting' && '🔄 Reset Form...'}
                </div>
                <p className="text-gray-600">
                  {status === 'idle' && 'Klik tombol "Kirim" untuk memulai'}
                  {status === 'uploading' && 'File sedang diproses, harap tunggu...'}
                  {status === 'success' && 'Bukti pembayaran berhasil dikirim!'}
                  {status === 'resetting' && 'Mereset form untuk upload baru...'}
                </p>
              </div>
            </div>

            {/* Sound Status */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sound Effects:</span>
                <div className="flex space-x-2">
                  <div className={`w-3 h-3 rounded-full ${status === 'uploading' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${status === 'resetting' ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Sound akan aktif selama proses upload
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Proses upload membutuhkan waktu 15 detik. Pastikan koneksi internet stabil.</p>
          <p className="mt-1">Setelah berhasil, sistem akan otomatis reset dalam 5 detik.</p>
        </div>
      </div>
    </div>
  );
};

export default TypewriterLoader;
