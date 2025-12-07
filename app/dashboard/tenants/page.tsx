import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { TenantList } from "@/components/tenants/tenant-list"
import { TenantForm } from "@/components/tenants/tenant-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import type { Tenant, Room } from "@/lib/types"

async function getData() {
  const supabase = await createClient()

  const [tenantsRes, roomsRes] = await Promise.all([
    supabase.from("tenants").select("*, room:rooms(*)").order("name"),
    supabase.from("rooms").select("*").eq("status", "vacant").order("room_number"),
  ])

  return {
    tenants: (tenantsRes.data as Tenant[]) || [],
    availableRooms: (roomsRes.data as Room[]) || [],
  }
}

export default async function TenantsPage() {
  const { tenants, availableRooms } = await getData()

  return (
    <>
      <Header title="Manajemen Penyewa" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Daftar Penyewa</h2>
            <p className="text-sm text-muted-foreground">Kelola data penyewa kost Anda</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Penyewa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Penyewa Baru</DialogTitle>
              </DialogHeader>
              <TenantForm availableRooms={availableRooms} />
            </DialogContent>
          </Dialog>
        </div>
        <TenantList tenants={tenants} availableRooms={availableRooms} />
      </main>
    </>
  )
}
