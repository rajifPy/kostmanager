import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';

// Sound effect URLs (gunakan path sesuai project Anda)
const SOUND_EFFECTS = {
  start: 'https://assets.mixkit.co/sfx/preview/mixkit-typewriter-loop-1121.mp3',
  stop: 'https://assets.mixkit.co/sfx/preview/mixkit-completion-of-a-level-2063.mp3',
  success: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'
};

// Typewriter Loading Component
const TypewriterLoader = ({ duration = 15, onComplete, isActive = false }) => {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(isActive);
  const [isUploading, setIsUploading] = useState(false);
  
  const startAudioRef = useRef(null);
  const stopAudioRef = useRef(null);
  const successAudioRef = useRef(null);

  useEffect(() => {
    // Inisialisasi audio elements
    startAudioRef.current = new Audio(SOUND_EFFECTS.start);
    stopAudioRef.current = new Audio(SOUND_EFFECTS.stop);
    successAudioRef.current = new Audio(SOUND_EFFECTS.success);
    
    startAudioRef.current.loop = true;
    
    return () => {
      // Cleanup audio
      [startAudioRef, stopAudioRef, successAudioRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!isRunning || !isUploading) return;

    let interval;
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    // Play start sound
    if (startAudioRef.current) {
      startAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Update progress setiap 100ms
    interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const remaining = endTime - currentTime;
      const newProgress = (elapsed / (duration * 1000)) * 100;

      setProgress(newProgress);

      // Jika selesai
      if (remaining <= 0) {
        clearInterval(interval);
        setIsRunning(false);
        setIsUploading(false);
        
        // Stop start sound
        if (startAudioRef.current) {
          startAudioRef.current.pause();
          startAudioRef.current.currentTime = 0;
        }
        
        // Play stop sound
        if (stopAudioRef.current) {
          stopAudioRef.current.play();
        }
        
        if (onComplete) onComplete();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (startAudioRef.current) {
        startAudioRef.current.pause();
        startAudioRef.current.currentTime = 0;
      }
    };
  }, [isRunning, isUploading, duration, onComplete]);

  const handleStartUpload = () => {
    setIsRunning(true);
    setIsUploading(true);
    setProgress(0);
  };

  const handleCancelUpload = () => {
    setIsRunning(false);
    setIsUploading(false);
    if (startAudioRef.current) {
      startAudioRef.current.pause();
      startAudioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        .typewriter {
          --blue: #5C86FF;
          --blue-dark: #275EFE;
          --key: #fff;
          --paper: #EEF0FD;
          --text: #D3D4EC;
          --tool: #FBC56C;
          --duration: 15s;
          position: relative;
          animation: bounce05 var(--duration) linear infinite;
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
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          animation: lines05 var(--duration) linear infinite;
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
          opacity: 0;
          animation: text05 var(--duration) linear infinite;
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

        .typewriter .keyboard .key:nth-child(1) {
          left: 14px;
        }

        .typewriter .keyboard .key:nth-child(2) {
          left: 32px;
        }

        .typewriter .keyboard .key:nth-child(3) {
          left: 50px;
          animation: key05_1 var(--duration) linear infinite;
        }

        .typewriter .keyboard .key:nth-child(4) {
          left: 68px;
        }

        .typewriter .keyboard .key:nth-child(5) {
          left: 86px;
          animation: key05_2 var(--duration) linear infinite;
        }

        .typewriter .keyboard .key:nth-child(6) {
          left: 104px;
        }

        .typewriter .keyboard .key:nth-child(7) {
          left: 122px;
          animation: key05_3 var(--duration) linear infinite;
        }

        @keyframes bounce05 {
          75% {
            transform: translateY(0);
          }

          80% {
            transform: translateY(-4px);
          }

          90% {
            transform: translateY(2px);
          }

          95% {
            transform: translateY(-2px);
          }

          100% {
            transform: translateY(0);
          }
        }

        @keyframes lines05 {
          0%, 20% {
            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          100% {
            opacity: 1;
          }
        }

        @keyframes text05 {
          0%, 20% {
            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          95% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes key05_1 {
          0%, 5% {
            transform: translateY(0);
          }

          10% {
            transform: translateY(4px);
          }

          15%, 100% {
            transform: translateY(0);
          }
        }

        @keyframes key05_2 {
          0%, 25% {
            transform: translateY(0);
          }

          30% {
            transform: translateY(4px);
          }

          35%, 100% {
            transform: translateY(0);
          }
        }

        @keyframes key05_3 {
          0%, 45% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(4px);
          }

          55%, 100% {
            transform: translateY(0);
          }
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: 30px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #5C86FF, #275EFE);
          border-radius: 4px;
          transition: width 0.1s linear;
        }

        .upload-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          margin-top: 20px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .upload-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .cancel-button {
          background: #ef4444;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          margin-top: 12px;
        }

        .cancel-button:hover {
          background: #dc2626;
        }

        .success-message {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          font-weight: 600;
          margin-top: 30px;
          text-align: center;
          animation: fadeIn 0.5s ease;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .status-text {
          font-family: 'Space Mono', monospace;
          margin-top: 15px;
          color: #4b5563;
          font-size: 14px;
          text-align: center;
        }

        .timer {
          font-family: 'Space Mono', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #275EFE;
          margin-top: 15px;
          background: #f3f4f6;
          padding: 8px 16px;
          border-radius: 8px;
        }
      `}} />

      {/* Upload Form */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Kirim Bukti Pembayaran</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2">Drag & drop file di sini</p>
                <p className="text-sm">atau</p>
              </div>
              <button 
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Pilih File
              </button>
              <input 
                id="fileInput"
                type="file" 
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Tambahkan catatan jika perlu..."
            />
          </div>
        </div>
      </div>

      {/* Typewriter Animation */}
      <div className="relative">
        {isUploading && (
          <div className="timer">
            {Math.max(0, duration - Math.floor(progress * duration / 100))}s
          </div>
        )}
        
        <div className={`typewriter ${isUploading ? '' : 'opacity-50'}`}>
          <div className="slide"></div>
          <div className="paper">
            <div className="lines">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="text">
              <p>Upload in progress...</p>
              <p>Please wait patiently</p>
              <p>Do not close this window</p>
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
        
        {isUploading && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <div className="status-text">
          {isUploading 
            ? `Mengunggah... ${progress.toFixed(1)}%`
            : isRunning 
              ? 'Menyiapkan upload...'
              : 'Siap mengunggah file'
          }
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col items-center space-y-3 mt-6">
        {!isUploading ? (
          <button 
            className="upload-button"
            onClick={handleStartUpload}
            disabled={isRunning}
          >
            {isRunning ? 'Memulai...' : 'Kirim Bukti Pembayaran'}
          </button>
        ) : (
          <button 
            className="cancel-button"
            onClick={handleCancelUpload}
          >
            Batalkan Upload
          </button>
        )}
      </div>

      {/* Success Message (akan muncul dari parent) */}
    </div>
  );
};

// Main Component yang mengatur alur lengkap
const UploadPaymentProof = () => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'reset'
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successAudioRef = useRef(null);

  useEffect(() => {
    // Inisialisasi audio sukses
    successAudioRef.current = new Audio(SOUND_EFFECTS.success);
  }, []);

  const handleUploadComplete = () => {
    // Step 4: Upload selesai → Sound STOP (sudah di TypewriterLoader)
    // Step 5: Animasi sukses dengan confetti
    setUploadStatus('success');
    setShowConfetti(true);
    setShowSuccess(true);
    
    // Play success sound
    if (successAudioRef.current) {
      successAudioRef.current.play();
    }
    
    // Step 6: Form reset otomatis setelah 5 detik
    setTimeout(() => {
      setShowConfetti(false);
      setShowSuccess(false);
      setUploadStatus('idle');
      // Reset form bisa ditambahkan di sini
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Online</h1>
      <p className="text-gray-600 mb-8">Upload bukti pembayaran Anda dengan aman</p>
      
      <TypewriterLoader 
        duration={15}
        onComplete={handleUploadComplete}
        isActive={uploadStatus === 'uploading'}
      />
      
      {showSuccess && (
        <div className="success-message animate-fadeIn">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xl">Upload Berhasil!</span>
          </div>
          <p>Bukti pembayaran telah diterima. Form akan reset dalam 5 detik...</p>
        </div>
      )}
      
      {/* Status Indicator */}
      <div className="mt-8 flex items-center space-x-6">
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${uploadStatus !== 'idle' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm mt-1 text-gray-600">Upload</span>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${uploadStatus === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm mt-1 text-gray-600">Verifikasi</span>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${uploadStatus === 'reset' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm mt-1 text-gray-600">Selesai</span>
        </div>
      </div>
    </div>
  );
};

export default UploadPaymentProof;
