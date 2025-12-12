'use client';

import React from 'react';
import styled from 'styled-components';

const WhatsAppShare = () => {
  const shareUrl = 'https://kostmanagerv1.vercel.app';
  const shareMessage = `Halo! Cek kost nyaman dan strategis ini: ${shareUrl}

Fasilitas lengkap:
✅ WiFi Gratis 24 Jam
✅ Keamanan CCTV & Satpam
✅ Parkir Luas
✅ Dapur Bersama

Yuk booking sekarang!`;

  const handleShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StyledWrapper>
      <div className="share-container">
        <div className="button-content" onClick={handleShare}>
          <span className="text">Bagikan ke Teman</span>
          <svg 
            className="whatsapp-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width={28} 
            height={28}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Container Styles */
  .share-container {
    display: inline-block;
    font-family: "Arial", sans-serif;
  }

  /* Button Styles */
  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #25D366, #128C7E);
    color: white;
    padding: 16px 32px;
    border-radius: 50px;
    cursor: pointer;
    transition:
      background 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
      transform 0.3s ease,
      box-shadow 0.4s ease;
    box-shadow: 0 8px 15px rgba(37, 211, 102, 0.3);
    position: relative;
    overflow: hidden;
    border: none;
  }

  .button-content::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(37, 211, 102, 0.4),
      rgba(18, 140, 126, 0.4)
    );
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: -1;
  }

  .button-content::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: scale(0);
    transition: transform 0.6s ease-out;
    z-index: -1;
  }

  .button-content:hover::before {
    opacity: 1;
  }

  .button-content:hover::after {
    transform: scale(1);
  }

  .button-content:hover {
    background: linear-gradient(135deg, #128C7E, #25D366);
    box-shadow: 0 12px 24px rgba(37, 211, 102, 0.4);
    transform: translateY(-4px) scale(1.03);
  }

  .button-content:active {
    transform: translateY(-2px) scale(0.98);
    box-shadow: 0 5px 10px rgba(37, 211, 102, 0.25);
  }

  .text {
    font-size: 18px;
    font-weight: 600;
    margin-right: 12px;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: letter-spacing 0.3s ease;
  }

  .button-content:hover .text {
    letter-spacing: 1px;
  }

  .whatsapp-icon {
    fill: white;
    transition:
      transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      fill 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  .button-content:hover .whatsapp-icon {
    transform: rotate(20deg) scale(1.15);
    animation: shake 0.5s ease-in-out;
  }

  /* Animation for Pulse Effect */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(37, 211, 102, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
    }
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0deg) scale(1.15); }
    25% { transform: rotate(15deg) scale(1.15); }
    75% { transform: rotate(-15deg) scale(1.15); }
  }

  .button-content {
    animation: pulse 3s infinite;
  }

  /* Hover Ripple Effect */
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  .button-content:active::before {
    animation: ripple 0.6s linear;
  }

  /* Accessibility */
  .button-content:focus {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(37, 211, 102, 0.5),
      0 8px 15px rgba(37, 211, 102, 0.3);
  }

  .button-content:focus:not(:focus-visible) {
    box-shadow: 0 8px 15px rgba(37, 211, 102, 0.3);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .button-content {
      padding: 14px 28px;
      border-radius: 40px;
    }

    .text {
      font-size: 16px;
    }

    .whatsapp-icon {
      width: 24px;
      height: 24px;
    }
  }

  @media (max-width: 480px) {
    .button-content {
      padding: 12px 24px;
    }

    .text {
      font-size: 15px;
      margin-right: 8px;
    }

    .whatsapp-icon {
      width: 22px;
      height: 22px;
    }
  }

  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .button-content {
      box-shadow: 0 8px 15px rgba(37, 211, 102, 0.4);
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .button-content,
    .whatsapp-icon {
      transition: none;
      animation: none;
    }
  }
`;

export default WhatsAppShare;
