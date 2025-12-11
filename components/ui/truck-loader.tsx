"use client";

import { useEffect, useState, useRef, useMemo } from "react";

export function TruckLoader({ 
  size = "large", 
  message = "Mengirim permintaan booking...",
  showProgress = true,
  className = "",
  speed = 1,
  fullScreen = false,
  roadLength = "medium",
}: { 
  size?: "tiny" | "small" | "medium" | "large" | "xlarge"; 
  message?: string;
  showProgress?: boolean;
  className?: string;
  speed?: number;
  fullScreen?: boolean;
  roadLength?: "short" | "medium" | "long";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const animationDuration = useRef<number>(2 / speed);

  useEffect(() => {
    setIsVisible(true);
    
    if (showProgress) {
      let progress = 0;
      progressInterval.current = setInterval(() => {
        progress += Math.random() * 10 + 5;
        if (progress > 95) progress = 95;
        setProgressWidth(progress);
      }, 400);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [showProgress]);

  useEffect(() => {
    animationDuration.current = 2 / speed;
  }, [speed]);

  if (!isVisible) return null;

  // Responsive size classes
  const containerClass = cn(
    "relative overflow-hidden",
    className,
    {
      "w-32 h-20 xs:w-40 xs:h-24 sm:w-48 sm:h-28": size === "tiny",
      "w-48 h-28 xs:w-56 xs:h-32 sm:w-64 sm:h-36 md:w-72 md:h-40": size === "small",
      "w-64 h-36 xs:w-72 xs:h-40 sm:w-80 sm:h-44 md:w-96 md:h-48 lg:w-104 lg:h-52": size === "medium",
      "w-80 h-44 xs:w-96 xs:h-48 sm:w-104 sm:h-52 md:w-112 md:h-56 lg:w-120 lg:h-60": size === "large",
      "w-96 h-48 xs:w-104 xs:h-52 sm:w-112 sm:h-56 md:w-120 md:h-60 lg:w-128 lg:h-64 xl:w-136 xl:h-68": size === "xlarge",
    }
  );

  // Animation duration based on road length
  const truckAnimationDuration = useMemo(() => {
    const baseDuration = animationDuration.current;
    switch(roadLength) {
      case "short": return baseDuration * 0.7;
      case "medium": return baseDuration;
      case "long": return baseDuration * 1.3;
      default: return baseDuration;
    }
  }, [roadLength, animationDuration]);

  // Truck size scaling
  const truckScale = useMemo(() => {
    switch(size) {
      case "tiny": return "scale(0.5)";
      case "small": return "scale(0.7)";
      case "medium": return "scale(0.85)";
      case "large": return "scale(1)";
      case "xlarge": return "scale(1.15)";
      default: return "scale(1)";
    }
  }, [size]);

  // Responsive font size for message
  const messageSize = useMemo(() => {
    switch(size) {
      case "tiny": return "text-xs xs:text-sm";
      case "small": return "text-sm xs:text-base";
      case "medium": return "text-base sm:text-lg";
      case "large": return "text-lg sm:text-xl md:text-2xl";
      case "xlarge": return "text-xl sm:text-2xl md:text-3xl";
      default: return "text-base sm:text-lg";
    }
  }, [size]);

  const wrapperClass = cn(
    "flex flex-col items-center justify-center gap-4 p-4",
    {
      "min-h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm": fullScreen,
    }
  );

  return (
    <div className={wrapperClass}>
      {/* Road and Truck Container */}
      <div className={cn("relative", containerClass)}>
        {/* Road */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-700 dark:bg-gray-800">
          {/* Road lines */}
          <div 
            className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-yellow-400"
            style={{ 
              background: "repeating-linear-gradient(90deg, transparent, transparent 20px, yellow 20px, yellow 40px)",
              animation: "roadLine 0.5s linear infinite"
            }}
          />
        </div>

        {/* Animated Background (optional clouds) */}
        <div 
          className="absolute top-2 left-full w-16 h-8 bg-white/30 rounded-full" 
          style={{ animation: "cloudMove 20s linear infinite" }} 
        />
        <div 
          className="absolute top-6 left-full w-12 h-6 bg-white/20 rounded-full" 
          style={{ animation: "cloudMove 25s linear infinite 5s" }} 
        />

        {/* Moving Truck */}
        <div 
          className="absolute bottom-8 left-0"
          style={{ 
            transform: truckScale,
            animation: `moveTruck ${truckAnimationDuration}s linear infinite`
          }}
        >
          {/* Truck Container */}
          <div className="relative">
            {/* Truck Body */}
            <div className="relative w-48 h-16">
              {/* Main Container (Back) */}
              <div className="absolute left-0 top-0 w-32 h-16 bg-blue-600 dark:bg-blue-700 rounded-lg">
                {/* Container Details */}
                <div className="absolute top-2 left-2 w-6 h-12 bg-blue-700 dark:bg-blue-800 rounded" />
                <div className="absolute top-2 right-2 w-6 h-12 bg-blue-700 dark:bg-blue-800 rounded" />
                <div className="absolute top-1/2 left-1/4 w-2 h-1 bg-blue-800 dark:bg-blue-900 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-2 h-1 bg-blue-800 dark:bg-blue-900 -translate-y-1/2" />
                <div className="absolute top-1/2 right-1/4 w-2 h-1 bg-blue-800 dark:bg-blue-900 -translate-y-1/2" />
              </div>

              {/* Cab */}
              <div className="absolute left-28 top-0 w-20 h-12 bg-red-600 dark:bg-red-700 rounded-t-lg">
                {/* Windshield */}
                <div className="absolute top-1 right-2 w-12 h-8 bg-blue-300/60 dark:bg-blue-400/40 rounded-sm" />
                {/* Side Window */}
                <div className="absolute top-2 left-2 w-6 h-5 bg-blue-300/60 dark:bg-blue-400/40 rounded" />
                {/* Headlights */}
                <div className="absolute bottom-0 left-2 w-3 h-2 bg-yellow-400 rounded-t" />
                <div className="absolute bottom-0 right-2 w-3 h-2 bg-yellow-400 rounded-t" />
              </div>

              {/* Wheels */}
              <div 
                className="absolute -bottom-3 left-6"
                style={{ animation: `rotateWheel ${truckAnimationDuration / 2}s linear infinite` }}
              >
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-700 rounded-full" />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(45deg)', transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(135deg)', transformOrigin: 'center' }} />
                </div>
              </div>
              
              <div 
                className="absolute -bottom-3 right-6"
                style={{ animation: `rotateWheel ${truckAnimationDuration / 2}s linear infinite` }}
              >
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-700 rounded-full" />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(45deg)', transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(135deg)', transformOrigin: 'center' }} />
                </div>
              </div>

              {/* Front Wheel (Cab) */}
              <div 
                className="absolute -bottom-3 left-36"
                style={{ animation: `rotateWheel ${truckAnimationDuration / 2}s linear infinite` }}
              >
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-700 rounded-full" />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(45deg)', transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }} />
                  <div className="absolute w-6 h-1 bg-gray-600 rounded-full" style={{ transform: 'rotate(135deg)', transformOrigin: 'center' }} />
                </div>
              </div>

              {/* Exhaust Pipe */}
              <div className="absolute -top-2 right-2 w-2 h-4 bg-gray-700 rounded-t" />
              <div 
                className="absolute -top-6 right-2 w-1 h-4 bg-gray-600 rounded-t" 
                style={{ animation: 'puff 0.5s ease-in-out infinite' }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations - Hanya satu <style jsx> */}
      <style jsx>{`
        @keyframes roadLine {
          from { transform: translateX(0); }
          to { transform: translateX(-40px); }
        }

        @keyframes moveTruck {
          0% {
            transform: translateX(-100%) ${truckScale};
          }
          100% {
            transform: translateX(100vw) ${truckScale};
          }
        }

        @keyframes rotateWheel {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes puff {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-2px);
          }
        }

        @keyframes cloudMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100vw);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .absolute.bottom-8.left-0 {
            animation-duration: ${truckAnimationDuration * 1.2}s !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .absolute.bottom-8.left-0,
          .absolute.-bottom-3,
          .absolute.top-1\\/2,
          .absolute.-top-6.right-2,
          .absolute.top-2.left-full,
          .absolute.top-6.left-full {
            animation: none !important;
          }
          
          .absolute.bottom-8.left-0 {
            transform: translateX(0) ${truckScale} !important;
          }
        }
      `}</style>

      {/* Message */}
      {message && (
        <p className={cn(
          "font-medium text-gray-700 dark:text-gray-300 text-center transition-opacity duration-300",
          messageSize,
          "max-w-xs sm:max-w-sm md:max-w-md"
        )}>
          {message}
        </p>
      )}
      
      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div className="h-1.5 xs:h-2 sm:h-2.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 xs:mt-2">
            <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
              {progressWidth < 100 ? `${Math.round(progressWidth)}%` : '99%'}
            </p>
            <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
              {progressWidth < 30 ? 'Memuat paket...' : 
               progressWidth < 60 ? 'Dalam perjalanan...' : 
               progressWidth < 90 ? 'Hampir sampai...' : 
               'Mengirim...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Additional Info */}
      {fullScreen && (
        <div className="text-center space-y-2 mt-4">
          <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
            🚚 Truk pengiriman sedang dalam perjalanan...
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Proses ini memakan waktu beberapa detik
          </p>
        </div>
      )}
    </div>
  );
}

// Utility function for conditional classes (cn)
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
