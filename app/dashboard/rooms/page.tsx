import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { RoomList } from "@/components/rooms/room-list"
import { RoomForm } from "@/components/rooms/room-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import type { Room } from "@/lib/types"

async function getRooms() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("rooms").select("*").order("room_number")

  if (error) {
    console.error("Error fetching rooms:", error)
    return []
  }

  return data as Room[]
}

export default async function RoomsPage() {
  const rooms = await getRooms()

  return (
    <>
      <Header title="Manajemen Kamar" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Daftar Kamar</h2>
            <p className="text-sm text-muted-foreground">Kelola kamar kost Anda</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kamar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kamar Baru</DialogTitle>
              </DialogHeader>
              <RoomForm />
            </DialogContent>
          </Dialog>
        </div>
        <RoomList rooms={rooms} />
      </main>
    </>
  )
}
