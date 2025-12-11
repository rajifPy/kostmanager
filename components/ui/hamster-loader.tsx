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
        <div 
          className="wheel-and-hamster"
          style={{ 
            fontSize: size === "xlarge" ? "24px" : size === "large" ? "20px" : "16px",
            width: "100%",
            height: "100%",
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
              {/* 🦵 KAKI DEPAN KANAN */}
              <div className="hamster__limb hamster__limb--fr" />
              {/* 🦵 KAKI DEPAN KIRI */}
              <div className="hamster__limb hamster__limb--fl" />
              {/* 🦵 KAKI BELAKANG KANAN */}
              <div className="hamster__limb hamster__limb--br" />
              {/* 🦵 KAKI BELAKANG KIRI */}
              <div className="hamster__limb hamster__limb--bl" />
              <div className="hamster__tail" />
            </div>
          </div>
          <div className="spoke" />
        </div>

        <style jsx>{`
          .wheel-and-hamster {
            --dur: 10s;
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

          .hamster__nose { 
            background: hsl(0,90%,75%);
            border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
            top: 0.75em; left: 0; width: 0.2em; height: 0.25em;
          }

          .hamster__body { 
            animation: hamsterBody var(--dur) ease-in-out infinite; 
            background: hsl(30,90%,90%);
            border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
            box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
              0.15em -0.5em 0 hsl(30,90%,80%) inset;
            top: 0.25em; left: 2em; width: 4.5em; height: 3em;
            transform-origin: 17% 50%;
            /* ❌ HAPUS: transform-style: preserve-3d */
          }

          /* 🦵 KAKI — SEMUA TANPA translateZ! */
          .hamster__limb {
            position: absolute;
            background: hsl(30,90%,85%);
          }

          .hamster__limb--fr {
            animation: hamsterFRLimb var(--dur) linear infinite;
            /* ✅ Gunakan layering 2D: z-index + top/left */
            z-index: 3;
            top: 1.8em;
            left: 1.8em;
            width: 0.8em;
            height: 1.2em;
            border-radius: 0.4em 0.4em 0 0;
            transform-origin: 50% 0;
            transform: rotate(20deg);
            background: linear-gradient(to bottom, hsl(30,90%,80%), hsl(0,90%,75%));
          }

          .hamster__limb--fl {
            animation: hamsterFLLimb var(--dur) linear infinite;
            z-index: 2; /* di belakang fr */
            top: 1.8em;
            left: 1.2em;
            width: 0.8em;
            height: 1.2em;
            border-radius: 0.4em 0.4em 0 0;
            transform-origin: 50% 0;
            transform: rotate(-10deg);
            background: linear-gradient(to bottom, hsl(30,90%,90%), hsl(0,90%,85%));
          }

          .hamster__limb--br {
            animation: hamsterBRLimb var(--dur) linear infinite;
            z-index: 3;
            top: 2.2em;
            left: 3.8em;
            width: 0.8em;
            height: 1.4em;
            border-radius: 0.4em 0.4em 0 0;
            transform-origin: 50% 20%;
            transform: rotate(-30deg);
            background: linear-gradient(to bottom, hsl(30,90%,80%), hsl(0,90%,75%));
          }

          .hamster__limb--bl {
            animation: hamsterBLLimb var(--dur) linear infinite;
            z-index: 2;
            top: 2.2em;
            left: 3.2em;
            width: 0.8em;
            height: 1.4em;
            border-radius: 0.4em 0.4em 0 0;
            transform-origin: 50% 20%;
            transform: rotate(-10deg);
            background: linear-gradient(to bottom, hsl(30,90%,90%), hsl(0,90%,85%));
          }

          .hamster__tail { 
            animation: hamsterTail var(--dur) linear infinite; 
            background: hsl(0,90%,85%);
            border-radius: 0.25em 50% 50% 0.25em;
            box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
            top: 1.8em; right: -0.2em; width: 0.8em; height: 0.4em;
            transform: rotate(25deg);
            transform-origin: 0.2em 0.2em;
          }

          .spoke { 
            animation: spoke 2.5s linear infinite;
            background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
              linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
          }

          /* === KEYFRAMES (diperbarui untuk kaki) === */
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

          /* 🦵 Animasi kaki — sekarang jelas terlihat! */
          @keyframes hamsterFRLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(45deg); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-25deg); }
          }
          @keyframes hamsterFLLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(-25deg); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(45deg); }
          }
          @keyframes hamsterBRLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(-50deg); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(15deg); }
          }
          @keyframes hamsterBLLimb { 
            from, 25%, 50%, 75%, to { transform: rotate(15deg); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-50deg); }
          }

          @keyframes hamsterTail { 
            from, 25%, 50%, 75%, to { transform: rotate(25deg); }
            12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(5deg); }
          }
          @keyframes spoke { 
            from { transform: rotate(0); }
            to { transform: rotate(-1turn); }
          }
        `}</style>
      </div>

      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center max-w-xs whitespace-pre-line">
        {message}
      </p>
    </div>
  );
}
