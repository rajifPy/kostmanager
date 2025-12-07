"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createRoom, updateRoom } from "@/app/actions/rooms"
import type { Room } from "@/lib/types"

interface RoomFormProps {
  room?: Room
  onSuccess?: () => void
}

export function RoomForm({ room, onSuccess }: RoomFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (room) {
        await updateRoom(room.id, formData)
      } else {
        await createRoom(formData)
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
        <Label htmlFor="room_number">Nomor Kamar</Label>
        <Input
          id="room_number"
          name="room_number"
          placeholder="Contoh: A1, 101, dll"
          defaultValue={room?.room_number}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Harga per Bulan (Rp)</Label>
        <Input id="price" name="price" type="number" placeholder="1500000" defaultValue={room?.price} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facilities">Fasilitas</Label>
        <Textarea
          id="facilities"
          name="facilities"
          placeholder="AC, WiFi, Kamar Mandi Dalam, dll"
          defaultValue={room?.facilities || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={room?.status || "vacant"}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vacant">Kosong</SelectItem>
            <SelectItem value="occupied">Terisi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Menyimpan..." : room ? "Update Kamar" : "Tambah Kamar"}
      </Button>
    </form>
  )
}
