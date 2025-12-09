import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Users,
  DoorOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2
} from "lucide-react"
import type { Payment, Tenant, Room } from "@/lib/types"
import { ExportPDFButton } from "./export-pdf-button"

async function getStatisticsData() {
  const supabase = await createClient()

  const [paymentsRes, tenantsRes, roomsRes] = await Promise.all([
    supabase.from("payments").select("*").order("created_at", { ascending: false }),
    supabase.from("tenants").select("*, room:rooms(*)"),
    supabase.from("rooms").select("*"),
  ])

  const payments = (paymentsRes.data as Payment[]) || []
  const tenants = (tenantsRes.data as Tenant[]) || []
  const rooms = (roomsRes.data as Room[]) || []

  // Calculate monthly revenue
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - i, 1)
    const month = date.toLocaleString('id-ID', { month: 'short' })
    const year = date.getFullYear()
    
    const monthPayments = payments.filter(p => {
      const paymentDate = new Date(p.paid_date || p.due_date)
      return paymentDate.getMonth() === date.getMonth() && 
             paymentDate.getFullYear() === date.getFullYear() &&
             p.status === 'paid'
    })
    
    const revenue = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0)
    
    return {
      month: `${month} ${year}`,
      revenue,
      payments: monthPayments.length
    }
  }).reverse()

  // Payment status breakdown
  const statusBreakdown = {
    paid: payments.filter(p => p.status === 'paid').length,
    pending: payments.filter(p => p.status === 'pending').length,
    overdue: payments.filter(p => p.status === 'overdue').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
  }

  // Room occupancy trend
  const occupancyRate = rooms.length > 0 
    ? (rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100 
    : 0

  // Average payment amount
  const avgPayment = payments.length > 0
    ? payments.reduce((sum, p) => sum + Number(p.amount), 0) / payments.length
    : 0

  // This month vs last month comparison
  const thisMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0
  const lastMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0
  const revenueChange = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0

  // Top paying tenants
  const tenantPayments = payments.reduce((acc, p) => {
    if (!acc[p.tenant_id]) {
      acc[p.tenant_id] = { total: 0, count: 0, tenantId: p.tenant_id }
    }
    if (p.status === 'paid') {
      acc[p.tenant_id].total += Number(p.amount)
      acc[p.tenant_id].count += 1
    }
    return acc
  }, {} as Record<string, { total: number; count: number; tenantId: string }>)

  const topTenants = Object.values(tenantPayments)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(tp => {
      const tenant = tenants.find(t => t.id === tp.tenantId)
      return {
        name: tenant?.name || 'Unknown',
        total: tp.total,
        count: tp.count,
        room: tenant?.room?.room_number
      }
    })

  return {
    monthlyData,
    statusBreakdown,
    occupancyRate,
    avgPayment,
    revenueChange,
    topTenants,
    totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0),
    totalPayments: payments.length,
    activeTenantsCount: tenants.length,
    totalRooms: rooms.length,
  }
}

export default async function StatisticsPage() {
  const stats = await getStatisticsData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Laporan Statistik</h2>
            <p className="text-sm text-muted-foreground">Analisis performa bisnis kost Anda</p>
          </div>
          <ExportPDFButton 
            monthlyData={stats.monthlyData}
            statusBreakdown={stats.statusBreakdown}
            occupancyRate={stats.occupancyRate}
            avgPayment={stats.avgPayment}
            revenueChange={stats.revenueChange}
            topTenants={stats.topTenants}
            totalRevenue={stats.totalRevenue}
            totalPayments={stats.totalPayments}
            activeTenantsCount={stats.activeTenantsCount}
            totalRooms={stats.totalRooms}
          />
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stats.revenueChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {formatPercent(stats.revenueChange)}
                </span>
                <span className="ml-1">dari bulan lalu</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Hunian</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalRooms - Math.floor(stats.totalRooms * stats.occupancyRate / 100)} kamar kosong
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Pembayaran</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgPayment)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per transaksi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeTenantsCount} penyewa aktif
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Pendapatan (6 Bulan Terakhir)</CardTitle>
              <CardDescription>Grafik pendapatan bulanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyData.map((data, index) => {
                  const maxRevenue = Math.max(...stats.monthlyData.map(d => d.revenue))
                  const barWidth = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{data.month}</span>
                        <span className="font-medium">{formatCurrency(data.revenue)}</span>
                      </div>
                      <div className="h-8 w-full bg-muted rounded-md overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {barWidth > 20 && (
                            <span className="text-xs text-primary-foreground font-medium">
                              {data.payments} pembayaran
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Pembayaran</CardTitle>
              <CardDescription>Distribusi status semua pembayaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Lunas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.statusBreakdown.paid}</span>
                    <span className="text-sm text-muted-foreground">
                      ({((stats.statusBreakdown.paid / stats.totalPayments) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(stats.statusBreakdown.paid / stats.totalPayments) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.statusBreakdown.pending}</span>
                    <span className="text-sm text-muted-foreground">
                      ({((stats.statusBreakdown.pending / stats.totalPayments) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${(stats.statusBreakdown.pending / stats.totalPayments) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Tunggakan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.statusBreakdown.overdue}</span>
                    <span className="text-sm text-muted-foreground">
                      ({((stats.statusBreakdown.overdue / stats.totalPayments) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${(stats.statusBreakdown.overdue / stats.totalPayments) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Ditolak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.statusBreakdown.rejected}</span>
                    <span className="text-sm text-muted-foreground">
                      ({((stats.statusBreakdown.rejected / stats.totalPayments) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${(stats.statusBreakdown.rejected / stats.totalPayments) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Tenants */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Penyewa</CardTitle>
            <CardDescription>Berdasarkan total pembayaran terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topTenants.map((tenant, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DoorOpen className="h-3 w-3" />
                        <span>Kamar {tenant.room || '-'}</span>
                        <span>•</span>
                        <span>{tenant.count} pembayaran</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(tenant.total)}</p>
                    <p className="text-xs text-muted-foreground">Total dibayar</p>
                  </div>
                </div>
              ))}
              {stats.topTenants.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada data pembayaran</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
