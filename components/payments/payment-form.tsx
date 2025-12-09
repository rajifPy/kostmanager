"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPayment, updatePayment } from "@/app/actions/payments"
import type { Payment, Tenant } from "@/lib/types"

interface PaymentFormProps {
  payment?: Payment
  tenants: Tenant[]
  onSuccess?: () => void
}

export function PaymentForm({ payment, tenants, onSuccess }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTenant, setSelectedTenant] = useState(payment?.tenant_id || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (payment) {
        await updatePayment(payment.id, formData)
      } else {
        await createPayment(formData)
      }
      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fill amount when tenant is selected
  const handleTenantChange = (tenantId: string) => {
    setSelectedTenant(tenantId)
    const tenant = tenants.find((t) => t.id === tenantId)
    if (tenant?.room) {
      const amountInput = document.getElementById("amount") as HTMLInputElement
      if (amountInput) {
        amountInput.value = tenant.room.price.toString()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tenant_id">Penyewa</Label>
        <Select name="tenant_id" value={selectedTenant} onValueChange={handleTenantChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih penyewa" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                {tenant.name}
                {tenant.room && ` - Kamar ${tenant.room.room_number}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Jumlah (Rp)</Label>
        <Input id="amount" name="amount" type="number" placeholder="1500000" defaultValue={payment?.amount} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
        <Input id="due_date" name="due_date" type="date" defaultValue={payment?.due_date?.split("T")[0]} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={payment?.status || "pending"}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Lunas</SelectItem>
            <SelectItem value="overdue">Tunggakan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Catatan (Opsional)</Label>
        <Textarea id="notes" name="notes" placeholder="Catatan tambahan" defaultValue={payment?.notes || ""} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Menyimpan..." : payment ? "Update Pembayaran" : "Tambah Pembayaran"}
      </Button>
    </form>
  )
}
