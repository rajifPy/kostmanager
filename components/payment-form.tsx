"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle2, Loader2, Download } from "lucide-react"
import type { TenantWithPayment } from "@/lib/types"

interface PaymentFormProps {
  tenants: TenantWithPayment[]
}

export function TenantPaymentForm({ tenants }: PaymentFormProps) {
  const [tenantId, setTenantId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]) // Default to today
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedTenant = tenants.find((t) => t.id === tenantId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File harus berupa gambar (JPG, PNG, WebP) atau PDF")
        return
      }
      // Validate file size (max 5MB)
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
    link.href = '/kodeQR.jpg'
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
        due_date: dueDate, // Use the due date from latest payment or today
        paid_date: paymentDate, // Use the actual payment date from form
        status: "pending", // Admin needs to verify
        notes: notes || null,
        proof_url: urlData?.publicUrl || null,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setTenantId("")
      setAmount("")
      setPaymentDate(new Date().toISOString().split('T')[0])
      setNotes("")
      setFile(null)

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pembayaran")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="border-primary bg-primary/10">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          Bukti pembayaran berhasil dikirim! Mohon tunggu verifikasi dari admin.
        </AlertDescription>
      </Alert>
    )
  }

  return (
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
          max={new Date().toISOString().split('T')[0]} // Can't select future date
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
  )
}
