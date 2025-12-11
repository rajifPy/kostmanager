// components/ui/hamster-loader.tsx
"use client";

import { useEffect, useState, useRef } from "react";

export function HamsterLoader({ 
  size = "large", 
  message = "Mengirim permintaan booking...",
  showProgress = true,
  className = ""
}: { 
  size?: "small" | "medium" | "large" | "xlarge"; 
  message?: string;
  showProgress?: boolean;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Progress animation simulation
    if (showProgress) {
      let progress = 0;
      progressInterval.current = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 95) progress = 95;
        setProgressWidth(progress);
      }, 300);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [showProgress]);

  if (!isVisible) return null;

  // Responsive size classes based on screen
  const containerClass = `relative ${className} ${
    size === "xlarge" 
      ? "w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72" 
      : size === "large" 
      ? "w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-56 lg:h-56"
      : size === "medium"
      ? "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44"
      : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
  }`;

  // Responsive font size for message
  const messageSize = 
    size === "xlarge" ? "text-base sm:text-lg md:text-xl" :
    size === "large" ? "text-sm sm:text-base md:text-lg" :
    size === "medium" ? "text-xs sm:text-sm md:text-base" :
    "text-xs sm:text-sm";

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      {/* Hamster Wheel Container */}
      <div className={containerClass}>
        <div 
          className="wheel-and-hamster"
          style={{ 
            fontSize: size === "xlarge" ? "1.25em" : 
                     size === "large" ? "1em" : 
                     size === "medium" ? "0.875em" : "0.75em",
            width: "100%",
            height: "100%"
          }}
          aria-hidden="true"
          role="status"
          aria-label="Loading animation"
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

        {/* Inline CSS with responsive improvements */}
        <style jsx>{`
          .wheel-and-hamster {
            --dur: 1s;
            position: relative;
            display: block;
            margin: 0 auto;
          }
          
          .wheel, .hamster, .hamster div, .spoke { 
            position: absolute; 
          }
          
          .wheel, .spoke { 
            border-radius: 50%; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
          }
          
          .wheel { 
            background: radial-gradient(100% 100% at center, hsla(0,0%,60%,0) 47.8%, hsl(0,0%,60%) 48%); 
            z-index: 2; 
          }
          
          .hamster { 
            animation: hamster var(--dur) ease-in-out infinite; 
            top: 50%; 
            left: 50%; 
            width: 3.5em; 
            height: 1.875em; 
            transform: translate(-50%, -50%) rotate(4deg);
            transform-origin: 50% 0; 
            z-index: 1; 
          }
          
          .hamster__head { 
            animation: hamsterHead var(--dur) ease-in-out infinite; 
            background: hsl(30,90%,55%); 
            border-radius: 70% 30% 0 100% / 40% 25% 25% 60%; 
            box-shadow: 0 -0.125em 0 hsl(30,90%,80%) inset, 
                        0.375em -0.775em 0 hsl(30,90%,90%) inset; 
            top: 0; 
            left: -1em; 
            width: 1.375em; 
            height: 1.25em; 
            transform-origin: 100% 50%; 
          }
          
          .hamster__ear { 
            animation: hamsterEar var(--dur) ease-in-out infinite; 
            background: hsl(0,90%,85%); 
            border-radius: 50%; 
            box-shadow: -0.125em 0 hsl(30,90%,55%) inset; 
            top: -0.125em; 
            right: -0.125em; 
            width: 0.375em; 
            height: 0.375em; 
            transform-origin: 50% 75%; 
          }
          
          .hamster__eye { 
            animation: hamsterEye var(--dur) linear infinite; 
            background-color: hsl(0,0%,0%); 
            border-radius: 50%; 
            top: 0.1875em; 
            left: 0.625em; 
            width: 0.25em; 
            height: 0.25em; 
          }
          
          .hamster__nose { 
            background: hsl(0,90%,75%); 
            border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%; 
            top: 0.375em; 
            left: 0; 
            width: 0.1em; 
            height: 0.125em; 
          }
          
          .hamster__body { 
            animation: hamsterBody var(--dur) ease-in-out infinite; 
            background: hsl(30,90%,90%); 
            border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%; 
            box-shadow: 0.05em 0.375em 0 hsl(30,90%,55%) inset, 
                        0.075em -0.25em 0 hsl(30,90%,80%) inset; 
            top: 0.125em; 
            left: 1em; 
            width: 2.25em; 
            height: 1.5em; 
            transform-origin: 17% 50%; 
            transform-style: preserve-3d; 
          }
          
          .hamster__limb--fr, .hamster__limb--fl { 
            clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%); 
            top: 1em; 
            left: 0.25em; 
            width: 0.5em; 
            height: 0.75em; 
            transform-origin: 50% 0; 
          }
          
          .hamster__limb--fr { 
            animation: hamsterFRLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,80%) 80%, hsl(0,90%,75%) 80%); 
            transform: rotate(15deg) translateZ(-1px); 
          }
          
          .hamster__limb--fl { 
            animation: hamsterFLLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,90%) 80%, hsl(0,90%,85%) 80%); 
            transform: rotate(15deg); 
          }
          
          .hamster__limb--br, .hamster__limb--bl { 
            border-radius: 0.375em 0.375em 0 0; 
            clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%); 
            top: 0.5em; 
            left: 1.4em; 
            width: 0.75em; 
            height: 1.25em; 
            transform-origin: 50% 30%; 
          }
          
          .hamster__limb--br { 
            animation: hamsterBRLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,80%) 90%, hsl(0,90%,75%) 90%); 
            transform: rotate(-25deg) translateZ(-1px); 
          }
          
          .hamster__limb--bl { 
            animation: hamsterBLLimb var(--dur) linear infinite; 
            background: linear-gradient(hsl(30,90%,90%) 90%, hsl(0,90%,85%) 90%); 
            transform: rotate(-25deg); 
          }
          
          .hamster__tail { 
            animation: hamsterTail var(--dur) linear infinite; 
            background: hsl(0,90%,85%); 
            border-radius: 0.125em 50% 50% 0.125em; 
            box-shadow: 0 -0.1em 0 hsl(0,90%,75%) inset; 
            top: 0.75em; 
            right: -0.25em; 
            width: 0.5em; 
            height: 0.25em; 
            transform: rotate(30deg) translateZ(-1px); 
            transform-origin: 0.125em 0.125em; 
          }
          
          .spoke { 
            animation: spoke var(--dur) linear infinite; 
            background: radial-gradient(100% 100% at center, hsl(0,0%,60%) 4.8%, hsla(0,0%,60%,0) 5%), 
                        linear-gradient(hsla(0,0%,55%,0) 46.9%, hsl(0,0%,65%) 47% 52.9%, hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat; 
          }

          /* Animations */
          @keyframes hamster { 
            from, to { transform: translate(-50%, -50%) rotate(4deg); } 
            50% { transform: translate(-50%, -50%) rotate(0); } 
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
            to { transform: rotate(-1turn); } 
          }

          /* Mobile optimizations */
          @media (max-width: 640px) {
            .wheel-and-hamster {
              --dur: 1.2s; /* Slightly slower on mobile for better performance */
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .wheel-and-hamster,
            .wheel-and-hamster * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>

      {/* Message with responsive font sizes */}
      {message && (
        <p className={`${messageSize} font-medium text-gray-700 dark:text-gray-300 text-center max-w-xs sm:max-w-sm md:max-w-md transition-opacity duration-300`}>
          {message}
        </p>
      )}
      
      {/* Progress Bar - Responsive width */}
      {showProgress && (
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div className="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            {progressWidth < 100 ? `${Math.round(progressWidth)}%` : 'Hampir selesai!'}
          </p>
        </div>
      )}
    </div>
  );
}
