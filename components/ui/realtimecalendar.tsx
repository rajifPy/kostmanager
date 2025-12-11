// components/ui/calendar.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function RealtimeCalendar() {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const optionsDate = { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  } as const;
  
  const optionsTime = { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit",
    hour12: false 
  } as const;

  const formattedDate = currentDateTime.toLocaleDateString("id-ID", optionsDate);
  const formattedTime = currentDateTime.toLocaleTimeString("id-ID", optionsTime);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-sm max-w-md mx-auto">
      <div className="flex items-center gap-2 text-primary">
        <CalendarIcon className="h-5 w-5" />
        <span className="font-medium">Hari Ini</span>
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">{formattedDate}</p>
        <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-lg font-mono">{formattedTime}</span>
        </div>
      </div>

      {/* Optional: Animated dot to indicate real-time */}
      <div className="flex gap-1 mt-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              i === Math.floor(Date.now() / 1000) % 3
                ? "bg-primary"
                : "bg-primary/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
