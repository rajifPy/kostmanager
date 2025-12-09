import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users } from "lucide-react"
import type { TenantWithPayment } from "@/lib/types"
import { TenantPaymentForm } from "@/components/payment-form"

export default async function PenyewaPage() {
  const supabase = await createClient()

  const { data: tenants } = await supabase
    .from("tenants")
    .select(`
      *,
      room:rooms(*),
      payments(*)
    `)
    .order("name")

  const tenantsWithPayment: TenantWithPayment[] = (tenants || []).map((tenant) => {
    const payments = tenant.payments || []
    const latestPayment = payments.sort(
      (a: { due_date: string }, b: { due_date: string }) =>
        new Date(b.due_date).getTime() - new Date(a.due_date).getTime(),
    )[0]
    return {
      ...tenant,
      payments,
      latestPayment,
    }
  })

  const getPaymentStatus = (tenant: TenantWithPayment) => {
    if (!tenant.latestPayment) return { label: "Belum Ada", variant: "secondary" as const }
    switch (tenant.latestPayment.status) {
      case "paid":
        return { label: "Lunas", variant: "default" as const }
      case "pending":
        return { label: "Menunggu Verifikasi", variant: "outline" as const }
      case "rejected":
        return { label: "Ditolak", variant: "destructive" as const }
      case "overdue":
        return { label: "Menunggak", variant: "destructive" as const }
      default:
        return { label: "Unknown", variant: "secondary" as const }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">KostManager</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Beranda
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Daftar Penyewa</h1>
          <p className="mt-2 text-muted-foreground">Lihat daftar penyewa kost dan upload bukti pembayaran</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tenant List */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Penyewa Aktif</h2>
            {tenantsWithPayment.length > 0 ? (
              <div className="space-y-4">
                {tenantsWithPayment.map((tenant) => {
                  const status = getPaymentStatus(tenant)
                  return (
                    <Card key={tenant.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{tenant.name}</h3>
                            <p className="text-sm text-muted-foreground">Kamar {tenant.room?.room_number || "-"}</p>
                            {tenant.latestPayment && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                Jatuh tempo:{" "}
                                {new Date(tenant.latestPayment.due_date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Belum ada data penyewa</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Upload Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upload Bukti Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <TenantPaymentForm tenants={tenantsWithPayment} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KostManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
