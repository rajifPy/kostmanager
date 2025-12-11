"use client";

import { useState, useEffect } from "react";
import { Share2, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ShareButton() {
  const [isCopied, setIsCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shareUrl = isMounted ? window.location.href : "";
  const whatsappText = encodeURIComponent(
    "Hai! Aku nemu kost yang bagus nih 👇\n\n" +
    "📍 Lokasi strategis\n" +
    "🔐 Keamanan 24 jam\n" +
    "📶 WiFi kencang\n" +
    "💰 Harga terjangkau\n\n" +
    "Cek detailnya di sini:"
  );

  const whatsappUrl = `https://wa.me/?text=${whatsappText}%20${encodeURIComponent(shareUrl)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin URL:", err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Tombol Utama: Bagikan via WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mr-3 group-hover:rotate-12 transition-transform"
        >
          <path d="M21 9l-4.5 9.5-4-2-5 2 2-5-4-4C4.7 9.5 5.2 9 6 9h12c.5 0 1 .5 1 1v5c0 .5-.5 1-1 1H6l2-5h13z" />
        </svg>
        Bagikan via WhatsApp
        <Badge variant="secondary" className="ml-2 bg-white/20 text-xs px-2 py-0.5">
          Rekomendasi ke Teman
        </Badge>
      </a>

      {/* Tombol Cadangan: Salin Link */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="text-muted-foreground hover:text-foreground"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-green-500 mr-1" />
              Disalin!
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4 mr-1" />
              Salin Link
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Kirim manual via chat
        </p>
      </div>

      {/* Micro-interaction: subtle pulse on load */}
      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
        }
        .group {
          animation: pulse-subtle 2s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .group { animation: none; }
        }
      `}</style>
    </div>
  );
}
