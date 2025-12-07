import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DoorOpen, Users, CreditCard, AlertTriangle, Clock, FileCheck } from "lucide-react"
import type { Room, Payment, Tenant } from "@/lib/types"

async function getDashboardData() {
  const supabase = await createClient()

  const [roomsRes, tenantsRes, paymentsRes] = await Promise.all([
    supabase.from("rooms").select("*"),
    supabase.from("tenants").select("*, room:rooms(*)"),
    supabase.from("payments").select("*, tenant:tenants(*, room:rooms(*))").order("created_at", { ascending: false }),
  ])

  const rooms = (roomsRes.data as Room[]) || []
  const tenants = (tenantsRes.data as Tenant[]) || []
  const payments = (paymentsRes.data as Payment[]) || []

  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length
  const vacantRooms = rooms.filter((r) => r.status === "vacant").length
  const pendingPayments = payments.filter((p) => p.status === "pending")
  const overduePayments = payments.filter((p) => p.status === "overdue")
  const paidPayments = payments.filter((p) => p.status === "paid")
  const rejectedPayments = payments.filter((p) => p.status === "rejected")
  const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0)

  return {
    rooms,
    tenants,
    payments,
    stats: {
      totalRooms: rooms.length,
      occupiedRooms,
      vacantRooms,
      totalTenants: tenants.length,
      pendingPayments: pendingPayments.length,
      overduePayments: overduePayments.length,
      paidPayments: paidPayments.length,
      rejectedPayments: rejectedPayments.length,
      totalRevenue,
    },
    pendingVerification: pendingPayments.filter((p) => p.proof_url),
    recentPayments: payments.slice(0, 5),
  }
}

export default async function DashboardPage() {
  const { stats, recentPayments, rooms, pendingVerification } = await getDashboardData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Lunas</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Tunggakan</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Ditolak</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Kamar"
            value={stats.totalRooms}
            description={`${stats.occupiedRooms} terisi, ${stats.vacantRooms} kosong`}
            icon={DoorOpen}
          />
          <StatsCard title="Total Penyewa" value={stats.totalTenants} description="Penyewa aktif" icon={Users} />
          <StatsCard
            title="Menunggu Verifikasi"
            value={pendingVerification.length}
            description={`${stats.pendingPayments} total pending`}
            icon={Clock}
          />
          <StatsCard
            title="Total Pendapatan"
            value={formatCurrency(stats.totalRevenue)}
            description="Dari pembayaran lunas"
            icon={CreditCard}
          />
        </div>

        {/* Pending Verification Alert */}
        {pendingVerification.length > 0 && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <FileCheck className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-700 dark:text-yellow-500">
                    {pendingVerification.length} Pembayaran Menunggu Verifikasi
                  </p>
                  <p className="text-sm text-yellow-600/80 dark:text-yellow-500/80">
                    Ada bukti pembayaran yang perlu diverifikasi
                  </p>
                </div>
              </div>
              <Link href="/dashboard/payments">
                <Button
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 bg-transparent"
                >
                  Verifikasi Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5" />
                Status Kamar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada kamar.</p>
              ) : (
                <div className="space-y-3">
                  {rooms.slice(0, 6).map((room) => (
                    <div key={room.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Kamar {room.room_number}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(room.price)}/bulan</p>
                      </div>
                      <Badge variant={room.status === "occupied" ? "default" : "secondary"}>
                        {room.status === "occupied" ? "Terisi" : "Kosong"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pembayaran Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada pembayaran.</p>
              ) : (
                <div className="space-y-3">
                  {recentPayments.map((payment: Payment & { tenant?: Tenant }) => (
                    <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{payment.tenant?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(payment.amount)} - Jatuh tempo:{" "}
                          {new Date(payment.due_date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {stats.overduePayments > 0 && (
          <Card className="mt-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <CardContent className="flex items-center gap-4 p-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-semibold text-red-600">{stats.overduePayments} Pembayaran Tunggakan</p>
                <p className="text-sm text-red-600/80">Segera hubungi penyewa untuk menyelesaikan pembayaran.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
