// components/ui/hamster-loader.tsx
"use client";

import { useEffect, useState } from "react";

export function HamsterLoader({ 
  size = "large", 
  message = "Mengirim permintaan booking..." 
}: { 
  size?: "medium" | "large" | "xlarge"; 
  message?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  const containerClass = 
    size === "xlarge" 
      ? "w-64 h-64 sm:w-80 sm:h-80" 
      : size === "large" 
      ? "w-48 h-48 sm:w-64 sm:h-64" 
      : "w-40 h-40 sm:w-48 sm:h-48";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${containerClass}`}>
        {/* 🔁 Perubahan utama: --dur = 10s */}
        <div 
          className="wheel-and-hamster"
          style={{ 
            fontSize: size === "xlarge" ? "24px" : size === "large" ? "20px" : "16px",
            width: "100%",
            height: "100%",
            // Set durasi utama jadi 10 detik
            '--dur': '10s'
          } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="wheel" />
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear" />
                <div className="hamster__eye" />
                <div className="hamster__nose" />
              </div>
              <div className="hamster__limb hamster__limb--fr" />
              <div className="hamster__limb hamster__limb--fl" />
              <div className="hamster__limb hamster__limb--br" />
              <div className="hamster__limb hamster__limb--bl" />
              <div className="hamster__tail" />
            </div>
          </div>
          <div className="spoke" />
        </div>

        <style jsx>{`
          .wheel-and-hamster {
            --dur: 10s; /* ⏱️ Diperpanjang jadi 10 detik */
            position: relative;
            display: block;
          }

          .wheel, .hamster, .hamster div, .spoke { 
            position: absolute; 
          }

          .wheel, .spoke { 
            border-radius: 50%; top: 0; left: 0; width: 100%; height: 100%; 
          }

          .wheel { 
            background: radial-gradient(100% 100% at center, hsla(0,0%,60%,0) 47.8%, hsl(0,0%,60%) 48%);
            z-index: 2; 
          }

          /* 🐹 Semua gerakan hamster jadi 10x lebih lambat */
          .hamster { 
            animation: hamster var(--dur) ease-in-out infinite; 
            top: 50%; 
            left: calc(50% - 3.5em); 
            width: 7em; 
            height: 3.75em; 
            transform: rotate(4deg) translate(-0.8em, 1.85em); 
            transform-origin: 50% 0; 
            z-index: 1; 
          }

          .hamster__head { 
            animation: hamsterHead var(--dur) ease-in-out infinite; 
            background: hsl(30,90%,55%);
            border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
            box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
              0.75em -1.55em 0 hsl(30,90%,90%) inset;
            top: 0; left: -2em; width: 2.75em; height: 2.5em;
            transform-origin: 100% 50%;
          }

          .hamster__ear { 
            animation: hamsterEar var(--dur) ease-in-out infinite; 
            background: hsl(0,90%,85%);
            border-radius: 50%;
            box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
            top: -0.25em; right: -0.25em; width: 0.75em; height: 0.75em;
            transform-origin: 50% 75%;
          }

          .hamster__eye { 
            animation: hamsterEye var(--dur) linear infinite; 
            background-color: hsl(0,0%,0%);
            border-radius: 50%;
            top: 0.375em; left: 1.25em; width: 0.5em; height: 0.5em;
          }

          .hamster__body { 
            animation: hamsterBody var(--dur) ease-in-out infinite; 
            background: hsl(30,90%,90%);
            border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
            box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
              0.15em -0.5em 0 hsl(30,90%,80%) inset;
            top: 0.25em; left: 2em; width: 4.5em; height: 3em;
            transform-origin: 17% 50%;
            transform-style: preserve-3d;
          }

          .hamster__limb--fr { 
            animation: hamsterFRLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
            transform: rotate(15deg) translateZ(-1px);
          }

          .hamster__limb--fl { 
            animation: hamsterFLLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
            transform: rotate(15deg);
          }

          .hamster__limb--br { 
            animation: hamsterBRLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
            transform: rotate(-25deg) translateZ(-1px);
          }

          .hamster__limb--bl { 
            animation: hamsterBLLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
            transform: rotate(-25deg);
          }

          .hamster__tail { 
            animation: hamsterTail var(--dur) linear infinite; 
            background: hsl(0,90%,85%);
            border-radius: 0.25em 50% 50% 0.25em;
            box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
            top: 1.5em; right: -0.5em; width: 1em; height: 0.5em;
            transform: rotate(30deg) translateZ(-1px);
            transform-origin: 0.25em 0.25em;
          }

          /* 🔁 RODA: tetap cepat! 2.5 detik per putaran (lebih realistis) */
          .spoke { 
            animation: spoke 2.5s linear infinite; /* ⚙️ Tetap cepat biar nggak 'mandek' */
            background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
              linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
          }

          /* === KEYFRAMES (tanpa perubahan logika, hanya durasi diperpanjang) === */
          @keyframes hamster { 
            from, to { transform: rotate(4deg) translate(-0.8em,1.85em); }
            50% { transform: rotate(0) translate(-0.8em,1.85em); }
          }

          @keyframes hamsterHead { 
            from, 25%, 50%, 75%, to { transform: rotate(0); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(8deg); }
          }

          @keyframes hamsterEye { 
            from, 90%, to { transform: scaleY(1); }
            95% { transform: scaleY(0); }
          }

          @keyframes hamsterEar { 
            from, 25%, 50%, 75%, to { transform: rotate(0); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(12deg); }
          }

          @keyframes hamsterBody { 
            from, 25%, 50%, 75%, to { transform: rotate(0); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-2deg); }
          }

          @keyframes hamsterFRLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(50deg) translateZ(-1px); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-30deg) translateZ(-1px); }
          }

          @keyframes hamsterFLLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(-30deg); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(50deg); }
          }

          @keyframes hamsterBRLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(-60deg) translateZ(-1px); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(20deg) translateZ(-1px); }
          }

          @keyframes hamsterBLLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(20deg); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-60deg); }
          }

          @keyframes hamsterTail { 
            from, 25%, 50%, 75%, to { transform: rotate(30deg) translateZ(-1px); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(10deg) translateZ(-1px); }
          }

          @keyframes spoke { 
            from { transform: rotate(0); }
            to { transform: rotate(-1turn); } /* 1 putaran penuh dalam 2.5 detik */
          }
        `}</style>
      </div>

      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center max-w-xs whitespace-pre-line">
        {message}
      </p>

      {/* Optional: Progress bar 10 detik */}
      <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{
            width: '100%',
            animation: 'progress10s 10s linear forwards',
          }}
        />
        <style jsx>{`
          @keyframes progress10s {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
