// app/dashboard/bookings/page.tsx
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { BookingList } from "@/components/bookings/booking-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react"
import type { Booking } from "@/lib/types"

async function getBookings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data as Booking[]
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const contactedBookings = bookings.filter((b) => b.status === "contacted")
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled")

  return (
    <>
      <Header title="Manajemen Booking" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booking Baru</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings.length}</div>
              <p className="text-xs text-muted-foreground">Menunggu diproses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dihubungi</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactedBookings.length}</div>
              <p className="text-xs text-muted-foreground">Dalam proses follow up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dikonfirmasi</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedBookings.length}</div>
              <p className="text-xs text-muted-foreground">Booking berhasil</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dibatalkan</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledBookings.length}</div>
              <p className="text-xs text-muted-foreground">Tidak jadi booking</p>
            </CardContent>
          </Card>
        </div>

        {pendingBookings.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardContent className="flex items-center gap-4 p-4">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-600">{pendingBookings.length} Booking Baru Menunggu</p>
                <p className="text-sm text-yellow-600/80">Segera hubungi calon penyewa untuk konfirmasi.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <BookingList bookings={bookings} />
      </main>
    </>
  )
}