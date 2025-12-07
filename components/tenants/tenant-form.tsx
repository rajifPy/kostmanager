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

interface TenantFormProps {
  tenant?: Tenant
  availableRooms: Room[]
  currentRoom?: Room
  onSuccess?: () => void
}

export function TenantForm({ tenant, availableRooms, currentRoom, onSuccess }: TenantFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Include current room in available rooms for editing
  const rooms = currentRoom ? [currentRoom, ...availableRooms.filter((r) => r.id !== currentRoom.id)] : availableRooms

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

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
