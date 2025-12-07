import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { ReminderList } from "@/components/reminders/reminder-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import type { Reminder } from "@/lib/types"

async function getReminders() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reminders")
    .select("*, payment:payments(*, tenant:tenants(*))")
    .order("reminder_date", { ascending: true })

  if (error) {
    console.error("Error fetching reminders:", error)
    return []
  }

  return data as Reminder[]
}

export default async function RemindersPage() {
  const reminders = await getReminders()

  const pendingReminders = reminders.filter((r) => r.status === "pending")
  const sentReminders = reminders.filter((r) => r.status === "sent")
  const todayReminders = pendingReminders.filter(
    (r) => new Date(r.reminder_date).toDateString() === new Date().toDateString(),
  )

  return (
    <>
      <Header title="Reminder Pembayaran" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reminder Hari Ini</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayReminders.length}</div>
              <p className="text-xs text-muted-foreground">Perlu dikirim hari ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReminders.length}</div>
              <p className="text-xs text-muted-foreground">Menunggu dikirim</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terkirim</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sentReminders.length}</div>
              <p className="text-xs text-muted-foreground">Sudah dikirim</p>
            </CardContent>
          </Card>
        </div>

        {todayReminders.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardContent className="flex items-center gap-4 p-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-600">{todayReminders.length} Reminder untuk Hari Ini</p>
                <p className="text-sm text-yellow-600/80">Jangan lupa kirim reminder ke penyewa.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <ReminderList reminders={reminders} />
      </main>
    </>
  )
}
