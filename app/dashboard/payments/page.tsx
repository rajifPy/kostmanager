import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { PaymentList } from "@/components/payments/payment-list"
import { PaymentForm } from "@/components/payments/payment-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import type { Payment, Tenant } from "@/lib/types"

async function getData() {
  const supabase = await createClient()

  const [paymentsRes, tenantsRes] = await Promise.all([
    supabase.from("payments").select("*, tenant:tenants(*, room:rooms(*))").order("due_date", { ascending: false }),
    supabase.from("tenants").select("*, room:rooms(*)").order("name"),
  ])

  return {
    payments: (paymentsRes.data as Payment[]) || [],
    tenants: (tenantsRes.data as Tenant[]) || [],
  }
}

export default async function PaymentsPage() {
  const { payments, tenants } = await getData()

  return (
    <>
      <Header title="Manajemen Pembayaran" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Daftar Pembayaran</h2>
            <p className="text-sm text-muted-foreground">Kelola pembayaran sewa kost</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pembayaran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pembayaran Baru</DialogTitle>
              </DialogHeader>
              <PaymentForm tenants={tenants} />
            </DialogContent>
          </Dialog>
        </div>
        <PaymentList payments={payments} tenants={tenants} />
      </main>
    </>
  )
}
