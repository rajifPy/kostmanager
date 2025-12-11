// components/ui/truck-loader.tsx
"use client";

import { useEffect, useState } from "react";

export function TruckLoader({ 
  message = "Mengirim permintaan booking..."
}: { 
  message?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 w-full max-w-xs">
      {/* Kontainer utama — responsif lebar */}
      <div className="relative w-full aspect-[3/1] max-w-[320px]">
        {/* Badan truk — skala otomatis */}
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="truck-body w-[85%] animate-motion">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 198 93"
              className="w-full h-auto"
            >
              <path
                strokeWidth={2.5}
                stroke="#282828"
                fill="#F83D3D"
                d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
              />
              <path
                strokeWidth={2.5}
                stroke="#282828"
                fill="#7D7C7C"
                d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
              />
              <path
                strokeWidth={1.5}
                stroke="#282828"
                fill="#282828"
                d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
              />
              <rect
                strokeWidth={1.5}
                stroke="#282828"
                fill="#FFFCAB"
                rx={0.8}
                height={5.6}
                width={4}
                y={63}
                x={187}
              />
              <rect
                strokeWidth={1.5}
                stroke="#282828"
                fill="#282828"
                rx={0.8}
                height={8.8}
                width={3.2}
                y={81}
                x={193}
              />
              <rect
                strokeWidth={2.5}
                stroke="#282828"
                fill="#DFDFDF"
                rx="2"
                height={72}
                width={96.8}
                y="1.5"
                x="6.5"
              />
              <rect
                strokeWidth={1.5}
                stroke="#282828"
                fill="#DFDFDF"
                rx={1.6}
                height={3.2}
                width={4.8}
                y={84}
                x={1}
              />
            </svg>
          </div>
        </div>

        {/* Ban — posisi fleksibel */}
        <div className="absolute bottom-0 w-full flex justify-between px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 30 30"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <circle
              strokeWidth={2.5}
              stroke="#282828"
              fill="#282828"
              r="13.5"
              cy={15}
              cx={15}
            />
            <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 30 30"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <circle
              strokeWidth={2.5}
              stroke="#282828"
              fill="#282828"
              r="13.5"
              cy={15}
              cx={15}
            />
            <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
          </svg>
        </div>

        {/* Jalan — 100% lebar, proporsional */}
        <div className="absolute bottom-0 w-full h-1 bg-gray-800 rounded">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {/* Garis putus-putus responsif */}
            <div 
              className="absolute h-full bg-white"
              style={{
                width: '12%',
                left: '100%',
                animation: 'road 10s linear infinite',
              }}
            />
            <div 
              className="absolute h-full bg-white"
              style={{
                width: '6%',
                left: '120%',
                animation: 'road 10s linear infinite 0.7s',
              }}
            />
          </div>
        </div>

        {/* Tiang lampu — responsif posisi */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-12 sm:w-8 sm:h-16"
          style={{
            animation: 'road 10s linear infinite',
          }}
        >
          <svg
            viewBox="0 0 100 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              fill="#282828"
              d="M50 0v10a2 2 0 1 0 4 0V5l10 20v165a5 5 0 0 1-5 5H46a5 5 0 0 1-5-5V25L50 5z"
            />
            <circle cx="52" cy="25" r="3" fill="#FFD700" />
          </svg>
        </div>
      </div>

      <p className="text-center text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
        {message}
      </p>

      {/* Animasi responsif */}
      <style jsx>{`
        @keyframes motion {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }

        @keyframes road {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .truck-body {
          animation: motion 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
