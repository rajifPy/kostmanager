"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTenant, updateTenant } from "@/app/actions/tenants"
import type { Tenant, Room } from "@/lib/types"
import { Copy, RefreshCw } from "lucide-react"

interface TenantFormProps {
  tenant?: Tenant
  availableRooms: Room[]
  currentRoom?: Room
  onSuccess?: () => void
}

// Function to generate unique code (client-side preview)
function generateUniqueCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function TenantForm({ tenant, availableRooms, currentRoom, onSuccess }: TenantFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uniqueCode, setUniqueCode] = useState(tenant?.unique_code || generateUniqueCode())

  // Include current room in available rooms for editing
  const rooms = currentRoom ? [currentRoom, ...availableRooms.filter((r) => r.id !== currentRoom.id)] : availableRooms

  const handleGenerateCode = () => {
    setUniqueCode(generateUniqueCode())
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(uniqueCode)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('unique_code', uniqueCode)

    try {
      if (tenant) {
        await updateTenant(tenant.id, formData, tenant.room_id)
      } else {
        await createTenant(formData)
      }
      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input id="name" name="name" placeholder="Nama penyewa" defaultValue={tenant?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unique_code">Kode Unik Penyewa</Label>
        <div className="flex gap-2">
          <Input 
            id="unique_code" 
            name="unique_code" 
            value={uniqueCode}
            readOnly
            className="font-mono font-bold text-primary"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={handleCopyCode}
            title="Salin Kode"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {!tenant && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleGenerateCode}
              title="Generate Ulang"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {tenant ? "Kode unik tidak dapat diubah" : "Kode ini akan digunakan penyewa untuk upload bukti pembayaran"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input id="phone" name="phone" placeholder="08xxxxxxxxxx" defaultValue={tenant?.phone || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          defaultValue={tenant?.email || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="room_id">Kamar</Label>
        <Select name="room_id" defaultValue={tenant?.room_id || "none"}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kamar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tidak ada kamar</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                Kamar {room.room_number} - Rp {room.price.toLocaleString("id-ID")}/bulan
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Tanggal Masuk</Label>
        <Input
          id="start_date"
          name="start_date"
          type="date"
          defaultValue={tenant?.start_date?.split("T")[0]}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end_date">Tanggal Keluar (Opsional)</Label>
        <Input id="end_date" name="end_date" type="date" defaultValue={tenant?.end_date?.split("T")[0] || ""} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Menyimpan..." : tenant ? "Update Penyewa" : "Tambah Penyewa"}
      </Button>
    </form>
  )
}
