import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, AlertTriangle } from "lucide-react"
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

  const today = new Date().toISOString().split('T')[0]

  const tenantsWithPayment: TenantWithPayment[] = (tenants || []).map((tenant) => {
    const payments = tenant.payments || []
    
    // Find unpaid payments (pending, overdue, or rejected)
    const unpaidPayments = payments.filter((p: any) => 
      ['pending', 'overdue', 'rejected'].includes(p.status)
    )
    
    // Get the most recent unpaid payment
    const latestUnpaidPayment = unpaidPayments.sort(
      (a: any, b: any) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
    )[0]
    
    // Also get the absolute latest payment for display
    const absoluteLatestPayment = payments.sort(
      (a: any, b: any) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
    )[0]
    
    return {
      ...tenant,
      payments,
      latestPayment: absoluteLatestPayment,
      hasUnpaidPayment: !!latestUnpaidPayment,
      latestUnpaidPayment
    }
  })

  // Filter only tenants with unpaid payments (active tenants)
  const activeTenants = tenantsWithPayment.filter(t => t.hasUnpaidPayment)

  const getPaymentStatus = (tenant: TenantWithPayment) => {
    if (!tenant.latestPayment) return { label: "Belum Ada", variant: "secondary" as const, priority: 4 }
    
    const latestUnpaid = tenant.latestUnpaidPayment as any
    if (!latestUnpaid) {
      return { label: "Lunas", variant: "default" as const, priority: 5 }
    }
    
    switch (latestUnpaid.status) {
      case "pending":
        return { label: "Menunggu Verifikasi", variant: "outline" as const, priority: 2 }
      case "rejected":
        return { label: "Ditolak", variant: "destructive" as const, priority: 1 }
      case "overdue":
        return { label: "Menunggak", variant: "destructive" as const, priority: 0 }
      default:
        return { label: "Unknown", variant: "secondary" as const, priority: 3 }
    }
  }

  // Sort by priority (overdue first, then rejected, then pending)
  const sortedActiveTenants = activeTenants.sort((a, b) => {
    const statusA = getPaymentStatus(a)
    const statusB = getPaymentStatus(b)
    return statusA.priority - statusB.priority
  })

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
          <h1 className="text-3xl font-bold">Daftar Penyewa Aktif</h1>
          <p className="mt-2 text-muted-foreground">Penyewa dengan pembayaran yang belum lunas</p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penyewa Aktif</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTenants.length}</div>
              <p className="text-xs text-muted-foreground">Memiliki tagihan belum lunas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggak</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {activeTenants.filter(t => (t.latestUnpaidPayment as any)?.status === 'overdue').length}
              </div>
              <p className="text-xs text-muted-foreground">Pembayaran terlambat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifikasi</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeTenants.filter(t => (t.latestUnpaidPayment as any)?.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Menunggu admin</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tenant List */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Penyewa dengan Tagihan Belum Lunas</h2>
            {sortedActiveTenants.length > 0 ? (
              <div className="space-y-4">
                {sortedActiveTenants.map((tenant) => {
                  const status = getPaymentStatus(tenant)
                  const unpaidPayment = tenant.latestUnpaidPayment as any
                  
                  return (
                    <Card key={tenant.id} className={
                      unpaidPayment?.status === 'overdue' ? 'border-destructive' : ''
                    }>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Kamar {tenant.room?.room_number || "-"}</p>
                            {unpaidPayment && (
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Jatuh tempo:{" "}
                                  {new Date(unpaidPayment.due_date).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </p>
                                <p className="text-sm font-medium">
                                  Tagihan: {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  }).format(unpaidPayment.amount)}
                                </p>
                              </div>
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
                  <p className="mt-4 text-muted-foreground">Tidak ada penyewa dengan tagihan belum lunas</p>
                  <p className="text-sm text-muted-foreground">Semua pembayaran sudah lunas! 🎉</p>
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
                <TenantPaymentForm tenants={sortedActiveTenants} />
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
