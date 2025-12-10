"use client"

import React from 'react'

interface GalleryCardProps {
  image: string
  title: string
}

export function GalleryCard({ image, title }: GalleryCardProps) {
  return (
    <div className="gallery-card-wrapper h-[280px]">
      <style jsx>{`
        .gallery-card {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 500ms;
          cursor: pointer;
          position: relative;
        }

        .gallery-card-wrapper:hover .gallery-card {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .card-front {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .card-back {
          transform: rotateY(180deg);
          background: #1a1a1a;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          position: relative;
        }

        .card-back::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #ff9966, #ff5e62, #ff9966, #ff5e62);
          animation: rotate-gradient 4s linear infinite;
          z-index: -1;
        }

        .card-back::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: #1a1a1a;
          border-radius: 10px;
          z-index: 0;
        }

        @keyframes rotate-gradient {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        .card-image-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .floating-circles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: float 3s ease-in-out infinite;
          opacity: 0.6;
        }

        .circle-1 {
          width: 120px;
          height: 120px;
          background: rgba(255, 187, 102, 0.8);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 180px;
          height: 180px;
          background: rgba(255, 136, 102, 0.8);
          bottom: 10%;
          left: 30%;
          animation-delay: -1s;
        }

        .circle-3 {
          width: 90px;
          height: 90px;
          background: rgba(255, 34, 51, 0.8);
          top: 15%;
          right: 15%;
          animation-delay: -2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon-container {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 12px;
          border-radius: 10px;
        }

        .icon {
          width: 32px;
          height: 32px;
          color: white;
        }

        .card-title {
          color: white;
          font-size: 18px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .back-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 30px;
        }

        .back-icon {
          width: 60px;
          height: 60px;
          color: white;
          margin-bottom: 20px;
        }

        .back-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 10px;
          color: white;
        }

        .back-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }
      `}</style>

      <div className="gallery-card">
        {/* Front Side */}
        <div className="card-front">
          <div className="card-image-container">
            <img 
              src={image || "/placeholder.svg"}
              alt={title}
              className="card-image"
            />
            <div className="floating-circles">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
            </div>
            <div className="card-overlay">
              <div className="icon-container">
                <svg 
                  className="icon"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div className="card-title">{title}</div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="card-back">
          <div className="back-content">
            <div className="back-title">Peraturan kost</div>
            <div className="back-description">
              <p>1. Tidak boleh membawa lawan jenis kedalam Kamar</p>
              <p>2. Dilarang Gay</p>
              <p>3. Tidak boleh membuang sampah sembarangan</p>
              <p>4. Hargai Sesama teman/tetangga Kost</p>
              <p>5. Dilarang menyetel musik atau berisik di tengah malam</p>
              <p>6. Jangan lupa Makan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}



