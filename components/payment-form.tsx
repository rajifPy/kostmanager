"use client"

import React, { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle2, Download, Loader2 } from "lucide-react"
import type { TenantWithPayment } from "@/lib/types"

// Typewriter Loading Component
const TypewriterLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <style jsx>{`
        .typewriter {
          --blue: #5C86FF;
          --blue-dark: #275EFE;
          --key: #fff;
          --paper: #EEF0FD;
          --text: #D3D4EC;
          --tool: #FBC56C;
          --duration: 3s;
          position: relative;
          animation: bounce05 var(--duration) linear infinite;
        }

        .typewriter .slide {
          width: 92px;
          height: 20px;
          border-radius: 3px;
          margin-left: 14px;
          transform: translateX(14px);
          background: linear-gradient(var(--blue), var(--blue-dark));
          animation: slide05 var(--duration) ease infinite;
        }

        .typewriter .slide:before,
        .typewriter .slide:after,
        .typewriter .slide i:before {
          content: "";
          position: absolute;
          background: var(--tool);
        }

        .typewriter .slide:before {
          width: 2px;
          height: 8px;
          top: 6px;
          left: 100%;
        }

        .typewriter .slide:after {
          left: 94px;
          top: 3px;
          height: 14px;
          width: 6px;
          border-radius: 3px;
        }

        .typewriter .slide i {
          display: block;
          position: absolute;
          right: 100%;
          width: 6px;
          height: 4px;
          top: 4px;
          background: var(--tool);
        }

        .typewriter .slide i:before {
          right: 100%;
          top: -2px;
          width: 4px;
          border-radius: 2px;
          height: 14px;
        }

        .typewriter .paper {
          position: absolute;
          left: 24px;
          top: -26px;
          width: 40px;
          height: 46px;
          border-radius: 5px;
          background: var(--paper);
          transform: translateY(46px);
          animation: paper05 var(--duration) linear infinite;
        }

        .typewriter .paper:before {
          content: "";
          position: absolute;
          left: 6px;
          right: 6px;
          top: 7px;
          border-radius: 2px;
          height: 4px;
          transform: scaleY(0.8);
          background: var(--text);
          box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text);
        }

        .typewriter .keyboard {
          width: 120px;
          height: 56px;
          margin-top: -10px;
          z-index: 1;
          position: relative;
        }

        .typewriter .keyboard:before,
        .typewriter .keyboard:after {
          content: "";
          position: absolute;
        }

        .typewriter .keyboard:before {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 7px;
          background: linear-gradient(135deg, var(--blue), var(--blue-dark));
          transform: perspective(10px) rotateX(2deg);
          transform-origin: 50% 100%;
        }

        .typewriter .keyboard:after {
          left: 2px;
          top: 25px;
          width: 11px;
          height: 4px;
          border-radius: 2px;
          box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key),
            60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key),
            22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key),
            60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
          animation: keyboard05 var(--duration) linear infinite;
        }

        @keyframes bounce05 {
          85%, 92%, 100% {
            transform: translateY(0);
          }
          89% {
            transform: translateY(-4px);
          }
          95% {
            transform: translateY(2px);
          }
        }

        @keyframes slide05 {
          5% {
            transform: translateX(14px);
          }
          15%, 30% {
            transform: translateX(6px);
          }
          40%, 55% {
            transform: translateX(0);
          }
          65%, 70% {
            transform: translateX(-4px);
          }
          80%, 89% {
            transform: translateX(-12px);
          }
          100% {
            transform: translateX(14px);
          }
        }

        @keyframes paper05 {
          5% {
            transform: translateY(46px);
          }
          20%, 30% {
            transform: translateY(34px);
          }
          40%, 55% {
            transform: translateY(22px);
          }
          65%, 70% {
            transform: translateY(10px);
          }
          80%, 85% {
            transform: translateY(0);
          }
          92%, 100% {
            transform: translateY(46px);
          }
        }

        @keyframes keyboard05 {
          5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key),
              60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key),
              22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
          }
          9% {
            box-shadow: 15px 2px 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key),
              60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key),
              22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div className="typewriter">
        <div className="slide"><i /></div>
        <div className="paper" />
        <div className="keyboard" />
      </div>
    </div>
  );
};

// Loading Overlay Component
const LoadingOverlay = ({ message = "Mengirim bukti pembayaran..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl max-w-sm md:max-w-md w-full mx-4 animate-in zoom-in duration-300">
        {/* Typewriter Animation */}
        <div className="mb-6">
          <TypewriterLoader />
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
            {message}
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Mohon tunggu sebentar...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="mt-6 flex justify-center items-center gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" style={{
            width: '100%',
            animation: 'progress 2s ease-in-out infinite'
          }}></div>
        </div>
      </div>
    </div>
  );
};

interface PaymentFormProps {
  tenants: TenantWithPayment[]
}

export function TenantPaymentForm({ tenants }: PaymentFormProps) {
  const [tenantId, setTenantId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedTenant = tenants.find((t) => t.id === tenantId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File harus berupa gambar (JPG, PNG, WebP) atau PDF")
        return
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB")
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = '/qr-payment.jpg'
    link.download = 'QR-Pembayaran-BNI.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantId || !amount || !file || !paymentDate) {
      setError("Mohon lengkapi semua field yang diperlukan")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${tenantId}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(fileName, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(fileName)

      // Find the latest payment for this tenant to use as due_date reference
      const latestPayment = selectedTenant?.latestPayment
      const dueDate = latestPayment?.due_date || new Date().toISOString().split("T")[0]

      // Create payment record with payment date
      const { error: insertError } = await supabase.from("payments").insert({
        tenant_id: tenantId,
        amount: Number.parseFloat(amount),
        due_date: dueDate,
        paid_date: paymentDate,
        status: "pending",
        notes: notes || null,
        proof_url: urlData?.publicUrl || null,
      })

      if (insertError) throw insertError

      setIsLoading(false)
      setSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setTenantId("")
        setAmount("")
        setPaymentDate(new Date().toISOString().split('T')[0])
        setNotes("")
        setFile(null)
      }, 3000)
      
    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pembayaran")
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-8 md:p-12 shadow-xl">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Animated Checkmark */}
            <div className="relative">
              {/* Outer ring with ping animation */}
              <div className="absolute inset-0 animate-ping">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-green-500 opacity-20"></div>
              </div>
              {/* Middle ring with slower pulse */}
              <div className="absolute inset-0 animate-pulse">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-green-400 opacity-30"></div>
              </div>
              {/* Main checkmark circle */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                <CheckCircle2 className="w-14 h-14 md:w-16 md:h-16 text-white animate-in zoom-in duration-500" strokeWidth={2.5} />
              </div>
            </div>

            {/* Success Text */}
            <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                🎉 Berhasil Dikirim!
              </h3>
              <div className="space-y-2">
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
                  Bukti pembayaran Anda telah diterima
                </p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Mohon tunggu verifikasi dari admin
                </p>
              </div>
            </div>

            {/* Status Info */}
            <div className="w-full mt-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-3 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span>
                </div>
                <span className="text-green-600 dark:text-green-400 font-semibold">Menunggu Verifikasi</span>
              </div>
            </div>

            {/* Auto redirect info */}
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center animate-pulse">
              Formulir akan direset otomatis dalam 3 detik...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && <LoadingOverlay message="Mengunggah bukti pembayaran..." />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tenant">Pilih Nama Penyewa</Label>
          <Select value={tenantId} onValueChange={setTenantId}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih penyewa" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name} - Kamar {tenant.room?.room_number || "-"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTenant?.room && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">Harga kamar per bulan:</p>
            <p className="text-lg font-semibold">Rp {selectedTenant.room.price.toLocaleString("id-ID")}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="amount">Nominal Pembayaran</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Contoh: 1500000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">Tanggal Pembayaran</Label>
          <Input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
          />
          <p className="text-xs text-muted-foreground">Pilih tanggal saat Anda melakukan pembayaran</p>
        </div>

        <div className="space-y-2">
          <Label>Kode QR Pembayaran</Label>
          <div className="rounded-lg border bg-muted/50 p-4 flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/qr-payment.jpg" 
                alt="QR Code Pembayaran BNI" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = "/qr-payment.jpg";
                  target.alt = "QR Code tidak dapat dimuat";
                }}
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm font-semibold text-foreground">BNI : 0797356663</p>
              <p className="text-xs text-muted-foreground">a.n Liestia Arfianti</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={handleDownloadQR}
            >
              <Download className="mr-2 h-4 w-4" />
              Unduh QR Code
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proof">Upload Bukti Pembayaran</Label>
          <div className="flex items-center gap-2">
            <Input
              id="proof"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
              required
            />
          </div>
          {file && <p className="text-sm text-muted-foreground">File terpilih: {file.name}</p>}
          <p className="text-xs text-muted-foreground">Format: JPG, PNG, WebP, atau PDF. Maksimal 5MB.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Catatan (Opsional)</Label>
          <Textarea
            id="notes"
            placeholder="Catatan tambahan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Kirim Bukti Pembayaran
            </>
          )}
        </Button>
      </form>
    </>
  )
}
