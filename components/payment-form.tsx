"use client"

import React, { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle2, Download, Loader2, AlertTriangle } from "lucide-react"
import type { TenantWithPayment } from "@/lib/types"

// Typewriter Loading Component (unchanged)
const TypewriterLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <style jsx>{`
        .typewriter { --blue: #5C86FF; --blue-dark: #275EFE; --key: #fff; --paper: #EEF0FD; --text: #D3D4EC; --tool: #FBC56C; --duration: 7s; position: relative; animation: bounce05 var(--duration) linear infinite; }
        .typewriter .slide { width: 92px; height: 20px; border-radius: 3px; margin-left: 14px; transform: translateX(14px); background: linear-gradient(var(--blue), var(--blue-dark)); animation: slide05 var(--duration) ease infinite; }
        .typewriter .slide:before, .typewriter .slide:after, .typewriter .slide i:before { content: ""; position: absolute; background: var(--tool); }
        .typewriter .slide:before { width: 2px; height: 8px; top: 6px; left: 100%; }
        .typewriter .slide:after { left: 94px; top: 3px; height: 14px; width: 6px; border-radius: 3px; }
        .typewriter .slide i { display: block; position: absolute; right: 100%; width: 6px; height: 4px; top: 4px; background: var(--tool); }
        .typewriter .slide i:before { right: 100%; top: -2px; width: 4px; border-radius: 2px; height: 14px; }
        .typewriter .paper { position: absolute; left: 24px; top: -26px; width: 40px; height: 46px; border-radius: 5px; background: var(--paper); transform: translateY(46px); animation: paper05 var(--duration) linear infinite; }
        .typewriter .paper:before { content: ""; position: absolute; left: 6px; right: 6px; top: 7px; border-radius: 2px; height: 4px; transform: scaleY(0.8); background: var(--text); box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text); }
        .typewriter .keyboard { width: 120px; height: 56px; margin-top: -10px; z-index: 1; position: relative; }
        .typewriter .keyboard:before, .typewriter .keyboard:after { content: ""; position: absolute; }
        .typewriter .keyboard:before { top: 0; left: 0; right: 0; bottom: 0; border-radius: 7px; background: linear-gradient(135deg, var(--blue), var(--blue-dark)); transform: perspective(10px) rotateX(2deg); transform-origin: 50% 100%; }
        .typewriter .keyboard:after { left: 2px; top: 25px; width: 11px; height: 4px; border-radius: 2px; box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key); animation: keyboard05 var(--duration) linear infinite; }
        @keyframes bounce05 { 85%, 92%, 100% { transform: translateY(0); } 89% { transform: translateY(-4px); } 95% { transform: translateY(2px); } }
        @keyframes slide05 { 5% { transform: translateX(14px); } 15%, 30% { transform: translateX(6px); } 40%, 55% { transform: translateX(0); } 65%, 70% { transform: translateX(-4px); } 80%, 89% { transform: translateX(-12px); } 100% { transform: translateX(14px); } }
        @keyframes paper05 { 5% { transform: translateY(46px); } 20%, 30% { transform: translateY(34px); } 40%, 55% { transform: translateY(22px); } 65%, 70% { transform: translateY(10px); } 80%, 85% { transform: translateY(0); } 92%, 100% { transform: translateY(46px); } }
        @keyframes keyboard05 { 5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84% { box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key); } 9% { box-shadow: 15px 2px 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key); } }
      `}</style>
      <div className="typewriter"><div className="slide"><i /></div><div className="paper" /><div className="keyboard" /></div>
    </div>
  );
};

const LoadingOverlay = ({ message = "Mengirim bukti pembayaran..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl max-w-sm md:max-w-md w-full mx-4 animate-in zoom-in duration-300">
        <div className="mb-6"><TypewriterLoader /></div>
        <div className="text-center space-y-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{message}</h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Mohon tunggu sebentar...</p>
        </div>
      </div>
    </div>
  );
};

interface PaymentFormProps {
  tenants: TenantWithPayment[]
}

export function TenantPaymentForm({ tenants }: PaymentFormProps) {
  const [uniqueCode, setUniqueCode] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeValidated, setCodeValidated] = useState(false)

  // Validate unique code and auto-select tenant
  const handleCodeValidation = () => {
    const foundTenant = tenants.find(t => t.unique_code === uniqueCode.toUpperCase().trim())
    
    if (foundTenant) {
      setTenantId(foundTenant.id)
      setCodeValidated(true)
      setError(null)
      
      // Auto-fill amount if there's an unpaid payment
      const unpaidPayment = foundTenant.latestUnpaidPayment as any
      if (unpaidPayment) {
        setAmount(unpaidPayment.amount.toString())
      } else if (foundTenant.room) {
        setAmount(foundTenant.room.price.toString())
      }
    } else {
      setCodeValidated(false)
      setTenantId("")
      setError("Kode unik tidak valid. Pastikan Anda memasukkan kode yang benar dari admin.")
    }
  }

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
    
    if (!codeValidated) {
      setError("Silakan validasi kode unik terlebih dahulu")
      return
    }
    
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

      // Find the latest unpaid payment for this tenant
      const latestUnpaidPayment = selectedTenant?.latestUnpaidPayment as any
      const dueDate = latestUnpaidPayment?.due_date || new Date().toISOString().split("T")[0]

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
        setUniqueCode("")
        setCodeValidated(false)
        setTenantId("")
        setAmount("")
        setPaymentDate(new Date().toISOString().split('T')[0])
        setNotes("")
        setFile(null)
        
        // Reload page to refresh tenant list
        window.location.reload()
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
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-14 h-14 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">🎉 Berhasil Dikirim!</h3>
              <div className="space-y-2">
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
                  Bukti pembayaran Anda telah diterima
                </p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Mohon tunggu verifikasi dari admin. Halaman akan di-refresh otomatis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && <LoadingOverlay message="Mengunggah bukti pembayaran..." />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Validate Unique Code */}
        <div className="space-y-2">
          <Label htmlFor="unique_code">Kode Unik Penyewa</Label>
          <div className="flex gap-2">
            <Input
              id="unique_code"
              type="text"
              placeholder="Masukkan kode unik (8 karakter)"
              value={uniqueCode}
              onChange={(e) => {
                setUniqueCode(e.target.value)
                setCodeValidated(false)
                setTenantId("")
              }}
              className="font-mono uppercase"
              maxLength={8}
              required
              disabled={codeValidated}
            />
            <Button 
              type="button" 
              onClick={handleCodeValidation}
              variant={codeValidated ? "default" : "outline"}
              disabled={uniqueCode.length !== 8 || codeValidated}
            >
              {codeValidated ? <CheckCircle2 className="h-4 w-4" /> : "Validasi"}
            </Button>
          </div>
          {codeValidated && selectedTenant && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Kode valid! Teridentifikasi: <strong>{selectedTenant.name}</strong> - Kamar {selectedTenant.room?.room_number}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground">
            Kode dibuat oleh Admin. Hubungi Admin jika belum mendapatkan kode unik
          </p>
        </div>

        {/* Show remaining form only after code validation */}
        {codeValidated && selectedTenant && (
          <>
            {selectedTenant.room && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">Tagihan saat ini:</p>
                <p className="text-lg font-semibold">
                  Rp {(selectedTenant.latestUnpaidPayment as any)?.amount?.toLocaleString("id-ID") || 
                       selectedTenant.room.price.toLocaleString("id-ID")}
                </p>
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
            </div>

            <div className="space-y-2">
              <Label>Kode QR Pembayaran</Label>
              <div className="rounded-lg border bg-muted/50 p-4 flex flex-col items-center">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/qr-payment.jpg" 
                    alt="QR Code Pembayaran BNI" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-foreground">BNI : 0797356663</p>
                  <p className="text-xs text-muted-foreground">a.n Liestia Arfianti</p>
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={handleDownloadQR}>
                  <Download className="mr-2 h-4 w-4" />
                  Unduh QR Code
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof">Upload Bukti Pembayaran</Label>
              <Input
                id="proof"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
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
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {codeValidated && (
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
        )}
      </form>
    </>
  )
}
