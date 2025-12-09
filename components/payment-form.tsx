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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
        <TypewriterLoader />
        <p className="text-center mt-8 text-base font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </p>
        <p className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          Mohon tunggu sebentar...
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
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
      <Alert className="border-primary bg-primary/10">
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full">
              <div className="w-20 h-20 rounded-full bg-green-500 opacity-75"></div>
            </div>
            <div className="relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-green-600">Berhasil Dikirim!</h3>
            <p className="text-sm text-muted-foreground">
              Bukti pembayaran Anda sedang diproses
            </p>
            <p className="text-xs text-muted-foreground">
              Mohon tunggu verifikasi dari admin
            </p>
          </div>
        </div>
      </Alert>
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
