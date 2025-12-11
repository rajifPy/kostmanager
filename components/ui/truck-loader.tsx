// components/ui/truck-loader.tsx
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

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
  const progressInterval = useRef<any>(null); // Menggunakan any untuk menghindari NodeJS.Timeout

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

  // Animation duration calculation
  const baseDuration = 2 / speed;
  const truckAnimationDuration = useMemo(() => {
    switch(roadLength) {
      case "short": return baseDuration * 0.7;
      case "medium": return baseDuration;
      case "long": return baseDuration * 1.3;
      default: return baseDuration;
    }
  }, [roadLength, baseDuration]);

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

  // Responsive container classes
  const getContainerClasses = () => {
    switch(size) {
      case "tiny": return "w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28";
      case "small": return "w-48 h-28 sm:w-56 sm:h-32 md:w-64 md:h-36 lg:w-72 lg:h-40";
      case "medium": return "w-64 h-36 sm:w-72 sm:h-40 md:w-80 md:h-44 lg:w-96 lg:h-48 xl:w-104 xl:h-52";
      case "large": return "w-80 h-44 sm:w-96 sm:h-48 md:w-104 md:h-52 lg:w-120 lg:h-56 xl:w-120 xl:h-60";
      case "xlarge": return "w-96 h-48 sm:w-104 sm:h-52 md:w-112 md:h-56 lg:w-128 lg:h-60 xl:w-136 xl:h-64";
      default: return "w-80 h-44 sm:w-96 sm:h-48 md:w-104 md:h-52 lg:w-120 lg:h-56";
    }
  };

  // Responsive font size for message
  const getMessageSize = () => {
    switch(size) {
      case "tiny": return "text-xs sm:text-sm";
      case "small": return "text-sm sm:text-base";
      case "medium": return "text-base sm:text-lg";
      case "large": return "text-lg sm:text-xl md:text-2xl";
      case "xlarge": return "text-xl sm:text-2xl md:text-3xl";
      default: return "text-base sm:text-lg";
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4 p-4",
      fullScreen && "min-h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    )}>
      {/* Road and Truck Container */}
      <div className={cn("relative overflow-hidden", getContainerClasses(), className)}>
        {/* Road */}
        <div className="absolute bottom-0 left-0 w-full h-6 bg-gray-700 dark:bg-gray-800">
          {/* Road lines */}
          <div 
            className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2"
            style={{ 
              background: "repeating-linear-gradient(90deg, transparent, transparent 20px, #fbbf24 20px, #fbbf24 40px)",
              animation: `roadLine 0.5s linear infinite`
            }}
          />
        </div>

        {/* Moving Truck */}
        <div 
          className="absolute bottom-4 left-0"
          style={{ 
            transform: truckScale,
            animation: `moveTruck ${truckAnimationDuration}s linear infinite`
          }}
        >
          <div className="relative">
            {/* Truck Body */}
            <div className="relative w-40 h-14">
              {/* Main Container */}
              <div className="absolute left-0 top-0 w-28 h-14 bg-blue-600 dark:bg-blue-700 rounded-lg">
                {/* Container Details */}
                <div className="absolute top-1 left-1 w-5 h-10 bg-blue-700 dark:bg-blue-800 rounded" />
                <div className="absolute top-1 right-1 w-5 h-10 bg-blue-700 dark:bg-blue-800 rounded" />
                <div className="absolute top-1/2 left-1/4 w-1.5 h-0.5 bg-blue-800 dark:bg-blue-900 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-1.5 h-0.5 bg-blue-800 dark:bg-blue-900 -translate-y-1/2" />
                <div className="absolute top-1/2 right-1/4 w-1.5 h-0.5 bg-blue-800 dark:bg-blue-900 -translate-y-1/2" />
              </div>

              {/* Cab */}
              <div className="absolute left-24 top-0 w-16 h-10 bg-red-600 dark:bg-red-700 rounded-t-lg">
                {/* Windshield */}
                <div className="absolute top-0.5 right-1 w-10 h-6 bg-blue-300/60 dark:bg-blue-400/40 rounded-sm" />
                {/* Side Window */}
                <div className="absolute top-1 left-1 w-4 h-3 bg-blue-300/60 dark:bg-blue-400/40 rounded" />
                {/* Headlights */}
                <div className="absolute bottom-0 left-1 w-2 h-1 bg-yellow-400 rounded-t" />
                <div className="absolute bottom-0 right-1 w-2 h-1 bg-yellow-400 rounded-t" />
              </div>

              {/* Wheels */}
              {[6, 24, 32].map((left, index) => (
                <div 
                  key={index}
                  className="absolute -bottom-2"
                  style={{ 
                    left: `${left}px`,
                    animation: `rotateWheel ${truckAnimationDuration / 2}s linear infinite`
                  }}
                >
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-700 rounded-full" />
                    <div className="absolute w-4 h-0.5 bg-gray-600 rounded-full" style={{ transformOrigin: 'center' }} />
                    <div className="absolute w-4 h-0.5 bg-gray-600 rounded-full" style={{ transform: 'rotate(45deg)', transformOrigin: 'center' }} />
                    <div className="absolute w-4 h-0.5 bg-gray-600 rounded-full" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }} />
                    <div className="absolute w-4 h-0.5 bg-gray-600 rounded-full" style={{ transform: 'rotate(135deg)', transformOrigin: 'center' }} />
                  </div>
                </div>
              ))}

              {/* Exhaust Pipe */}
              <div className="absolute -top-1 right-1 w-1.5 h-3 bg-gray-700 rounded-t" />
              <div 
                className="absolute -top-4 right-1 w-0.5 h-3 bg-gray-600 rounded-t" 
                style={{ animation: 'puff 0.5s ease-in-out infinite' }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes roadLine {
          from { transform: translateX(0); }
          to { transform: translateX(-40px); }
        }

        @keyframes moveTruck {
          0% {
            transform: translateX(-100%) ${truckScale};
          }
          100% {
            transform: translateX(100%) ${truckScale};
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

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .absolute.bottom-4.left-0 {
            animation-duration: ${truckAnimationDuration * 1.2}s !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .absolute.bottom-4.left-0,
          .absolute.-bottom-2,
          .absolute.top-1\\/2,
          .absolute.-top-4.right-1 {
            animation: none !important;
          }
          
          .absolute.bottom-4.left-0 {
            transform: translateX(0) ${truckScale} !important;
          }
        }
      `}</style>

      {/* Message */}
      {message && (
        <p className={cn(
          "font-medium text-gray-700 dark:text-gray-300 text-center transition-opacity duration-300",
          getMessageSize(),
          "max-w-xs sm:max-w-sm md:max-w-md"
        )}>
          {message}
        </p>
      )}
      
      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div className="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 sm:mt-2">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {progressWidth < 100 ? `${Math.round(progressWidth)}%` : '99%'}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {progressWidth < 30 ? 'Memuat...' : 
               progressWidth < 60 ? 'Dalam perjalanan...' : 
               progressWidth < 90 ? 'Hampir sampai...' : 
               'Menyelesaikan...'}
            </span>
          </div>
        </div>
      )}
      
      {/* Additional Info */}
      {fullScreen && (
        <div className="text-center space-y-2 mt-4">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
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
